import * as THREE from 'three';

export const KEYFRAMES = [
  { pos: new THREE.Vector3( 0, 6, 12), lookAt: new THREE.Vector3(0, 0, 0) }, // KF0 Intro
  { pos: new THREE.Vector3( 2, 3,  9), lookAt: new THREE.Vector3(0, 1, 0) }, // KF1 About
  { pos: new THREE.Vector3( 5, 3,  9), lookAt: new THREE.Vector3(0, 1, 0) }, // KF2 Experience (elevated wide)
  { pos: new THREE.Vector3( 0, 7, 13), lookAt: new THREE.Vector3(0, 0, 0) }, // KF3 Skills (wide pull-back)
  { pos: new THREE.Vector3(-3, 2,  9), lookAt: new THREE.Vector3(0, 1, 0) }, // KF4 Work (orbit left)
  { pos: new THREE.Vector3( 3, 0,  8), lookAt: new THREE.Vector3(0, 1, 0) }, // KF5 Education (side angle)
  { pos: new THREE.Vector3( 7, 2,  7), lookAt: new THREE.Vector3(0, 1, 0) }, // KF6 Certs (orbit right)
  { pos: new THREE.Vector3( 1, 1,  7), lookAt: new THREE.Vector3(0, 0, 0) }, // KF7 Contact (pull back)
];
