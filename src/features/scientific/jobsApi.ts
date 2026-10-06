import { z } from 'zod';
import { api } from '../../lib/api';
import type { components } from '../../types/scientific.proposal.generated';
import { catalogId } from '../lakes/catalogSchemas';
import type { ScientificRequester } from './estimatesApi';

export type ScientificJob = components['schemas']['ScientificJob'];
export type ScientificJobStatus = ScientificJob['status'];

export const scientificJobStatuses = [
  'queued',
  'running',
  'completed',
  'failed',
  'cancelled',
] as const satisfies readonly ScientificJobStatus[];

const scientificJobSchema = z.object({
  id: catalogId,
  status: z.enum(scientificJobStatuses),
  updated_at: z.iso.datetime(),
  progress: z.number().finite().min(0).max(100).nullable().optional(),
  error_message: z.string().nullable().optional(),
});

export function parseScientificJob(id: string, value: unknown): ScientificJob {
  const job = scientificJobSchema.parse(value);
  if (job.id.toLowerCase() !== id) {
    throw new Error('La respuesta corresponde a otro trabajo.');
  }
  return job;
}

// La ruta pertenece al OpenAPI propuesto y debe confirmarse con Web/API.
export async function fetchScientificJob(
  jobId: string,
  signal?: AbortSignal,
  request: ScientificRequester | null = api,
): Promise<ScientificJob> {
  const id = catalogId.parse(jobId).toLowerCase();
  if (!request) {
    throw new Error('Configura EXPO_PUBLIC_API_URL para consultar trabajos.');
  }
  return parseScientificJob(
    id,
    await request(`/scientific/jobs/${id}`, { signal }),
  );
}
