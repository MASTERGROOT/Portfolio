'use client';
import { Scene }   from '../components/scene/Scene.jsx';
import { Overlay } from '../components/ui/Overlay.jsx';
import { useFlightProgress } from '../hooks/useFlightProgress.js';

export default function Page() {
  const flightProgress = useFlightProgress();
  return (
    <>
      <Scene flightProgress={flightProgress} />
      <Overlay flightProgress={flightProgress} />
    </>
  );
}
