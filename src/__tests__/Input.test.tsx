import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Input } from '../components/ui/Input';

describe('Input Component - File Type Coverage', () => {
  it('should render file input and handle file upload', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Input label="Avatar" type="file" name="avatar" onChange={handleChange} />
    );

    expect(screen.getByText('No file chosen')).toBeInTheDocument();

    const fileInput = screen.getByLabelText('Avatar');
    const file = new File(['hello'], 'avatar.png', { type: 'image/png' });

    await user.upload(fileInput, file);

    expect(screen.getByText('avatar.png')).toBeInTheDocument();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should cover the else branch in handleFileChange when no files are selected', () => {
    render(<Input label="Avatar" type="file" name="avatar" />);

    const fileInput = screen.getByLabelText('Avatar');

    fireEvent.change(fileInput, {
      target: { files: [] },
    });

    expect(screen.getByText('No file chosen')).toBeInTheDocument();
  });

  it('should trigger hidden input click when custom button is clicked', async () => {
    const user = userEvent.setup();
    render(<Input label="Avatar" type="file" name="avatar" />);

    const hiddenInput = screen.getByLabelText('Avatar');

    const clickSpy = vi.spyOn(hiddenInput, 'click');

    const customButton = screen.getByRole('button', { name: 'Choose File' });
    await user.click(customButton);

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('should correctly assign object ref to ref.current', () => {
    const objectRef = createRef<HTMLInputElement>();

    render(<Input label="Avatar" type="file" name="avatar" ref={objectRef} />);

    expect(objectRef.current).toBeInstanceOf(HTMLInputElement);
    expect(objectRef.current?.type).toBe('file');
  });
});
