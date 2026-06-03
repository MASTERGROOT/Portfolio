import * as THREE from 'three';

export const KEYFRAMES = [
  {
    // 0: Intro — full network active
    cameraPos:     new THREE.Vector3(0, 6, 12),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['center','sap','oracle','mfg','dist','retail','analysis','pm','tech','comm','uni','cert_sap','cert_pmp','work1','work2','contact'],
    edgeOpacity:   0.35,
    particlesOn:   true,
  },
  {
    // 1: About — center node only
    cameraPos:     new THREE.Vector3(0, 0.5, 3.5),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['center'],
    edgeOpacity:   0.1,
    particlesOn:   false,
  },
  {
    // 2: Education — face edu cluster
    cameraPos:     new THREE.Vector3(2, -2, 4),
    lookAt:        new THREE.Vector3(1, -3, -2),
    highlight:     ['center', 'uni'],
    edgeOpacity:   0.2,
    particlesOn:   false,
  },
  {
    // 3: Skills — pull back, clusters visible
    cameraPos:     new THREE.Vector3(0, 5, 9),
    lookAt:        new THREE.Vector3(0, 1, 0),
    highlight:     ['analysis', 'pm', 'tech', 'comm'],
    edgeOpacity:   0.3,
    particlesOn:   false,
  },
  {
    // 4: Work — pan to company cluster
    cameraPos:     new THREE.Vector3(-1, 1, 7),
    lookAt:        new THREE.Vector3(0, 0.5, 3.5),
    highlight:     ['center', 'work1', 'work2'],
    edgeOpacity:   0.25,
    particlesOn:   false,
  },
  {
    // 5: Experience — low angle chronological arc
    cameraPos:     new THREE.Vector3(4, -1, 5),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['work1', 'work2', 'uni'],
    edgeOpacity:   0.2,
    particlesOn:   false,
  },
  {
    // 6: Certifications — orbit view
    cameraPos:     new THREE.Vector3(5, 1, 3),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['cert_sap', 'cert_pmp', 'center'],
    edgeOpacity:   0.15,
    particlesOn:   false,
  },
  {
    // 7: Contact — close on contact node
    cameraPos:     new THREE.Vector3(0, -0.5, 3),
    lookAt:        new THREE.Vector3(0, -1, 0.5),
    highlight:     ['contact', 'center'],
    edgeOpacity:   0.5,
    particlesOn:   false,
  },
];
