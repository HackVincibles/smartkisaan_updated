import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '@/components/common/QRScanner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Home, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const DeliveryScanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScanSuccess = (data: string) => {
    setScannedData(data);
    setScanning(false);
    toast.success('Delivery Confirmed!');
    // In real app, call API to release escrow
    setTimeout(() => navigate('/logistics/dashboard'), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-green-600 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <Home className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Buyer Delivery</h1>
          <p className="text-gray-500 font-medium">Scan the QR code provided by the buyer to finalize delivery.</p>
        </div>

        {!scannedData ? (
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100 text-center space-y-8">
            <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ready to Finalize</p>
            </div>
            
            <button 
              onClick={() => setScanning(true)}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
            >
              Scan Buyer QR
            </button>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[3rem] border border-green-100 shadow-xl shadow-green-50 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Delivery Confirmed!</h2>
              <p className="text-gray-500 font-medium mt-1">Order Sk-8821092 has been delivered successfully.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-2xl text-xs font-bold text-green-600 uppercase tracking-widest">
              Escrow funds released to farmer.
            </div>
          </div>
        )}

        {scanning && (
          <QRScanner 
            onScanSuccess={handleScanSuccess} 
            onClose={() => setScanning(false)} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default DeliveryScanner;

