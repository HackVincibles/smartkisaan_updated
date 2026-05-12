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
  Zap
} from 'lucide-react';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { toast } from 'react-hot-toast';

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
      // Mock data for demo
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await transporterService.acceptOrder(id);
      toast.success('Load accepted successfully!');
      fetchLoads();
    } catch (error) {
      toast.error('Failed to accept load');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
            <span>Marketplace</span>
            <ChevronRight size={10} />
            <span className="text-gray-900">Freight Exchange</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Available Loads</h1>
        </div>
        
        <div className="flex gap-4 p-4 bg-orange-50 rounded-[2rem] border border-orange-100 shadow-sm">
          <div className="px-6 border-r border-orange-200">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Active Leads</p>
            <p className="text-2xl font-black text-orange-900">{loads.length}</p>
          </div>
          <div className="px-6">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Earnings Pot.</p>
            <p className="text-2xl font-black text-orange-900">₹45.2k</p>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search routes, cities or crop types..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-100 font-bold text-gray-900"
          />
        </div>
        <div className="flex gap-3">
          <button className="px-8 py-5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-3">
            <Filter size={18} />
            Filter Region
          </button>
          <button className="px-8 py-5 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center gap-3">
            <Navigation size={18} />
            Nearby Only
          </button>
        </div>
      </div>

      {/* Grid of Loads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-50 space-y-6 animate-pulse shadow-sm">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl" />
                <div className="w-24 h-10 bg-gray-50 rounded-xl" />
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-50 rounded-lg w-3/4" />
                <div className="h-4 bg-gray-50 rounded-lg w-1/2" />
              </div>
              <div className="h-32 bg-gray-50 rounded-[2rem]" />
              <div className="h-16 bg-gray-50 rounded-2xl" />
            </div>
          ))
        ) : loads.length === 0 ? (
          <div className="col-span-full bg-white rounded-[4rem] p-24 text-center space-y-8 border border-gray-50">
            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <Package size={64} className="text-gray-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900">No available loads found</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto">New loads are posted every few minutes. Expand your search range to see more results.</p>
            </div>
            <button className="px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
              Broaden Search Parameters
            </button>
          </div>
        ) : (
          loads.map((load) => (
            <div key={load._id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 transition-all flex flex-col group relative overflow-hidden">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-orange-50 text-orange-600 rounded-[1.5rem] shadow-inner">
                  <Truck size={28} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fixed Freight</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter">
                    ₹{load.freightCharge}
                  </p>
                </div>
              </div>

              {/* Load Info */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                    {load.listingId?.productName}
                  </h3>
                  <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase tracking-widest">
                    Verified
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-1"><Scale size={12} className="text-orange-400" /> {load.listingId?.quantity} {load.listingId?.unit}</span>
                  <span className="flex items-center gap-1"><Navigation size={12} className="text-orange-400" /> {load.distance || '420 km'}</span>
                </div>
              </div>

              {/* Route Visualization */}
              <div className="bg-gray-50 p-6 rounded-[2rem] space-y-6 relative mb-10">
                <div className="absolute left-9 top-14 bottom-14 w-0.5 border-l-2 border-dashed border-gray-200" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pickup Point</p>
                    <p className="text-sm font-black text-gray-800 leading-tight">{load.pickupAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-orange-600 border-4 border-white shadow-sm shrink-0 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Delivery Destination</p>
                    <p className="text-sm font-black text-gray-800 leading-tight">{load.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Timing & Action */}
              <div className="mt-auto flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={12} />
                    Pickup Deadline
                  </p>
                  <p className="text-xs font-black text-gray-900">{load.deadline || 'Today, 6:00 PM'}</p>
                </div>
                <button 
                  onClick={() => handleAccept(load._id)}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-gray-100 group-hover:scale-105 active:scale-95"
                >
                  Accept Load <ArrowRight size={16} />
                </button>
              </div>

              {/* Subtle background element */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))
        )}
      </div>

      {/* Promotion/Info Card */}
      <div className="bg-gray-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-orange-400">
            <Zap size={14} />
            Verified Transporter Network
          </div>
          <h2 className="text-4xl font-black leading-tight max-w-lg">
            Maximize your truck's utilization with high-density routes.
          </h2>
          <p className="text-gray-400 font-medium max-w-md">
            Our algorithmic route matching ensures you spend less time empty and more time earning. Verified payment protection via Smart-Kissan Escrow.
          </p>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-8 shrink-0">
          <div className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
            <p className="text-5xl font-black text-orange-500 mb-2">98<span className="text-2xl text-white">%</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Avg. Utilization</p>
          </div>
          <div className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
            <p className="text-5xl font-black text-orange-500 mb-2">15<span className="text-2xl text-white">m</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Fast Settlement</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-orange-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute top-10 right-10 w-px h-64 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
      </div>
    </div>
  );
};

export default AvailableLoadsPage;
