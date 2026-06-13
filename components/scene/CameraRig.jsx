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

    // lookAt target stays at KF0 origin throughout the crane shot
    target.current.copy(KEYFRAMES[0].lookAt);

    if (reduced) {
      // Reduced-motion: skip animation, land directly at crane-shot destination
      camera.position.set(0, 7, 13);
      camera.fov = 65;
      camera.updateProjectionMatrix();
      return;
    }

    // Crane shot: start at wide establishing position, arrive near KF0
    camera.position.set(0, 12, 18);
    camera.fov = 70;
    camera.updateProjectionMatrix();

    // One-time cinematic descent on page load
    gsap.to(camera.position, {
      x: 0, y: 7, z: 13,
      duration: 2.4,
      ease: 'expo.out',
    });
    gsap.to(camera, {
      fov: 65,
      duration: 2.4,
      ease: 'expo.out',
      onUpdate: () => camera.updateProjectionMatrix(),
    });

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
