import { describe, expect, it } from 'vitest';
import { MOCK_VEHICLES } from '../../src/data/vehicles';
import { filterVehicles } from '../../src/utils/filtering';

describe('filterVehicles', () => {
  it('filters vehicles by selected category', () => {
    const result = filterVehicles(MOCK_VEHICLES, { category: ['mpv'] }, []);

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((vehicle) => vehicle.category === 'mpv')).toBe(true);
  });

  it('combines category, price range, and search query filters', () => {
    const result = filterVehicles(
      MOCK_VEHICLES,
      {
        category: ['suv'],
        priceRange: { min: 1000000, max: 1400000 },
        searchQuery: 'fortuner',
      },
      []
    );

    expect(result.map((vehicle) => vehicle.name)).toEqual(['Fortuner TRD/GR']);
  });
});
