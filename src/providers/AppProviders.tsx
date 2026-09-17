import { useEffect, useState, type PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApiError } from '../lib/http';

export const queryCachePolicy = {
  staleTime: 60_000,
  gcTime: 5 * 60_000,
  maxRetries: 2,
} as const;

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (error instanceof Error && error.name === 'AbortError') return false;
  if (error instanceof ApiError && error.status < 500) return false;
  return failureCount < queryCachePolicy.maxRetries;
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryCachePolicy.staleTime,
        gcTime: queryCachePolicy.gcTime,
        retry: shouldRetryQuery,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
      mutations: { retry: false },
    },
  });
}

export function AppProviders({ children }: PropsWithChildren) {
  const [client] = useState(createAppQueryClient);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(
        state.isConnected !== false && state.isInternetReachable !== false,
      );
    });
    const subscription = AppState.addEventListener('change', (state) => {
      if (Platform.OS !== 'web') focusManager.setFocused(state === 'active');
    });
    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, []);
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </SafeAreaProvider>
  );
}
