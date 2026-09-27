import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { fetchLakeDetail } from './catalogApi';
import { isCatalogId } from './catalogSchemas';

export const lakeDetailKey = (id: string) =>
  ['lakes', 'detail', id.toLowerCase()] as const;
export function lakeDetailQueryOptions(id: string, loader = fetchLakeDetail) {
  return {
    queryKey: lakeDetailKey(id),
    enabled: isCatalogId(id),
    queryFn: ({ signal }: QueryFunctionContext) => loader(id, signal),
  };
}
export function useLakeDetail(id: string) {
  return useQuery(lakeDetailQueryOptions(id));
}
