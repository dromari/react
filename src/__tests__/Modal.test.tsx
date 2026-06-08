import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../components/Modal/Modal';

describe('Modal Component (React Portal)', () => {
  afterEach(() => {
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) modalRoot.remove();
  });

  it('should not render anything if isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('must render content in the portal, have accessible attributes, and close when clicking on the cross', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Modal Body</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Body')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should close when the Escape key is pressed (FIX FOR LINES 19-21)', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should close when clicking on the overlay backdrop, but not on content (FIX FOR LINE 47)', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div data-testid="modal-content">Content</div>
      </Modal>
    );

    const content = screen.getByTestId('modal-content');
    await user.click(content);

    expect(handleClose).not.toHaveBeenCalled();

    const overlay = screen.getByRole('dialog');
    await user.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  it('should NOT close when any key other than Escape is pressed (FIX FOR LINE 21 BRANCH)', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    await user.keyboard('{Enter}');

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should reuse existing modal-root if it is already present in DOM', () => {
    const existingRoot = document.createElement('div');
    existingRoot.id = 'modal-root';
    document.body.appendChild(existingRoot);

    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Content</div>
      </Modal>
    );

    const allModalRoots = document.querySelectorAll('#modal-root');
    expect(allModalRoots.length).toBe(1);
  });
});
