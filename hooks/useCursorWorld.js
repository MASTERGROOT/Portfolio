import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function useCursorWorld(camera) {
  const mouse = useRef(new THREE.Vector3(0, 0, 0));
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const target = useRef(new THREE.Vector3());

  useEffect(() => {
    function onMove(e) {
      if (!camera) return;
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.current.setFromCamera({ x: ndcX, y: ndcY }, camera);
      raycaster.current.ray.intersectPlane(plane.current, target.current);
      mouse.current.copy(target.current);
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [camera]);

  return mouse;
}
