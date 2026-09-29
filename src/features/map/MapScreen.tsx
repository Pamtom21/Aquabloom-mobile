import { useMemo, useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsyncState } from '../../components/AsyncState';
import { useLakes } from '../lakes/useLakes';
import { useLakeDetail } from '../lakes/useLakeDetail';
import { OfflineNotice } from '../offline/OfflineNotice';
import { catalogError } from '../lakes/catalogError';
import { LakeMap } from './LakeMap';
import { lakeFeature } from './geometry';

export function MapScreen() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState('');
  const lakes = useLakes({ page, page_size: 20 });
  const detail = useLakeDetail(selectedId);
  const feature = useMemo(
    () => (detail.data && !detail.isError ? lakeFeature(detail.data) : null),
    [detail.data, detail.isError],
  );
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <View style={{ padding: 12, gap: 8 }}>
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
      </View>
      <LakeMap feature={feature} />
    </SafeAreaView>
  );
}
