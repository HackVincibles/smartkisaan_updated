import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Smartphone, CheckCircle, Shield, Globe, ArrowRight, TrendingUp, Leaf } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('farmer');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer'
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'farmer', label: 'Farmer', icon: '🌾' },
    { id: 'buyer', label: 'Buyer', icon: '🛒' },
    { id: 'transporter', label: 'Transporter', icon: '🚚' },
    { id: 'admin', label: 'Admin', icon: '👤' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setFormData({
      ...formData,
      role
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      toast.error('Invalid mobile number.');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        name: formData.fullName,
        phone: formData.mobileNumber,
        email: formData.email,
        role: formData.role === 'transporter' ? 'transport' : formData.role,
      };

      const user = await register(payload);
      toast.success('Account created successfully!');
      
      const role = user?.role?.toLowerCase();
      setTimeout(() => {
        if (role === 'farmer') navigate('/farmer');
        else if (role === 'buyer') navigate('/buyer');
        else if (role === 'transport' || role === 'transporter') navigate('/transporter');
        else navigate('/');
      }, 1000);
    } catch (error: any) {
      const msg = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-700 via-green-600 to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-800/20 to-cyan-900/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400/30 via-orange-500/20 to-pink-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/20 via-pink-500/20 to-indigo-600/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="text-center space-y-8">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/30 rounded-full flex items-center justify-center mb-8 mx-auto shadow-2xl border-4 border-yellow-300/50">
              <Leaf className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">Join Smart-Kissan</h1>
            <p className="text-xl mb-8 text-yellow-100 drop-shadow-md">and Grow Together</p>
          </div>
          
          {/* Benefits List */}
          <div className="space-y-8 max-w-sm mx-auto">
            <div className="flex items-center space-x-6 bg-gradient-to-r from-emerald-500/20 to-green-600/30 p-6 rounded-2xl shadow-xl border border-emerald-400/30 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-emerald-200" />
              </div>
              <p className="text-base font-semibold text-emerald-100">Secure Payments</p>
            </div>
            <div className="flex items-center space-x-6 bg-gradient-to-r from-blue-500/20 to-cyan-600/30 p-6 rounded-2xl shadow-xl border border-cyan-400/30 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-cyan-200" />
              </div>
              <p className="text-base font-semibold text-cyan-100">Live Tracking</p>
            </div>
            <div className="flex items-center space-x-6 bg-gradient-to-r from-purple-500/20 to-violet-600/30 p-6 rounded-2xl shadow-xl border border-violet-400/30 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-violet-200" />
              </div>
              <p className="text-base font-semibold text-violet-100">AI Price Suggestions</p>
            </div>
            <div className="flex items-center space-x-6 bg-gradient-to-r from-pink-500/20 to-rose-600/30 p-6 rounded-2xl shadow-xl border border-rose-400/30 backdrop-blur-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-rose-200" />
              </div>
              <p className="text-base font-semibold text-rose-100">Fair & Transparent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-600">Join our agricultural marketplace platform</p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Register As</label>
              <div className="grid grid-cols-2 gap-4">
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
                    <div className="text-2xl mb-2">{role.icon}</div>
                    <span className="text-sm font-medium">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      name="mobileNumber"
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="•••••"
                      className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-12 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="•••••"
                      className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-12 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 px-4">
                <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg border-gray-200 text-emerald-500 focus:ring-emerald-500/20 transition-all cursor-pointer" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 leading-relaxed">
                  I agree to the <Link to="/terms" className="text-emerald-600 underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-emerald-600 underline">Privacy Policy</Link>.
                </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-8 bg-gray-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 shadow-2xl shadow-gray-200 transition-all flex items-center justify-center gap-4 group"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <p>Initializing Node...</p>
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                      <span>Register</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </form>

                      </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
