import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  Calendar, 
  Zap, 
  ChevronRight, 
  Compass, 
  Workflow, 
  Cpu, 
  Activity, 
  Globe, 
  Sparkles,
  BarChart3,
  Target,
  MoreHorizontal
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { motion } from 'framer-motion';

const data = [
  { month: 'MAY', current: 2400, predicted: 2400 },
  { month: 'JUN', current: 2550, predicted: 2600 },
  { month: 'JUL', current: null, predicted: 2800 },
  { month: 'AUG', current: null, predicted: 2750 },
  { month: 'SEP', current: null, predicted: 2900 },
  { month: 'OCT', current: null, predicted: 3100 },
];

const FuturePrices = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Analytics Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Market Intelligence Engine v12.4.0
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Future <span className="not-italic text-primary">Pulse.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Advanced AI-powered price projections for your crop strategy. Synchronizing <span className="text-gray-900 font-black italic">regional supply/demand nodes</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <div className="flex bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 backdrop-blur-xl">
                {['WHEAT', 'RICE', 'CORN'].map((crop, idx) => (
                    <button 
                        key={crop}
                        className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${
                            idx === 0 
                            ? 'bg-white text-primary shadow-xl border border-primary/10' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {crop}
                    </button>
                ))}
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-950 transition-all shadow-sm">
                <BarChart3 size={24} />
            </button>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">FUTURE</h1>
        </div>
      </div>

      {/* Prediction Intelligence Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        {[
          { label: '30 DAY FORECAST', price: '₹2,600', change: 8.3, sentiment: 'BULLISH', icon: <Activity /> },
          { label: '60 DAY FORECAST', price: '₹2,800', change: 15.2, sentiment: 'BULLISH', icon: <Target /> },
          { label: '90 DAY FORECAST', price: '₹3,100', change: 24.5, sentiment: 'STRONG BUY', icon: <Zap /> }
        ].map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stitch-card p-12 group relative overflow-hidden bg-white shadow-2xl shadow-gray-200/50 hover:translate-y-[-8px] transition-all duration-500"
          >
            <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gray-950 text-white shadow-2xl flex items-center justify-center group-hover:rotate-6 group-hover:bg-primary transition-all duration-700">
                        {React.cloneElement(card.icon as React.ReactElement, { size: 28 })}
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] italic ${card.change > 0 ? 'text-success' : 'text-error'} bg-${card.change > 0 ? 'success' : 'error'}/10 px-4 py-2 rounded-xl border border-${card.change > 0 ? 'success' : 'error'}/20 shadow-sm`}>
                        <ArrowUpRight size={16} />
                        {card.change}%
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2 italic leading-none">{card.label}</p>
                    <h3 className="text-5xl font-black text-gray-950 italic tracking-tighter leading-none">{card.price}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] italic leading-none pt-2 ${card.sentiment.includes('BUY') ? 'text-primary' : 'text-gray-400'}`}>{card.sentiment}</p>
                </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          </motion.div>
        ))}
      </div>

      {/* Main Forecast Surface */}
      <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 relative overflow-hidden group mx-4">
        <div className="relative z-10 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-950 rounded-2xl text-white flex items-center justify-center shadow-2xl">
                        <LineChart size={32} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Price <span className="not-italic text-primary">Projection.</span></h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Based on Historical Trends & Monsoon Synthesis</p>
                    </div>
                </div>
                <div className="flex gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gray-950 shadow-xl shadow-gray-950/20"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">CURRENT LEVEL</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-primary shadow-xl shadow-primary/20 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">AI PREDICTION</span>
                    </div>
                </div>
            </div>

            <div className="h-[500px] w-full pt-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900, letterSpacing: '0.2em'}} 
                            dy={20} 
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                        />
                        <Tooltip 
                            contentStyle={{
                                borderRadius: '2rem', 
                                border: 'none', 
                                backgroundColor: '#030712',
                                color: '#fff',
                                boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                                padding: '20px',
                                fontFamily: 'Inter, sans-serif'
                            }}
                            itemStyle={{
                                fontSize: '10px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}
                            cursor={{stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5'}}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="predicted" 
                            stroke="#10b981" 
                            strokeWidth={6} 
                            fillOpacity={1} 
                            fill="url(#colorPredicted)" 
                            animationDuration={2000}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="current" 
                            stroke="#030712" 
                            strokeWidth={6} 
                            fill="transparent" 
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none opacity-40"></div>
      </div>

      {/* Strategic Intelligence Banner */}
      <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20 mx-4">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-28 h-28 bg-primary/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-primary border border-primary/20 shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                <TrendingUp size={48} className="stroke-[1.5]" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-primary/20 shadow-2xl">
                    <Sparkles size={18} /> STRATEGIC ADVISORY ACTIVE
                </div>
                <h3 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">Optimization Protocol: Inventory Hold</h3>
                <p className="text-gray-400 font-medium max-w-3xl leading-relaxed text-xl italic">
                    Prices are projected to peak in <span className="text-primary font-black italic underline underline-offset-8 decoration-4 decoration-primary/20">October</span>. Protocol suggests holding <span className="text-white font-black italic">30% of harvest</span> for the next 45 days to maximize delta by <span className="text-primary font-black italic">+12%</span>.
                </p>
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-black/20 hover:bg-primary hover:text-white transition-all"
            >
                SET PRICE ALERT
            </motion.button>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -mr-80 -mt-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
            <Globe size={160} />
        </div>
      </div>
    </div>
  );
};

export default FuturePrices;
