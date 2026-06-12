import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LangProvider, useLang } from './LangContext.jsx';

const Toggle = () => {
  const { lang, setLang } = useLang();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setLang(lang === 'en' ? 'th' : 'en')}>toggle</button>
    </div>
  );
};

beforeEach(() => localStorage.clear());

describe('LangContext', () => {
  it('defaults to en', () => {
    render(<LangProvider><Toggle /></LangProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('switches to th on toggle', () => {
    render(<LangProvider><Toggle /></LangProvider>);
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('lang').textContent).toBe('th');
  });

  it('persists lang in localStorage', () => {
    render(<LangProvider><Toggle /></LangProvider>);
    fireEvent.click(screen.getByText('toggle'));
    expect(localStorage.getItem('lang')).toBe('th');
  });

  it('reads initial lang from localStorage', () => {
    localStorage.setItem('lang', 'th');
    render(<LangProvider><Toggle /></LangProvider>);
    expect(screen.getByTestId('lang').textContent).toBe('th');
  });
});
