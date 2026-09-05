import { z } from 'zod';

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.httpUrl().optional(),
);
const schema = z.object({
  apiUrl: optionalUrl,
  supabaseUrl: optionalUrl,
  supabaseKey: z.string().optional(),
});

export function parseEnv(input: unknown) {
  return schema.safeParse(input);
}

// Expo requires direct property access to inline public variables.
export const environment = parseEnv({
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});
export const env = environment.success ? environment.data : {};
