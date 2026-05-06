import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/node';
import ResultsContainer from './ResultsContainer';

describe('ResultsContainer Component', () => {
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

    expect(screen.getByText(/BULBASAUR/i)).toBeInTheDocument();
  });

  it('shows "NO DATA FOUND" message for 404 error', async () => {
    const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

    server.use(
      http.get(`${BASE_URL}/unknown`, () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    render(<ResultsContainer searchTerm="unknown" />);

    const errorText = await screen.findByText(
      /Error 404: Pokemon not found in database/i,
      {},
      { timeout: 5000 }
    );

    expect(errorText).toBeInTheDocument();
    expect(screen.getByText(/DATABASE ERROR/i)).toBeInTheDocument();
  });

  it('shows "DATABASE ERROR" for 500 status code', async () => {
    server.use(
      http.get('https://pokeapi.co*', () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: 'Internal Server Error',
        });
      })
    );

    render(<ResultsContainer searchTerm="" />);

    const errorTitle = await screen.findByText(
      /⚠️ DATABASE ERROR/i,
      {},
      { timeout: 3000 }
    );
    expect(errorTitle).toBeInTheDocument();
    expect(
      screen.getByText(/Error 500: Internal Server Error/i)
    ).toBeInTheDocument();
  });
});
