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
});
