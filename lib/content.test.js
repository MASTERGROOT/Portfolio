import { describe, it, expect } from 'vitest';
import { CONTENT } from './content.js';

describe('CONTENT', () => {
  it('has exactly 8 zones', () => {
    expect(CONTENT).toHaveLength(8);
  });

  it('every zone has en+th label, title, sub', () => {
    CONTENT.forEach((zone, i) => {
      expect(zone.label.en, `zone ${i} label.en`).toBeTruthy();
      expect(zone.label.th, `zone ${i} label.th`).toBeTruthy();
      expect(zone.title.en, `zone ${i} title.en`).toBeTruthy();
      expect(zone.title.th, `zone ${i} title.th`).toBeTruthy();
    });
  });

  it('zone 0 has ctaLinks array', () => {
    expect(Array.isArray(CONTENT[0].body.ctaLinks)).toBe(true);
    expect(CONTENT[0].body.ctaLinks.length).toBeGreaterThan(0);
  });

  it('zone 1 has stats array with 3 items', () => {
    expect(CONTENT[1].body.stats).toHaveLength(3);
    CONTENT[1].body.stats.forEach(s => {
      expect(s.value.en).toBeTruthy();
      expect(s.label.en).toBeTruthy();
    });
  });

  it('zone 2 has roles array', () => {
    expect(Array.isArray(CONTENT[2].body.roles)).toBe(true);
  });

  it('zone 7 contact has email', () => {
    expect(CONTENT[7].body.email).toBe('vivitthachaigood@gmail.com');
  });
});
