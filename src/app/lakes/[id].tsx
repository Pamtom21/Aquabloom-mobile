import { useLocalSearchParams } from 'expo-router';
import { Screen } from '../../components/Screen';
import { AsyncState } from '../../components/AsyncState';
export default function LakeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen title="Detalle de lago">
      <AsyncState
        kind="empty"
        message={`Ruta preparada para el lago ${id}. Implementación: AQU-37 a AQU-40.`}
      />
    </Screen>
  );
}
