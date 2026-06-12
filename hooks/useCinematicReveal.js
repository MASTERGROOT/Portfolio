import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export function useCinematicReveal(options = {}) {
  const ref = useRef(null);
  const { stagger = 0.08, duration = 0.7, once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    gsap.set(el, { scale: 0.85, y: 60, opacity: 0, filter: 'blur(4px)' });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          gsap.fromTo(
            el,
            { scale: 0.85, y: 60, opacity: 0, filter: 'blur(4px)' },
            { scale: 1, y: 0, opacity: 1, filter: 'blur(0px)', duration, ease: 'expo.out' }
          );
          // Stagger children with class .reveal-item
          const items = el.querySelectorAll('.reveal-item');
          items.forEach((item, i) => {
            gsap.fromTo(
              item,
              { scale: 0.85, y: 40, opacity: 0 },
              { scale: 1, y: 0, opacity: 1, duration, ease: 'expo.out', delay: stagger * (i + 1) }
            );
          });
          if (once) observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [duration, once, stagger]);

  return ref;
}
