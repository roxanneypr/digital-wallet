import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User } from './AuthTypes';

// Create the AuthContext with the correct type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth token and user info in localStorage on component mount
    const token = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');

    if (token && userInfo) {
      setAuthToken(token);
      setUser(JSON.parse(userInfo));
    }
  }, []);

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
        username: data.user.firstName,
        email: data.user.email,
      } as User;

      // Store the token and user info in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      setAuthToken(token);
      setUser(userInfo);

      navigate('/dashboard');
    } else {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }
  };

  const logout = () => {
    // Clear token and user info from localStorage on logout
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
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
