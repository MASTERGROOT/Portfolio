import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { Overlay } from './Overlay.jsx';

function makeProgress(p = 0, zi = 0) {
  return {
    progress:  { current: p },
    zoneIndex: { current: zi },
    target:    { current: p },
  };
}

function renderOverlay(p = 0, zi = 0) {
  return render(
    <LangProvider>
      <Overlay flightProgress={makeProgress(p, zi)} />
    </LangProvider>
  );
}

describe('Overlay', () => {
  it('renders VIVITTHACHAI logo', () => {
    renderOverlay();
    expect(screen.getByText('VIVITTHACHAI')).toBeDefined();
  });

  it('renders zone title from ZONES', () => {
    renderOverlay(0, 0);
    expect(screen.getByTestId('zone-title')).toBeDefined();
  });

  it('renders dot nav with 8 dots', () => {
    renderOverlay();
    const nav = screen.getByRole('navigation', { name: /section/i });
    expect(nav.querySelectorAll('button').length).toBe(8);
  });

  it('View Details button opens the detail panel', () => {
    renderOverlay();
    expect(screen.queryByTestId('detail-panel')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /view .* details/i }));
    expect(screen.getByTestId('detail-panel')).toBeDefined();
  });
});
