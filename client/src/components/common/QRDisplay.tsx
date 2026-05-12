import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';

interface QRDisplayProps {
  value: string;
  title?: string;
  subtitle?: string;
}

const QRDisplay = ({ value, title, subtitle }: QRDisplayProps) => {
  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${title || 'code'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100 text-center space-y-6">
      {title && <h3 className="text-2xl font-black text-gray-900">{title}</h3>}
      {subtitle && <p className="text-sm font-medium text-gray-500">{subtitle}</p>}
      
      <div className="bg-gray-50 p-6 rounded-[2.5rem] inline-block border-4 border-white shadow-inner">
        <QRCodeSVG 
          id="qr-code-svg"
          value={value} 
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="flex gap-4">
        <button 
          onClick={downloadQR}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all"
        >
          <Download className="w-4 h-4" /> Download
        </button>
        <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Scan this to confirm pickup/delivery
      </p>
    </div>
  );
};

export default QRDisplay;
