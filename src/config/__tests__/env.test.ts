import { parseEnv } from '../env';
it('allows startup before credentials are provided', () => {
  expect(parseEnv({ apiUrl: '', supabaseUrl: '' }).success).toBe(true);
});
it('rejects malformed API URLs', () => {
  expect(parseEnv({ apiUrl: 'not-a-url' }).success).toBe(false);
});

it('normalizes blank configuration and surrounding whitespace', () => {
  expect(
    parseEnv({
      apiUrl: ' https://example.com/api/v1 ',
      supabaseUrl: ' ',
      supabaseKey: ' ',
    }),
  ).toMatchObject({
    success: true,
    data: {
      apiUrl: 'https://example.com/api/v1',
      supabaseUrl: undefined,
      supabaseKey: undefined,
    },
  });
});

it.each([
  { supabaseUrl: 'https://example.supabase.co' },
  { supabaseKey: 'sb_publishable_test' },
])('rejects incomplete Supabase configuration: %j', (input) => {
  expect(parseEnv(input).success).toBe(false);
});

it('accepts a complete public Supabase configuration', () => {
  expect(
    parseEnv({
      supabaseUrl: 'https://example.supabase.co',
      supabaseKey: 'sb_publishable_test',
    }).success,
  ).toBe(true);
});

it.each([
  'https://user:password@example.com/api/v1',
  'https://example.com/api/v1?token=example',
  'https://example.com/api/v1#health',
])('rejects an unsafe or ambiguous API base: %s', (apiUrl) => {
  expect(parseEnv({ apiUrl }).success).toBe(false);
});
