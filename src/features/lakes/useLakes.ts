import {
  keepPreviousData,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { normalizeLakeFilters } from './lakeFilters';
import { fetchLakes } from './lakesApi';
import type { LakeFilters } from './types';

export const lakeKeys = {
  all: ['lakes'] as const,
  list: (filters: LakeFilters = {}) =>
    [...lakeKeys.all, 'list', normalizeLakeFilters(filters)] as const,
};

export type LakesQueryKey = ReturnType<typeof lakeKeys.list>;
export type LakesLoader = typeof fetchLakes;

export function lakesQueryOptions(
  filters: LakeFilters = {},
  loader: LakesLoader = fetchLakes,
) {
  const normalizedFilters = normalizeLakeFilters(filters);
  const queryKey = lakeKeys.list(normalizedFilters);
  return {
    queryKey,
    queryFn: ({ signal }: QueryFunctionContext<LakesQueryKey>) =>
      loader(normalizedFilters, signal),
    placeholderData: keepPreviousData,
  };
}

export function useLakes(filters: LakeFilters = {}) {
  return useQuery(lakesQueryOptions(filters));
}
