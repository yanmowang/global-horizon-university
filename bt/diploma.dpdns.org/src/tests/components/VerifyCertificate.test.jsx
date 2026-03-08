import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import VerifyCertificate from '../../components/VerifyCertificate';

// Reset mocks
beforeEach(() => {
  global.fetch.mockReset();
});

// Mock component with router
const renderWithRouter = ui => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('VerifyCertificate Component', () => {
  test('renders the verification form correctly', () => {
    renderWithRouter(<VerifyCertificate />);

    // Check for page title
    expect(screen.getByText(/Certificate Verification/i)).toBeInTheDocument();

    // Check for input field
    expect(screen.getByPlaceholderText(/Enter certificate number/i)).toBeInTheDocument();

    // Check for verify button
    expect(screen.getByRole('button', { name: /Verify Certificate/i })).toBeInTheDocument();
  });

  test('displays error when certificate number is not provided', async () => {
    renderWithRouter(<VerifyCertificate />);

    // Get the verify button and click it without filling the input
    const verifyButton = screen.getByRole('button', { name: /Verify Certificate/i });
    fireEvent.click(verifyButton);

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Please enter a certificate number/i)).toBeInTheDocument();
    });

    // Verify that fetch was not called
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('displays loading state when verifying', async () => {
    // Mock fetch to delay response
    global.fetch.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () =>
                  Promise.resolve({
                    success: true,
                    valid: false,
                    message: 'Certificate not found',
                  }),
              }),
            100
          )
        )
    );

    renderWithRouter(<VerifyCertificate />);

    // Fill in certificate number
    const input = screen.getByPlaceholderText(/Enter certificate number/i);
    fireEvent.change(input, { target: { value: 'GHU-2023-123456' } });

    // Click verify button
    const verifyButton = screen.getByRole('button', { name: /Verify Certificate/i });
    fireEvent.click(verifyButton);

    // Check for loading state
    expect(screen.getByText(/Verifying/i)).toBeInTheDocument();

    // Wait for response
    await waitFor(() => {
      expect(screen.queryByText(/Verifying/i)).not.toBeInTheDocument();
    });
  });

  test('displays invalid certificate message when certificate is not found', async () => {
    // Mock fetch with invalid certificate response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          valid: false,
          message: 'Certificate not found',
        }),
    });

    renderWithRouter(<VerifyCertificate />);

    // Fill in certificate number
    const input = screen.getByPlaceholderText(/Enter certificate number/i);
    fireEvent.change(input, { target: { value: 'INVALID-CERT' } });

    // Click verify button
    const verifyButton = screen.getByRole('button', { name: /Verify Certificate/i });
    fireEvent.click(verifyButton);

    // Check for invalid certificate message
    await waitFor(() => {
      expect(screen.getByText(/Invalid certificate/i)).toBeInTheDocument();
    });
  });

  test('displays certificate details when certificate is valid', async () => {
    // Mock fetch with valid certificate response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          valid: true,
          data: {
            certificateNumber: 'GHU-BA-2023-123456',
            program: 'Computer Science',
            certificateType: 'bachelor',
            issueDate: '2023-07-15',
            status: 'issued',
            metadata: {
              graduationDate: '2023-05-20',
              gpa: 3.8,
              honors: 'Cum Laude',
            },
            recipientName: 'John Doe',
          },
        }),
    });

    renderWithRouter(<VerifyCertificate />);

    // Fill in certificate number
    const input = screen.getByPlaceholderText(/Enter certificate number/i);
    fireEvent.change(input, { target: { value: 'GHU-BA-2023-123456' } });

    // Click verify button
    const verifyButton = screen.getByRole('button', { name: /Verify Certificate/i });
    fireEvent.click(verifyButton);

    // Check for valid certificate details
    await waitFor(() => {
      expect(screen.getByText(/Certificate is Valid/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Computer Science/i)).toBeInTheDocument();
      expect(screen.getByText(/Bachelor/i, { exact: false })).toBeInTheDocument();
    });
  });

  test('handles network errors gracefully', async () => {
    // Mock fetch with network error
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<VerifyCertificate />);

    // Fill in certificate number
    const input = screen.getByPlaceholderText(/Enter certificate number/i);
    fireEvent.change(input, { target: { value: 'GHU-BA-2023-123456' } });

    // Click verify button
    const verifyButton = screen.getByRole('button', { name: /Verify Certificate/i });
    fireEvent.click(verifyButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Error verifying certificate/i)).toBeInTheDocument();
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});
