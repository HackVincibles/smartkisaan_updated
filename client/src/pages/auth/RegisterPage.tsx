import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Smartphone, Check, Zap, Shield, Globe, Activity, ArrowRight, CheckCircle2, ChevronRight, Scale, TrendingUp } from 'lucide-react';
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
    { id: 'farmer', label: 'Farmer', icon: '🌾', desc: 'Manage harvests & bids' },
    { id: 'buyer', label: 'Buyer', icon: '🛒', desc: 'Procure bulk inventory' },
    { id: 'transporter', label: 'Transporter', icon: '🚛', desc: 'Secure logistic rails' }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setFormData({
      ...formData,
      role: role
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Cryptographic keys do not match.');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Key must be at least 6 characters.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      toast.error('Invalid mobile identifier.');
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
      toast.success('Protocol Node Initialized. Redirecting...');
      
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
    <div className="min-h-screen flex bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Left Column: Premium Visual (Consistent with Login) */}
      <div className="hidden lg:flex lg:w-2/5 bg-gray-900 relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b981_0%,transparent_50%)] blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
              <Zap size={20} fill="white" />
            </div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter">Smart<span className="text-emerald-500 not-italic">Kissan</span></h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-5xl font-black text-white leading-tight tracking-tighter italic">
              The New <span className="not-italic text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Standard</span> for Agri-Trade.
            </h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm">
              Unified digital infrastructure for the next generation of Indian agriculture.
            </p>
          </div>
        </motion.div>

        <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Instant Escrow Settlement</p>
            </div>
            <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <CheckCircle2 size={20} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">KYC Verified Nodes Only</p>
            </div>
        </div>

        <div className="absolute -bottom-20 -left-20 opacity-5">
            <Globe size={500} strokeWidth={0.5} className="text-white animate-[spin_60s_linear_infinite]" />
        </div>
      </div>

      {/* Right Column: Registration Interface */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 md:p-16 bg-gray-50/50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl space-y-10"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1">
              <Shield size={14} />
              Protocol Enrollment
            </div>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none">Initialize <span className="not-italic">Account</span></h3>
            <p className="text-gray-400 font-medium text-base">Select your operational role to begin the onboarding sequence.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Role Chips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleSelect(role.id)}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all relative group overflow-hidden ${
                    selectedRole === role.id
                      ? 'border-emerald-500 bg-white shadow-xl shadow-emerald-900/5'
                      : 'border-white bg-white/50 hover:border-emerald-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110 ${
                    selectedRole === role.id ? 'bg-emerald-50' : 'bg-gray-50'
                  }`}>
                    {role.icon}
                  </div>
                  <div className={`text-xs font-black uppercase tracking-widest mb-1 ${
                    selectedRole === role.id ? 'text-emerald-600' : 'text-gray-900'
                  }`}>
                    {role.label}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">{role.desc}</p>
                  
                  {selectedRole === role.id && (
                    <motion.div 
                      layoutId="role-check"
                      className="absolute top-4 right-4 text-emerald-500"
                    >
                      <CheckCircle2 size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Legal Identity (Full Name)</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Mobile Identifier</label>
                <div className="relative">
                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    name="mobileNumber"
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Terminal Email</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="operator@smartkissan.in"
                    className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-6 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white border border-gray-100 rounded-[1.5rem] py-5 pl-14 pr-12 text-gray-900 font-bold placeholder:text-gray-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Confirm Key</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
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
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-relaxed">
                I accept the <Link to="/terms" className="text-emerald-600 underline">Protocol Terms</Link> and <Link to="/privacy" className="text-emerald-600 underline">Privacy Mandate</Link>.
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
                    Initializing Node...
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                    Establish Identity <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          <div className="text-center pt-8 border-t border-gray-100">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Already Certified? <Link to="/login" className="text-emerald-600 hover:text-emerald-700 transition-colors ml-2">Authenticate Node</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
