// lib/content.test.js
import { describe, it, expect } from 'vitest';
import { content } from './content.js';

describe('content structure', () => {
  const LANGS = ['en', 'th'];
  const SECTIONS = ['nav', 'hero', 'about', 'skills', 'work', 'experience', 'education', 'certs', 'contact', 'footer'];

  it('exports content object', () => {
    expect(typeof content).toBe('object');
  });

  SECTIONS.forEach(section => {
    it(`section "${section}" exists for both langs`, () => {
      LANGS.forEach(lang => {
        expect(content[section]?.[lang], `content.${section}.${lang}`).toBeDefined();
      });
    });
  });

  it('hero has headline lines for both langs', () => {
    expect(content.hero.en.line1).toBe('Turning Complex Systems');
    expect(content.hero.th.line1).toBe('เปลี่ยนระบบที่ซับซ้อน');
  });

  it('nav has exactly 6 keys per lang', () => {
    expect(Object.keys(content.nav.en).length).toBe(6);
  });

  it('no undefined values in any leaf', () => {
    function check(obj, path) {
      Object.entries(obj).forEach(([k, v]) => {
        const p = `${path}.${k}`;
        if (typeof v === 'object' && v !== null) check(v, p);
        else expect(v, `${p} should not be undefined`).not.toBeUndefined();
      });
    }
    check(content, 'content');
  });
});
