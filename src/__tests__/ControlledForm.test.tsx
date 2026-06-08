import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useFormStore } from '../shared/store';
import type { ControlledForm as ControlledFormType } from '../components/Forms/ControlledForm';
import type { ComponentType } from 'react';

let ControlledForm: ComponentType<{ onSuccess: () => void }>;

beforeAll(async () => {
  useFormStore.setState({ countries: ['Canada'], submissions: [] });

  const module = await import('../components/Forms/ControlledForm');
  ControlledForm = module.ControlledForm as typeof ControlledFormType;

  vi.stubGlobal('alert', vi.fn());
});

afterEach(() => {
  vi.clearAllMocks();
});

const createMockFileList = (file: File): FileList => {
  const fileList = Object.create(FileList.prototype);

  Object.defineProperty(fileList, '0', { value: file, enumerable: true });
  Object.defineProperty(fileList, 'length', { value: 1, enumerable: true });
  Object.defineProperty(fileList, 'item', {
    value: (index: number) => (index === 0 ? file : null),
    enumerable: true,
  });

  return fileList as FileList;
};

describe('Controlled Form (React Hook Form)', () => {
  it('should correctly render fields, validate reactively, enable submit button, and submit valid data', async () => {
    const user = userEvent.setup();
    const handleSuccess = vi.fn();
    render(<ControlledForm onSuccess={handleSuccess} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();

    const nameInput = screen.getByLabelText('Name');
    await user.type(nameInput, 'ivan');
    expect(
      await screen.findByText('First letter must be uppercase')
    ).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    await user.clear(nameInput);
    await user.type(nameInput, 'Ivan');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'male');

    const countryInput = screen.getByLabelText('Country');
    await user.clear(countryInput);
    await user.type(countryInput, 'Canada');
    const dropdownItem = await screen.findByText('Canada');
    await user.click(dropdownItem);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm password');

    await user.type(passwordInput, 'Temp');
    await user.clear(passwordInput);

    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.input(passwordInput);
    fireEvent.input(confirmPasswordInput);

    await user.click(screen.getByRole('checkbox'));

    const file = new File(['fake-content'], 'avatar.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByLabelText(/Avatar/i);

    Object.defineProperty(fileInput, 'files', {
      value: createMockFileList(file),
      configurable: true,
    });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should trigger alert when file verification fails inside onSubmit branch', async () => {
    const user = userEvent.setup();
    render(<ControlledForm onSuccess={() => {}} />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const fileInput = screen.getByLabelText(/Avatar/i);

    await user.type(screen.getByLabelText('Name'), 'Ivan');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'male');

    const countryInput = screen.getByLabelText('Country');
    await user.clear(countryInput);
    await user.type(countryInput, 'Canada');
    const dropdownItem = await screen.findByText('Canada');
    await user.click(dropdownItem);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm password');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.input(passwordInput);
    fireEvent.input(confirmPasswordInput);

    await user.click(screen.getByRole('checkbox'));

    const invalidTextFile = new File(['text'], 'doc.txt', {
      type: 'text/plain',
    });

    Object.defineProperty(fileInput, 'files', {
      value: createMockFileList(invalidTextFile),
      configurable: true,
    });
    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(globalThis.alert).toHaveBeenCalledWith(
        'File Error: PNG/JPEGs up to 2MB allowed'
      );
    });
  });
  it('should successfully submit form without avatar (cover empty image branch)', async () => {
    const user = userEvent.setup();
    const handleSuccess = vi.fn();
    render(<ControlledForm onSuccess={handleSuccess} />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    await user.type(screen.getByLabelText('Name'), 'Ivan');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.selectOptions(screen.getByRole('combobox'), 'male');

    const countryInput = screen.getByLabelText('Country');
    await user.clear(countryInput);
    await user.type(countryInput, 'Canada');
    const dropdownItem = await screen.findByText('Canada');
    await user.click(dropdownItem);

    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm password');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });
    fireEvent.input(passwordInput);
    fireEvent.input(confirmPasswordInput);

    await user.click(screen.getByRole('checkbox'));

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
    });
  });
});
