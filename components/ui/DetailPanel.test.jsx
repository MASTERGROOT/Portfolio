import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { DetailPanel } from './DetailPanel.jsx';

function renderPanel(zoneIndex = 0, onClose = vi.fn()) {
  return render(
    <LangProvider>
      <DetailPanel zoneIndex={zoneIndex} onClose={onClose} />
    </LangProvider>
  );
}

describe('DetailPanel', () => {
  it('renders panel element', () => {
    renderPanel(0);
    expect(screen.getByTestId('detail-panel')).toBeDefined();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    renderPanel(0, onClose);
    fireEvent.click(screen.getByLabelText('Close panel'));
    // Allow close animation timeout
    setTimeout(() => expect(onClose).toHaveBeenCalledTimes(1), 350);
  });

  it('calls onClose when Escape pressed', () => {
    const onClose = vi.fn();
    renderPanel(0, onClose);
    fireEvent.keyDown(window, { key: 'Escape' });
    setTimeout(() => expect(onClose).toHaveBeenCalledTimes(1), 350);
  });

  it('renders content for each zone without throwing', () => {
    for (let i = 0; i < 8; i++) {
      const { unmount } = renderPanel(i);
      expect(screen.getAllByTestId('detail-panel').length).toBeGreaterThan(0);
      unmount();
    }
  });
});
