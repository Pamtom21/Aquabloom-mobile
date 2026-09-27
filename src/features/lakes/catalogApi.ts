import { api } from '../../lib/api';
import { catalogId, lakeDetailSchema, stationsSchema } from './catalogSchemas';

export type CatalogRequester = (
  path: string,
  init?: RequestInit,
) => Promise<unknown>;

export async function fetchLakeDetail(
  id: string,
  signal?: AbortSignal,
  request: CatalogRequester | null = api,
) {
  const lakeId = catalogId.parse(id).toLowerCase();
  if (!request)
    throw new Error('Configura EXPO_PUBLIC_API_URL para consultar los lagos.');
  return lakeDetailSchema.parse(await request('/lakes/' + lakeId, { signal }));
}

export async function fetchStations(
  id: string,
  signal?: AbortSignal,
  request: CatalogRequester | null = api,
) {
  const lakeId = catalogId.parse(id).toLowerCase();
  if (!request)
    throw new Error(
      'Configura EXPO_PUBLIC_API_URL para consultar las estaciones.',
    );
  const stations = stationsSchema.parse(
    await request('/lakes/' + lakeId + '/stations', { signal }),
  );
  if (stations.some((station) => station.lake_id.toLowerCase() !== lakeId)) {
    throw new Error('La respuesta contiene estaciones de otro lago.');
  }
  return stations;
}
