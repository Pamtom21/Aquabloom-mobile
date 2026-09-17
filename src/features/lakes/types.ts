import type { components, operations } from '../../types/api.generated';

export type Lake = components['schemas']['Lake'];
export type LakeListResponse = components['schemas']['LakeListResponse'];
export type LakeFilters = NonNullable<
  operations['listLakes']['parameters']['query']
>;

export type NormalizedLakeFilters = {
  search?: string;
  region?: string;
  page: number;
  page_size: number;
};
