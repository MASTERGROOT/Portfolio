import { it, expect } from 'vitest';
import { get } from 'svelte/store';
import { sceneStore } from './scene.js';

it('sceneStore starts at 0', () => {
  expect(get(sceneStore)).toBe(0);
});

it('sceneStore updates to given index', () => {
  sceneStore.set(5);
  expect(get(sceneStore)).toBe(5);
  sceneStore.set(0); // reset
});
