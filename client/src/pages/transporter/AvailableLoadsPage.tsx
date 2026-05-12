import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Search, Filter,
  Package, IndianRupee, ArrowRight,
  TrendingUp, Clock
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
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
          listingId: { productName: 'Basmati Rice', quantity: 100, unit: 'Quintal' },
          pickupAddress: 'Bikaner, Rajasthan',
          deliveryAddress: 'Azadpur Mandi, Delhi',
          freightCharge: 8500,
          createdAt: new Date()
        },
        { 
          _id: 'L-102', 
          listingId: { productName: 'Red Onions', quantity: 40, unit: 'Quintal' },
          pickupAddress: 'Nashik, Maharashtra',
          deliveryAddress: 'Vashi Mandi, Mumbai',
          freightCharge: 4200,
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
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Available Loads</h1>
            <p className="text-gray-500 mt-1">Find and accept new delivery assignments</p>
          </div>
          
          <div className="flex gap-4 p-2 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active Leads</p>
              <p className="text-xl font-black text-blue-900">{loads.length}</p>
            </div>
            <div className="w-px bg-blue-200" />
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Market Status</p>
              <div className="flex items-center gap-1 text-green-600 font-bold">
                <TrendingUp size={14} /> High
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by city, crop or order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button className="px-8 py-4 bg-white border border-gray-100 rounded-3xl text-sm font-black text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Filter size={18} />
            Filter Location
          </button>
        </div>

        {/* Loads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="card bg-white p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-gray-100 rounded-full w-2/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-50 rounded-full w-full" />
                  <div className="h-4 bg-gray-50 rounded-full w-full" />
                </div>
                <div className="h-12 bg-gray-100 rounded-2xl w-full pt-4" />
              </div>
            ))
          ) : loads.length === 0 ? (
            <div className="col-span-full card bg-white p-16 text-center space-y-6">
              <Package size={64} className="text-gray-100 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">No loads available right now</h3>
              <p className="text-gray-500 max-w-sm mx-auto">Try widening your search area or check back in a few minutes.</p>
            </div>
          ) : (
            loads.map((load) => (
              <div key={load._id} className="card bg-white p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-transparent hover:border-blue-100 group">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Truck size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Payout</p>
                      <p className="text-2xl font-black text-gray-900 flex items-center justify-end">
                        <IndianRupee size={18} /> {load.freightCharge || '4,500'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">
                      {load.listingId?.productName}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {load.listingId?.quantity} {load.listingId?.unit} • Bulk Shipment
                    </p>
                  </div>

                  <div className="space-y-3 py-4 border-y border-gray-50">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-green-600 mt-1" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup</p>
                        <p className="text-sm font-bold text-gray-700">{load.pickupAddress || 'Bikaner, Rajasthan'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-blue-600 mt-1" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery</p>
                        <p className="text-sm font-bold text-gray-700">{load.deliveryAddress || 'Delhi Mandi'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex-1 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={12} />
                    Posted {new Date(load.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button 
                    onClick={() => handleAccept(load._id)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    Accept <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Banner */}
        <div className="card bg-gray-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2),transparent)]" />
          <div className="relative z-10 space-y-2">
            <h3 className="text-2xl font-black italic">Ready to hit the road?</h3>
            <p className="text-gray-400 max-w-md">Accepting a load commits you to the timeline. Ensure your vehicle is ready for the specified quantity.</p>
          </div>
          <div className="relative z-10 flex gap-4">
            <div className="text-center px-6">
              <p className="text-3xl font-black">98%</p>
              <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">SLA Match</p>
            </div>
            <div className="text-center px-6">
              <p className="text-3xl font-black">4.9</p>
              <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AvailableLoadsPage;
