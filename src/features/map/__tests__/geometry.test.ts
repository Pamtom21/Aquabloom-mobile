import { lakeFeature, lakeBounds } from '../geometry';
import { lake } from '../../lakes/__tests__/fixtures';

const ring = [
  [-72, -39],
  [-71, -39],
  [-71, -38],
  [-72, -39],
];
it('preserves polygon holes and stable identifiers, and calculates camera bounds', () => {
  const feature = lakeFeature({
    ...lake,
    geom: { type: 'Polygon', coordinates: [ring, ring] },
  });
  expect(feature?.geometry.coordinates).toEqual([ring, ring]);
  expect(feature?.id).toBe(lake.id);
  expect(lakeBounds(feature!)).toEqual([-72, -39, -71, -38]);
});
it('accepts multi-polygons', () => {
  expect(
    lakeFeature({
      ...lake,
      geom: { type: 'MultiPolygon', coordinates: [[ring], [ring]] },
    })?.geometry.type,
  ).toBe('MultiPolygon');
});
it.each([
  {},
  { type: 'Point', coordinates: [-72, -39] },
  { type: 'Polygon', coordinates: [] },
  {
    type: 'Polygon',
    coordinates: [
      [
        [-72, -39],
        [-71, -39],
        [-71, -38],
        [-72, -38],
      ],
    ],
  },
  {
    type: 'Polygon',
    coordinates: [
      [
        [200, -39],
        [-71, -39],
        [-71, -38],
        [200, -39],
      ],
    ],
  },
  {
    type: 'Polygon',
    coordinates: [
      [
        [NaN, -39],
        [-71, -39],
        [-71, -38],
        [NaN, -39],
      ],
    ],
  },
])('rejects invalid geometry without crashing the map', (geom) => {
  expect(lakeFeature({ ...lake, geom })).toBeNull();
});
