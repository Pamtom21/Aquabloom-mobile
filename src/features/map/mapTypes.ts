import type { LakeFeature, StationFeatures } from './geometry';
export type LakeMapProps = {
  feature?: LakeFeature | null;
  stations?: StationFeatures;
};
