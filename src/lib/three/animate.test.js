import { it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

vi.mock('gsap', () => ({ default: { to: vi.fn() } }));

import gsap from 'gsap';
import { animateToKeyframe } from './animate.js';
import { buildNetwork } from './network.js';

beforeEach(() => gsap.to.mockClear());

it('calls gsap.to for camera.position on valid index', () => {
  const scene = new THREE.Scene();
  const { nodeMap, lines } = buildNetwork(scene);
  const camera = new THREE.PerspectiveCamera();
  const lookAtTarget = new THREE.Vector3();

  animateToKeyframe(0, camera, lookAtTarget, nodeMap, lines);
  expect(gsap.to).toHaveBeenCalled();

  const firstCall = gsap.to.mock.calls[0];
  expect(firstCall[0]).toBe(camera.position);
});

it('does nothing for invalid index', () => {
  const scene = new THREE.Scene();
  const { nodeMap, lines } = buildNetwork(scene);
  const camera = new THREE.PerspectiveCamera();
  const lookAtTarget = new THREE.Vector3();

  animateToKeyframe(99, camera, lookAtTarget, nodeMap, lines);
  expect(gsap.to).not.toHaveBeenCalled();
});
