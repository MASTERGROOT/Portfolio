import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Cursor } from './Cursor.jsx';

describe('Cursor', () => {
  it('renders dot and ring after mousemove', async () => {
    const { container } = render(<Cursor />);
    // Before any mousemove, cursor is hidden
    const dot = container.querySelector('[data-cursor-dot]');
    expect(dot).toBeNull();
    // Trigger mousemove
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    // After mousemove, cursor elements should appear
    await new Promise(r => setTimeout(r, 50));
    expect(container.querySelector('[data-cursor-dot]')).toBeDefined();
    expect(container.querySelector('[data-cursor-ring]')).toBeDefined();
  });
});
