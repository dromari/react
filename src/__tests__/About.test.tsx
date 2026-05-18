import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import About from '../components/About/About';

describe('About Component', () => {
  it('renders page heading correctly', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(screen.getByText(/About Pokédex/i)).toBeInTheDocument();
  });
});
