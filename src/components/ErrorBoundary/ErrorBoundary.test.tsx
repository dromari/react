import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const BuggyComponent = () => {
  throw new Error('Test crash');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText(/Safe Content/i)).toBeInTheDocument();
  });

  it('renders fallback UI when an error is caught', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/SYSTEM ERROR/i)).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  it('resets error state when "Reboot System" button is clicked', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    let shouldThrow = true;
    const BuggyComponent = () => {
      if (shouldThrow) {
        throw new Error('Test crash');
      }
      return <div>Recovered Content</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/SYSTEM ERROR/i)).toBeInTheDocument();

    shouldThrow = false;

    const button = screen.getByRole('button', { name: /Reboot System/i });
    fireEvent.click(button);

    rerender(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Recovered Content/i)).toBeInTheDocument();
    expect(screen.queryByText(/SYSTEM ERROR/i)).not.toBeInTheDocument();
  });
});
