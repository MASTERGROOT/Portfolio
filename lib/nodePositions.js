// Chaos positions: deterministic scatter across a sphere of radius ~5.5
export const CHAOS_POSITIONS = [
  [-4.2, 1.8, -3.1], [3.7, -2.4, 2.8], [-2.1, 3.5, 1.9], [4.8, 0.6, -2.3],
  [-3.4, -1.7, 3.2], [2.9, 2.1, -4.1], [1.2, -3.8, -1.5], [-4.7, 2.9, 0.8],
  [3.1, 1.4, 3.6], [-1.8, -4.2, -2.7], [4.3, -0.9, 1.3], [-2.6, 3.8, -3.4],
  [0.7, 4.5, 2.1], [-3.9, -2.1, -0.6], [2.4, -2.8, -4.2], [4.1, 3.2, -1.8],
  [-1.3, -3.6, 3.9], [3.5, -4.0, 0.4], [-4.4, 0.3, 2.6], [1.9, 4.7, -2.9],
  [-2.8, -0.5, -4.6], [4.6, 1.1, -3.7], [-3.2, 4.1, 1.4], [0.5, -4.4, 3.3],
];

// Grid positions: 4 cols × 3 rows × 2 layers = 24 nodes
// Layout: x ∈ [-2.25,-0.75,0.75,2.25], y ∈ [-1.2,0,1.2], z ∈ [-0.8,0.8]
// Index: col + row*4 + layer*12
export const GRID_POSITIONS = (() => {
  const xs = [-2.25, -0.75, 0.75, 2.25];
  const ys = [-1.2, 0, 1.2];
  const zs = [-0.8, 0.8];
  const out = [];
  for (let li = 0; li < zs.length; li++)
    for (let ri = 0; ri < ys.length; ri++)
      for (let ci = 0; ci < xs.length; ci++)
        out.push([xs[ci], ys[ri], zs[li]]);
  return out;
})();

// 32 edges: pairs of node indices
export const EDGES = [
  // Horizontal (x-axis): 3 per row × 3 rows × 2 layers = 18
  [0,1],[1,2],[2,3],   [4,5],[5,6],[6,7],   [8,9],[9,10],[10,11],
  [12,13],[13,14],[14,15], [16,17],[17,18],[18,19], [20,21],[21,22],[22,23],
  // Vertical (y-axis): rows 0→1, 1→2 for all 4 cols, front layer only
  [0,4],[4,8], [1,5],[5,9], [2,6],[6,10], [3,7],[7,11],
  // Depth (z-axis): front→back for 4 corner+mid nodes
  [0,12],[3,15],[8,20],[11,23],
  // Cross: two diagonals for structural richness
  [5,16],[6,17],
];
