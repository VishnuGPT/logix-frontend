import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming custom UI components
import { Input } from '@/components/ui/input';   // Assuming custom UI components
import { LoaderOne } from '@/components/ui/loader';


export default function AdminSignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/signin`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // On success, server should return a token
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Redirect to the admin dashboard
        navigate('/admin-dashboard');
      } else {
        setError(response.data.message || 'An unexpected error occurred.');
      }

    } catch (err) {
      if (err.response) {
        // Handle specific HTTP error statuses from the server
        setError(err.response.data.message || 'Invalid credentials or server error.');
      } else {
        // Handle network errors
        setError('Cannot connect to the server. Please check your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background font-sans p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-white border border-black/10 rounded-xl shadow-lg"
      >
        <div className="text-center">
          <img src="/LOGO.png" alt="LogiXjunction Logo" className="w-auto h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-headings">Admin Portal</h1>
          <p className="text-text/70">Sign in to manage operations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-text">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/50" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="pl-10" // Padding for the icon
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-text">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/50" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="pl-10" // Padding for the icon
              />
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-medium text-center text-red-600"
            >
              {error}
            </motion.p>
          )}

          {/* Submit Button */}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <LoaderOne />
                  <span className="ml-2">Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}