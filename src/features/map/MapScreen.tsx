import { useMemo, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsyncState } from '../../components/AsyncState';
import { useLakes } from '../lakes/useLakes';
import { useLakeDetail } from '../lakes/useLakeDetail';
import { useStations } from '../lakes/useStations';
import { OfflineNotice } from '../offline/OfflineNotice';
import { catalogError } from '../lakes/catalogError';
import { LakeMap } from './LakeMap';
import { lakeFeature, stationFeatures } from './geometry';

export function MapScreen() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState('');
  const lakes = useLakes({ page, page_size: 20 });
  const detail = useLakeDetail(selectedId);
  const stations = useStations(selectedId);
  const markers = useMemo(
    () =>
      stationFeatures(
        stations.isError ? [] : (stations.data ?? []),
        selectedId,
      ),
    [stations.data, stations.isError, selectedId],
  );
  const feature = useMemo(
    () => (detail.data && !detail.isError ? lakeFeature(detail.data) : null),
    [detail.data, detail.isError],
  );
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <ScrollView
        style={{ maxHeight: '40%', flexGrow: 0 }}
        contentContainerStyle={{ padding: 12, gap: 8 }}
      >
        {lakes.isPending ? (
          <AsyncState kind="loading" message="Cargando lagos…" />
        ) : lakes.isError ? (
          <AsyncState
            kind="error"
            message={catalogError(lakes.error, 'los lagos del mapa')}
            onRetry={() => lakes.refetch()}
          />
        ) : (
          <>
            <Text>Selecciona un lago para ver su polígono</Text>
            <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
              {lakes.data?.items.map((lake) => (
                <Button
                  key={lake.id}
                  title={lake.name}
                  accessibilityLabel={`Mostrar ${lake.name} en el mapa`}
                  onPress={() => setSelectedId(lake.id)}
                />
              ))}
            </ScrollView>
            {lakes.data?.total === 0 && <Text>No hay lagos disponibles.</Text>}
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Button
                title="Anterior"
                disabled={page === 1 || lakes.isFetching}
                onPress={() => setPage(page - 1)}
              />
              <Text>Página {page}</Text>
              <Button
                title="Siguiente"
                disabled={
                  lakes.isFetching || page * 20 >= (lakes.data?.total ?? 0)
                }
                onPress={() => setPage(page + 1)}
              />
            </View>
          </>
        )}
        {lakes.isOffline && !lakes.isError && (
          <OfflineNotice savedAt={lakes.savedAt} />
        )}
        {!!selectedId &&
          (detail.isPending ? (
            <AsyncState kind="loading" message="Cargando polígono…" />
          ) : detail.isError ? (
            <AsyncState
              kind="error"
              message={catalogError(detail.error, 'el polígono')}
              onRetry={() => detail.refetch()}
            />
          ) : !feature ? (
            <Text>Este lago no tiene un polígono válido disponible.</Text>
          ) : (
            <Text>{feature.properties.name}</Text>
          ))}
        {detail.isOffline && !detail.isError && (
          <OfflineNotice savedAt={detail.savedAt} />
        )}
        {!!selectedId &&
          (stations.isPending ? (
            <AsyncState kind="loading" message="Cargando estaciones…" />
          ) : stations.isError ? (
            <AsyncState
              kind="error"
              message={catalogError(stations.error, 'las estaciones')}
              onRetry={() => stations.refetch()}
            />
          ) : (
            <>
              <Text>
                {markers.features.length} estaciones con ubicación disponible
              </Text>
              {(stations.data?.length ?? 0) > markers.features.length && (
                <Text>
                  Hay estaciones sin coordenadas válidas que no se muestran en
                  el mapa.
                </Text>
              )}
              {stations.isOffline && (
                <OfflineNotice savedAt={stations.savedAt} />
              )}
            </>
          ))}
      </ScrollView>
      <LakeMap feature={feature} stations={markers} />
    </SafeAreaView>
  );
}
