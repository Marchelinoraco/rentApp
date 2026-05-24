import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Button,
  Input,
  Select,
  DatePicker,
  Card,
  Modal,
  LoadingSpinner,
  ErrorMessage
} from '../../src/components/ui';

describe('UI Components', () => {
  describe('Button', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render different variants', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-600');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border-2');
    });

    it('should show loading state', () => {
      render(<Button isLoading>Submit</Button>);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Input', () => {
    it('should render input with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should display helper text', () => {
      render(<Input label="Email" helperText="Enter your email address" />);
      expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
    });

    it('should show required indicator', () => {
      render(<Input label="Email" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Select', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ];

    it('should render select with options', () => {
      render(<Select label="Choose" options={options} />);
      expect(screen.getByLabelText(/choose/i)).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /option 1/i })).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<Select label="Choose" options={options} error="Required field" />);
      expect(screen.getByText(/required field/i)).toBeInTheDocument();
    });

    it('should render placeholder', () => {
      render(<Select label="Choose" options={options} placeholder="Select an option" />);
      expect(screen.getByText(/select an option/i)).toBeInTheDocument();
    });
  });

  describe('DatePicker', () => {
    it('should render date input with label', () => {
      render(<DatePicker label="Start Date" />);
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    });

    it('should display error message', () => {
      render(<DatePicker label="Start Date" error="Invalid date" />);
      expect(screen.getByText(/invalid date/i)).toBeInTheDocument();
    });

    it('should set min and max dates', () => {
      const minDate = new Date('2024-01-01');
      const maxDate = new Date('2024-12-31');
      render(<DatePicker label="Date" minDate={minDate} maxDate={maxDate} />);
      const input = screen.getByLabelText(/date/i);
      expect(input).toHaveAttribute('min', '2024-01-01');
      expect(input).toHaveAttribute('max', '2024-12-31');
    });
  });

  describe('Card', () => {
    it('should render card with children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
    });

    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Clickable card</Card>);
      fireEvent.click(screen.getByText(/clickable card/i));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard interaction', () => {
      const handleClick = vi.fn();
      render(<Card onClick={handleClick}>Clickable card</Card>);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal', () => {
    it('should render modal when open', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
          Modal content
        </Modal>
      );
      expect(screen.getByText(/test modal/i)).toBeInTheDocument();
      expect(screen.getByText(/modal content/i)).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
          Modal content
        </Modal>
      );
      expect(screen.queryByText(/test modal/i)).not.toBeInTheDocument();
    });

    it('should call onClose when close button clicked', () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          Modal content
        </Modal>
      );
      fireEvent.click(screen.getByLabelText(/close modal/i));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('LoadingSpinner', () => {
    it('should render spinner with label', () => {
      render(<LoadingSpinner label="Loading data" />);
      expect(screen.getByLabelText(/loading data/i)).toBeInTheDocument();
    });

    it('should render different sizes', () => {
      const { rerender } = render(<LoadingSpinner size="small" />);
      let spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('w-4');

      rerender(<LoadingSpinner size="large" />);
      spinner = screen.getByRole('status').querySelector('svg');
      expect(spinner).toHaveClass('w-12');
    });
  });

  describe('ErrorMessage', () => {
    it('should render error message', () => {
      render(<ErrorMessage message="Something went wrong" />);
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(<ErrorMessage message="Error details" title="Error" variant="banner" />);
      expect(screen.getByText(/error$/i)).toBeInTheDocument();
      expect(screen.getByText(/error details/i)).toBeInTheDocument();
    });

    it('should render different severities', () => {
      const { rerender } = render(<ErrorMessage message="Error" severity="error" variant="banner" />);
      expect(screen.getByRole('alert')).toHaveClass('bg-red-50');

      rerender(<ErrorMessage message="Warning" severity="warning" variant="banner" />);
      expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');
    });

    it('should call onDismiss when dismiss button clicked', () => {
      const handleDismiss = vi.fn();
      render(
        <ErrorMessage
          message="Error"
          variant="banner"
          onDismiss={handleDismiss}
        />
      );
      fireEvent.click(screen.getByLabelText(/dismiss error message/i));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
