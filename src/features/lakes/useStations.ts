import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { fetchStations } from './catalogApi';
import { isCatalogId } from './catalogSchemas';

export const stationsKey = (id: string) =>
  ['lakes', 'stations', id.toLowerCase()] as const;
export function stationsQueryOptions(id: string, loader = fetchStations) {
  return {
    queryKey: stationsKey(id),
    enabled: isCatalogId(id),
    queryFn: ({ signal }: QueryFunctionContext) => loader(id, signal),
  };
}
export function useStations(id: string) {
  return useQuery(stationsQueryOptions(id));
}
