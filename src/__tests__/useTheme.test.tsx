import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTheme } from '../hooks/useTheme';
import ThemeProvider from '../context/ThemeProvider';

function BadComponent() {
  useTheme();
  return <div>Bad</div>;
}

function GoodComponent() {
  const { theme } = useTheme();
  return <div>Current theme: {theme}</div>;
}

describe('useTheme Hook Coverage Tests', () => {
  it('should throw an error when used outside of ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<BadComponent />)).toThrow(
      'useTheme must be used inside ThemeProvider'
    );

    consoleSpy.mockRestore();
  });

  it('should return context values when used inside ThemeProvider', () => {
    render(
      <ThemeProvider>
        <GoodComponent />
      </ThemeProvider>
    );

    expect(screen.getByText(/Current theme: light/i)).toBeInTheDocument();
  });
});
