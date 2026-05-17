import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShieldAlert, Cpu, UploadCloud, FileText, CheckCircle2,
  Trash2, ExternalLink, Zap, Key, Server, Lock, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { getMockOrderById } from '../../services/routeService';

const EvidenceVaultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getMockOrderById(id);

  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [evidenceRecords, setEvidenceRecords] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles([...files, {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type
      }]);
      toast.success('Evidence file added to staging.');
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    toast.success('Staged file removed.');
  };

  const handleUpload = () => {
    if (!description.trim()) {
      toast.error('Please input a dispute manifest description.');
      return;
    }
    if (files.length === 0) {
      toast.error('Please attach at least one piece of staging evidence.');
      return;
    }

    setUploading(true);
    setUploaded(false);

    // Mock IPFS CID generation
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      const newRecord = {
        id: 'DISP-' + Math.floor(Math.random() * 9000 + 1000),
        description,
        timestamp: new Date().toLocaleString(),
        filesCount: files.length,
        ipfsCid: 'QmXb12e8b284e311a68fbf9b015112e8b284e311a68f3e' + Math.floor(Math.random() * 90 + 10),
        status: 'TAMPER_PROOF_CONSENSUS_SECURED'
      };
      setEvidenceRecords([newRecord, ...evidenceRecords]);
      setFiles([]);
      setDescription('');
      toast.success('Evidence successfully uploaded and anchored to IPFS!');
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 pt-8 px-4 fade-in">
      {/* Header Panel */}
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-error transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> BACK TO PORTAL
        </button>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-error italic">
          <ShieldAlert size={16} /> DECENTRALIZED EVIDENCE & ARBITRATION PROTOCOL
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
          Evidence <span className="not-italic text-error">Vault.</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg leading-relaxed italic max-w-2xl">
          Secure, cryptographic custody for dispute manifests. Anchored to <span className="text-gray-950 font-black">IPFS Storage (Pinata)</span> to guarantee tamper-proof resolution matrices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Staging & Upload Console */}
        <div className="lg:col-span-7 space-y-12">
          <div className="stitch-card p-12 bg-white border-none shadow-2xl space-y-12 relative overflow-hidden group rounded-[3rem]">
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-error/10 text-error rounded-2xl border border-error/10 shadow-inner group-hover:rotate-6 transition-transform duration-700">
                <UploadCloud size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic text-gray-950 tracking-tighter uppercase leading-none">Staging <span className="text-error not-italic">Terminal.</span></h3>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none">Stage dispute records for IPFS anchoring</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              {/* Manifest Description */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic leading-none block">Dispute Narrative Manifest</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe crop quality defects, transit delays, or weight anomalies in detail..."
                  className="w-full h-40 px-6 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] outline-none font-medium italic text-gray-900 focus:ring-12 focus:ring-error/5 focus:border-error/20 transition-all placeholder:text-gray-300 resize-none shadow-inner"
                ></textarea>
              </div>

              {/* Drag-and-Drop Area */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic leading-none block">Staged Materials (Photos, Logs, Chats)</label>
                <div className="relative border-4 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center group-hover:border-error/20 transition-colors bg-gray-50/50 shadow-inner">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={48} className="mx-auto text-gray-300 mb-4 animate-pulse group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-black italic text-gray-950 uppercase tracking-wider mb-2">Drag and drop file here</p>
                  <p className="text-xs text-gray-400 italic">or click to select file from node filesystem</p>
                </div>
              </div>

              {/* Files Staging List */}
              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic mb-2 leading-none">STAGED DOCUMENTS</p>
                    <div className="space-y-3">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-4">
                            <FileText size={18} className="text-error" />
                            <div className="text-left">
                              <p className="text-xs font-bold text-gray-950 truncate max-w-[200px]">{file.name}</p>
                              <p className="text-[9px] text-gray-400 font-mono tracking-widest">{file.size} • {file.type}</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile(i)} className="p-2.5 text-gray-300 hover:text-error hover:bg-white rounded-xl transition-all shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Action */}
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] italic hover:bg-error transition-all shadow-2xl flex items-center justify-center gap-4"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>PINNING DISPUTE RECORDS TO IPFS STORAGE...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} className="animate-bounce" />
                    <span>BROADCAST TO SECURITY CORE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* IPFS Status & Records Feed */}
        <div className="lg:col-span-5 space-y-12">
          {/* Node IPFS Security Metrics */}
          <div className="stitch-card p-10 bg-gray-950 text-white space-y-8 relative overflow-hidden group shadow-2xl rounded-[3rem]">
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl text-error border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                <Key size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black italic text-white tracking-tight uppercase leading-none">Storage Node Specifications</h4>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 italic leading-none">IPFS Gateway operational metrics</p>
              </div>
            </div>
            <div className="space-y-6 relative z-10">
              {[
                { label: 'DECENTRALIZED VAULT', value: 'Pinata Web3 Client', Icon: Server },
                { label: 'DATA REPLICATION', value: '3x Active Swarms', Icon: Layers },
                { label: 'CONSENSUS RAIL', value: 'Polygon Amoy Multi-Sig', Icon: Lock },
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <spec.Icon size={18} className="text-error shrink-0" />
                  <div className="text-left space-y-0.5">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">{spec.label}</p>
                    <p className="text-sm font-bold text-white italic leading-none">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 w-88 h-88 bg-error/10 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
          </div>

          {/* Historical dispute records list */}
          <div className="space-y-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic px-4 leading-none">ACTIVE VAULT DISPUTES ({evidenceRecords.length})</p>
            <AnimatePresence>
              {evidenceRecords.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[2.5rem] italic text-gray-300 font-medium text-lg leading-relaxed bg-white shadow-inner">
                  Vault empty. No active dispute manifests detected in the current procurement index.
                </div>
              ) : (
                evidenceRecords.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="stitch-card p-8 bg-white shadow-2xl border-none space-y-6 rounded-[2.5rem] group hover:border-error/20 border border-transparent transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-4 py-2 bg-error/10 text-error border border-error/10 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] italic">
                          CONSENSUS_LOCKED
                        </span>
                        <h4 className="text-lg font-black text-gray-950 tracking-tighter italic mt-3 uppercase">{rec.id}</h4>
                      </div>
                      <span className="text-[9px] text-gray-300 font-mono tracking-widest">{rec.timestamp}</span>
                    </div>

                    <p className="text-sm text-gray-500 font-medium italic leading-relaxed text-left border-l-2 border-error/20 pl-4">{rec.description}</p>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 italic">
                        <span>IPFS STORAGE CID</span>
                        <a 
                          href={`https://ipfs.io/ipfs/${rec.ipfsCid}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-error"
                        >
                          OPEN GATEWAY <ExternalLink size={10} />
                        </a>
                      </div>
                      <p className="text-[10px] font-mono text-gray-500 break-all select-all font-semibold">{rec.ipfsCid}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceVaultPage;
