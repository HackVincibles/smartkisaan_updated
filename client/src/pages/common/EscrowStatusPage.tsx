import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Clock, Zap, Cpu, Award, Database,
  ArrowRight, CheckCircle2, ShieldAlert, FileText, Lock, RefreshCw, BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getMockOrderById } from '../../services/routeService';

const EscrowStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getMockOrderById(id);

  // Escrow state indices: 0: PENDING, 1: PAID, 2: PICKUP, 3: TRANSIT, 4: DELIVERED, 5: COMPLETED
  const states = [
    { key: 'PENDING_PAYMENT', label: 'CONTRACT_SIGNED', details: 'Awaiting buyer deposit' },
    { key: 'PAID_ESCROW', label: 'CAPITAL_LOCKED', details: 'Funds secured in smart contract' },
    { key: 'PICKUP_ASSIGNED', label: 'DISPATCH_READY', details: 'Transporter secured cargo' },
    { key: 'IN_TRANSIT', label: 'LOGISTICS_ACTIVE', details: 'Real-time transit active' },
    { key: 'DELIVERED', label: 'VAULT_ARRIVED', details: 'Crop dispatch under review' },
    { key: 'COMPLETED', label: 'DISBURSED_SETTLED', details: 'Capital released to Farmer node' }
  ];

  const getCurrentStateIndex = () => {
    const status = order.status || order.escrowState || 'IN_TRANSIT';
    const normalized = String(status).toUpperCase();
    if (normalized === 'PENDING_PAYMENT') return 0;
    if (normalized === 'PAID_ESCROW') return 1;
    if (normalized === 'PICKUP_ASSIGNED' || normalized === 'READY_FOR_PICKUP') return 2;
    if (normalized === 'IN_TRANSIT' || normalized === 'PICKED_UP') return 3;
    if (normalized === 'DELIVERED') return 4;
    if (normalized === 'COMPLETED' || normalized === 'SUCCESS' || normalized === 'SETTLED') return 5;
    return 3; // Default to Transit for high-fidelity visualization
  };

  const currentIndex = getCurrentStateIndex();

  // Premium Escrow breakdown calculations
  const productCost = order.totalAmount || 215000;
  const freightCost = Math.round(productCost * 0.02) || 4500;
  const platformFee = Math.round(productCost * 0.01) || 2150;
  const lockedCapitalSum = productCost + freightCost + platformFee;

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
          <ShieldCheck size={16} /> SECURE CRYPTOGRAPHIC SETTLEMENT RAIL
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
          Escrow <span className="not-italic text-primary">Status.</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg leading-relaxed italic max-w-2xl">
          Visual status tracker for capital locked in the non-custodial decentralized clearing protocol.
        </p>
      </div>

      {/* Visual State Machine Progress Track */}
      <div className="stitch-card p-12 bg-white border-none shadow-2xl relative overflow-hidden group rounded-[3rem]">
        <div className="relative z-10 space-y-16">
          <div className="flex justify-between items-center pb-8 border-b border-gray-50">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl shadow-inner group-hover:rotate-6 transition-transform duration-700">
                <RefreshCw size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic text-gray-950 tracking-tighter uppercase leading-none">Consensus <span className="text-primary not-italic">State.</span></h3>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none">Smart contract escrow state machine sync</p>
              </div>
            </div>
            <div className="px-5 py-2 bg-gray-50 border border-gray-100 rounded-xl font-mono text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] italic shadow-inner">
              BLOCK_CHAIN_80002::OK
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="relative pt-12 pb-16">
            {/* Background connecting track line */}
            <div className="absolute top-[4.5rem] left-[10%] right-[10%] h-1 bg-gray-100 rounded-full pointer-events-none z-0">
              <div 
                className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-[2000ms] rounded-full"
                style={{ width: `${(currentIndex / (states.length - 1)) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-6 gap-4 relative z-10">
              {states.map((state, i) => {
                const active = i <= currentIndex;
                const current = i === currentIndex;
                return (
                  <div key={state.key} className="flex flex-col items-center text-center space-y-4 group/node">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-2xl relative transition-all duration-700 ${
                      current 
                        ? 'bg-primary text-white scale-125 ring-12 ring-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        : active 
                          ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-white text-gray-200 border-gray-100 shadow-sm'
                    }`}>
                      {active ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <div className="w-3.5 h-3.5 rounded-full bg-current"></div>}
                      
                      {current && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full border border-white animate-ping"></div>
                      )}
                    </div>
                    <div className="space-y-1.5 px-1.5">
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] italic leading-none ${active ? 'text-gray-950 font-black' : 'text-gray-300'}`}>{state.label}</p>
                      <p className="text-[7.5px] text-gray-400 font-semibold italic leading-relaxed hidden sm:block">{state.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none"><Lock size={150} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Settlement breakdown & countdown */}
        <div className="lg:col-span-7 space-y-12">
          {/* Breakdown manifest */}
          <div className="stitch-card p-12 bg-white border-none shadow-2xl space-y-12 relative overflow-hidden group rounded-[3rem]">
            <div className="flex items-center gap-5 pb-4 relative z-10">
              <div className="p-4 bg-gray-950 text-white rounded-2xl shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                <Database size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-black italic text-gray-950 tracking-tighter uppercase leading-none">Capital Breakdown</h4>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none">Locked escrow clearing manifest</p>
              </div>
            </div>
            <div className="space-y-8 relative z-10">
              {[
                { label: 'CROP VALUE INDEX', value: `₹${productCost.toLocaleString()}`, details: 'Standard agricultural settlement' },
                { label: 'FREIGHT DISPATCH RAIL', value: `₹${freightCost.toLocaleString()}`, details: 'Consensus logistics payout' },
                { label: 'PLATFORM PROTOCOL FEE', value: `₹${platformFee.toLocaleString()}`, details: 'Sovereign clearing commission' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner group/item hover:bg-white hover:shadow-xl transition-all">
                  <div className="text-left space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">{item.label}</p>
                    <p className="text-[8px] text-gray-300 font-semibold italic leading-none">{item.details}</p>
                  </div>
                  <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none">{item.value}</p>
                </div>
              ))}

              <div className="flex justify-between items-center p-8 bg-gray-950 text-white rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group/sum">
                <div className="text-left space-y-1 relative z-10">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">TOTAL SECURED CAPITAL</p>
                  <p className="text-[8px] text-primary font-black uppercase tracking-[0.2em] italic leading-none animate-pulse">ERC-20 LEDGER CONFIRMED</p>
                </div>
                <p className="text-4xl font-black text-white italic tracking-tighter leading-none relative z-10">₹{lockedCapitalSum.toLocaleString()}</p>
                <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover/sum:scale-110 transition-transform">
                  <Lock size={100} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI metrics & countdown sidebar */}
        <div className="lg:col-span-5 space-y-12">
          {/* Quality Assessment & auto countdown */}
          <div className="stitch-card p-10 bg-gray-950 text-white space-y-8 relative overflow-hidden group shadow-2xl rounded-[3rem]">
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl text-primary border border-white/10 shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                <Award size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black italic text-white tracking-tight uppercase leading-none">AI Grading Verification</h4>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 italic leading-none">In-situ machine assessment</p>
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              {/* Quality score progress bar */}
              <div className="space-y-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-white/50 italic leading-none">
                  <span>AI PURITY SCORE</span>
                  <span className="text-primary animate-pulse font-mono">96.4% ACCURACY</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400" style={{ width: '96.4%' }}></div>
                </div>
              </div>

              {/* Countdown release timeline */}
              <div className="flex gap-4 p-5 bg-white/5 rounded-[2rem] border border-white/5">
                <Clock size={20} className="text-primary shrink-0 animate-bounce" />
                <div className="text-left space-y-1.5">
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">AUTO RELEASE RESOLUTION ENGINE</p>
                  <p className="text-xl font-black italic tracking-tighter text-white leading-none">3d 14h 28m left</p>
                  <p className="text-[8px] text-white/40 font-semibold italic leading-relaxed">System automates full disbursement unless buyer lodges IPFS dispute payload.</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-88 h-88 bg-primary/10 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
          </div>

          {/* Trigger dispute section */}
          {currentIndex === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="stitch-card p-10 bg-error/5 border border-error/10 shadow-2xl relative overflow-hidden group rounded-[3rem]"
            >
              <div className="flex items-start gap-6 relative z-10">
                <ShieldAlert size={28} className="text-error shrink-0 animate-pulse" />
                <div className="space-y-4 text-left">
                  <h4 className="text-lg font-black text-gray-950 italic uppercase leading-none">DISPUTE INTERFACE</h4>
                  <p className="text-gray-400 font-medium italic text-sm leading-relaxed">
                    Unsatisfied with agricultural dispatch weight or purity? Lodge an immutable dispute block securely.
                  </p>
                  <Link
                    to={`/buyer/orders/${id}/dispute-vault`}
                    className="w-full py-5 bg-error hover:bg-gray-950 text-white rounded-[2rem] font-black text-[9px] uppercase tracking-[0.4em] italic shadow-2xl shadow-error/10 flex items-center justify-center gap-3"
                  >
                    <span>LAUNCH ARBITRATION CONSENSUS</span> <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowStatusPage;
