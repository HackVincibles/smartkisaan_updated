import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Smartphone, Shield, Truck, TrendingUp, Scale, Zap, Globe, ArrowRight, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
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
      toast.success('Access Granted. Synchronizing Workspace...');
      
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
  
  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Left Column: Premium Visual & Trust Signal */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between p-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)] blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#3b82f6_0%,transparent_40%)] blur-[100px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
              <Zap size={24} fill="white" />
            </div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter">Smart<span className="text-emerald-500 not-italic">Kissan</span></h1>
          </div>

          <div className="space-y-6 max-w-lg">
            <h2 className="text-6xl font-black text-white leading-tight tracking-tighter italic">
              Digital <span className="not-italic text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Sovereignty</span> for Agriculture.
            </h2>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              Access the Pan-India agricultural blockchain grid. Secured by cryptographic custody and real-time IoT intelligence.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 grid grid-cols-2 gap-10"
        >
          <div className="space-y-4 p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Shield size={24} />
            </div>
            <h4 className="text-white font-black text-lg italic">Proof of Custody</h4>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest leading-loose">Automated escrow and dispute resolution via smart contracts.</p>
          </div>
          <div className="space-y-4 p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <TrendingUp size={24} />
            </div>
            <h4 className="text-white font-black text-lg italic">Market Pulse</h4>
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest leading-loose">Live mandi analytics and AI-driven yield prediction models.</p>
          </div>
        </motion.div>

        <div className="absolute -bottom-20 -left-20 opacity-5">
            <Globe size={600} strokeWidth={0.5} className="text-white animate-[spin_60s_linear_infinite]" />
        </div>
      </div>

      {/* Right Column: Auth Interface */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 bg-gray-50/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg space-y-12"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">
              <Activity size={14} />
              Protocol Node Access
            </div>
            <h3 className="text-5xl font-black text-gray-900 tracking-tighter italic leading-none">Authentication <span className="not-italic">Vault</span></h3>
            <p className="text-gray-400 font-medium text-lg">Secure entry to your professional agricultural dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Terminal Identifier (Email)</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="operator@smartkissan.in"
                    className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-8 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cryptographic Key (Password)</label>
                  <Link to="/forgot-password" size={14} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">Recover Key</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-16 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-emerald-500 focus:ring-emerald-500/20 transition-all cursor-pointer" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Maintain Session on this Node</span>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-8 bg-gray-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-emerald-600 shadow-2xl shadow-gray-200 hover:shadow-emerald-900/20 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Authenticating Node...
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    Authorize Access <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          <div className="pt-12 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              New Participant? <Link to="/register" className="text-emerald-600 hover:text-emerald-700 transition-colors ml-2">Initialize Registration</Link>
            </p>
          </div>
          
          <div className="flex justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-400">
              <CheckCircle2 size={12} className="text-emerald-500" />
              SOC2 Certified
            </div>
            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-gray-400">
              <CheckCircle2 size={12} className="text-emerald-500" />
              AES-256 Encrypted
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
