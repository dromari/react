import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../components/ui/Select';

describe('Select Component', () => {
  const mockOptions = [
    { value: 'usa', label: 'USA' },
    { value: 'canada', label: 'Canada' },
  ];

  it('should render correctly with options and custom id', () => {
    render(
      <Select
        label="Choose Country"
        id="custom-country-id"
        options={mockOptions}
      />
    );

    const label = screen.getByText('Choose Country');
    const select = screen.getByRole('combobox');

    expect(select).toHaveAttribute('id', 'custom-country-id');
    expect(label).toHaveAttribute('for', 'custom-country-id');

    expect(
      screen.getByRole('option', { name: 'Select...' })
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'USA' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
  });

  it('should fallback to props.name when id is not provided ', () => {
    render(
      <Select
        label="Choose Country"
        name="fallback-country-name"
        options={mockOptions}
      />
    );

    const label = screen.getByText('Choose Country');
    const select = screen.getByRole('combobox');

    expect(select).toHaveAttribute('id', 'fallback-country-name');
    expect(label).toHaveAttribute('for', 'fallback-country-name');
  });

  it('should support user interaction and change value', async () => {
    const user = userEvent.setup();
    render(<Select label="Choose Country" options={mockOptions} />);

    const select = screen.getByRole('combobox');

    expect(select).toHaveValue('');

    await user.selectOptions(select, 'canada');
    expect(select).toHaveValue('canada');
  });

  it('should display error message and apply error class when error prop is active', () => {
    render(
      <Select
        label="Choose Country"
        options={mockOptions}
        error="Please select a country"
      />
    );

    const errorText = screen.getByText('Please select a country');
    expect(errorText).toBeInTheDocument();

    const select = screen.getByRole('combobox');
    expect(select.className).toContain('Error');
  });
});
