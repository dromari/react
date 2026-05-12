import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders with initial value from props', () => {
    render(<SearchBar onSearch={() => {}} initialValue="Pikachu" />);
    const input = screen.getByPlaceholderText(
      /Search Pokemon.../i
    ) as HTMLInputElement;

    expect(input.value).toBe('Pikachu');
  });

  it('updates input value on change', () => {
    render(<SearchBar onSearch={() => {}} initialValue="" />);
    const input = screen.getByPlaceholderText(
      /Search Pokemon.../i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'Charizard' } });
    expect(input.value).toBe('Charizard');
  });

  it('calls onSearch with trimmed value when button is clicked', () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} initialValue="" />);

    const input = screen.getByPlaceholderText(/Search Pokemon.../i);
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: '  Bulbasaur  ' } });
    fireEvent.click(button);

    expect(mockSearch).toHaveBeenCalledWith('Bulbasaur');
  });

  it('calls onSearch when Enter key is pressed', () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} initialValue="" />);

    const input = screen.getByPlaceholderText(/Search Pokemon.../i);

    fireEvent.change(input, { target: { value: 'Mew' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSearch).toHaveBeenCalledWith('Mew');
  });

  it('does not call onSearch when other keys are pressed', () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} initialValue="" />);

    const input = screen.getByPlaceholderText(/Search Pokemon.../i);

    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
