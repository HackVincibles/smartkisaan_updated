import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, CreditCard, ArrowUpRight, 
  ArrowDownRight, Calendar, Download,
  Wallet, PieChart, IndianRupee,
  Activity, Zap, Shield, Database,
  MoreHorizontal, ChevronRight,
  ArrowRight, Layers, Target, Clock,
  CheckCircle, Cpu
} from 'lucide-react';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { motion, AnimatePresence } from 'framer-motion';

const EarningsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const weekData = [40, 70, 45, 90, 65, 80, 50];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await transporterService.getDashboardStats();
      const data = response.data?.data || response.data;
      setStats(data);
      setTransactions([
        { id: 'T1', type: 'Credit', amount: 4500, orderId: 'ORD-A23F', date: new Date(), status: 'PAID_CONFIRMED' },
        { id: 'T2', type: 'Credit', amount: 3200, orderId: 'ORD-B8C1', date: new Date(Date.now() - 86400000), status: 'PAID_CONFIRMED' },
        { id: 'T3', type: 'Payout', amount: -5000, date: new Date(Date.now() - 172800000), status: 'CLEARED' },
        { id: 'T4', type: 'Credit', amount: 8500, orderId: 'ORD-E44D', date: new Date(Date.now() - 259200000), status: 'PROCESSING' }
      ]);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricCards = [
    {
      label: 'TOTAL_LIFETIME_EARNINGS',
      value: `₹${(stats?.totalEarnings || 124500).toLocaleString()}`,
      subtext: '+12.4% from last month',
      subIcon: ArrowUpRight,
      subColor: 'text-success',
      icon: TrendingUp,
      bg: 'bg-gray-950',
      textColor: 'text-white',
      accentColor: 'text-warning'
    },
    {
      label: 'PENDING_SETTLEMENT',
      value: `₹${(stats?.pendingPayout || 14200).toLocaleString()}`,
      subtext: 'Next cycle in 2 days',
      subIcon: Clock,
      subColor: 'text-secondary',
      icon: CreditCard,
      bg: 'bg-white',
      textColor: 'text-gray-950',
      accentColor: 'text-secondary'
    },
    {
      label: 'COMPLETED_HAULS',
      value: '124',
      subtext: 'Top Performer Badge',
      subIcon: CheckCircle,
      subColor: 'text-warning',
      icon: PieChart,
      bg: 'bg-white',
      textColor: 'text-gray-950',
      accentColor: 'text-warning'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Financial Ledger Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-warning italic">
            <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
            Financial_Registry v2.1 [SETTLEMENT_ACTIVE]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Capital <span className="not-italic text-warning">Ledger.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Complete transparency over your <span className="text-gray-950 font-black italic">freight earnings</span>, settlement cycles, and payout rails.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 relative z-10">
          <button className="px-10 py-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200/50 hover:bg-gray-950 hover:text-white transition-all text-gray-400 group">
            <Download size={20} className="group-hover:scale-110 transition-transform" /> EXPORT_STATEMENT
          </button>
          <button className="px-10 py-6 bg-warning text-white rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-warning/20 hover:bg-gray-950 transition-all group relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-5"><Wallet size={20} /> REQUEST_PAYOUT</span>
            <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">₹</h1>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <div className={`stitch-card p-12 ${card.bg} shadow-2xl shadow-gray-200/50 border-none relative overflow-hidden hover:translate-y-[-8px] transition-all duration-700`}>
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-700 ${
                  card.bg === 'bg-gray-950' ? 'bg-white/10 text-warning' : 'bg-gray-50 text-gray-300'
                }`}>
                  <card.icon size={36} strokeWidth={1.5} />
                </div>
                <button className={`p-4 rounded-2xl transition-all ${card.bg === 'bg-gray-950' ? 'bg-white/5 text-white/20 hover:bg-white/10' : 'bg-gray-50 text-gray-200 hover:bg-white shadow-inner'}`}>
                  <MoreHorizontal size={22} />
                </button>
              </div>
              <div className="space-y-4 relative z-10">
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] italic leading-none ${card.bg === 'bg-gray-950' ? 'text-white/30' : 'text-gray-300'}`}>{card.label}</p>
                <p className={`text-6xl font-black tracking-tighter italic leading-none ${card.textColor} ${card.accentColor}`}>{card.value}</p>
                <div className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] italic ${card.subColor}`}>
                  <card.subIcon size={18} /> {card.subtext}
                </div>
              </div>
              {/* Background Decor */}
              <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-[0.03] group-hover:rotate-12 transition-transform duration-[2s]">
                <IndianRupee size={150} className={card.textColor} />
              </div>
              <div className={`absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]`}></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 px-4">
        {/* Transaction Ledger */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-1.5 h-10 bg-warning rounded-full"></div>
              <h3 className="text-4xl font-black text-gray-950 italic tracking-tighter uppercase leading-none">Transaction <span className="text-warning not-italic">Rail.</span></h3>
            </div>
            <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-warning transition-colors group">
              VIEW_ALL <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="space-y-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="stitch-card bg-white border-none h-28 animate-pulse shadow-2xl shadow-gray-200/50" />
              ))
            ) : (
              transactions.map((t, index) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="stitch-card p-10 bg-white border-none shadow-2xl shadow-gray-200/50 flex items-center justify-between hover:translate-y-[-4px] transition-all duration-500 relative overflow-hidden">
                    <div className="flex items-center gap-8">
                      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner border border-current/10 group-hover:rotate-12 transition-transform duration-700 ${
                        t.amount > 0 ? 'text-success bg-success/5' : 'text-error bg-error/5'
                      }`}>
                        {t.amount > 0 ? <ArrowDownRight size={36} strokeWidth={1.5} /> : <ArrowUpRight size={36} strokeWidth={1.5} />}
                      </div>
                      <div className="space-y-2">
                        <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase group-hover:text-warning transition-colors">
                          {t.type === 'Credit' ? `FREIGHT_PAYMENT::${t.orderId}` : 'BANK_WITHDRAWAL'}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">
                          <Clock size={14} /> {new Date(t.date).toLocaleDateString().toUpperCase()}
                          <span className="px-4 py-1.5 bg-gray-50 rounded-xl border border-gray-100">{t.status}</span>
                        </div>
                      </div>
                    </div>
                    <p className={`text-4xl font-black italic tracking-tighter leading-none shrink-0 ${t.amount > 0 ? 'text-success' : 'text-gray-950'}`}>
                      {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString()}
                    </p>
                    <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-12">
          {/* Weekly Earnings Chart */}
          <div className="stitch-card p-12 bg-white border-none shadow-2xl shadow-gray-200/50 space-y-10 relative overflow-hidden group">
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-warning/10 text-warning rounded-2xl shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <Activity size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">Weekly <span className="text-warning not-italic">Rail.</span></h4>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">EARNINGS_TELEMETRY</p>
              </div>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end h-40 gap-3">
                {weekData.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                    <div className="w-full bg-gray-50 rounded-t-[0.8rem] relative overflow-hidden border border-gray-100 shadow-inner" style={{ height: '160px' }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: i * 0.05 + 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-0 left-0 right-0 bg-warning rounded-t-[0.7rem] group-hover/bar:bg-gray-950 transition-colors duration-500 shadow-[0_-5px_20px_rgba(234,179,8,0.3)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                {days.map((d, i) => (
                  <span key={i} className="flex-1 text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] italic leading-none">{d}</span>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-10 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]">
              <TrendingUp size={150} />
            </div>
          </div>

          {/* AI Earnings Intelligence */}
          <div className="stitch-card p-12 bg-gray-950 text-white space-y-8 shadow-2xl shadow-gray-950/40 relative overflow-hidden group">
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl text-warning border border-white/5 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <Zap size={28} />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Neural <span className="text-warning not-italic">Tip.</span></h4>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic leading-none">AI_MARKET_INTEL</p>
              </div>
            </div>
            <p className="text-white/50 text-lg font-medium leading-relaxed italic relative z-10">
              Transporters in your region are earning <span className="text-white font-black underline decoration-warning/20 underline-offset-8 uppercase">20% more</span> by accepting night logistics contracts to Delhi Mandi nodes.
            </p>
            <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic text-warning group-hover:text-white transition-colors relative z-10">
              ENABLE_NIGHT_LOADS <ArrowRight size={18} />
            </button>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-warning/10 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="absolute top-0 right-0 p-10 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]">
              <Cpu size={150} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
