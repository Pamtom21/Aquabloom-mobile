import { parseEnv } from '../env';
it('allows startup before credentials are provided', () => {
  expect(parseEnv({ apiUrl: '', supabaseUrl: '' }).success).toBe(true);
});
it('rejects malformed API URLs', () => {
  expect(parseEnv({ apiUrl: 'not-a-url' }).success).toBe(false);
});
