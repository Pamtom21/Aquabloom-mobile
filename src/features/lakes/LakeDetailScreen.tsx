import { Text } from 'react-native';
import { Link } from 'expo-router';
import { Screen } from '../../components/Screen';
import { AsyncState } from '../../components/AsyncState';
import { catalogError } from './catalogError';
import { isCatalogId } from './catalogSchemas';
import { useLakeDetail } from './useLakeDetail';
import { StationsList } from './StationsList';
import { OfflineNotice } from '../offline/OfflineNotice';

export function LakeDetailScreen({ id }: { id: string }) {
  const lake = useLakeDetail(id);
  return (
    <Screen
      title={
        !lake.isError
          ? (lake.data?.name ?? 'Detalle de lago')
          : 'Detalle de lago'
      }
    >
      {lake.isOffline && !lake.isError ? (
        <OfflineNotice savedAt={lake.savedAt} />
      ) : null}
      {!isCatalogId(id) ? (
        <AsyncState kind="error" message="El enlace del lago no es válido." />
      ) : lake.isPending ? (
        <AsyncState kind="loading" message="Cargando lago…" />
      ) : lake.isError ? (
        <AsyncState
          kind="error"
          message={catalogError(lake.error, 'el lago')}
          onRetry={() => void lake.refetch()}
        />
      ) : lake.data ? (
        <>
          <Text>Región: {lake.data.region}</Text>
          <Text>Estado: {lake.data.status}</Text>
          <Text>{lake.data.description || 'Sin descripción disponible.'}</Text>
          <Text accessibilityRole="header">Estaciones de monitoreo</Text>
          <StationsList lakeId={id} />
        </>
      ) : null}
      <Link href="/catalog">Volver al catálogo</Link>
    </Screen>
  );
}
