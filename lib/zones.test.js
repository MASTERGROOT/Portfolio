import { describe, it, expect } from 'vitest';
import { ZONES, TOTAL_DEPTH, getZoneIndex, getZoneAtZ } from './zones.js';

describe('ZONES', () => {
  it('exports exactly 8 zones', () => {
    expect(ZONES).toHaveLength(8);
  });

  it('each zone has index, zStart, zEnd, zMid, label/title/sub with en+th', () => {
    ZONES.forEach((z, i) => {
      expect(z.index, `zone ${i} index`).toBe(i);
      expect(typeof z.zStart).toBe('number');
      expect(typeof z.zEnd).toBe('number');
      expect(typeof z.zMid).toBe('number');
      ['label', 'title', 'sub'].forEach(key => {
        expect(typeof z[key].en, `zone ${i} ${key}.en`).toBe('string');
        expect(typeof z[key].th, `zone ${i} ${key}.th`).toBe('string');
        expect(z[key].en.length, `zone ${i} ${key}.en non-empty`).toBeGreaterThan(0);
        expect(z[key].th.length, `zone ${i} ${key}.th non-empty`).toBeGreaterThan(0);
      });
    });
  });

  it('zones cover full depth — first starts at 0, last ends at -TOTAL_DEPTH, no gaps', () => {
    expect(ZONES[0].zStart).toBe(0);
    expect(ZONES[7].zEnd).toBe(-TOTAL_DEPTH);
    for (let i = 1; i < 8; i++) {
      expect(ZONES[i].zStart, `gap between zone ${i-1} and ${i}`).toBe(ZONES[i-1].zEnd);
    }
  });

  it('each zMid is between zStart and zEnd (exclusive)', () => {
    ZONES.forEach((z, i) => {
      expect(z.zMid, `zone ${i} zMid`).toBeLessThan(z.zStart);
      expect(z.zMid, `zone ${i} zMid`).toBeGreaterThan(z.zEnd);
    });
  });
});

describe('getZoneIndex', () => {
  it('returns 0 at progress=0', () => expect(getZoneIndex(0)).toBe(0));
  it('returns 7 at progress=1', () => expect(getZoneIndex(1)).toBe(7));
  it('returns 7 at progress=0.999', () => expect(getZoneIndex(0.999)).toBe(7));
  it('maps progress=0.5 to zone 4', () => expect(getZoneIndex(0.5)).toBe(4));
  it('returns 0–7 for all progress values', () => {
    for (let p = 0; p <= 1; p += 0.1) {
      const idx = getZoneIndex(p);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThanOrEqual(7);
    }
  });
});

describe('getZoneAtZ', () => {
  it('returns zone 0 at z=0', () => expect(getZoneAtZ(0).index).toBe(0));
  it('returns zone 7 at z=-160', () => expect(getZoneAtZ(-160).index).toBe(7));
  it('returns zone 2 at z=-45', () => expect(getZoneAtZ(-45).index).toBe(2));
});
