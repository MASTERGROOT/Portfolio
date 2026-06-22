'use client';
import { useState } from 'react';
import { Scene }   from '../components/scene/Scene.jsx';
import { Overlay } from '../components/ui/Overlay.jsx';
import { Loader }  from '../components/ui/Loader.jsx';
import { useFlightProgress } from '../hooks/useFlightProgress.js';

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const flightProgress = useFlightProgress();

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      {loaded && (
        <>
          <Scene flightProgress={flightProgress} />
          <Overlay flightProgress={flightProgress} />
        </>
      )}
    </>
  );
}
