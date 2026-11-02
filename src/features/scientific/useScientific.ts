import { useQuery } from '@tanstack/react-query';
import { env } from '../../config/env';
import { useCurrentUser } from '../auth/useCurrentUser';
import { isCatalogId } from '../lakes/catalogSchemas';
import {
  loadEstimates,
  loadJob,
  type ScientificSource,
} from './scientificSource';

export function useEstimates(lakeId: string, source: ScientificSource) {
  const { user } = useCurrentUser();
  return useQuery({
    queryKey: [
      'scientific',
      env.apiUrl,
      user?.id,
      source,
      'estimates',
      lakeId.toLowerCase(),
    ],
    enabled: Boolean(user) && isCatalogId(lakeId) && source !== 'disabled',
    queryFn: ({ signal }) => loadEstimates(source, lakeId, signal),
    retry: false,
  });
}
export function useScientificJob(jobId: string, source: ScientificSource) {
  const { user } = useCurrentUser();
  return useQuery({
    queryKey: [
      'scientific',
      env.apiUrl,
      user?.id,
      source,
      'job',
      jobId.toLowerCase(),
    ],
    enabled: Boolean(user) && isCatalogId(jobId) && source !== 'disabled',
    queryFn: ({ signal }) => loadJob(source, jobId, signal),
    retry: false,
    // Manual refresh: no guessed progress and no training/job creation request.
    staleTime: 0,
  });
}
