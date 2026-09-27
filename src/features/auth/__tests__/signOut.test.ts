import { QueryClient } from '@tanstack/react-query';
import { AuthError } from '@supabase/supabase-js';
import { signOutAndClearCache } from '../signOut';
import { authFixture } from './authFixture';

jest.mock('../../../lib/supabase', () => ({ supabase: null }));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { gcTime: 0 }, mutations: { gcTime: 0 } },
  });
}

it('signs out only the current session and clears queries and mutations', async () => {
  const auth = authFixture();
  const cache = createQueryClient();
  cache.setQueryData(['private'], 'sensitive');
  cache.getMutationCache().build(cache, { mutationKey: ['private'] });
  await signOutAndClearCache(auth.client, cache);
  expect(auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  expect(cache.getQueryCache().getAll()).toHaveLength(0);
  expect(cache.getMutationCache().getAll()).toHaveLength(0);
});

it('aborts pending requests and prevents late results from repopulating cache', async () => {
  const auth = authFixture();
  const cache = createQueryClient();
  let resolve!: (data: string) => void;
  let signal!: AbortSignal;
  const pending = cache
    .fetchQuery({
      queryKey: ['private'],
      queryFn: (context) => {
        signal = context.signal;
        return new Promise<string>((done) => {
          resolve = done;
        });
      },
    })
    .catch(() => undefined);
  await signOutAndClearCache(auth.client, cache);
  expect(signal.aborted).toBe(true);
  resolve('late private data');
  await pending;
  expect(cache.getQueryCache().getAll()).toHaveLength(0);
});

it('reports a Supabase failure while still clearing cached data', async () => {
  const auth = authFixture();
  const cache = createQueryClient();
  const error = new AuthError('unavailable');
  auth.signOut.mockResolvedValueOnce({ error });
  cache.setQueryData(['private'], 'sensitive');
  await expect(signOutAndClearCache(auth.client, cache)).rejects.toBe(error);
  expect(cache.getQueryCache().getAll()).toHaveLength(0);
});

it('clears cache after a thrown network error and supports a retry', async () => {
  const auth = authFixture();
  const cache = createQueryClient();
  auth.signOut.mockImplementationOnce(async () => {
    cache.setQueryData(['late'], 'sensitive');
    throw new Error('network');
  });
  await expect(signOutAndClearCache(auth.client, cache)).rejects.toThrow(
    'network',
  );
  expect(cache.getQueryCache().getAll()).toHaveLength(0);
  await expect(
    signOutAndClearCache(auth.client, cache),
  ).resolves.toBeUndefined();
});
