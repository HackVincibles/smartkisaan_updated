import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, IndianRupee, Loader2, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { toast } from 'sonner';

const PaymentGateway = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Simulated payment processing
    const timer = setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success('Payment Successful!');
      
      // Auto-redirect to orders after 3 seconds
      setTimeout(() => {
        navigate('/buyer/orders');
      }, 3000);
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-gray-100 border border-gray-100 space-y-8">
          {isProcessing ? (
            <div className="space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <Loader2 className="w-24 h-24 text-green-600 animate-spin relative z-10" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">Securing Transaction...</h2>
                <p className="text-gray-500 mt-2 font-medium">Please do not refresh or close this window</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 py-3 rounded-2xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Razorpay Secure Payment Portal
              </div>
            </div>
          ) : (
            <div className="animate-in zoom-in duration-500 space-y-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-900">Payment Successful!</h2>
                <p className="text-gray-500 mt-2 font-medium">Your order has been placed and funds are in Escrow.</p>
              </div>
              <div className="p-6 bg-green-50 rounded-2xl text-left border border-green-100">
                <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-2">Order ID</div>
                <div className="font-black text-green-900 text-lg">SK-ORD-8821092</div>
                <div className="mt-4 flex justify-between items-end pt-4 border-t border-green-200">
                  <div className="text-sm font-bold text-green-800">Redirecting to My Orders...</div>
                  <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-6 opacity-30 grayscale">
          {['visa', 'mastercard', 'upi', 'razorpay'].map(brand => (
            <div key={brand} className="text-xs font-black uppercase tracking-widest">{brand}</div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PaymentGateway;

