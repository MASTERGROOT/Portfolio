import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Loader } from './Loader.jsx';

describe('Loader', () => {
  it('renders name and role text', () => {
    render(<Loader onComplete={() => {}} />);
    expect(screen.getByTestId('loader-name')).toBeDefined();
    expect(screen.getByTestId('loader-role')).toBeDefined();
  });

  it('calls onComplete', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<Loader onComplete={onComplete} />);
    await act(() => vi.advanceTimersByTime(3000));
    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
