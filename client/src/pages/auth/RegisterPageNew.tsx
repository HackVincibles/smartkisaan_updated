import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Leaf, Lock, Mail, Phone, User, ShieldCheck, ShoppingCart, Tractor, Truck, Users } from 'lucide-react';
import toast from 'react-hot-toast';

type Role = "Farmer" | "Buyer" | "Transporter" | "Admin";

interface RoleOption {
  name: Role;
  icon: React.ReactNode;
  accent: string;
}

const roles: RoleOption[] = [
  { name: "Farmer", icon: <User size={40} strokeWidth={1.8} />, accent: "#1f9d3a" },
  { name: "Buyer", icon: <ShoppingCart size={40} strokeWidth={1.8} />, accent: "#2f80ed" },
  { name: "Transporter", icon: <Truck size={40} strokeWidth={1.8} />, accent: "#a24cf0" },
  { name: "Admin", icon: <ShieldCheck size={40} strokeWidth={1.8} />, accent: "#f59e0b" },
];

const features = [
  { label: "Secure\nPayments", icon: <ShieldCheck size={18} strokeWidth={2} /> },
  { label: "Live\nTracking", icon: <Leaf size={18} strokeWidth={2} /> },
  { label: "AI Price\nSuggestions", icon: <Tractor size={18} strokeWidth={2} /> },
  { label: "Fair &\nTransparent", icon: <Users size={18} strokeWidth={2} /> },
];

interface FormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

const SmartKissanRegisterPage: React.FC = () => {
  const [role, setRole] = useState<Role>("Farmer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Farmer'
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    if (!formData.mobileNumber.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }
    
    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      toast.error('Please enter a valid Indian mobile number');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!formData.password) {
      toast.error('Please enter a password');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const payload = {
        name: formData.fullName,
        phone: formData.mobileNumber,
        email: formData.email,
        role: role === 'Transporter' ? 'transport' : role.toLowerCase()
      };

      console.log('Registration payload:', payload);
      
      toast.success('Account created successfully!');
      
      // Navigate based on role
      setTimeout(() => {
        switch (role) {
          case 'farmer':
            navigate('/farmer');
            break;
          case 'buyer':
            navigate('/buyer');
            break;
          case 'transporter':
            navigate('/transporter');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            navigate('/');
        }
      }, 1000);
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4ef] px-6 py-5">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-[1500px] grid-cols-1 gap-6 xl:grid-cols-[1.02fr_1.08fr]">
        {/* Left Side - Illustration */}
        <div className="relative overflow-hidden rounded-[36px] bg-transparent">
          <svg
            viewBox="0 0 760 630"
            className="absolute inset-0 h-full w-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f7fbf4" />
                <stop offset="55%" stopColor="#eef8ea" />
                <stop offset="100%" stopColor="#f4f0df" />
              </linearGradient>
              <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8fce5f" />
                <stop offset="100%" stopColor="#5cab31" />
              </linearGradient>
              <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dff0cc" />
                <stop offset="100%" stopColor="#afce8f" />
              </linearGradient>
              <linearGradient id="path" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9cd06c" />
                <stop offset="100%" stopColor="#5d9f35" />
              </linearGradient>
              <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f5efe6" />
              </linearGradient>
              <linearGradient id="turban" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94c93d" />
                <stop offset="100%" stopColor="#4c7d14" />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#9db488" floodOpacity="0.25" />
              </filter>
            </defs>

            <rect width="760" height="630" rx="34" fill="url(#sky)" />

            <g opacity="0.6">
              <circle cx="70" cy="210" r="10" fill="#ffffff" />
              <circle cx="105" cy="178" r="6" fill="#ffffff" />
              <circle cx="620" cy="120" r="9" fill="#ffffff" />
              <circle cx="650" cy="160" r="6" fill="#ffffff" />
              <path d="M590 130c12-16 21-17 33-2" stroke="#c6bca5" strokeWidth="2" strokeLinecap="round" />
              <path d="M613 138c10-10 16-11 24-1" stroke="#c6bca5" strokeWidth="2" strokeLinecap="round" />
            </g>

            <path
              d="M0 390C90 340 165 354 235 332C312 307 367 251 455 253C555 255 603 315 760 273V630H0V390Z"
              fill="url(#hill)"
              opacity="0.95"
            />
            <path
              d="M0 420C78 375 160 392 238 374C321 355 363 307 452 305C552 303 605 364 760 324V630H0V420Z"
              fill="#c7e2ab"
              opacity="0.9"
            />
            <path
              d="M0 480C94 442 162 455 243 438C323 421 371 385 453 381C555 376 628 432 760 402V630H0V480Z"
              fill="#a6d47e"
              />

            <g opacity="0.9">
              <path d="M85 508C116 498 146 498 176 508V630H85V508Z" fill="url(#field)" />
              <path d="M176 503C209 491 246 491 279 503V630H176V503Z" fill="#72b841" />
              <path d="M279 495C315 485 351 486 388 495V630H279V495Z" fill="#88c34f" />
              <path d="M388 500C422 490 459 490 492 500V630H388V500Z" fill="#64a93b" />
              <path d="M492 493C528 483 566 484 604 493V630H492V493Z" fill="#7fbe49" />
              <path d="M604 500C642 490 700 490 760 502V630H604V500Z" fill="#5e9e36" />
            </g>

            <g opacity="0.45" stroke="#6ea74a" strokeWidth="2">
              <path d="M0 535H760" />
              <path d="M0 560H760" />
              <path d="M0 588H760" />
            </g>

            <g filter="url(#softShadow)">
              <path d="M548 430h92l18 9v38H531v-29l17-18Z" fill="#8a6b45" />
              <path d="M535 405h84l20 25h-124l20-25Z" fill="#d9bf92" />
              <path d="M555 435h55v28h-55z" fill="#d8c39e" />
              <path d="M610 435h30v28h-30z" fill="#af8f62" />
              <path d="M592 444h10v54h-10z" fill="#7e6240" />
              <path d="M540 430l-6 35" stroke="#5f4427" strokeWidth="3" strokeLinecap="round" />
            </g>

            <g transform="translate(115 378)" opacity="0.9">
              <rect x="0" y="0" width="28" height="120" rx="10" fill="#527a35" />
              <circle cx="15" cy="125" r="46" fill="#415f26" />
              <circle cx="15" cy="125" r="31" fill="#8cb85d" />
              <path d="M-28 146h84" stroke="#2f4f1c" strokeWidth="8" strokeLinecap="round" />
              <path d="M15 45v-52" stroke="#4b6d2f" strokeWidth="8" strokeLinecap="round" />
              <path d="M15 8c-18 0-32 12-40 30 20-4 33-14 40-30Z" fill="#9ccd66" />
              <path d="M15 8c18 0 32 12 40 30-20-4-33-14-40-30Z" fill="#7fb44c" />
            </g>

            <g transform="translate(382 390)" filter="url(#softShadow)">
              <rect x="0" y="0" width="72" height="44" rx="8" fill="#3a7926" />
              <rect x="14" y="-22" width="42" height="30" rx="6" fill="#cfe59f" />
              <rect x="18" y="-18" width="34" height="22" rx="4" fill="#f3fbec" />
              <rect x="62" y="6" width="34" height="18" rx="5" fill="#4a8d2a" />
              <circle cx="16" cy="52" r="18" fill="#25351b" />
              <circle cx="78" cy="52" r="18" fill="#25351b" />
              <circle cx="16" cy="52" r="9" fill="#7ca454" />
              <circle cx="78" cy="52" r="9" fill="#7ca454" />
            </g>

            <g transform="translate(82 392)" opacity="0.9">
              <rect x="0" y="0" width="6" height="92" rx="3" fill="#afafaf" />
              <path d="M3 0L27 18" stroke="#afafaf" strokeWidth="3" />
              <path d="M3 0L-20 18" stroke="#afafaf" strokeWidth="3" />
              <path d="M3 20L30 28" stroke="#afafaf" strokeWidth="3" />
              <path d="M3 20L-26 28" stroke="#afafaf" strokeWidth="3" />
            </g>

            <g transform="translate(165 410)" opacity="0.4">
              <circle cx="0" cy="0" r="15" fill="#ffffff" />
              <path d="M0 -15V15M-15 0H15" stroke="#89b26c" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            <g transform="translate(240 406)" opacity="0.6">
              <circle cx="0" cy="0" r="18" fill="#ffffff" />
              <path d="M-8 2l6 6 12-14" stroke="#a06ae0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            <g transform="translate(138 170)" filter="url(#softShadow)">
              <circle cx="0" cy="0" r="30" fill="#ffffff" opacity="0.9" />
              <ShieldCheck x="-12" y="-12" size={24} strokeWidth={2} color="#1f9d3a" />
            </g>
            <g transform="translate(560 180)" filter="url(#softShadow)">
              <circle cx="0" cy="0" r="30" fill="#ffffff" opacity="0.9" />
              <Truck x="-14" y="-12" size={28} strokeWidth={2} color="#a24cf0" />
            </g>
            <g transform="translate(170 305)" filter="url(#softShadow)">
              <circle cx="0" cy="0" r="28" fill="#ffffff" opacity="0.95" />
              <ShoppingCart x="-12" y="-11" size={24} strokeWidth={2} color="#2f80ed" />
            </g>
            <g transform="translate(338 318)" filter="url(#softShadow)">
              <circle cx="0" cy="0" r="28" fill="#ffffff" opacity="0.95" />
              <Users x="-12" y="-11" size={24} strokeWidth={2} color="#f59e0b" />
            </g>

            <g transform="translate(334 286)">
              <circle cx="74" cy="158" r="66" fill="#d8a36f" opacity="0.22" />
              <ellipse cx="74" cy="162" rx="49" ry="54" fill="#c58a58" />
              <path d="M45 170c5-34 26-53 29-55 6-5 20-5 28 0 5 4 22 21 27 55-4 14-16 25-40 25-24 0-39-11-44-25Z" fill="#8cc33f" />
              <path d="M32 169c11-36 26-61 39-73 0 0 5-11 26-11s29 13 29 13c12 11 25 34 37 71-20-11-36-14-55-14-20 0-36 4-56 14Z" fill="url(#turban)" />
              <path d="M65 132c8-8 20-11 31-10 12 1 22 5 28 11" stroke="#6a8f2d" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="57" cy="161" rx="6" ry="8" fill="#3d2316" />
              <ellipse cx="89" cy="161" rx="6" ry="8" fill="#3d2316" />
              <path d="M59 182c6 7 23 9 31 0" stroke="#5a2f1f" strokeWidth="4" strokeLinecap="round" />
              <path d="M53 166c10 7 12 10 21 10s15-3 24-10" stroke="#2f1a12" strokeWidth="4" strokeLinecap="round" />
              <path d="M54 140c10-10 18-13 24-13 10 0 18 4 23 13" stroke="#6f8f2c" strokeWidth="10" strokeLinecap="round" />
              <path d="M63 195c-12 21-19 47-20 74h62c-2-29-10-54-24-74" fill="url(#shirt)" />
              <path d="M60 201c8 0 14 0 18 8-2 10-2 19-2 31H45c1-14 5-25 15-39Z" fill="#d9ece0" opacity="0.85" />
              <path d="M39 267c3-17 10-24 20-29 5-2 13-3 20-3 7 0 15 1 21 3 11 4 18 13 21 29v21H39v-21Z" fill="url(#shirt)" />
              <path d="M37 248c4-10 9-18 18-22l12 22-11 49H38l-1-49Z" fill="url(#shirt)" />
              <path d="M111 248c-4-10-9-18-18-22L-12 22 11 49h18l1-49Z" fill="url(#shirt)" />
              <path d="M52 244l22 16 22-16" stroke="#cbbd9f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M59 214l15 20 14-20" stroke="#c7b27f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M44 205c-18 4-27 12-35 28" stroke="#2d6030" strokeWidth="6" strokeLinecap="round" />
              <path d="M104 205c18 4 27 12 35 28" stroke="#2d6030" strokeWidth="6" strokeLinecap="round" />
              <path d="M25 233c13 0 20 8 24 18" stroke="#2d6030" strokeWidth="6" strokeLinecap="round" />
              <path d="M125 233c-13 0-20 8-24 18" stroke="#2d6030" strokeWidth="6" strokeLinecap="round" />
              <path d="M66 281c4 2 8 3 8 3s4-1 8-3" stroke="#6f8f2c" strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>

          <div className="absolute left-8 top-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm">
                <Leaf className="text-white" size={24} strokeWidth={2.2} />
              </div>
              <div className="leading-tight">
                <div className="text-[22px] font-semibold tracking-[-0.03em] text-slate-800">
                  Smart-Kissan
                </div>
                <div className="text-[13px] text-slate-500">Smart Farming. Better Future.</div>
              </div>
            </div>
          </div>

          <div className="absolute left-8 top-[142px] max-w-[540px]">
            <h1 className="max-w-[520px] text-[44px] font-semibold leading-[1.1] tracking-[-0.05em] text-slate-800">
              Join <span className="text-green-600">Smart-Kissan</span>
              <br />
              and Grow Together
            </h1>

            <div className="mt-8 h-[3px] w-36 overflow-hidden rounded-full bg-green-100">
              <div className="h-full w-10 rounded-full bg-green-600" />
            </div>

            <p className="mt-7 max-w-[360px] text-[18px] leading-8 text-slate-600">
              A trusted digital platform connecting
              <br />
              Farmers, Buyers & Transporters.
            </p>
          </div>

          <div className="absolute bottom-6 left-8 right-8 rounded-[22px] bg-white/75 px-5 py-4 shadow-[0_12px_45px_rgba(80,120,60,0.12)] backdrop-blur-[4px]">
            <div className="grid grid-cols-4 gap-2">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 rounded-2xl px-3 py-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700 shadow-sm">
                    {item.icon}
                  </div>
                  <div className="whitespace-pre-line text-[14px] font-medium leading-5 text-slate-700">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center">
          <div className="w-full rounded-[34px] bg-white px-10 py-8 shadow-[0_10px_40px_rgba(35,50,35,0.08)] xl:px-14 xl:py-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <Leaf className="text-green-600" size={34} strokeWidth={2.2} />
              </div>

              <h2 className="mt-6 text-[36px] font-semibold tracking-[-0.05em] text-slate-800">
                Create Your <span className="text-green-600">Account</span>
              </h2>
              <p className="mt-2 text-[18px] text-slate-500">Get started with Smart-Kissan</p>
            </div>

            <div className="mt-7 flex items-center justify-center gap-5 text-slate-500">
              <div className="h-px w-12 bg-slate-200" />
              <span className="text-[18px]">Register As</span>
              <div className="h-px w-12 bg-slate-200" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
              {roles.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setRole(r.name)}
                  className={[
                    "relative flex h-[175px] w-full flex-col items-center justify-center rounded-[14px] border bg-white px-4 shadow-[0_0_0_1px_rgba(15,23,42,0.03)] transition-all",
                    role === r.name ? "border-green-600 ring-1 ring-green-600" : "border-slate-200 hover:border-slate-300",
                  ].join(" ")}
                  style={role === r.name ? { boxShadow: "0 0 0 1px rgba(34,197,94,0.15)" } : undefined}
                >
                  <div className="absolute top-5 text-[40px]" style={{ color: r.accent }}>
                    {r.icon}
                  </div>
                  <div className="mt-24 text-[16px] font-semibold text-slate-800">{r.name}</div>

                  <div className="mt-4">
                    <div
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full border-2",
                        role === r.name ? "border-green-600" : "border-slate-400",
                      ].join(" ")}
                    >
                      {role === r.name && <div className="h-3 w-3 rounded-full bg-green-600" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="h-[56px] w-full rounded-[10px] border border-slate-200 bg-white pl-12 pr-4 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className="h-[56px] w-full rounded-[10px] border border-slate-200 bg-white pl-12 pr-4 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="h-[56px] w-full rounded-[10px] border border-slate-200 bg-white pl-12 pr-4 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="h-[56px] w-full rounded-[10px] border border-slate-200 bg-white pl-12 pr-12 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="h-[56px] w-full rounded-[10px] border border-slate-200 bg-white pl-12 pr-12 text-[15px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </form>

            <label className="mt-4 flex items-start gap-3 text-[15px] text-slate-600">
              <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-[3px] bg-green-600 text-white">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none">
                  <path d="M4 10.5l3.2 3.2L16 5.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                I agree to the <span className="text-green-600">Terms & Conditions</span> and{" "}
                <span className="text-green-600">Privacy Policy</span>.
              </span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-5 flex h-[54px] w-full items-center justify-center gap-3 rounded-[10px] bg-gradient-to-r from-[#2f8f38] to-[#66bf57] text-[18px] font-medium text-white shadow-[0_10px_25px_rgba(57,143,59,0.28)]"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span>Register</span>
                  <ArrowRight size={22} strokeWidth={2} />
                </div>
              )}
            </button>

            <div className="mt-5 text-center text-[15px] text-slate-500">
              Already have an account?{" "}
              <button type="button" className="font-semibold text-green-600">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartKissanRegisterPage;
