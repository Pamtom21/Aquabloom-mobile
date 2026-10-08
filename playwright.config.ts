import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  workers: 1,
  use: { baseURL: 'http://localhost:8091', trace: 'retain-on-failure' },
  webServer: {
    command: 'pnpm exec expo start --web --port 8091 --max-workers 2',
    url: 'http://localhost:8091',
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      CI: '1',
      EXPO_NO_DOTENV: '1',
      EXPO_PUBLIC_API_URL: 'https://api.aquabloom.invalid',
      EXPO_PUBLIC_SUPABASE_URL: 'https://auth.aquabloom.invalid',
      EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_e2e_fixture',
    },
  },
});
