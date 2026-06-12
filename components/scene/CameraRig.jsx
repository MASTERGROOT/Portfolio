'use client';
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { KEYFRAMES } from '../../lib/keyframes.js';

gsap.registerPlugin(ScrollTrigger);

// Section IDs that map 1:1 to KEYFRAMES indices 0–7
const SECTION_IDS = ['hero', 'about', 'experience', 'skills', 'work', 'education', 'certs', 'contact'];

export function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    camera.position.copy(KEYFRAMES[0].pos);
    target.current.copy(KEYFRAMES[0].lookAt);

    if (reduced) return;

    function tweenTo(i) {
      gsap.to(camera.position, {
        x: KEYFRAMES[i].pos.x,
        y: KEYFRAMES[i].pos.y,
        z: KEYFRAMES[i].pos.z,
        duration: 1.8,
        ease: 'power2.inOut',
      });
      gsap.to(target.current, {
        x: KEYFRAMES[i].lookAt.x,
        y: KEYFRAMES[i].lookAt.y,
        z: KEYFRAMES[i].lookAt.z,
        duration: 1.8,
        ease: 'power2.inOut',
      });
    }

    const triggers = SECTION_IDS.map((id, i) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        onEnter:     () => tweenTo(i),
        onEnterBack: () => tweenTo(i),
      });
    }).filter(Boolean);

    return () => triggers.forEach(t => t.kill());
  }, [camera]);

  useFrame(() => {
    camera.lookAt(target.current);
  });

  return null;
}
