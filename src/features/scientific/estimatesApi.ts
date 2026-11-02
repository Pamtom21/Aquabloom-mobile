import { z } from 'zod';
import { api } from '../../lib/api';
import type { components } from '../../types/scientific.proposal.generated';
import { catalogId } from '../lakes/catalogSchemas';

export type EstimatePoint = components['schemas']['EstimatePoint'];
export type EstimateListResponse =
  components['schemas']['EstimateListResponse'];

export type ScientificRequester = (
  path: string,
  init?: RequestInit,
) => Promise<unknown>;

const estimatePointSchema = z.object({
  id: catalogId,
  lake_id: catalogId,
  point_id: z.string().min(1),
  latitude: z.number().finite().min(-90).max(90).nullable().optional(),
  longitude: z.number().finite().min(-180).max(180).nullable().optional(),
  value: z.number().finite(),
  unit: z.string().min(1),
  variable: z.string().min(1),
  observed_at: z.iso.datetime(),
  status: z.string().min(1),
  scene_id: z.string().nullable().optional(),
  model_id: z.string().nullable().optional(),
  model_version: z.string().nullable().optional(),
  dataset_id: z.string().nullable().optional(),
  dataset_version: z.string().nullable().optional(),
  warnings: z.array(z.string()),
});

const estimateListSchema = z.object({
  items: z.array(estimatePointSchema),
});

export function parseLakeEstimates(
  lakeId: string,
  value: unknown,
): EstimateListResponse {
  const response = estimateListSchema.parse(value);
  if (response.items.some((item) => item.lake_id.toLowerCase() !== lakeId)) {
    throw new Error('La respuesta contiene estimaciones de otro lago.');
  }
  return response;
}

// La ruta pertenece al OpenAPI propuesto y debe confirmarse con Web/API.
export async function fetchLakeEstimates(
  lakeId: string,
  signal?: AbortSignal,
  request: ScientificRequester | null = api,
): Promise<EstimateListResponse> {
  const id = catalogId.parse(lakeId).toLowerCase();
  if (!request) {
    throw new Error(
      'Configura EXPO_PUBLIC_API_URL para consultar estimaciones.',
    );
  }
  return parseLakeEstimates(
    id,
    await request(`/lakes/${id}/estimates`, { signal }),
  );
}
