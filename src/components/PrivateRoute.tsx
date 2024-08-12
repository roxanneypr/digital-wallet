import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Import the useAuth hook

function PrivateRoute() {
  const { user } = useAuth(); // Check if the user is authenticated

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
