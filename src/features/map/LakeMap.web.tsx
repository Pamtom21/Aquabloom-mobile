import { Link } from 'expo-router';
import { View } from 'react-native';
import { AsyncState } from '../../components/AsyncState';
import type { LakeFeature } from './geometry';

export function LakeMap(_props: { feature?: LakeFeature | null }) {
  return (
    <View style={{ padding: 24, gap: 16 }}>
      <AsyncState
        kind="empty"
        message="El mapa interactivo está disponible en la aplicación móvil. Puedes consultar los lagos desde el catálogo."
      />
      <Link href="/catalog">Ver lagos</Link>
    </View>
  );
}
