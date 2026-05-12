import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, MapPin, BarChart3, CheckCircle, ArrowRight, Users, Truck, Leaf } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('farmer');
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
  
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Access Granted. Redirecting to dashboard...');
      
      const role = user?.role?.toLowerCase();
      setTimeout(() => {
        if (role === 'farmer') navigate('/farmer');
        else if (role === 'buyer') navigate('/buyer');
        else if (role === 'transport' || role === 'transporter') navigate('/transporter');
        else if (role === 'admin') navigate('/admin');
        else navigate('/');
      }, 800);
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Authentication failed. Verify credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  
  const roles = [
    { 
      id: 'farmer', 
      label: 'Farmer', 
      icon: Leaf, 
      description: 'List your products and connect with buyers directly'
    },
    { 
      id: 'buyer', 
      label: 'Buyer', 
      icon: Users, 
      description: 'Source quality products from verified farmers'
    },
    { 
      id: 'transporter', 
      label: 'Transporter', 
      icon: Truck, 
      description: 'Join logistics network and earn'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="text-center space-y-8">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-8">
              <Leaf className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg mb-8">Login to your Smart-Kissan account and continue your journey.</p>
          </div>
          
          {/* Feature Icons */}
          <div className="grid grid-cols-2 gap-8 max-w-sm mx-auto">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium">Secure Payments</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium">Live Tracking</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium">AI Price Insights</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm font-medium">Fair & Transparent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Login to Smart-Kissan</h2>
              <p className="text-gray-600">Enter your credentials to access your account.</p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === role.id
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    <role.icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-green-600 focus:ring-green-500 rounded"
                />
                <label className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Login
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Google Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gray-300"></div>
                  <p className="bg-white px-4 py-1 text-sm text-gray-600 relative">or continue with</p>
                </div>
              </div>
              <button className="w-full py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                Continue with Google
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account? <Link to="/register" className="text-green-600 hover:text-green-700 font-medium">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default LoginPage;
