import { z } from 'zod';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import type { LakeDetail } from '../lakes/types';

const position = z
  .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])
  .rest(z.number());
const ring = z
  .array(position)
  .min(4)
  .refine((points) => {
    const first = points[0];
    const last = points[points.length - 1];
    return (
      first.length === last.length &&
      first.every((value, index) => value === last[index])
    );
  }, 'El anillo debe estar cerrado');
const polygon = z.array(ring).min(1);
const geometry = z.discriminatedUnion('type', [
  z.object({ type: z.literal('Polygon'), coordinates: polygon }),
  z.object({
    type: z.literal('MultiPolygon'),
    coordinates: z.array(polygon).min(1),
  }),
]);
export type LakeFeature = Feature<
  Polygon | MultiPolygon,
  { id: string; name: string }
>;

export function lakeFeature(lake: LakeDetail): LakeFeature | null {
  const parsed = geometry.safeParse(lake.geom);
  if (!parsed.success) return null;
  return {
    type: 'Feature',
    id: lake.id,
    properties: { id: lake.id, name: lake.name },
    geometry: parsed.data,
  };
}

export function lakeBounds(
  feature: LakeFeature,
): [number, number, number, number] {
  const polygons =
    feature.geometry.type === 'Polygon'
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  let west = Infinity,
    south = Infinity,
    east = -Infinity,
    north = -Infinity;
  for (const rings of polygons)
    for (const points of rings)
      for (const [lng, lat] of points) {
        west = Math.min(west, lng);
        east = Math.max(east, lng);
        south = Math.min(south, lat);
        north = Math.max(north, lat);
      }
  return [west, south, east, north];
}
