<script>
  import { onMount, onDestroy } from 'svelte';
  import { sceneStore } from './stores/scene.js';

  let canvas;
  let renderer, scene, camera, animId;
  let nodeMap = {}, lines = [];
  let lookAtTarget;

  onMount(async () => {
    // Dynamic import keeps Three.js out of the initial bundle
    const [
      THREE,
      { buildNetwork },
      { animateToKeyframe },
      { KEYFRAMES },
    ] = await Promise.all([
      import('three').then(m => m),
      import('./lib/three/network.js'),
      import('./lib/three/animate.js'),
      import('./lib/three/keyframes.js'),
    ]);

    lookAtTarget = new THREE.Vector3();

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const kf0 = KEYFRAMES[0];
    camera.position.copy(kf0.cameraPos);
    lookAtTarget.copy(kf0.lookAt);
    camera.lookAt(lookAtTarget);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    const point = new THREE.PointLight(0xc9a84c, 2, 20);
    point.position.set(0, 5, 5);
    scene.add(ambient, point);

    const net = buildNetwork(scene);
    nodeMap = net.nodeMap;
    lines = net.lines;

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const unsub = sceneStore.subscribe(index => {
      animateToKeyframe(index, camera, lookAtTarget, nodeMap, lines);
    });

    const loop = () => {
      animId = requestAnimationFrame(loop);
      camera.lookAt(lookAtTarget);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      unsub();
    };
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
    renderer?.dispose();
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
</style>
