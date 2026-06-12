import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { LangToggle } from './LangToggle.jsx';

describe('LangToggle', () => {
  it('renders EN | TH label', () => {
    render(<LangProvider><LangToggle /></LangProvider>);
    expect(screen.getByRole('button').textContent).toMatch(/EN/);
    expect(screen.getByRole('button').textContent).toMatch(/TH/);
  });

  it('cycles en → th on click', () => {
    render(<LangProvider><LangToggle /></LangProvider>);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(btn.getAttribute('data-lang')).toBe('th');
  });
});
