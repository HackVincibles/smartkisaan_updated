import React, { useState } from 'react';
import { 
  Sprout, Scale, MapPin, IndianRupee, 
  ArrowRight, CheckCircle2, ClipboardList
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/api/client';
import { toast } from 'sonner';

const CreateDemand = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    targetPrice: '',
    location: '',
    deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/buyer/demands', formData);
      toast.success('Demand posted successfully! Farmers will start bidding soon.');
    } catch (e) {
      toast.error('Failed to post demand');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Post Bulk Demand</h1>
          <p className="text-gray-500 mt-2">Let farmers compete to provide you the best rates</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">What do you need?</label>
              <div className="relative">
                <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all" 
                  placeholder="e.g. Organic Basmati Rice" 
                  value={formData.cropName}
                  onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Total Quantity (KG)</label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="number"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all" 
                    placeholder="1000"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Target Price (per KG)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="number"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all font-bold text-green-600" 
                    placeholder="85"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Delivery Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all" 
                  placeholder="Warehouse Address, City" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black shadow-xl shadow-gray-100 flex items-center justify-center gap-2 transition-all"
          >
            Post Demand <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateDemand;

