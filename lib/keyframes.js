import * as THREE from 'three';

export const KEYFRAMES = [
  // KF0 Intro — wide establishing, crane-shot landing zone
  { pos: new THREE.Vector3( 0, 6, 12), lookAt: new THREE.Vector3(0, 0, 0), fov: 65, ease: 'power2.inOut', duration: 1.8 },
  // KF1 About — human-level, considered arrival
  { pos: new THREE.Vector3( 2, 3,  9), lookAt: new THREE.Vector3(0, 1, 0), fov: 58, ease: 'power3.inOut', duration: 1.8 },
  // KF2 Experience — arc sweep, flowing transition
  { pos: new THREE.Vector3( 5, 3,  9), lookAt: new THREE.Vector3(0, 1, 0), fov: 55, ease: 'sine.inOut',   duration: 2.2 },
  // KF3 Skills — widest FOV, board snap
  { pos: new THREE.Vector3( 0, 7, 13), lookAt: new THREE.Vector3(0, 0, 0), fov: 72, ease: 'power4.out',   duration: 1.6 },
  // KF4 Work — balanced professional
  { pos: new THREE.Vector3(-3, 2,  9), lookAt: new THREE.Vector3(0, 1, 0), fov: 52, ease: 'power2.inOut', duration: 2.0 },
  // KF5 Education — earthen, deliberate
  { pos: new THREE.Vector3( 3, 0,  8), lookAt: new THREE.Vector3(0, 1, 0), fov: 60, ease: 'power1.inOut', duration: 2.0 },
  // KF6 Certs — telephoto precision, tightest FOV
  { pos: new THREE.Vector3( 7, 2,  7), lookAt: new THREE.Vector3(0, 1, 0), fov: 44, ease: 'power3.out',   duration: 1.4 },
  // KF7 Contact — opens wide after tightest moment
  { pos: new THREE.Vector3( 1, 1,  7), lookAt: new THREE.Vector3(0, 0, 0), fov: 64, ease: 'power2.out',   duration: 2.4 },
];
