// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2';
import { register } from '../api/auth';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register(formData);
      localStorage.setItem('token', data.token); // Save token and log in

      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'You are now logged in.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Later, we will redirect to the dashboard
      // window.location.href = '/dashboard';

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'A user with this email may already exist.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6 relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600 transition-colors"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;