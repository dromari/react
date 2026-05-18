import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../components/NotFound/NotFound';

describe('NotFound Component', () => {
  it('renders 404 error code and missing page message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByText(/The page you are looking for does not exist/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Return to Main App/i })
    ).toBeInTheDocument();
  });
});
