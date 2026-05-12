import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../__tests__/node';
import ResultsContainer from './ResultsContainer';
import * as api from '../../services/api';

describe('ResultsContainer Component', () => {
  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    render(<ResultsContainer searchTerm="" />);
    expect(screen.getByText(/SYSTEM SCANNING.../i)).toBeInTheDocument();
  });

  it('renders pokemon cards after successful fetch', async () => {
    render(<ResultsContainer searchTerm="" />);
    await waitFor(
      () => {
        expect(
          screen.queryByText(/SYSTEM SCANNING.../i)
        ).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
    const pokemonName = await screen.findByText(/BULBASAUR/i);
    expect(pokemonName).toBeInTheDocument();
  });

  it('shows DATABASE ERROR for 500 status code', async () => {
    server.use(
      http.get('https://pokeapi.co*', () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        });
      })
    );
    render(<ResultsContainer searchTerm="error" />);
    const errorTitle = await screen.findByText(/⚠️ DATABASE ERROR/i);
    expect(errorTitle).toBeInTheDocument();
    expect(
      screen.getByText(/Error 500: Internal Server Error/i)
    ).toBeInTheDocument();
  });

  it('handles empty results array', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue([]);
    render(<ResultsContainer searchTerm="non-existent" />);
    const noDataMsg = await screen.findByText(/NO DATA FOUND/i);
    expect(noDataMsg).toBeInTheDocument();
  });

  it('displays System Error when status is missing', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      isError: true,
      message: 'Database connection lost',
    });
    render(<ResultsContainer searchTerm="error" />);
    const errorMsg = await screen.findByText(
      /System Error: Database connection lost/i
    );
    expect(errorMsg).toBeInTheDocument();
  });

  it('renders placeholder when pokemon image is missing', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue([
      {
        name: 'MISSINGNO',
        description: 'Type: ???',
        image: '',
      },
    ]);
    render(<ResultsContainer searchTerm="missing" />);
    const placeholder = await screen.findByText('?');
    expect(placeholder).toBeInTheDocument();
  });
});
