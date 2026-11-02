import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '../../auth/useCurrentUser';
import { useEstimates, useScientificJob } from '../useScientific';
import {
  loadEstimates,
  loadJob,
  type ScientificSource,
} from '../scientificSource';
jest.mock('@tanstack/react-query', () => ({ useQuery: jest.fn(() => ({})) }));
jest.mock('../../auth/useCurrentUser', () => ({ useCurrentUser: jest.fn() }));
jest.mock('../scientificSource', () => ({
  loadEstimates: jest.fn(),
  loadJob: jest.fn(),
}));
jest.mock('../../../config/env', () => ({
  env: { apiUrl: 'https://api.example.test' },
}));
const query = useQuery as jest.Mock;
const session = useCurrentUser as jest.Mock;
const id = '11111111-1111-4111-8111-111111111111';
function Probe({
  source,
  value = id,
}: {
  source: ScientificSource;
  value?: string;
}) {
  useEstimates(value, source);
  useScientificJob(value, source);
  return <Text>Query probe</Text>;
}
beforeEach(() => {
  jest.clearAllMocks();
  session.mockReturnValue({ user: { id: 'franco' } });
});
it.each(['demo', 'proposal'] as const)(
  'keys %s reads by API, user, source and identity, and propagates cancellation',
  async (source) => {
    await render(<Probe source={source} />);
    const options = query.mock.calls.map(([value]) => value);
    expect(options[0].queryKey).toEqual([
      'scientific',
      'https://api.example.test',
      'franco',
      source,
      'estimates',
      id,
    ]);
    expect(options[1].queryKey).toEqual([
      'scientific',
      'https://api.example.test',
      'franco',
      source,
      'job',
      id,
    ]);
    expect(options.every((option) => option.enabled)).toBe(true);
    const controller = new AbortController();
    await options[0].queryFn({ signal: controller.signal });
    await options[1].queryFn({ signal: controller.signal });
    expect(loadEstimates).toHaveBeenCalledWith(source, id, controller.signal);
    expect(loadJob).toHaveBeenCalledWith(source, id, controller.signal);
  },
);
it('does not enable requests before a user session is available', async () => {
  session.mockReturnValue({ user: null });
  await render(<Probe source="proposal" />);
  expect(query.mock.calls.every(([options]) => options.enabled === false)).toBe(
    true,
  );
});
it.each([
  { source: 'disabled', value: id },
  { source: 'proposal', value: '../bad' },
] as const)('disables reads for $source / $value', async (props) => {
  await render(<Probe {...props} />);
  expect(query.mock.calls.every(([options]) => options.enabled === false)).toBe(
    true,
  );
});
it('changes the query scope when the account changes, rather than sharing private data', async () => {
  const view = await render(<Probe source="proposal" />);
  session.mockReturnValue({ user: { id: 'other' } });
  await view.rerender(<Probe source="proposal" />);
  expect(
    query.mock.calls
      .slice(-2)
      .every(([options]) => options.queryKey[2] === 'other'),
  ).toBe(true);
});
