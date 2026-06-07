import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useFormStore } from '../shared/store';

vi.mock('../components/Forms/UncontrolledForm', () => ({
  UncontrolledForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button data-testid="submit-uncontrolled-mock" onClick={onSuccess}>
      Submit Uncontrolled
    </button>
  ),
}));

vi.mock('../components/Forms/ControlledForm', () => ({
  ControlledForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button data-testid="submit-controlled-mock" onClick={onSuccess}>
      Submit Controlled
    </button>
  ),
}));

describe('App Component Layout and Branch Coverage', () => {
  beforeEach(() => {
    useFormStore.setState({ submissions: [] });
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.remove();
  });

  it('should render empty history by default and handle Uncontrolled Form modal flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByText('No forms have been submitted yet...')
    ).toBeInTheDocument();

    const uncontrolledBtn = screen.getByRole('button', {
      name: 'Uncontrolled Form',
    });
    await user.click(uncontrolledBtn);

    expect(await screen.findByText('Uncontrollable form')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const mockSubmit = screen.getByTestId('submit-uncontrolled-mock');
    await user.click(mockSubmit);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should handle Controlled Form modal flow', async () => {
    const user = userEvent.setup();
    render(<App />);

    const controlledBtn = screen.getByRole('button', {
      name: 'React Hook Form',
    });
    await user.click(controlledBtn);

    expect(
      await screen.findByRole('heading', { name: 'React Hook Form' })
    ).toBeInTheDocument();

    const mockSubmit = screen.getByTestId('submit-controlled-mock');
    await user.click(mockSubmit);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should close the modal when onClose is triggered via the close button', async () => {
    const user = userEvent.setup();
    render(<App />);

    const uncontrolledBtn = screen.getByRole('button', {
      name: 'Uncontrolled Form',
    });
    await user.click(uncontrolledBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should successfully render user submission cards WITH and WITHOUT avatar image', async () => {
    vi.useFakeTimers();

    useFormStore.setState({
      submissions: [
        {
          id: '1',
          name: 'Pavel',
          age: 28,
          email: 'pavel@test.com',
          gender: 'male',
          country: 'Germany',
          image: 'data:image/png;base64,fake',
          submittedAt: Date.now(),
        },
        {
          id: '2',
          name: 'Anna',
          age: 22,
          email: 'anna@test.com',
          gender: 'female',
          country: 'Canada',
          image: '',
          submittedAt: Date.now(),
        },
        {
          id: '3',
          name: 'Old User',
          age: 40,
          email: 'old@test.com',
          gender: 'male',
          country: 'USA',
          image: '',
          submittedAt: Date.now() - 10000,
        },
      ],
    });

    render(<App />);

    expect(screen.getByText('Sending history (3)')).toBeInTheDocument();
    expect(screen.getByText('Pavel')).toBeInTheDocument();
    expect(screen.getByText('Anna')).toBeInTheDocument();

    const img = screen.getByAltText('Pavel');
    expect(img).toBeInTheDocument();

    const placeholderA = screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() !== 'h3' && content === 'A';
    });
    expect(placeholderA).toBeInTheDocument();

    vi.advanceTimersByTime(4000);
    vi.useRealTimers();
  });
});
