import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Smartphone, Shield, Truck, TrendingUp, Scale } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Login successful!');
      
      // Redirect based on role
      const role = user?.role;
      if (role === 'farmer') navigate('/farmer');
      else if (role === 'buyer') navigate('/buyer');
      else if (role === 'transport') navigate('/transporter');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-dark-200 dark:via-dark-100 dark:to-dark-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Smartphone className="w-12 h-12 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enter your credentials to access your account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 relative"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                Register
              </Link>
            </p>
          </div>
        </form>
        
        <div className="grid grid-cols-4 gap-3 text-center text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-col items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-4 h-4" />
            <span>Live Tracking</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>AI Price</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Scale className="w-4 h-4" />
            <span>Fair & Transparent</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
