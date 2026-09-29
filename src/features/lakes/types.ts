import type { components } from '../../types/api.generated';

export type Lake = components['schemas']['Lake'];
export type LakeListResponse = components['schemas']['LakeListResponse'];
export type LakeDetail = components['schemas']['LakeDetail'];
export type Station = components['schemas']['Station'];
// UI names; serialized to the backend's text/limit query parameters.
export type LakeFilters = {
  search?: string;
  region?: string;
  page?: number;
  page_size?: number;
};

export type NormalizedLakeFilters = {
  search?: string;
  region?: string;
  page: number;
  page_size: number;
};
