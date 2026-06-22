import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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

  it('calls onClose when close button clicked', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderPanel(0, onClose);
    fireEvent.click(screen.getByLabelText('Close panel'));
    await act(async () => { vi.advanceTimersByTime(350); });
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('calls onClose when Escape pressed', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderPanel(0, onClose);
    fireEvent.keyDown(window, { key: 'Escape' });
    await act(async () => { vi.advanceTimersByTime(350); });
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('renders content for each zone without throwing', () => {
    for (let i = 0; i < 8; i++) {
      const { unmount } = renderPanel(i);
      expect(screen.getAllByTestId('detail-panel').length).toBeGreaterThan(0);
      unmount();
    }
  });
});
