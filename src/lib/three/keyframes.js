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
    // 1: About — pull back so center node stays small, shifted up-right
    cameraPos:     new THREE.Vector3(2, 3, 9),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['center'],
    edgeOpacity:   0.06,
    particlesOn:   false,
  },
  {
    // 2: Education — face edu cluster from a safe distance
    cameraPos:     new THREE.Vector3(3, 0, 8),
    lookAt:        new THREE.Vector3(1, -2, -1),
    highlight:     ['center', 'uni'],
    edgeOpacity:   0.07,
    particlesOn:   false,
  },
  {
    // 3: Skills — wide pull-back showing clusters
    cameraPos:     new THREE.Vector3(0, 7, 13),
    lookAt:        new THREE.Vector3(0, 1, 0),
    highlight:     ['analysis', 'pm', 'tech', 'comm'],
    edgeOpacity:   0.08,
    particlesOn:   false,
  },
  {
    // 4: Work — side angle on work cluster
    cameraPos:     new THREE.Vector3(-3, 2, 9),
    lookAt:        new THREE.Vector3(0, 0.5, 3.5),
    highlight:     ['center', 'work1', 'work2'],
    edgeOpacity:   0.07,
    particlesOn:   false,
  },
  {
    // 5: Experience — elevated wide angle
    cameraPos:     new THREE.Vector3(5, 3, 9),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['work1', 'work2', 'uni'],
    edgeOpacity:   0.06,
    particlesOn:   false,
  },
  {
    // 6: Certifications — orbit view from distance
    cameraPos:     new THREE.Vector3(7, 2, 7),
    lookAt:        new THREE.Vector3(0, 0, 0),
    highlight:     ['cert_sap', 'cert_pmp', 'center'],
    edgeOpacity:   0.06,
    particlesOn:   false,
  },
  {
    // 7: Contact — pulled back so contact node is visible but small
    cameraPos:     new THREE.Vector3(1, 1, 7),
    lookAt:        new THREE.Vector3(0, -1, 0.5),
    highlight:     ['contact', 'center'],
    edgeOpacity:   0.12,
    particlesOn:   false,
  },
];
