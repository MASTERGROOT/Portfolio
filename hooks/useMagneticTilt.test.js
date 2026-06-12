import { describe, it, expect } from 'vitest';
import { calcTilt } from './useMagneticTilt.js';

describe('calcTilt', () => {
  it('returns zero tilt at centre of card', () => {
    const { rotateX, rotateY } = calcTilt(50, 50, 100, 100);
    expect(rotateX).toBeCloseTo(0);
    expect(rotateY).toBeCloseTo(0);
  });

  it('returns max negative rotateX at top edge (offsetY=0)', () => {
    const { rotateX } = calcTilt(50, 0, 100, 100);
    expect(rotateX).toBeCloseTo(8);
  });

  it('returns max positive rotateY at right edge (offsetX=100)', () => {
    const { rotateY } = calcTilt(100, 50, 100, 100);
    expect(rotateY).toBeCloseTo(8);
  });

  it('returns ±8 at corner and clamps beyond bounds', () => {
    // At exact corner
    const corner = calcTilt(0, 0, 100, 100);
    expect(Math.abs(corner.rotateX)).toBeLessThanOrEqual(8);
    expect(Math.abs(corner.rotateY)).toBeLessThanOrEqual(8);
    // Past bounds (e.g. child element pointer capture)
    const overBounds = calcTilt(200, 0, 100, 100);
    expect(overBounds.rotateY).toBeLessThanOrEqual(8);
  });
});
