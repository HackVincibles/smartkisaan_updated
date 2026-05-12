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
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';

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
      <div className="text-center space-y-6">
        <div className="w-24 h-24 border-4 border-tertiary-50 border-t-tertiary rounded-[2.5rem] animate-spin mx-auto shadow-2xl"></div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary italic">Syncing Global Mandi Pulse...</p>
          <p className="text-xs text-gray-400 font-medium italic">Scanning 500+ regional nodes...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-tertiary">
            <Compass size={14} /> <span>Geospatial Intelligence</span>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-400 italic">Market Index</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight italic leading-none">
            Mandi <span className="not-italic text-tertiary">Insights.</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-4 p-3 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="flex bg-gray-50/50 p-1.5 rounded-[1.5rem] border border-gray-100">
            {['Wheat', 'Rice', 'Soybean', 'Mustard'].map(crop => (
              <button 
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCrop === crop ? 'bg-white text-tertiary shadow-xl border border-tertiary/10' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {crop}
              </button>
            ))}
          </div>
          <div className="w-px h-10 bg-gray-100 self-center mx-2" />
          <div className="flex items-center px-4">
            <Calendar size={16} className="text-gray-400 mr-3" />
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 focus:ring-0 cursor-pointer italic"
            >
              <option value="week">Current Cycle</option>
              <option value="month">Quarterly view</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary KPI Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Market Index Price" 
          value={formatCurrency(insights.currentPrice)} 
          subtext="Per Quintal (SK-AVG)"
          trend={insights.priceChange}
          isPositive={insights.isPositive}
          icon={<IndianRupee size={24} />}
          color="tertiary"
        />
        <StatCard 
          label="Arrival Telemetry" 
          value={`${insights.mandiArrivals.toLocaleString()} Qtl`} 
          subtext="Total Region Volume"
          icon={<Radar size={24} />}
          color="primary"
        />
        <StatCard 
          label="Market Liquidity" 
          value={`${insights.demandScore}%`} 
          subtext="Buyer Concentration"
          icon={<Target size={24} />}
          color="success"
        />
        
        {/* Prediction Node */}
        <div className="stitch-card p-10 bg-gray-900 text-white relative overflow-hidden group shadow-2xl">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-tertiary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-tertiary/20 group-hover:scale-110 transition-transform duration-500">
                <Zap size={22} className="fill-current" />
              </div>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-[8px] font-bold uppercase tracking-widest text-tertiary border border-white/5 animate-pulse">
                AI Inference Live
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold italic tracking-tighter leading-none">{insights.forecast.prediction}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">{insights.forecast.confidence}% Confidence Hash</p>
            </div>
            <p className="text-[11px] text-gray-300 font-medium leading-relaxed italic">{insights.forecast.reason}</p>
            <div className="pt-4">
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${insights.forecast.confidence}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="h-full bg-tertiary shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-tertiary rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Trajectory Visualizer */}
        <div className="lg:col-span-8 stitch-card p-12 bg-white relative overflow-hidden shadow-2xl shadow-gray-200/50">
          <div className="relative z-10 space-y-12">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-tertiary/5 rounded-2xl text-tertiary flex items-center justify-center shadow-inner border border-tertiary/10">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight italic leading-none">Price <span className="not-italic">Trajectory.</span></h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Historic & Projected Data</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Mandi Average</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Global Index</span>
                </div>
              </div>
            </div>
            
            <div className="h-96 flex items-end justify-between gap-6 pt-10">
              {insights.priceHistory.map((price: number, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-6 group cursor-pointer h-full justify-end">
                  <div className="relative w-full flex items-end justify-center h-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(price / 3000) * 100}%` }}
                      transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
                      className="w-full max-w-[56px] bg-gray-50 group-hover:bg-tertiary/20 transition-all rounded-[1.5rem] relative border border-gray-100 group-hover:border-tertiary/20"
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-tertiary rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                    <div className="absolute -top-14 bg-gray-900 text-white text-[11px] font-bold px-4 py-2.5 rounded-[1rem] opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-2xl -translate-y-4 group-hover:translate-y-0 z-20">
                      ₹{price.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic group-hover:text-tertiary transition-colors">Node {i+1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-tertiary/5 rounded-full blur-[120px]"></div>
        </div>

        {/* Regional Pulse List */}
        <div className="lg:col-span-4 stitch-card p-10 flex flex-col space-y-10 bg-white shadow-2xl shadow-gray-200/50">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-primary/5 rounded-2xl text-primary flex items-center justify-center shadow-inner border border-primary/10">
              <MapPin size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight italic leading-none">Regional <span className="not-italic">Nodes.</span></h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Top Performing Mandis</p>
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            {insights.topMandis.map((mandi: any, i: number) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center justify-between p-6 rounded-[1.8rem] bg-gray-50/50 border border-transparent hover:border-tertiary/10 hover:bg-tertiary/5 transition-all group cursor-pointer"
              >
                <div className="space-y-2">
                  <p className="font-bold text-gray-900 text-xl italic tracking-tight leading-tight group-hover:text-tertiary transition-colors">{mandi.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] flex items-center gap-3 italic">
                    <TrendingUp size={12} className={mandi.trend === 'up' ? 'text-success' : 'text-gray-300'} />
                    {mandi.distance} KM • {mandi.trend} Pulse
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-bold text-tertiary text-2xl tracking-tighter italic leading-none">₹{mandi.price}</p>
                  <div className="inline-flex px-3 py-1 rounded-full bg-white text-[9px] font-bold text-tertiary border border-tertiary/10 uppercase tracking-widest shadow-sm">Verified</div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="w-full py-6 bg-gray-900 text-white rounded-[1.5rem] text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 group hover:bg-black transition-all shadow-2xl">
            Explore 42 Regional Nodes
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Strategic Advisory Section */}
      <div className="stitch-card p-12 bg-tertiary rounded-[3.5rem] text-white relative overflow-hidden group shadow-2xl shadow-tertiary/20">
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-2xl rounded-[2.2rem] flex items-center justify-center text-white border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-700">
            <Workflow size={40} className="stroke-[1.5]" />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-3">
            <h3 className="text-3xl font-bold italic tracking-tight leading-tight">Strategic Protocol: {selectedCrop} Asset</h3>
            <p className="text-white/70 font-medium max-w-2xl leading-relaxed text-lg italic">
              Geospatial data suggests <span className="text-white font-bold underline decoration-white/20 underline-offset-8 decoration-2">Neemuch Mandi</span> prices will peak within the next 48 hours. Smart-Kissan recommends immediate listing to capture the <span className="text-white font-bold">₹2,510</span> premium window.
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white text-tertiary rounded-[1.8rem] text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl shadow-black/10 hover:shadow-white/20 transition-all"
          >
            Execute Advice
          </motion.button>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64 group-hover:opacity-40 transition-opacity"></div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subtext, trend, isPositive, icon, color }: any) => (
  <div className="stitch-card p-10 group relative overflow-hidden bg-white border-none shadow-2xl shadow-gray-200/50 hover:translate-y-[-5px] transition-transform">
    <div className="relative z-10 space-y-8">
      <div className="flex justify-between items-start">
        <div className={`w-14 h-14 rounded-2xl bg-${color} text-white shadow-xl shadow-${color}/20 flex items-center justify-center group-hover:rotate-3 transition-transform`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${isPositive ? 'text-success' : 'text-error'} bg-${isPositive ? 'success' : 'error'}/10 px-3 py-1.5 rounded-xl border border-${isPositive ? 'success' : 'error'}/20`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 italic">{label}</p>
        <h3 className="text-4xl font-bold text-gray-900 mb-2 italic tracking-tighter leading-none">{value}</h3>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic opacity-60 leading-none">{subtext}</p>
      </div>
    </div>
    <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${color}/5 rounded-full blur-[60px]`}></div>
  </div>
const IndianRupee = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12M6 8h12M6 13h12M14.5 21l-9-9c5 0 7-3 7-5" />
  </svg>
);

export default DemandMandiInsights;
