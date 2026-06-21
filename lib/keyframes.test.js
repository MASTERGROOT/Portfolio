import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { KEYFRAMES } from './keyframes.js';

describe('camera keyframes', () => {
  it('exports exactly 8 keyframes', () => {
    expect(KEYFRAMES).toHaveLength(8);
  });

  it('each keyframe has pos and lookAt as THREE.Vector3', () => {
    KEYFRAMES.forEach((kf, i) => {
      expect(kf.pos, `kf[${i}].pos`).toBeInstanceOf(THREE.Vector3);
      expect(kf.lookAt, `kf[${i}].lookAt`).toBeInstanceOf(THREE.Vector3);
    });
  });

  it('keyframe 0 (intro) is furthest from origin', () => {
    expect(KEYFRAMES[0].pos.z).toBeGreaterThanOrEqual(12);
  });

  it('keyframe 7 (contact) has y <= 2', () => {
    expect(KEYFRAMES[7].pos.y).toBeLessThanOrEqual(2);
  });

  it('each keyframe has fov as a number between 40 and 80', () => {
    KEYFRAMES.forEach((kf, i) => {
      expect(typeof kf.fov, `kf[${i}].fov type`).toBe('number');
      expect(kf.fov, `kf[${i}].fov range`).toBeGreaterThanOrEqual(40);
      expect(kf.fov, `kf[${i}].fov range`).toBeLessThanOrEqual(80);
    });
  });

  it('each keyframe has ease (string) and duration (positive number)', () => {
    KEYFRAMES.forEach((kf, i) => {
      expect(typeof kf.ease, `kf[${i}].ease type`).toBe('string');
      expect(kf.ease.length, `kf[${i}].ease non-empty`).toBeGreaterThan(0);
      expect(typeof kf.duration, `kf[${i}].duration type`).toBe('number');
      expect(kf.duration, `kf[${i}].duration positive`).toBeGreaterThan(0);
    });
  });
});
