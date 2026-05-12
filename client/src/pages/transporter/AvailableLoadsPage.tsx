import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Search, 
  Filter,
  Package, 
  IndianRupee, 
  ArrowRight,
  TrendingUp, 
  Clock,
  Shield,
  Navigation,
  Scale,
  Calendar,
  ChevronRight,
  Zap,
  Activity,
  Target,
  Globe,
  Layers,
  ArrowUpRight,
  Database,
  Radar,
  CheckCircle,
  Signal
} from 'lucide-react';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AvailableLoadsPage = () => {
  const [loads, setLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLoads();
  }, []);

  const fetchLoads = async () => {
    try {
      const response = await transporterService.getAvailableLoads();
      const data = response.data?.data?.orders || response.data?.orders || [];
      setLoads(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch available loads:', error);
      setLoads([
        { 
          _id: 'L-101', 
          listingId: { productName: 'Wheat (HD-2967)', quantity: 100, unit: 'Quintal' },
          pickupAddress: 'Bikaner, Rajasthan',
          deliveryAddress: 'Azadpur Mandi, Delhi',
          freightCharge: 8500,
          distance: '420 km',
          deadline: 'Today, 6:00 PM',
          createdAt: new Date()
        },
        { 
          _id: 'L-102', 
          listingId: { productName: 'Red Onions', quantity: 40, unit: 'Quintal' },
          pickupAddress: 'Nashik, Maharashtra',
          deliveryAddress: 'Vashi Mandi, Mumbai',
          freightCharge: 4200,
          distance: '165 km',
          deadline: 'Tomorrow, 9:00 AM',
          createdAt: new Date(Date.now() - 3600000)
        },
        { 
          _id: 'L-103', 
          listingId: { productName: 'Basmati Rice', quantity: 200, unit: 'Quintal' },
          pickupAddress: 'Karnal, Haryana',
          deliveryAddress: 'INA Market, Delhi',
          freightCharge: 12000,
          distance: '130 km',
          deadline: 'Tomorrow, 2:00 PM',
          createdAt: new Date(Date.now() - 7200000)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await transporterService.acceptOrder(id);
      toast.success('Load accepted! Trip added to your registry.');
      fetchLoads();
    } catch (error) {
      toast.error('Failed to accept load');
    }
  };

  const filtered = loads.filter(l =>
    searchTerm === '' ||
    l.listingId?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Freight Exchange Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-warning italic">
            <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
            Freight_Exchange v5.0 [LIVE_BROADCAST]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Load <span className="not-italic text-warning">Market.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Accessing <span className="text-gray-950 font-black italic">{loads.length} verified freight contracts</span> from the pan-India agricultural logistics rail.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-8 relative z-10">
          <div className="stitch-card p-8 bg-white shadow-2xl shadow-gray-200/50 flex items-center gap-6 group hover:-rotate-1 transition-transform">
            <div className="w-14 h-14 bg-warning/10 text-warning rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Signal size={28} className="animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">ACTIVE_LEADS</p>
              <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">{loads.length} <span className="text-xs text-gray-400">CONTRACTS</span></p>
            </div>
          </div>
          <div className="stitch-card p-8 bg-warning text-white shadow-2xl shadow-warning/20 flex items-center gap-6 group hover:rotate-1 transition-transform">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <IndianRupee size={28} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic leading-none">EARNINGS_POT</p>
              <p className="text-3xl font-black italic tracking-tighter leading-none">₹{(loads.reduce((a, b) => a + (b.freightCharge || 0), 0) / 1000).toFixed(1)}k</p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">LOADS</h1>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        <div className="relative flex-1 group">
          <Search size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-warning transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN ROUTES, CROPS, OR MARKETS..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-10 py-10 bg-white border border-gray-100 rounded-[3rem] focus:ring-12 focus:ring-warning/5 focus:border-warning/20 outline-none font-black text-[11px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-2xl shadow-gray-200/50"
          />
        </div>
        <div className="flex gap-6">
          <button className="px-10 py-8 bg-white border border-gray-100 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 flex items-center gap-4 hover:shadow-2xl transition-all shadow-sm">
            <Filter size={22} /> FILTER_REGION
          </button>
          <button className="px-10 py-8 bg-warning text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic flex items-center gap-4 shadow-2xl shadow-warning/20 hover:bg-gray-950 transition-all">
            <Navigation size={22} /> NEARBY_ONLY
          </button>
        </div>
      </div>

      {/* Load Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 px-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="stitch-card p-10 bg-white border-none shadow-2xl animate-pulse space-y-10">
                <div className="flex justify-between items-start">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem]" />
                  <div className="w-32 h-12 bg-gray-50 rounded-2xl" />
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-50 rounded-xl w-3/4" />
                  <div className="h-5 bg-gray-50 rounded-xl w-1/2" />
                </div>
                <div className="h-40 bg-gray-50 rounded-[2.5rem]" />
                <div className="h-16 bg-gray-50 rounded-2xl" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full stitch-card py-48 text-center space-y-12 bg-white shadow-2xl relative overflow-hidden">
              <div className="w-48 h-48 bg-gray-50 rounded-[4rem] flex items-center justify-center mx-auto shadow-inner">
                <Package size={90} className="text-gray-200" />
              </div>
              <div className="space-y-6">
                <h3 className="text-5xl font-black text-gray-950 italic uppercase">Registry <span className="text-warning not-italic">Empty.</span></h3>
                <p className="text-gray-400 text-xl italic max-w-lg mx-auto">No loads match the current filter parameters. Broaden your search to access more freight contracts.</p>
              </div>
            </motion.div>
          ) : (
            filtered.map((load, index) => (
              <motion.div
                key={load._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="stitch-card p-10 bg-white border-none shadow-2xl shadow-gray-200/50 flex flex-col hover:translate-y-[-10px] transition-all duration-700 relative overflow-hidden h-full">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-20 h-20 bg-warning/10 text-warning rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-700">
                      <Truck size={36} strokeWidth={1.5} />
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none mb-3">FIXED_FREIGHT</p>
                      <p className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none group-hover:text-warning transition-colors">
                        ₹{load.freightCharge?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Asset Info */}
                  <div className="mb-10 space-y-5">
                    <div className="flex items-center gap-4">
                      <h3 className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none uppercase group-hover:text-warning transition-colors">
                        {load.listingId?.productName}
                      </h3>
                      <span className="px-4 py-2 bg-success/10 text-success rounded-xl text-[9px] font-black uppercase tracking-[0.3em] italic border border-success/10 shadow-sm">VERIFIED</span>
                    </div>
                    <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">
                      <span className="flex items-center gap-2"><Scale size={14} className="text-warning" /> {load.listingId?.quantity} {load.listingId?.unit}</span>
                      <span className="flex items-center gap-2"><Navigation size={14} className="text-warning" /> {load.distance || '—'}</span>
                    </div>
                  </div>

                  {/* Route Visualization */}
                  <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-8 relative mb-10 border border-gray-100 shadow-inner">
                    <div className="absolute left-12 top-16 bottom-16 w-px border-l-2 border-dashed border-gray-200" />
                    
                    <div className="flex items-start gap-6 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-success border-4 border-white shadow-md shrink-0 mt-1" />
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 italic leading-none">PICKUP_NODE</p>
                        <p className="text-lg font-black text-gray-950 italic uppercase leading-none">{load.pickupAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-warning border-4 border-white shadow-md shrink-0 mt-1" />
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 italic leading-none">DELIVERY_HUB</p>
                        <p className="text-lg font-black text-gray-950 italic uppercase leading-none">{load.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Row */}
                  <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none flex items-center gap-2"><Calendar size={12} /> PICKUP_EXPIRY</p>
                      <p className="text-[13px] font-black text-gray-950 italic uppercase leading-none">{load.deadline || 'TODAY, 18:00'}</p>
                    </div>
                    <button 
                      onClick={() => handleAccept(load._id)}
                      className="px-10 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] italic flex items-center gap-4 hover:bg-warning transition-all shadow-2xl shadow-gray-950/20 group/btn relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-4">ACCEPT <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" /></span>
                      <div className="absolute inset-0 bg-warning opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    </button>
                  </div>

                  <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
                  <div className="absolute -right-16 -top-16 w-48 h-48 bg-warning/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Platform Intelligence Panel */}
      <div className="px-4">
        <div className="stitch-card p-12 md:p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/40">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="space-y-10 flex-1">
              <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-warning italic border border-white/5">
                <Zap size={16} className="fill-warning animate-pulse" /> Verified_Transporter_Network
              </div>
              <h2 className="text-5xl font-black leading-tight italic tracking-tighter uppercase">
                Maximize utilization with <span className="text-warning not-italic">neural routing.</span>
              </h2>
              <p className="text-white/40 text-xl font-medium leading-relaxed italic max-w-2xl">
                Algorithmic freight matching reduces empty miles by <span className="text-white font-black underline decoration-warning/20 underline-offset-8">62%</span>. Verified payment protection via SmartKissan Escrow vault.
              </p>
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-8 shrink-0">
              <div className="text-center p-10 bg-white/5 rounded-[3rem] border border-white/5 group-hover:bg-warning/10 transition-colors">
                <p className="text-6xl font-black text-warning mb-3 italic">98<span className="text-2xl text-white/40">%</span></p>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">AVG_UTILIZATION</p>
              </div>
              <div className="text-center p-10 bg-white/5 rounded-[3rem] border border-white/5 group-hover:bg-warning/10 transition-colors">
                <p className="text-6xl font-black text-warning mb-3 italic">15<span className="text-2xl text-white/40">m</span></p>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">FAST_SETTLEMENT</p>
              </div>
            </div>
          </div>

          <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-warning/10 rounded-full blur-[150px] opacity-20"></div>
          <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]">
            <Globe size={300} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableLoadsPage;
