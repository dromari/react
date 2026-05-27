import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import ThemeProvider from '../context/ThemeProvider';

describe('App Component Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  const renderWithProviders = (ui: React.ReactElement) => {
    const testQueryClient = createTestQueryClient();
    return {
      testQueryClient,
      ...render(
        <QueryClientProvider client={testQueryClient}>
          <ThemeProvider>{ui}</ThemeProvider>
        </QueryClientProvider>
      ),
    };
  };

  it('loads with initial value from localStorage', () => {
    localStorage.setItem('pokeSearch', '"pikachu"');
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(
      /Search Pokemon.../i
    ) as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('updates state and localStorage on search', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const input = screen.getByPlaceholderText(/Search Pokemon.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'mew' } });
    fireEvent.click(button);

    expect(localStorage.getItem('pokeSearch')).toBe('"mew"');
  });

  it('throws an error when TEST button is clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider>
          <ErrorBoundary>
            <MemoryRouter>
              <App />
            </MemoryRouter>
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    );

    const errorButton = screen.getByRole('button', { name: /test/i });
    fireEvent.click(errorButton);

    expect(screen.getByText(/SYSTEM ERROR/i)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('triggers navigate on background click and blocks propagation inside right column', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/pokemon/pikachu']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route
              path="pokemon/:detailsId"
              element={<div data-testid="details-content">Details Outlet</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
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

    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/Pokédex v1.0/i)).toBeInTheDocument();
  });

  it('toggles theme correctly when theme button is clicked', () => {
    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
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

    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /DARK/i })).toBeInTheDocument();
  });

  it('initializes with dark theme if it is already saved in localStorage', () => {
    vi.restoreAllMocks();

    localStorage.setItem('app_theme', 'dark');

    renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /LIGHT/i })).toBeInTheDocument();
  });

  it('triggers query cache invalidation when REFRESH button is clicked', () => {
    const { testQueryClient } = renderWithProviders(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const invalidateQueriesSpy = vi.spyOn(testQueryClient, 'invalidateQueries');

    const refreshButton = screen.getByRole('button', { name: /REFRESH/i });
    expect(refreshButton).toBeInTheDocument();

    fireEvent.click(refreshButton);

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['pokemons'],
    });
  });
});
