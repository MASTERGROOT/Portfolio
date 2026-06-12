import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LangProvider } from '../../lib/LangContext.jsx';
import { HeroSection } from './HeroSection.jsx';

describe('HeroSection', () => {
  it('renders EN headline', () => {
    render(<LangProvider><HeroSection /></LangProvider>);
    expect(screen.getByText('Turning Complex Systems')).toBeTruthy();
  });
  it('renders CV download link', () => {
    render(<LangProvider><HeroSection /></LangProvider>);
    expect(screen.getByRole('link', { name: /download cv/i })).toBeTruthy();
  });
});
