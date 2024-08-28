import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User } from './AuthTypes'; // Adjust the import path as needed

// Create the AuthContext with the correct type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth token and user info in localStorage on component mount
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');

    if (token && userInfo) {
      setAuthToken(token);
      setUser(JSON.parse(userInfo));
      fetchKycStatus(token);
    }
  }, []);

  const logout = () => {
    // Clear token and user info from localStorage on logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    setAuthToken(null);
    setUser(null);
    setKycStatus(null); // Clear KYC status on logout
    navigate('/login');
  };

  const handleFetchResponse = async (response: Response) => {
    if (response.status === 401) {
      // If the token is expired or invalid, log out the user
      logout();
    } else if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Something went wrong');
    }
    return response;
  };

  const fetchKycStatus = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/kyc/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch KYC status');
      }

      const data = await response.json();
      setKycStatus(data.status);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      setKycStatus('error');
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      // Construct user information from response
      const userInfo = {
        id: data.user.id,
        firstName: data.user.firstName,
        username: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
      } as User;

      // Store the token and user info in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      setAuthToken(token);
      setUser(userInfo);

      // Fetch KYC status after login
      await fetchKycStatus(token);

      navigate('/dashboard');
    } else {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    if (authToken) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
      };
    }

    const response = await fetch(url, options);
    return handleFetchResponse(response);
  };

  return (
    <AuthContext.Provider value={{ user, authToken, kycStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
