import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Flyout from '../components/Flyout/Flyout';
import { usePokemonStore } from '../store/usePokemonStore';

vi.mock('../store/usePokemonStore', () => ({
  usePokemonStore: vi.fn(),
}));

describe('Flyout Component Coverage Tests', () => {
  it('renders nothing when no pokemons are selected', () => {
    vi.mocked(usePokemonStore).mockReturnValue({
      selectedPokemons: [],
      unselectAll: vi.fn(),
    });

    const { container } = render(<Flyout />);

    expect(container.firstChild).toBeNull();
  });

  it('renders summary and buttons when pokemons are selected', () => {
    vi.mocked(usePokemonStore).mockReturnValue({
      selectedPokemons: [
        {
          name: 'PIKACHU',
          description: 'Electric',
          image: '',
          detailsUrl: 'http://pokeapi/1',
        },
      ],
      unselectAll: vi.fn(),
    });

    render(<Flyout />);

    expect(screen.getByText(/Selected items:/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Download/i })
    ).toBeInTheDocument();
  });

  it('calls unselectAll when clicking the clear button', () => {
    const mockUnselectAll = vi.fn();
    vi.mocked(usePokemonStore).mockReturnValue({
      selectedPokemons: [
        {
          name: 'PIKACHU',
          description: 'Electric',
          image: '',
          detailsUrl: 'http://pokeapi/1',
        },
      ],
      unselectAll: mockUnselectAll,
    });

    render(<Flyout />);

    fireEvent.click(screen.getByRole('button', { name: /Unselect all/i }));

    expect(mockUnselectAll).toHaveBeenCalledTimes(1);
  });

  it('executes download CSV flow successfully when download button is clicked', () => {
    vi.mocked(usePokemonStore).mockReturnValue({
      selectedPokemons: [
        {
          name: 'PIKACHU',
          description: 'Electric',
          image: '',
          detailsUrl: 'http://pokeapi/1',
        },
      ],
      unselectAll: vi.fn(),
    });

    const createObjectURLMock = vi.fn(() => 'blob:mock-url');
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    render(<Flyout />);

    fireEvent.click(screen.getByRole('button', { name: /Download/i }));

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
  it('calls unselectAll when pressing the Escape key', () => {
    const mockUnselectAll = vi.fn();

    vi.mocked(usePokemonStore).mockReturnValue({
      selectedPokemons: [
        {
          name: 'PIKACHU',
          description: 'Electric',
          image: '',
          detailsUrl: 'http://pokeapi/1',
        },
      ],
      unselectAll: mockUnselectAll,
    });

    render(<Flyout />);
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    expect(mockUnselectAll).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(mockUnselectAll).toHaveBeenCalledTimes(1);
  });
});
