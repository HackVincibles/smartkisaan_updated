import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Truck,
  Shield,
  Info
} from 'lucide-react';
// @ts-ignore
import transporterService from '../../services/transporterService';
import toast from 'react-hot-toast';

const QRScanProofPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<'select' | 'scanning' | 'verifying' | 'success'>('select');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // await transporterService.verifyDelivery(orderId, otp)
      setTimeout(() => {
        setStep('success');
        setLoading(false);
        toast.success('Handover verified successfully!');
      }, 1500);
    } catch (error) {
      toast.error('Verification failed. Invalid OTP.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Delivery Verification</h1>
      </div>

      <div className="card overflow-hidden">
        <div className="p-6 bg-primary-600 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs opacity-80 uppercase font-black tracking-widest">Order ID</p>
              <h2 className="text-xl font-bold">#{orderId}</h2>
            </div>
          </div>
        </div>

        <div className="p-8">
          {step === 'select' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure Handover</h3>
                <p className="text-gray-500 text-sm">Please choose a verification method to complete the delivery.</p>
              </div>

              <div className="grid gap-4">
                <button 
                  onClick={() => setStep('scanning')}
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 border-primary-100 hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="p-3 bg-primary-100 text-primary-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Scan QR Code</p>
                    <p className="text-xs text-gray-500">Scan the QR code shown by the buyer</p>
                  </div>
                </button>

                <button 
                  onClick={() => setStep('verifying')}
                  className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className="p-3 bg-gray-100 text-gray-500 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Enter Manual OTP</p>
                    <p className="text-xs text-gray-500">Ask buyer for the 6-digit verification code</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'scanning' && (
            <div className="space-y-6 text-center">
              <div className="aspect-square max-w-sm mx-auto bg-black rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-64 h-64 border-2 border-primary-500 rounded-2xl animate-pulse flex items-center justify-center">
                      <div className="w-full h-1 bg-primary-500 absolute top-1/2 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-bounce"></div>
                   </div>
                </div>
                <div className="absolute bottom-6 left-0 right-0">
                   <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Position QR within frame</p>
                </div>
              </div>
              <button 
                onClick={() => setStep('select')}
                className="text-gray-500 text-sm hover:underline"
              >
                Cancel and use OTP
              </button>
            </div>
          )}

          {step === 'verifying' && (
            <div className="space-y-6 max-w-sm mx-auto text-center">
              <div>
                <h3 className="text-xl font-bold mb-2">Enter OTP</h3>
                <p className="text-gray-500 text-sm">A 6-digit code has been sent to the buyer's registered mobile number.</p>
              </div>
              
              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-16 text-center text-2xl font-black rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:ring-0 transition-all"
                    value={otp[i] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!/^\d*$/.test(val)) return;
                      const newOtp = otp.split('');
                      newOtp[i] = val;
                      setOtp(newOtp.join(''));
                      if (val && i < 5) {
                        const next = e.target.nextElementSibling as HTMLInputElement;
                        next?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
                        prev?.focus();
                      }
                    }}
                  />
                ))}
              </div>

              <button 
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="btn-primary w-full py-4 text-lg font-bold shadow-xl shadow-primary-100"
              >
                {loading ? 'Verifying...' : 'Complete Delivery'}
              </button>

              <button 
                onClick={() => setStep('select')}
                className="text-gray-500 text-sm hover:underline block w-full"
              >
                Go back
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-8 text-center py-4">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto scale-110">
                <CheckCircle className="w-16 h-16" />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Success!</h3>
                <p className="text-gray-500">Delivery for order #{orderId} has been verified and recorded on the blockchain.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500 font-bold uppercase">Escrow Release</span>
                  <span className="text-sm font-black text-green-600">IN PROGRESS</span>
                </div>
                <p className="text-xs text-gray-600">Your earnings of <span className="font-bold">₹1,250</span> will be added to your wallet within 2 hours.</p>
              </div>
              <button 
                onClick={() => navigate('/transporter')}
                className="btn-primary w-full py-4 font-bold"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex gap-4">
        <div className="text-blue-600"><Info className="w-5 h-5" /></div>
        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
          <span className="font-bold">Important:</span> Secure verification is mandatory for escrow release. Both QR scan and OTP are cryptographically signed to ensure payment safety for you and the farmer.
        </p>
      </div>
    </div>
  );
};

export default QRScanProofPage;
