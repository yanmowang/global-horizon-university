import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CertificateForm from '../components/CertificateForm';

// Mock the alert function
global.alert = jest.fn();

// Mock console.log and console.error
console.log = jest.fn();
console.error = jest.fn();

describe('CertificateForm Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(<CertificateForm />);

    // Check for form title
    expect(screen.getByText('Certificate Application')).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Program/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Issue Date/i)).toBeInTheDocument();

    // Check for submit button
    expect(screen.getByRole('button', { name: /Submit Application/i })).toBeInTheDocument();
  });

  test('displays validation error when name is less than 3 characters', async () => {
    render(<CertificateForm />);

    // Get form elements
    const nameInput = screen.getByLabelText(/Full Name/i);
    const programSelect = screen.getByLabelText(/Program/i);
    const dateInput = screen.getByLabelText(/Issue Date/i);
    const submitButton = screen.getByRole('button', { name: /Submit Application/i });

    // Fill the form with invalid name
    fireEvent.change(nameInput, { target: { value: 'Jo' } });
    fireEvent.change(programSelect, { target: { value: 'MBA' } });
    fireEvent.change(dateInput, { target: { value: '2023-07-20' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
    });

    // Check that the form was not submitted
    expect(global.alert).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  test('displays validation errors when required fields are missing', async () => {
    render(<CertificateForm />);

    // Get submit button and click it without filling the form
    const submitButton = screen.getByRole('button', { name: /Submit Application/i });
    fireEvent.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
      expect(screen.getByText('Please select a program')).toBeInTheDocument();
      expect(screen.getByText('Please select an issue date')).toBeInTheDocument();
    });
  });

  test('submits the form successfully with valid data', async () => {
    render(<CertificateForm />);

    // Get form elements
    const nameInput = screen.getByLabelText(/Full Name/i);
    const programSelect = screen.getByLabelText(/Program/i);
    const dateInput = screen.getByLabelText(/Issue Date/i);
    const submitButton = screen.getByRole('button', { name: /Submit Application/i });

    // Fill the form with valid data
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(programSelect, { target: { value: 'MBA' } });
    fireEvent.change(dateInput, { target: { value: '2023-07-20' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check form submission
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        'Form submitted:',
        expect.objectContaining({
          name: 'John Doe',
          program: 'MBA',
          issueDate: '2023-07-20',
        })
      );

      expect(global.alert).toHaveBeenCalledWith('Certificate application submitted successfully!');
    });

    // Check that form was reset
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(programSelect.value).toBe('');
      expect(dateInput.value).toBe('');
    });
  });
});
