import gsap from 'gsap';
import { KEYFRAMES } from './keyframes.js';
import { setNodeHighlights } from './network.js';

export function animateToKeyframe(index, camera, lookAtTarget, nodeMap, lines) {
  const kf = KEYFRAMES[index];
  if (!kf) return;

  gsap.to(camera.position, {
    x: kf.cameraPos.x,
    y: kf.cameraPos.y,
    z: kf.cameraPos.z,
    duration: 0.8,
    ease: 'power2.inOut',
  });

  gsap.to(lookAtTarget, {
    x: kf.lookAt.x,
    y: kf.lookAt.y,
    z: kf.lookAt.z,
    duration: 0.8,
    ease: 'power2.inOut',
    onUpdate: () => camera.lookAt(lookAtTarget),
  });

  setNodeHighlights(nodeMap, kf.highlight);

  lines.forEach(line => {
    gsap.to(line.material, {
      opacity: kf.edgeOpacity,
      duration: 0.6,
    });
  });
}
