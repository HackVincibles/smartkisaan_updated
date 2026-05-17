import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Award, Shield, Compass, ChevronRight,
  Database, Cpu, Globe, ExternalLink, Zap, Star, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const SbtBadgesPage = () => {
  const navigate = useNavigate();

  const badges = [
    {
      id: 'SBT-001',
      title: 'TRUSTED FARMER PROTOCOL',
      criteria: 'Complete 10+ dispute-free premium deliveries',
      progress: 100,
      status: 'ISSUED',
      details: 'Anchored to decentralized ledger on May 10, 2026.',
      txHash: '0x3c921319bfca89e24bcf8915e61ac2407519bb7d22faef9b2d3ff9b015112e8',
      image: '🌟',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-500'
    },
    {
      id: 'SBT-002',
      title: 'QUALITY CHAMPION INSIGNIA',
      criteria: 'Maintain average AI quality grade of A or A+ over 5 harvest cycles',
      progress: 100,
      status: 'ISSUED',
      details: 'Decentralized reputation signature anchored on May 12, 2026.',
      txHash: '0x9924baef9b015112e8b284e311a68fb2d3ff9e8b284e3100ba7d22faef9b01',
      image: '🏆',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-500'
    },
    {
      id: 'SBT-003',
      title: 'CONSISTENT SUPPLY DECREE',
      criteria: 'Achieve 30 consecutive days of on-time crop dispatching',
      progress: 75,
      status: 'PENDING Consensus',
      details: '7.5 out of 10 verification nodes cleared.',
      txHash: null,
      image: '⚡',
      color: 'from-blue-500/5 to-purple-500/5 border-gray-100 text-gray-400'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 pt-8 px-4 fade-in">
      {/* Header Info */}
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-primary transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> BACK TO PORTAL
        </button>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
          <Award size={16} /> SOVEREIGN REPUTATION LEDGER
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
          Soulbound <span className="not-italic text-primary">Tokens.</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg leading-relaxed italic max-w-2xl">
          Non-transferable reputation credentials (SBTs) permanently anchored to your digital identity node, showing verified field metrics.
        </p>
      </div>

      {/* Main SBT Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`stitch-card overflow-hidden bg-white hover:translate-y-[-10px] transition-all duration-700 p-8 shadow-2xl relative flex flex-col justify-between h-[520px] rounded-[3.5rem]`}
          >
            {/* Holographic Badge Background */}
            <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-[40px] opacity-25 bg-gradient-to-br ${badge.color}`}></div>

            <div className="space-y-8 relative z-10">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-300 tracking-[0.3em] font-mono leading-none uppercase">
                  METRIC::{badge.id}
                </span>
                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic ${
                  badge.progress === 100 ? 'bg-primary/10 text-primary border border-primary/10' : 'bg-gray-100 text-gray-400'
                }`}>
                  {badge.status}
                </span>
              </div>

              {/* Holographic Icon Sphere */}
              <div className="w-28 h-28 mx-auto bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-center text-5xl shadow-inner group-hover:scale-115 transition-transform duration-1000">
                {badge.image}
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-xl font-black text-gray-950 italic tracking-tighter uppercase leading-none">{badge.title}</h3>
                <p className="text-xs text-gray-400 font-medium italic leading-relaxed px-2">{badge.criteria}</p>
              </div>
            </div>

            {/* Progress & Verification Section */}
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] italic">
                  <span className="text-gray-400">Consensus Progress</span>
                  <span className="text-gray-950">{badge.progress}%</span>
                </div>
                <div className="h-2.5 bg-gray-50 border border-gray-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${badge.progress === 100 ? 'from-primary to-emerald-400' : 'from-blue-400 to-indigo-400'}`}
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-[10px] font-medium italic text-gray-400">
                {badge.details}
              </div>

              {badge.txHash ? (
                <a
                  href={`https://amoy.polygonscan.com/tx/${badge.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-5 bg-gray-950 text-white hover:bg-primary rounded-[2rem] font-black text-[9px] uppercase tracking-[0.4em] italic shadow-2xl transition-all flex items-center justify-center gap-3"
                >
                  <span>VERIFY CREDENTIAL</span> <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-5 bg-gray-50 text-gray-300 rounded-[2rem] font-black text-[9px] uppercase tracking-[0.4em] italic cursor-not-allowed flex items-center justify-center gap-3 border border-gray-100"
                >
                  <span>LOCK IN TRANSIT</span> <Compass size={14} className="animate-spin" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Block explaining SBTs */}
      <div className="stitch-card p-12 bg-gray-950 text-white relative overflow-hidden group shadow-2xl rounded-[3rem]">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] italic text-primary">
              <Cpu size={16} /> REPUTATION ENGINES
            </div>
            <h3 className="text-3xl font-black italic tracking-tighter leading-none">Non-Transferable Credential Ledger</h3>
            <p className="text-gray-400 font-medium italic text-lg leading-relaxed">
              Unlike generic NFTs, Soulbound credentials are locked to a specific operational wallet node. They cannot be transferred, leased, or manipulated, building a verified, tamper-proof reputation framework.
            </p>
          </div>
          <div className="p-8 bg-white/5 border border-white/5 rounded-3xl shrink-0 group-hover:rotate-6 transition-transform duration-1000">
            <Database size={50} className="text-primary animate-pulse" />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none select-none"></div>
      </div>
    </div>
  );
};

export default SbtBadgesPage;
