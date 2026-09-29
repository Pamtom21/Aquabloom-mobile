import { fireEvent, render, screen } from '@testing-library/react-native';
import { MapScreen } from '../MapScreen';
import { LakeMap } from '../LakeMap';
import { useLakes } from '../../lakes/useLakes';
import { useLakeDetail } from '../../lakes/useLakeDetail';
import { useStations } from '../../lakes/useStations';
import { lake } from '../../lakes/__tests__/fixtures';

jest.mock('../LakeMap', () => ({ LakeMap: jest.fn(() => null) }));
jest.mock('../../lakes/useLakes');
jest.mock('../../lakes/useLakeDetail');
jest.mock('../../lakes/useStations');
const validLake = {
  ...lake,
  geom: {
    type: 'Polygon',
    coordinates: [
      [
        [-72, -39],
        [-71, -39],
        [-71, -38],
        [-72, -39],
      ],
    ],
  },
};
const latestMap = () => jest.mocked(LakeMap).mock.calls.at(-1)![0];
beforeEach(() => {
  jest.mocked(useStations).mockReturnValue({
    data: [],
    isPending: false,
    isError: false,
  } as unknown as ReturnType<typeof useStations>);
  jest.mocked(useLakes).mockReturnValue({
    data: { items: [lake], total: 21 },
    isPending: false,
    isError: false,
    isFetching: false,
  } as unknown as ReturnType<typeof useLakes>);
  jest.mocked(useLakeDetail).mockImplementation(
    (id) =>
      ({
        data: id ? validLake : undefined,
        isPending: false,
        isError: false,
      }) as unknown as ReturnType<typeof useLakeDetail>,
  );
});
it('loads a selected lake, passes its polygon to the map and supports pagination', async () => {
  await render(<MapScreen />);
  expect(latestMap().feature).toBeNull();
  await fireEvent.press(
    screen.getByLabelText(`Mostrar ${lake.name} en el mapa`),
  );
  expect(useLakeDetail).toHaveBeenLastCalledWith(lake.id);
  expect(latestMap().feature?.id).toBe(lake.id);
  await fireEvent.press(screen.getByText('Siguiente'));
  expect(useLakes).toHaveBeenLastCalledWith({ page: 2, page_size: 20 });
});
it('does not pass unavailable geometry to the native renderer', async () => {
  jest.mocked(useLakeDetail).mockReturnValue({
    data: lake,
    isPending: false,
    isError: false,
  } as unknown as ReturnType<typeof useLakeDetail>);
  await render(<MapScreen />);
  await fireEvent.press(
    screen.getByLabelText(`Mostrar ${lake.name} en el mapa`),
  );
  expect(screen.getByText(/no tiene un polígono válido/)).toBeTruthy();
  expect(latestMap().feature).toBeNull();
});
