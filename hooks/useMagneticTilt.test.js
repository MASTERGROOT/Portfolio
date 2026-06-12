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

  it('clamps at ±8 degrees', () => {
    const { rotateX, rotateY } = calcTilt(0, 0, 100, 100);
    expect(Math.abs(rotateX)).toBeLessThanOrEqual(8);
    expect(Math.abs(rotateY)).toBeLessThanOrEqual(8);
  });
});
