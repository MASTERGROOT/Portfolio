import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

export function calcTilt(offsetX, offsetY, width, height) {
  const rotateY = ((offsetX / width) - 0.5) * 16;
  const rotateX = -((offsetY / height) - 0.5) * 16;
  return { rotateX, rotateY };
}

export function useMagneticTilt() {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const { offsetX, offsetY } = e.nativeEvent ?? e;
    const { offsetWidth: width, offsetHeight: height } = ref.current;
    const { rotateX, rotateY } = calcTilt(offsetX, offsetY, width, height);
    const mx = (offsetX / width * 100).toFixed(1) + '%';
    const my = (offsetY / height * 100).toFixed(1) + '%';
    ref.current.style.transform =
      `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    ref.current.style.setProperty('--mx', mx);
    ref.current.style.setProperty('--my', my);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
      clearProps: 'transform'
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
