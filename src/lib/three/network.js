import * as THREE from 'three';
import { createNodeMaterial, createEdgeMaterial } from './materials.js';

export const NODE_DEFS = [
  { id: 'center',   label: 'Goody / BA',       type: 'center',    pos: [0, 0, 0],           size: 0.25 },
  { id: 'sap',      label: 'SAP',               type: 'erp',       pos: [3, 1, -1],          size: 0.15 },
  { id: 'oracle',   label: 'Oracle',            type: 'erp',       pos: [-3, 0.5, -1],       size: 0.15 },
  { id: 'mfg',      label: 'Manufacturing',     type: 'client',    pos: [2, -2, 1],          size: 0.13 },
  { id: 'dist',     label: 'Distribution',      type: 'client',    pos: [-2, -1.5, 2],       size: 0.13 },
  { id: 'retail',   label: 'Retail',            type: 'client',    pos: [0, -2.5, -2],       size: 0.12 },
  { id: 'analysis', label: 'Analysis',          type: 'skill',     pos: [0, 3, 1],           size: 0.14 },
  { id: 'pm',       label: 'Project Mgmt',      type: 'skill',     pos: [2, 2, 2],           size: 0.14 },
  { id: 'tech',     label: 'Tech',              type: 'skill',     pos: [-1, 2.5, -2],       size: 0.13 },
  { id: 'comm',     label: 'Communication',     type: 'skill',     pos: [-2.5, 1.5, 1],      size: 0.13 },
  { id: 'uni',      label: 'Kasetsart',         type: 'education', pos: [1, -3, -2],         size: 0.14 },
  { id: 'cert_sap', label: 'SAP Certified',     type: 'cert',      pos: [3.5, 0, 2],         size: 0.12 },
  { id: 'cert_pmp', label: 'PMP',               type: 'cert',      pos: [-3.5, -0.5, -1.5], size: 0.12 },
  { id: 'work1',    label: 'Nishoku',           type: 'work',      pos: [0.5, 1, 3.5],       size: 0.14 },
  { id: 'work2',    label: 'Primus',            type: 'work',      pos: [-1, 0.5, 3.5],      size: 0.14 },
  { id: 'contact',  label: 'Contact',           type: 'contact',   pos: [0, -1, 0.5],        size: 0.18 },
];

export const EDGE_DEFS = [
  ['center', 'sap'],    ['center', 'oracle'],
  ['center', 'mfg'],    ['center', 'dist'],    ['center', 'retail'],
  ['center', 'analysis'], ['center', 'pm'],    ['center', 'tech'], ['center', 'comm'],
  ['center', 'uni'],
  ['center', 'cert_sap'], ['center', 'cert_pmp'],
  ['center', 'work1'],  ['center', 'work2'],
  ['center', 'contact'],
  ['sap',    'cert_sap'], ['sap', 'mfg'],
  ['oracle', 'dist'],
  ['work1',  'mfg'],    ['work2', 'dist'],
  ['analysis', 'pm'],
];

export function buildNetwork(scene) {
  const nodeMap = {};
  const lines = [];

  NODE_DEFS.forEach(def => {
    const geo = new THREE.SphereGeometry(def.size, 16, 16);
    const mat = createNodeMaterial(def.type, false);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...def.pos);
    mesh.userData = { id: def.id, type: def.type };
    scene.add(mesh);
    nodeMap[def.id] = mesh;
  });

  EDGE_DEFS.forEach(([fromId, toId]) => {
    const from = nodeMap[fromId];
    const to = nodeMap[toId];
    if (!from || !to) return;
    const geo = new THREE.BufferGeometry().setFromPoints([
      from.position.clone(),
      to.position.clone(),
    ]);
    const mat = createEdgeMaterial(0.2);
    const line = new THREE.Line(geo, mat);
    line.userData = { fromId, toId };
    scene.add(line);
    lines.push(line);
  });

  return { nodeMap, lines };
}

export function setNodeHighlights(nodeMap, highlightIds) {
  const active = new Set(highlightIds);
  Object.entries(nodeMap).forEach(([id, mesh]) => {
    mesh.material.emissiveIntensity = active.has(id) ? 0.9 : 0.03;
  });
}
