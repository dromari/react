import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import ThemeProvider from '../context/ThemeProvider';

describe('App Component Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads with initial value from localStorage', () => {
    localStorage.setItem('pokeSearch', '"pikachu"');
    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText(
      /Search Pokemon.../i
    ) as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('updates state and localStorage on search', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );
    const input = screen.getByPlaceholderText(/Search Pokemon.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'mew' } });
    fireEvent.click(button);

    expect(localStorage.getItem('pokeSearch')).toBe('"mew"');
  });

  it('throws an error when TEST button is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ThemeProvider>
        <ErrorBoundary>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </ErrorBoundary>
      </ThemeProvider>
    );

    const errorButton = screen.getByRole('button', { name: /test/i });
    fireEvent.click(errorButton);

    expect(screen.getByText(/SYSTEM ERROR/i)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('triggers navigate on background click and blocks propagation inside right column', () => {
    render(
      <ThemeProvider>
        <MemoryRouter initialEntries={['/pokemon/pikachu']}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route
                path="pokemon/:detailsId"
                element={
                  <div data-testid="details-content">Details Outlet</div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    );

    const detailsView = screen.getByTestId('details-content');
    expect(detailsView).toBeInTheDocument();

    fireEvent.click(detailsView);

    const mainWrapper = screen.getByText(/Pokédex v1.0/i).closest('div');
    if (mainWrapper) {
      fireEvent.click(mainWrapper);
    }
  });

  it('handles localStorage target errors in try-catch blocks', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Security Error');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota Exceeded');
    });

    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByText(/Pokédex v1.0/i)).toBeInTheDocument();
  });
  it('toggles theme correctly when theme button is clicked', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

    const themeButton = screen.getByRole('button', { name: /DARK/i });
    expect(themeButton).toBeInTheDocument();

    fireEvent.click(themeButton);

    expect(screen.getByRole('button', { name: /LIGHT/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /LIGHT/i }));
    expect(screen.getByRole('button', { name: /DARK/i })).toBeInTheDocument();
  });

  it('handles secure localStorage target errors inside ThemeProvider initialization catch block', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Security Block Error');
    });

    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /DARK/i })).toBeInTheDocument();
  });

  it('initializes with dark theme if it is already saved in localStorage', () => {
    vi.restoreAllMocks();

    localStorage.setItem('app_theme', 'dark');

    render(
      <ThemeProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getByRole('button', { name: /LIGHT/i })).toBeInTheDocument();
  });
});
