import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User } from './AuthTypes'; // Import your types

// Create the AuthContext with the correct type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');

    if (token && userInfo) {
      // Optionally, you could verify the token's validity on the server before setting it
      setAuthToken(token);
      setUser(JSON.parse(userInfo));
    }
  }, []);

  /* const login = async (username: string, password: string) => {
    // Example: Replace with your API call
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      // Assuming the token contains the user info in its payload
      const decodedUser = JSON.parse(atob(token.split('.')[1])) as User;

      localStorage.setItem('authToken', token);
      setAuthToken(token);
      setUser(decodedUser);

      navigate('/dashboard');
    } else {
      throw new Error('Login failed');
    }
  }; */

  // AuthProvider.tsx

  const login = async (email: string, password: string) => {
    // Simulate an API call
    return new Promise<void>((resolve, reject) => {
      if (email === 'test@example.com' && password === 'password123') {
        // Simulate setting a token and user
        const mockToken = 'mock-token';
        const userInfo: User = { id: '1', username: 'testuser', email };

        // Store token and user info in localStorage
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        setAuthToken(mockToken);
        setUser(userInfo);
        resolve();
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  };
  

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout }}>
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
