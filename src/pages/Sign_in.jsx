import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import LoaderOne from "@/components/ui/LoadingScreen";
import { Eye, EyeOff } from 'lucide-react';

// --- Helper component for the Google Icon ---
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_17_40)">
      <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24v10.1h13.4c-.7 3.1-2.7 5.6-5.6 7.3v5.7h7.7c4.5-4 8-10 8-17.4Z" fill="#4285F4" />
      <path d="M24 48c6.6 0 12.1-2.1 16.5-5.9l-7.7-5.7c-2.1 1.2-4.5 1.9-8.8 1.9-6.3 0-11.8-4.1-13.7-9.6H2.3v6c3.4 6.5 11.8 13.5 21.7 13.5Z" fill="#34A853" />
      <path d="M10.3 28.7c-.5-1.2-.8-2.5-.8-3.9s.3-2.7.8-3.9V15H2.3C.8 18.1 0 21.4 0 24.8s.8 6.7 2.3 9.8l8-5.9Z" fill="#FBBC05" />
      <path d="M24 9.7c3.8 0 6.7 1.4 8.6 3.2l7.1-6.8C36.1 2.7 30.6 0 24 0 14.1 0 5.7 6.9 2.3 15l8 5.9c1.9-5.5 7.4-11.2 13.7-11.2Z" fill="#EA4335" />
    </g>
    <defs><clipPath id="clip0_17_40"><rect width="48" height="48" fill="white" /></clipPath></defs>
  </svg>
);

export default function SignInPage() {
  const [userType, setUserType] = useState('Shipper');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      password,
      ...(contact.includes('@') ? { email: contact } : { mobileNumber: contact }),
    };

    const endpoint = userType === 'Transporter'
      ? `${import.meta.env.VITE_API_URL}/api/transporters/login`
      : `${import.meta.env.VITE_API_URL}/api/shipper/login`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        const dashboardPath = userType === 'Shipper' ? '/client-dashboard' : '/transporter-dashboard';
        navigate(dashboardPath);
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      navigate('/client-dashboard');
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // background color changes depending on userType
  const bgClass = userType === 'Shipper' 
    ? 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    : 'bg-gradient-to-br from-orange-50 via-white to-orange-100';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${bgClass}`}>
      <div className="absolute top-0 left-0 w-72 h-72 bg-interactive/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-cta/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <img src="/LOGO_LxJ2.png" alt="LogiXjunction Logo" className="h-20 w-auto mx-auto" />
          <h1 className="text-3xl font-bold text-headings mt-4">Welcome Back</h1>
          <p className="text-text/70 mt-1">Login to continue your journey in smart logistics.</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-lg p-8 border border-black/5 shadow-sm">
          {/* User Type Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-black/5 p-1 rounded-lg">
            {['Transporter', 'Shipper'].map(type => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-interactive 
                  ${userType === type ? 'bg-white text-headings shadow-sm' : 'bg-transparent text-text/60 hover:text-headings'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="contact" className="block mb-1.5 text-sm font-medium text-text">Email</label>
              <Input
                id="contact"
                type="text"
                placeholder="you@example.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-text">Password</label>
                <a href="/forgot-password" className="text-sm font-semibold text-interactive hover:underline">Forgot?</a>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

                                    <div className="space-y-4 pt-2">
                            <Button type="submit" variant="cta" className="w-full font-semibold bg-accent-cta cursor-pointer" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <LoaderOne />
                                        <span className="ml-2">Signing In...</span>
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </div>

            <p className="text-center text-sm text-text/80 pt-4">
              Don't have an account?{' '}
              <button type="button" className="font-semibold text-interactive hover:underline" onClick={() => navigate('/sign-up')}>
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
