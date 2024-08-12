import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import * as AuthContext from '../context/AuthProvider'; // Import the AuthProvider module

// Mock the useAuth hook
const mockUseAuth = jest.spyOn(AuthContext, 'useAuth') as jest.Mock;

describe('Login Component', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUseAuth.mockReset();
  });

  test('renders the Login component', () => {
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
      authToken: null,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText('Login to DigiWallet')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('logs in successfully with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue(true);
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      user: null,
      authToken: null,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123'));
    // Additional assertions can be added here to check for navigation or UI changes
  });

  test('shows error message on failed login', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      logout: jest.fn(),
      user: null,
      authToken: null,
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByText('Log In'));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword'));
    expect(await screen.findByText('Login failed. Please check your credentials and try again.')).toBeInTheDocument();
  });
});
