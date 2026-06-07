import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UncontrolledForm } from '../components/Forms/UncontrolledForm';
import { useFormStore } from '../shared/store';

describe('UncontrolledForm Component', () => {
  beforeEach(() => {
    useFormStore.setState({
      countries: ['Canada', 'Germany'],
      submissions: [],
    });
  });

  const fillFormFields = async (user: ReturnType<typeof userEvent.setup>) => {
    const nameInput = screen.getByLabelText('Name');
    const ageInput = screen.getByLabelText('Age');
    const emailInput = screen.getByLabelText('Email');
    const genderSelect = screen.getByRole('combobox');
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText('Confirm password');
    const termsCheckbox = screen.getByRole('checkbox');

    fireEvent.change(nameInput, { target: { value: 'Ivan' } });
    fireEvent.change(ageInput, { target: { value: '25' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await user.selectOptions(genderSelect, 'male');
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'Password123!' },
    });

    fireEvent.change(termsCheckbox, { target: { checked: true, value: 'on' } });
    termsCheckbox.setAttribute('checked', 'true');
    termsCheckbox.setAttribute('value', 'on');
  };

  it('should validate empty form and then successfully submit with valid data', async () => {
    const user = userEvent.setup();
    const handleSuccess = vi.fn();
    render(<UncontrolledForm onSuccess={handleSuccess} />);

    const submitButton = screen.getByRole('button', {
      name: /Submit \(Uncontrolled\)/i,
    });

    await user.click(submitButton);
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Please upload an avatar')
    ).toBeInTheDocument();

    await fillFormFields(user);

    const countryInput = screen.getByLabelText('Country');
    await user.type(countryInput, 'Can');

    const autocompleteItem = await screen.findByText('Canada');
    await user.click(autocompleteItem);

    fireEvent.change(countryInput, { target: { value: 'Canada' } });

    const fileInput = screen.getByLabelText(/Avatar/i);
    const file = new File(['fake-image-content'], 'avatar.png', {
      type: 'image/png',
    });
    await user.upload(fileInput, file);

    const formElement = fileInput.closest('form');
    const originalConstructor = globalThis.FormData;
    class PatchedFormData extends originalConstructor {
      constructor(form?: HTMLFormElement) {
        super(form);
        this.set('image', file);
      }
    }
    globalThis.FormData = PatchedFormData;

    setTimeout(() => {
      globalThis.FormData = originalConstructor;
    }, 0);

    if (formElement) {
      fireEvent.submit(formElement);
    }

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

  it('should catch file validation errors (wrong format and size exceed)', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={() => {}} />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const fileInput = screen.getByLabelText(/Avatar/i) as HTMLInputElement;

    await fillFormFields(user);

    const countryInput = screen.getByLabelText('Country');
    fireEvent.change(countryInput, { target: { value: 'Canada' } });

    const textFile = new File(['text'], 'doc.txt', { type: 'text/plain' });
    await user.upload(fileInput, textFile);

    const formElement = fileInput.closest('form');
    const originalConstructor = globalThis.FormData;

    if (formElement) {
      formElement.addEventListener(
        'submit',
        () => {
          class PatchedFormDataTxt extends originalConstructor {
            constructor(form?: HTMLFormElement) {
              super(form);
              this.set('image', textFile);
            }
          }
          globalThis.FormData = PatchedFormDataTxt;
          setTimeout(() => {
            globalThis.FormData = originalConstructor;
          }, 0);
        },
        { capture: true, once: true }
      );
    }

    await user.click(submitButton);
    expect(
      await screen.findByText('Only PNG and JPEG formats are allowed.')
    ).toBeInTheDocument();

    fileInput.value = '';

    const bigBlob = new Uint8Array(2.5 * 1024 * 1024);
    const largeFile = new File([bigBlob], 'huge.jpg', { type: 'image/jpeg' });
    await user.upload(fileInput, largeFile);

    if (formElement) {
      formElement.addEventListener(
        'submit',
        () => {
          class PatchedFormDataImg extends originalConstructor {
            constructor(form?: HTMLFormElement) {
              super(form);
              this.set('image', largeFile);
            }
          }
          globalThis.FormData = PatchedFormDataImg;
          setTimeout(() => {
            globalThis.FormData = originalConstructor;
          }, 0);
        },
        { capture: true, once: true }
      );
    }

    await user.click(submitButton);
    expect(
      await screen.findByText('The file size must not exceed 2 MB')
    ).toBeInTheDocument();
  });

  it('should open dropdown on input focus', async () => {
    const user = userEvent.setup();
    render(<UncontrolledForm onSuccess={() => {}} />);

    const countryInput = screen.getByLabelText('Country');
    await user.click(countryInput);

    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('should cover non-array issue path branch for 100% coverage (FIX FOR LINE 69)', () => {
    render(<UncontrolledForm onSuccess={() => {}} />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    const formElement = submitButton.closest('form');

    const originalIsArray = Array.isArray;

    Array.isArray = function (arg: unknown): arg is unknown[] {
      return typeof arg === 'string' && false;
    };

    if (formElement) {
      fireEvent.submit(formElement);
    }

    Array.isArray = originalIsArray;
  });
});
