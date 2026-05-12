import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

describe('App Component Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads with initial value from localStorage', () => {
    localStorage.setItem('pokeSearch', 'pikachu');
    render(<App />);

    const input = screen.getByPlaceholderText(
      /Search Pokemon.../i
    ) as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('updates state and localStorage on search', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/Search Pokemon.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'mew' } });
    fireEvent.click(button);

    expect(localStorage.getItem('pokeSearch')).toBe('mew');
  });

  it('throws an error when TEST button is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);
    const errorButton = screen.getByRole('button', { name: /test/i });

    expect(() => fireEvent.click(errorButton)).toThrow('Test Error');

    spy.mockRestore();
  });
});
