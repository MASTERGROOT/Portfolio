'use client';
import { Float, Html } from '@react-three/drei';
import styles from './DataPanels.module.css';

const PANELS = [
  { pos: [-2.5,  2.5, 0], label: 'ERP Modules',          value: '8',   sub: 'POJJAMAN' },
  { pos: [ 2.5,  2.5, 0], label: 'Projects Delivered',   value: '10+', sub: 'Construction' },
  { pos: [-2.5,  0.5, 0], label: 'Site Engineering',      value: 'Q/C', sub: 'Civil' },
  { pos: [ 2.5,  0.5, 0], label: 'Data Analytics',        value: '✓',   sub: 'Google Certified' },
];

export function DataPanels() {
  return (
    <>
      {PANELS.map((p, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
          <Html position={p.pos} center>
            <div className={styles.panel}>
              <div className={styles.value}>{p.value}</div>
              <div className={styles.label}>{p.label}</div>
              <div className={styles.sub}>{p.sub}</div>
            </div>
          </Html>
        </Float>
      ))}
    </>
  );
}
