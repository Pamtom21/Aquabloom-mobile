import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { bindSessionLifecycle } from './bindSessionLifecycle';

export function SessionLifecycle() {
  useEffect(() => {
    if (!supabase || Platform.OS === 'web') return;
    return bindSessionLifecycle(supabase.auth, AppState);
  }, []);
  return null;
}
