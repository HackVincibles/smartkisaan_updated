import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, ExternalLink, Cpu, Copy, Check,
  Calendar, Layers, Clock, Zap, Award, Globe, Database, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getMockOrderById } from '../../services/routeService';

const BlockchainReceiptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const order = getMockOrderById(id);

  // Generate deterministic receipt details
  const receiptData = {
    orderId: order._id || 'ORD-5521',
    farmerId: order.farmerId?.name || 'Farmer Node #8843',
    buyerId: order.buyerId?.businessName || 'Global Foods Ltd',
    amount: order.totalAmount || 215000,
    qualityGrade: 'Grade A+ Premium',
    timestamp: new Date(Date.now() - 86400000).toLocaleString(),
    txHash: '0x8b3e24bcf8915e61ac2407519bb7d22faef9b015112e8b284e311a68fb2d3ff9',
    ipfsHash: 'QmPXx9TfA448aB3251cDaD22feEf9b2d3ff9e8b28114ef'
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptData.txHash);
    setCopied(true);
    toast.success('Transaction Hash Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const triggerVerification = () => {
    setVerifying(true);
    setVerified(false);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      toast.success('Consensus Ledger Signature Verified!');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32 pt-8 px-4 fade-in">
      {/* Header section */}
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-primary transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> BACK TO PORTAL
        </button>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
          <ShieldCheck size={16} /> SECURE CRYPTOGRAPHIC TRUST RECEIPT
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
          Trust <span className="not-italic text-primary">Receipt.</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg leading-relaxed italic">
          Verifiably anchored on the <span className="text-gray-950 font-black">Polygon Amoy Ledger</span> via immutable smart contract consensus.
        </p>
      </div>

      {/* Main receipt container */}
      <div className="relative stitch-card bg-white shadow-2xl border-none p-12 md:p-16 overflow-hidden rounded-[3rem] group">
        
        {/* Verification watermark */}
        {verified && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 rotate-12 border-8 border-dashed border-primary/20 text-primary/25 font-black text-6xl uppercase tracking-[0.3em] px-16 py-8 rounded-[2rem]"
          >
            VERIFIED CHAIN
          </motion.div>
        )}

        <div className="relative z-10 space-y-16">
          {/* Header Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-12 border-b border-gray-100">
            <div className="space-y-2">
              <span className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] italic">
                STATE::RECORDED
              </span>
              <p className="text-2xl font-black text-gray-950 italic tracking-tighter mt-4">CONTRACT ORDER ID: #{receiptData.orderId}</p>
            </div>
            <div className="text-left md:text-right space-y-1.5">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic leading-none">BLOCKCHAIN TIMESTAMP</p>
              <p className="text-lg font-bold text-gray-400 italic">{receiptData.timestamp}</p>
            </div>
          </div>

          {/* Receipt Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { label: 'Sovereign Seller (Farmer)', value: receiptData.farmerId, icon: Award, color: 'text-primary' },
              { label: 'Sovereign Buyer', value: receiptData.buyerId, icon: Globe, color: 'text-secondary' },
              { label: 'Settlement Amount', value: `₹${receiptData.amount.toLocaleString()}`, icon: Database, color: 'text-gray-950' },
              { label: 'AI Assessed Crop Quality', value: receiptData.qualityGrade, icon: Zap, color: 'text-warning font-black' }
            ].map((field, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner group/field hover:bg-white hover:shadow-2xl transition-all">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-4 leading-none">{field.label}</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center ${field.color} shadow-sm group-hover/field:rotate-12 transition-transform duration-700`}>
                    <field.icon size={20} strokeWidth={2} />
                  </div>
                  <p className={`text-xl font-black italic tracking-tighter text-gray-950 leading-none`}>{field.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hash Elements */}
          <div className="space-y-8 pt-8 border-t border-gray-100">
            {/* Tx Hash */}
            <div className="p-8 bg-gray-950 text-white rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group/hash">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">POLYGON AMOY TRAN_HASH</span>
                <button 
                  onClick={handleCopy}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-primary transition-all text-white/60 hover:text-white"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="text-xs font-mono text-white/80 break-all select-all tracking-wider relative z-10">{receiptData.txHash}</p>
              <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover/hash:text-white/10 transition-colors">
                <Cpu size={150} />
              </div>
            </div>

            {/* IPFS CID Hash */}
            <div className="p-8 bg-gray-50 text-gray-950 rounded-[2.5rem] border border-gray-100 shadow-inner relative overflow-hidden group/hash">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">DECENTRALIZED IPFS STORAGE HASH (CID)</span>
                <a 
                  href={`https://ipfs.io/ipfs/${receiptData.ipfsHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-secondary hover:text-white transition-all text-gray-400 flex items-center justify-center"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              <p className="text-xs font-mono text-gray-500 break-all select-all tracking-wider relative z-10">{receiptData.ipfsHash}</p>
              <div className="absolute top-0 right-0 p-12 text-gray-200 pointer-events-none opacity-30">
                <FileText size={150} />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <button
              onClick={triggerVerification}
              disabled={verifying}
              className="w-full sm:w-auto px-16 py-8 bg-gray-950 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic hover:bg-primary transition-all shadow-2xl flex items-center justify-center gap-4 relative overflow-hidden"
            >
              {verifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>BROADCASTING DISPATCH STATUS...</span>
                </>
              ) : verified ? (
                <>
                  <ShieldCheck size={20} className="text-primary fill-primary animate-pulse" />
                  <span>CONSENSUS MATCHED & SECURE</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="animate-bounce" />
                  <span>VERIFY RECORD INTEGRITY</span>
                </>
              )}
            </button>
            <a
              href={`https://amoy.polygonscan.com/tx/${receiptData.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-12 py-8 bg-white border border-gray-100 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-gray-950 hover:shadow-2xl transition-all flex items-center justify-center gap-4"
            >
              <span>VIEW IN POLYGONSCAN</span> <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainReceiptPage;
