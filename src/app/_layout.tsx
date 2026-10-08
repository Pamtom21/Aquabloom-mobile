import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '../providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen
          name="lakes/[id]"
          options={{ title: 'Detalle de lago' }}
        />
        <Stack.Screen
          name="lakes/[id]/observations"
          options={{ title: 'Observación de terreno' }}
        />
        <Stack.Screen
          name="lakes/[id]/stations/[stationId]"
          options={{ title: 'Estación' }}
        />
      </Stack>
    </AppProviders>
  );
}
