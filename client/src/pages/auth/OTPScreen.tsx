import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw, Smartphone } from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = [useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null), useRef<any>(null)];
  
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const phone = location.state?.phone || '98765 43210';
  const role = location.state?.role || 'farmer'; // Default to farmer for demo login

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) return;

    setLoading(true);
    // Simulated verification
    setTimeout(() => {
      setLoading(false);
      if (otpValue === '123456') {
        // Set mock auth state
        setAuth({
          id: '123',
          name: 'Demo User',
          phone: phone,
          role: role as any,
          location: 'Pune, Maharashtra'
        }, 'mock-jwt-token');

        // Redirect based on role
        if (role === 'farmer') navigate('/farmer/dashboard');
        else if (role === 'buyer') navigate('/buyer/dashboard');
        else if (role === 'transport') navigate('/transport/dashboard');
        else navigate('/');
      } else {
        alert('Invalid OTP. Hint: Use 123456');
        setOtp(['', '', '', '', '', '']);
        inputRefs[0].current.focus();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
          <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-100">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Verify OTP</h1>
            <p className="text-gray-500 mt-2">Sent to +91 {phone}</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength="1"
                  className="w-12 h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-600 focus:outline-none transition-all shadow-sm"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length < 6}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Verify & Continue <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <button
              disabled={timer > 0}
              onClick={() => setTimer(30)}
              className="flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-600 hover:text-blue-600 disabled:text-gray-300 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${timer > 0 ? '' : 'animate-spin'}`} />
              {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP Now'}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
              <ShieldCheck className="w-4 h-4" /> 256-bit Encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPScreen;

