import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
