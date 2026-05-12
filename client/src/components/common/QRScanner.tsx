import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QRScanner = ({ onScanSuccess, onClose }: QRScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scannerRef.current.render((decodedText) => {
      onScanSuccess(decodedText);
      scannerRef.current?.clear();
    }, (error) => {
      // console.warn(error);
    });

    return () => {
      scannerRef.current?.clear().catch(e => console.error("Failed to clear scanner", e));
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Camera className="w-6 h-6 text-green-600" /> Scan QR Code
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-all">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6">
          <div id="qr-reader" className="rounded-2xl overflow-hidden border-0"></div>
        </div>

        <div className="p-6 bg-gray-50 text-center">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Align QR code within the frame
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
