import { Tabs } from 'expo-router';
import { tokens } from '../../theme/tokens';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: tokens.colors.primary }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="catalog" options={{ title: 'Catálogo' }} />
      <Tabs.Screen name="map" options={{ title: 'Mapa' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
