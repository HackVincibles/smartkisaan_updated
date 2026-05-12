import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '@/components/common/QRScanner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Package, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'sonner';

const PickupScanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  const handleScanSuccess = (data: string) => {
    setScannedData(data);
    setScanning(false);
    toast.success('Pickup QR Scanned Successfully!');
    // In real app, call API to confirm pickup
    setTimeout(() => navigate('/logistics/dashboard'), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-green-600 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
            <Package className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Farmer Pickup</h1>
          <p className="text-gray-500 font-medium">Scan the QR code provided by the farmer to confirm pickup.</p>
        </div>

        {!scannedData ? (
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100 text-center space-y-8">
            <div className="p-8 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
              <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ready to Scan</p>
            </div>
            
            <button 
              onClick={() => setScanning(true)}
              className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 transition-all"
            >
              Open QR Scanner
            </button>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[3rem] border border-green-100 shadow-xl shadow-green-50 text-center space-y-6 animate-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Pickup Verified!</h2>
              <p className="text-gray-500 font-medium mt-1">Order #SK-{scannedData.slice(-6)} is now in your custody.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl text-xs font-bold text-gray-400 uppercase tracking-widest">
              Updating status and route...
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

export default PickupScanner;

