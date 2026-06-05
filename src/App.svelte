<script>
  import { onMount } from 'svelte';
  import ThreeCanvas from './ThreeCanvas.svelte';
  import LangToggle from './LangToggle.svelte';
  import Intro from './sections/Intro.svelte';
  import About from './sections/About.svelte';
  import Education from './sections/Education.svelte';
  import Skills from './sections/Skills.svelte';
  import Work from './sections/Work.svelte';
  import Experience from './sections/Experience.svelte';
  import Certifications from './sections/Certifications.svelte';
  import Contact from './sections/Contact.svelte';
  import { sceneStore } from './stores/scene.js';

  const isMobile = typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;

  onMount(() => {
    if (isMobile) {
      document.body.classList.add('mobile');
      return;
    }

    const sections = document.querySelectorAll('[data-scene]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sceneStore.set(Number(entry.target.dataset.scene));
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  });
</script>

<ThreeCanvas />
<main>
  <Intro />
  <About />
  <Experience />
  <Skills />
  <Work />
  <Education />
  <Certifications />
  <Contact />
</main>
<LangToggle />

<style>
  main {
    position: relative;
    z-index: 1;
  }
</style>
