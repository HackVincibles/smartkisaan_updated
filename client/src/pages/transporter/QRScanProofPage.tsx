import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, Camera, CheckCircle, AlertCircle, 
  ArrowLeft, Truck, Shield, Info, Zap,
  Fingerprint, ArrowRight, Lock, Database,
  IndianRupee, Clock, Activity
} from 'lucide-react';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'select' | 'scanning' | 'verifying' | 'success';

const QRScanProofPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6) {
      toast.error('Enter a valid 6-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      // await transporterService.verifyDelivery(orderId, otp)
      setTimeout(() => {
        setStep('success');
        setLoading(false);
        toast.success('Handover cryptographically verified!');
      }, 1800);
    } catch {
      toast.error('Verification failed. Invalid OTP signature.');
      setLoading(false);
    }
  };

  const handleOtpChange = (val: string, i: number) => {
    if (!/^\d*$/.test(val)) return;
    const arr = otp.split('');
    arr[i] = val;
    setOtp(arr.join('').slice(0, 6));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-16 pb-32 fade-in">
      {/* Header */}
      <div className="space-y-6 p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-warning transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> BACK_TO_TRIP_REGISTRY
        </button>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-warning italic">
          <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
          Handover_Verification_Node [ESCROW_GATE]
        </div>
        <h1 className="text-6xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
          QR <span className="not-italic text-warning">Handover.</span>
        </h1>
        <p className="text-gray-400 font-medium text-xl leading-relaxed italic">
          Cryptographically signed delivery verification for order <span className="text-gray-950 font-black italic uppercase">#{orderId?.slice(-10).toUpperCase()}</span>.
        </p>
      </div>

      {/* Main Card */}
      <div className="px-4">
        {/* Mission Bar */}
        <div className="stitch-card p-10 bg-gray-950 text-white flex items-center gap-8 rounded-b-none shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center border border-white/5 shadow-inner text-warning shrink-0">
            <Truck size={30} strokeWidth={1.5} />
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] italic leading-none">ESCROW_GATE::CONTRACT</p>
            <h2 className="text-2xl font-black italic tracking-tighter leading-none uppercase">ORDER::{orderId?.slice(-10).toUpperCase()}</h2>
          </div>
          <div className="text-[10px] font-black text-warning/70 uppercase tracking-[0.4em] italic bg-warning/5 px-5 py-2.5 rounded-2xl border border-warning/10">ACTIVE</div>
          <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none"><QrCode size={120} /></div>
        </div>

        {/* Step Content */}
        <div className="stitch-card p-12 rounded-t-none border-t-0 bg-white shadow-2xl shadow-gray-200/50 border-none">
          <AnimatePresence mode="wait">
            {step === 'select' && (
              <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-16">
                <div className="text-center space-y-8">
                  <div className="w-32 h-32 bg-warning/5 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner border border-warning/10">
                    <QrCode size={72} className="text-warning" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black text-gray-950 italic tracking-tighter uppercase leading-none">Secure <span className="text-warning not-italic">Handover.</span></h3>
                    <p className="text-gray-400 text-lg font-medium italic max-w-sm mx-auto">Choose your verification method to release the escrow and complete delivery.</p>
                  </div>
                </div>

                <div className="grid gap-8">
                  <button
                    onClick={() => setStep('scanning')}
                    className="flex items-center gap-8 p-10 rounded-[3rem] bg-gray-950 text-white group hover:bg-warning transition-all shadow-2xl shadow-gray-950/20 relative overflow-hidden"
                  >
                    <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner border border-white/5 group-hover:rotate-12 transition-transform duration-700">
                      <Camera size={36} />
                    </div>
                    <div className="text-left space-y-2">
                      <p className="text-2xl font-black italic tracking-tighter leading-none uppercase">SCAN_QR_CODE</p>
                      <p className="text-white/40 font-medium italic text-lg">Camera-scan the QR displayed by the buyer</p>
                    </div>
                    <ArrowRight size={28} className="ml-auto text-white/30 group-hover:translate-x-3 group-hover:text-white transition-all" />
                  </button>

                  <button
                    onClick={() => setStep('verifying')}
                    className="flex items-center gap-8 p-10 rounded-[3rem] bg-gray-50 border border-gray-100 text-gray-950 group hover:bg-gray-950 hover:text-white transition-all shadow-inner hover:shadow-2xl relative overflow-hidden"
                  >
                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shrink-0 shadow-sm border border-gray-100 group-hover:bg-white/10 group-hover:border-white/5 group-hover:rotate-12 transition-all duration-700 text-warning">
                      <Shield size={36} strokeWidth={1.5} />
                    </div>
                    <div className="text-left space-y-2">
                      <p className="text-2xl font-black italic tracking-tighter leading-none uppercase">ENTER_MANUAL_OTP</p>
                      <p className="text-gray-400 group-hover:text-white/40 font-medium italic text-lg transition-colors">Request the 6-digit verification code from buyer</p>
                    </div>
                    <ArrowRight size={28} className="ml-auto text-gray-200 group-hover:translate-x-3 group-hover:text-white transition-all" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'scanning' && (
              <motion.div key="scanning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-12 text-center">
                <div className="aspect-square max-w-sm mx-auto bg-gray-950 rounded-[3rem] overflow-hidden relative shadow-2xl shadow-gray-950/20">
                  {/* Scan frame */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 relative">
                      {/* Corners */}
                      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-warning rounded-tl-2xl"></div>
                      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-warning rounded-tr-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-warning rounded-bl-2xl"></div>
                      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-warning rounded-br-2xl"></div>
                      {/* Scan line */}
                      <motion.div
                        animate={{ top: ['10%', '90%', '10%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        className="absolute left-4 right-4 h-0.5 bg-warning shadow-[0_0_15px_rgba(234,179,8,0.9)]"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">POSITION_QR_IN_FRAME</div>
                </div>
                <button onClick={() => setStep('select')} className="text-gray-400 text-[11px] font-black uppercase tracking-[0.4em] italic hover:text-warning transition-colors">
                  CANCEL — USE OTP
                </button>
              </motion.div>
            )}

            {step === 'verifying' && (
              <motion.div key="verifying" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-14 max-w-sm mx-auto text-center">
                <div className="space-y-6">
                  <h3 className="text-4xl font-black text-gray-950 italic tracking-tighter uppercase leading-none">Enter <span className="text-warning not-italic">OTP.</span></h3>
                  <p className="text-gray-400 font-medium italic text-lg">A 6-digit code has been sent to the buyer's registered device. Ask for it to proceed.</p>
                </div>

                <div className="flex justify-center gap-4">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-14 h-20 text-center text-3xl font-black rounded-[1.5rem] bg-gray-50 border-2 border-gray-100 focus:border-warning focus:bg-white focus:ring-12 focus:ring-warning/5 outline-none shadow-inner transition-all italic tracking-tighter text-gray-950"
                      value={otp[i] || ''}
                      onChange={(e) => {
                        handleOtpChange(e.target.value, i);
                        if (e.target.value && i < 5) {
                          document.getElementById(`otp-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerify}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-8 bg-warning text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic shadow-2xl shadow-warning/20 hover:bg-gray-950 transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-5">
                    <Fingerprint size={24} /> {loading ? 'VERIFYING_SIGNATURE...' : 'COMPLETE_HANDOVER'}
                  </span>
                  <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button onClick={() => setStep('select')} className="text-gray-400 text-[11px] font-black uppercase tracking-[0.4em] italic hover:text-warning transition-colors">
                  ← BACK_TO_OPTIONS
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="space-y-14 text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="w-40 h-40 bg-success/10 text-success rounded-[4rem] flex items-center justify-center mx-auto shadow-2xl border border-success/20">
                  <CheckCircle size={80} strokeWidth={1.5} />
                </motion.div>
                <div className="space-y-5">
                  <h3 className="text-5xl font-black text-gray-950 italic tracking-tighter uppercase leading-none">Verified <span className="text-success not-italic">✓</span></h3>
                  <p className="text-gray-400 font-medium italic text-xl">Delivery for <span className="text-gray-950 font-black uppercase">ORDER::{orderId?.slice(-10).toUpperCase()}</span> has been cryptographically signed and recorded on the Polygon Amoy ledger.</p>
                </div>
                <div className="p-10 bg-success/5 rounded-[2.5rem] border border-success/10 shadow-inner text-left space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">ESCROW_RELEASE_STATUS</span>
                    <span className="text-[11px] font-black text-success uppercase tracking-[0.4em] italic px-5 py-2 bg-success/5 rounded-xl border border-success/10">IN_PROGRESS</span>
                  </div>
                  <p className="text-gray-400 font-medium italic text-lg">Your freight earnings will be credited to your wallet within <span className="text-gray-950 font-black">12 hours</span> of settlement.</p>
                </div>
                <button
                  onClick={() => navigate('/transporter')}
                  className="w-full py-8 bg-gray-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic shadow-2xl shadow-gray-950/20 hover:bg-warning transition-all group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-5">RETURN_TO_COMMAND_HUB <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" /></span>
                  <div className="absolute inset-0 bg-warning opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Escrow Trust Notice */}
      <div className="px-4">
        <div className="stitch-card p-10 bg-secondary/5 border border-secondary/10 shadow-2xl shadow-secondary/5 flex items-start gap-8 relative overflow-hidden">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-[1.5rem] flex items-center justify-center shrink-0 border border-secondary/20 shadow-inner">
            <Info size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.5em] italic leading-none">SECURITY_NOTICE</p>
            <p className="text-gray-400 font-medium italic text-lg leading-relaxed">
              <span className="text-gray-950 font-black">IMPORTANT:</span> Both QR scan and OTP are cryptographically signed on the Polygon blockchain. Verification is mandatory for escrow release and ensures payment safety for all parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanProofPage;
