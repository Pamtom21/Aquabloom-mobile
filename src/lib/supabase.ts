import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// AQU-17/AQU-18: connect SecureStore and session lifecycle in the auth PR.
// Until then sessions are memory-only; never persist tokens in plain storage.
export const supabase =
  env.supabaseUrl && env.supabaseKey
    ? createClient(env.supabaseUrl, env.supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null;
