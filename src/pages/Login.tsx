import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Import the useAuth hook

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null); // State to hold error message
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from the AuthProvider

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    try {
      // Use the login function from the AuthProvider
      await login(email, password);
      navigate('/dashboard'); // Navigate to dashboard after successful login
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed. Please check your credentials and try again.'); // Set the error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login to DigiWallet</h2>
        {error && <p className="text-red-600 text-center">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
