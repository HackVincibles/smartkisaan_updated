import React, { useState } from 'react';
import { 
  Sprout, 
  Scale, 
  MapPin, 
  IndianRupee, 
  ArrowRight, 
  CheckCircle2, 
  ClipboardList,
  Calendar,
  Info,
  TrendingUp,
  Zap
} from 'lucide-react';
// @ts-ignore
import apiClient from '../../services/api';
import { toast } from 'react-hot-toast';

const CreateDemand = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    targetPrice: '',
    location: '',
    deadline: '',
    description: ''
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
    <div className="max-w-6xl mx-auto pb-20">
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Information & Visuals */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <TrendingUp size={14} />
              Supply Discovery
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
              Create New Demand
            </h1>
            <p className="text-gray-500 font-medium text-lg leading-relaxed">
              Tell us what you need. We'll notify our network of verified suppliers and they'll send you their best offers directly.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, title: 'Instant Reach', desc: 'Notify 5000+ verified farmers in seconds.' },
              { icon: Shield, title: 'Escrow Protected', desc: 'Secure blockchain transactions by default.' },
              { icon: IndianRupee, title: 'Direct Pricing', desc: 'No middlemen. Get the best rates from the source.' }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{feature.title}</h4>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Pro Tip</p>
            <h4 className="text-xl font-bold mb-4">Detailed specs get 40% faster responses.</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Include moisture content, variety names, and packaging requirements to get more accurate bids from farmers.
            </p>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20"></div>
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl shadow-blue-50/50 border border-gray-100 space-y-10">
            <div className="space-y-8">
              {/* Product Info */}
              <div className="space-y-6">
                <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Produce Details</h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Commodity & Variety</label>
                  <div className="relative group">
                    <Sprout className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-900 placeholder:text-gray-300" 
                      placeholder="e.g. Organic Basmati Rice (Pusa-1121)" 
                      value={formData.cropName}
                      onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Quantity Needed</label>
                    <div className="relative group">
                      <Scale className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="number"
                        className="w-full pl-14 pr-16 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-900" 
                        placeholder="500"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Quintals</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Target Price</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                      <input 
                        type="number"
                        className="w-full pl-14 pr-16 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-black text-blue-600 text-xl" 
                        placeholder="2150"
                        value={formData.targetPrice}
                        onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                        required
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">/ Qtl</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics & Timing */}
              <div className="space-y-6">
                <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Logistics & Timing</h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Warehouse Delivery Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-900 placeholder:text-gray-300" 
                      placeholder="e.g. NH-8 Industrial Estate, Jaipur" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Procurement Deadline</label>
                  <div className="relative group">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="date"
                      className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-900" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Additional Requirements</label>
                <textarea 
                  rows={4}
                  className="w-full px-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-medium text-gray-700 placeholder:text-gray-300" 
                  placeholder="Include moisture requirements, quality certificates, or packaging specs..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-100 hover:shadow-blue-200 transition-all flex items-center justify-center gap-4 group"
              >
                Launch Demand Request
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-2 mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Info size={14} className="text-blue-500" />
                Suppliers will receive instant SMS & Email notifications
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDemand;

