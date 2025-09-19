// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import { login } from '../api/auth';

function LoginPage() {
  // ... (keep all your existing state and handler logic)
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token);
      Swal.fire({
        icon: 'success',
        title: 'Logged In!',
        timer: 2000,
        showConfirmButton: false,
      });
      window.location.href = '/dashboard';
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your credentials.',
      });
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          {/* ... (keep your form inputs) ... */}
           <div className="mb-4 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div className="mb-6 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Sign In
          </button>
        </form>
        {/* Add this link to the bottom */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;