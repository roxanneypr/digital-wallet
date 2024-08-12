import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthProvider'; // Import the useAuth hook
import PrivateRoute from './components/PrivateRoute';

function AppRoutes() {
  const { user, authToken } = useAuth(); // Access authentication state

  const isAuthenticated = !!user || !!authToken; // Determine if the user is authenticated

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>

      {/* Redirect root path to dashboard if authenticated, else to login */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

      {/* Catch-All Route for Not Found Pages */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
