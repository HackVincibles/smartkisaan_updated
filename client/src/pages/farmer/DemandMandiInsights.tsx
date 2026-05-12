import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info,
  Calendar,
  Filter,
  BarChart3,
  LineChart,
  ChevronRight,
  Zap,
  Globe,
  ShieldCheck,
  MoreVertical,
  Activity,
  Compass,
  Radar,
  ArrowRight,
  BarChart,
  Target,
  Workflow,
  Cpu,
  Fingerprint,
  Sparkles,
  Layers,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';

const DemandMandiInsights = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchInsights();
  }, [selectedCrop, timeframe]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      // Simulating API call with premium realistic data
      setTimeout(() => {
        setInsights({
          currentPrice: 2450,
          priceChange: '+6.2%',
          isPositive: true,
          mandiArrivals: 18400,
          demandScore: 94,
          topMandis: [
            { name: 'Neemuch Mandi', price: 2510, distance: 42, trend: 'up' },
            { name: 'Mandsaur Mandi', price: 2480, distance: 88, trend: 'up' },
            { name: 'Indore Mandi', price: 2420, distance: 195, trend: 'stable' }
          ],
          priceHistory: [2150, 2210, 2250, 2310, 2450, 2420, 2450],
          forecast: {
            prediction: 'Highly Bullish',
            confidence: 96,
            reason: 'Global export demand and localized supply shocks indicate a 12% upside in the next 21-day cycle.'
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Market Node Synchronization Failed');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh] fade-in">
      <div className="text-center space-y-8">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mx-auto shadow-2xl">
          <Workflow className="text-primary animate-spin" size={40} />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic leading-none">Syncing Global Mandi Pulse...</p>
          <p className="text-xs text-gray-400 font-medium italic leading-none">Scanning 500+ regional nodes...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Mandi Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Market Intelligence Protocol v8.4.1
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Mandi <span className="not-italic text-primary">Insights.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Geospatial market intelligence terminal. Synchronizing real-time pricing and demand telemetry across <span className="text-gray-900 font-black italic">500+ regional nodes</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <div className="flex bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 backdrop-blur-xl">
                {['Wheat', 'Rice', 'Soybean', 'Mustard'].map(crop => (
                    <button 
                        key={crop}
                        onClick={() => setSelectedCrop(crop)}
                        className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${
                            selectedCrop === crop 
                            ? 'bg-white text-primary shadow-xl border border-primary/10' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {crop}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-4 px-8 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50">
                <Calendar size={18} className="text-gray-400" />
                <select 
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 focus:ring-0 cursor-pointer italic outline-none"
                >
                    <option value="week">Current Cycle</option>
                    <option value="month">Quarterly View</option>
                </select>
            </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">MARKET</h1>
        </div>
      </div>

      {/* KPI Intelligence Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4">
        <StatCard 
          label="Market Index Price" 
          value={formatCurrency(insights.currentPrice)} 
          subtext="Per Quintal (SK-AVG)"
          trend={insights.priceChange}
          isPositive={insights.isPositive}
          icon={<IndianRupee size={28} />}
          color="primary"
        />
        <StatCard 
          label="Arrival Telemetry" 
          value={`${insights.mandiArrivals.toLocaleString()} Qtl`} 
          subtext="Total Region Volume"
          icon={<Radar size={28} />}
          color="secondary"
        />
        <StatCard 
          label="Market Liquidity" 
          value={`${insights.demandScore}%`} 
          subtext="Buyer Concentration"
          icon={<Target size={28} />}
          color="success"
        />
        
        {/* Prediction Node */}
        <div className="stitch-card p-10 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                <Zap size={32} className="fill-current" />
              </div>
              <span className="px-4 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] text-primary border border-white/5 animate-pulse italic">
                AI INFERENCE LIVE
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold italic tracking-tighter leading-none">{insights.forecast.prediction}</h3>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] italic leading-none">{insights.forecast.confidence}% Confidence Hash</p>
            </div>
            <p className="text-sm text-gray-400 font-medium leading-relaxed italic line-clamp-3">{insights.forecast.reason}</p>
            <div className="pt-4">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${insights.forecast.confidence}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="h-full bg-primary shadow-[0_0_20px_rgba(16,185,129,0.8)]" 
                />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] opacity-10 group-hover:opacity-40 transition-opacity duration-1000"></div>
        </div>
      </div>

      {/* Main Analysis Engine */}
      <div className="grid lg:grid-cols-12 gap-12 px-4">
        {/* Price Trajectory Visualizer */}
        <div className="lg:col-span-8 stitch-card p-12 bg-white relative overflow-hidden shadow-2xl shadow-gray-200/50 flex flex-col justify-between">
          <div className="relative z-10 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-950 rounded-2xl text-white flex items-center justify-center shadow-2xl">
                  <BarChart3 size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Price <span className="not-italic text-primary">Trajectory.</span></h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Regional Hub Market Indices</p>
                </div>
              </div>
              <div className="flex gap-10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-xl shadow-primary/20"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Mandi Average</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Global Index</span>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] flex items-end justify-between gap-8 pt-16">
              {insights.priceHistory.map((price: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-8 group cursor-pointer h-full justify-end relative">
                  <div className="relative w-full flex items-end justify-center h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(price / 3000) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
                      className="w-full max-w-[64px] bg-gray-50 group-hover:bg-primary/20 transition-all rounded-[2rem] relative border border-gray-100 group-hover:border-primary/20 shadow-sm"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="absolute -top-16 bg-gray-950 text-white text-xs font-black px-6 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-2xl -translate-y-4 group-hover:translate-y-0 z-20 italic">
                      ₹{price.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic group-hover:text-primary transition-colors leading-none">NODE {i+1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
        </div>

        {/* Regional Hub Registry */}
        <div className="lg:col-span-4 stitch-card p-10 flex flex-col space-y-12 bg-white shadow-2xl shadow-gray-200/50">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gray-950 rounded-2xl text-white flex items-center justify-center shadow-2xl">
              <MapPin size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Regional <span className="not-italic text-primary">Nodes.</span></h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Top Performing Market Hubs</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            {insights.topMandis.map((mandi: any, i: number) => (
              <motion.div 
                key={i}
                whileHover={{ x: 12 }}
                className="flex items-center justify-between p-8 rounded-[2.5rem] bg-gray-50/50 border border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all group cursor-pointer"
              >
                <div className="space-y-3">
                  <p className="font-black text-gray-950 text-2xl italic tracking-tight leading-none group-hover:text-primary transition-colors">{mandi.name}</p>
                  <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none">
                    <TrendingUp size={14} className={mandi.trend === 'up' ? 'text-success' : 'text-gray-300'} />
                    <span>{mandi.distance} KM • {mandi.trend.toUpperCase()} PULSE</span>
                  </div>
                </div>
                <div className="text-right space-y-3">
                  <p className="font-black text-primary text-3xl tracking-tighter italic leading-none">₹{mandi.price}</p>
                  <div className="inline-flex px-4 py-1.5 rounded-xl bg-primary/10 text-[9px] font-black text-primary border border-primary/10 uppercase tracking-[0.2em] italic leading-none shadow-sm">VERIFIED NODE</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full py-7 bg-gray-950 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] italic flex items-center justify-center gap-4 group hover:bg-primary transition-all shadow-2xl shadow-gray-200">
            EXPLORE 42 HUB NODES
            <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
          </button>
        </div>
      </div>

      {/* Strategic Intelligence Banner */}
      <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-28 h-28 bg-primary/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-primary border border-primary/20 shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                <Workflow size={48} className="stroke-[1.5]" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-primary/20 shadow-2xl">
                    <Sparkles size={18} /> STRATEGIC PROTOCOL ACTIVE
                </div>
                <h3 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">Sector Optimization: {selectedCrop} Asset</h3>
                <p className="text-gray-400 font-medium max-w-3xl leading-relaxed text-xl italic">
                    Geospatial telemetry suggests <span className="text-primary font-black underline decoration-primary/20 underline-offset-8 decoration-4">Neemuch Hub</span> prices will peak within the next 48 hours. Smart-Kissan recommends immediate node initialization to capture the <span className="text-white font-black italic">₹2,510</span> premium delta.
                </p>
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-black/20 hover:bg-primary hover:text-white transition-all"
            >
                EXECUTE ADVICE
            </motion.button>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -mr-80 -mt-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
            <Compass size={160} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subtext, trend, isPositive, icon, color }: any) => (
  <div className="stitch-card p-12 group relative overflow-hidden bg-white shadow-2xl shadow-gray-200/50 hover:translate-y-[-8px] transition-all duration-500">
    <div className="relative z-10 space-y-10">
      <div className="flex justify-between items-start">
        <div className={`w-16 h-16 rounded-[1.5rem] bg-gray-950 text-white shadow-2xl flex items-center justify-center group-hover:rotate-6 group-hover:bg-${color} transition-all duration-700`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] italic ${isPositive ? 'text-success' : 'text-error'} bg-${isPositive ? 'success' : 'error'}/10 px-4 py-2 rounded-xl border border-${isPositive ? 'success' : 'error'}/20 shadow-sm`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 italic leading-none">{label}</p>
        <h3 className="text-5xl font-black text-gray-950 italic tracking-tighter leading-none">{value}</h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60 leading-none">{subtext}</p>
      </div>
    </div>
    <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-${color}/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
  </div>
);

const IndianRupee = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13h12M14.5 21l-9-9c5 0 7-3 7-5" />
  </svg>
);

export default DemandMandiInsights;
