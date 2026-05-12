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
  Zap,
  Shield,
  Workflow,
  Cpu,
  Globe,
  Database,
  Target,
  MoreHorizontal,
  ChevronDown,
  Navigation,
  FileText,
  Activity,
  Layers,
  ArrowUpRight,
  Boxes,
  Truck,
  ZapOff,
  Radio,
  Signal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      toast.success('Demand signal broadcasted successfully!');
    } catch (e) {
      toast.error('Failed to broadcast demand signal');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 space-y-20 fade-in">
      {/* Strategic Sourcing Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            Demand_Emission_Module v2.0.0 [ACTIVE]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Emit <span className="not-italic text-secondary">Demand.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Broadcast institutional procurement signals to the <span className="text-gray-950 font-black italic">global supply rail</span> and receive hyper-competitive farm-direct quotations.
          </p>
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
            <div className="stitch-card p-8 bg-white shadow-2xl shadow-gray-200/50 flex items-center gap-6 group hover:rotate-1 transition-transform">
                <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Signal size={28} className="animate-pulse" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">SIGNAL_STATUS</p>
                    <p className="text-xl font-black text-gray-950 italic tracking-tighter leading-none">OPTIMAL_UPLINK</p>
                </div>
            </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
            <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">SIGNAL</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16 items-start px-4">
        {/* Left Column: Intelligence Matrix */}
        <div className="lg:col-span-5 space-y-12">
          <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 space-y-12 relative overflow-hidden group">
            <div className="space-y-6 relative z-10">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">Broadcasting_Protocols</h3>
                <div className="space-y-8">
                    {[
                      { icon: Zap, title: 'NEURAL_REACH', desc: 'Notify 5,000+ verified supplier nodes in <250ms latency.', color: 'text-secondary bg-secondary/5' },
                      { icon: Shield, title: 'ESCROW_VAULT', desc: 'Every signal is backed by non-custodial cryptographic settlement.', color: 'text-emerald-500 bg-emerald-500/5' },
                      { icon: Activity, title: 'DIRECT_MARKET', desc: 'Zero intermediary friction. Farm-direct pricing telemetry.', color: 'text-primary bg-primary/5' }
                    ].map((feature, i) => (
                      <div key={i} className="flex gap-8 group/item">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-inner border border-current/10 transition-transform duration-700 group-hover/item:rotate-12 ${feature.color}`}>
                          <feature.icon size={28} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1.5 pt-1">
                          <h4 className="font-black text-gray-950 uppercase italic tracking-tighter text-xl group-hover/item:text-secondary transition-colors">{feature.title}</h4>
                          <p className="text-sm text-gray-400 font-medium leading-relaxed italic">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                </div>
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-[2000ms]">
                <Radio size={200} />
            </div>
          </div>

          <div className="stitch-card p-12 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/40">
            <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4 text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic">
                    <Info size={16} className="text-secondary" /> PRO_INTELLIGENCE
                </div>
                <h4 className="text-3xl font-black italic tracking-tighter leading-tight uppercase">High-Fidelity specs reduce <span className="text-secondary">procurement cycles</span> by 40%.</h4>
                <p className="text-white/40 text-lg font-medium leading-relaxed italic">
                  Inject detailed environmental specs, moisture parameters, and <span className="text-white font-black underline decoration-secondary/20 underline-offset-8">certification requirements</span> to attract tier-1 institutional suppliers.
                </p>
                <div className="pt-4">
                    <div className="flex -space-x-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-950 bg-gray-900 flex items-center justify-center text-[10px] font-black text-white/20">U{i}</div>
                        ))}
                        <div className="w-12 h-12 rounded-full border-4 border-gray-950 bg-secondary flex items-center justify-center text-[10px] font-black text-white">+8K</div>
                    </div>
                </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] group-hover:opacity-30 transition-opacity"></div>
          </div>
        </div>

        {/* Right Column: Sourcing Terminal Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="stitch-card p-12 md:p-16 bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] border-none space-y-16 group/form relative overflow-hidden">
            <div className="space-y-12 relative z-10">
              {/* Product Info Segment */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-1.5 bg-secondary rounded-full"></div>
                    <h3 className="font-black text-[11px] uppercase tracking-[0.6em] text-gray-300 italic">Asset_Specifications</h3>
                </div>
                
                <div className="space-y-4 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 ml-2 italic group-focus-within/input:text-secondary transition-colors">COMMODITY_VARIETY</label>
                  <div className="relative">
                    <Boxes className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-200 group-focus-within/input:text-secondary transition-colors" />
                    <input 
                      className="w-full pl-20 pr-8 py-10 bg-gray-50 border-none rounded-[2.5rem] focus:ring-12 focus:ring-secondary/5 transition-all font-black text-[14px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-inner" 
                      placeholder="e.g. ORGANIC_BASMATI_RICE_PUSA_1121" 
                      value={formData.cropName}
                      onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4 group/input">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 ml-2 italic">TARGET_QUANTITY</label>
                    <div className="relative">
                      <Scale className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-200 group-focus-within/input:text-secondary transition-colors" />
                      <input 
                        type="number"
                        className="w-full pl-20 pr-24 py-10 bg-gray-50 border-none rounded-[2.5rem] focus:ring-12 focus:ring-secondary/5 transition-all font-black text-[18px] text-gray-950 italic shadow-inner" 
                        placeholder="500"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        required
                      />
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">QTL</span>
                    </div>
                  </div>
                  <div className="space-y-4 group/input">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 ml-2 italic">CEILING_PRICE</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-200 group-focus-within/input:text-secondary transition-colors" />
                      <input 
                        type="number"
                        className="w-full pl-20 pr-24 py-10 bg-gray-50 border-none rounded-[2.5rem] focus:ring-12 focus:ring-secondary/5 transition-all font-black text-[18px] text-secondary italic shadow-inner" 
                        placeholder="2150"
                        value={formData.targetPrice}
                        onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                        required
                      />
                      <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">/QTL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics Grid Segment */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-1.5 bg-secondary rounded-full"></div>
                    <h3 className="font-black text-[11px] uppercase tracking-[0.6em] text-gray-300 italic">Logistics_Timing_Rail</h3>
                </div>
                
                <div className="space-y-4 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 ml-2 italic">DESTINATION_TERMINAL</label>
                  <div className="relative">
                    <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-200 group-focus-within/input:text-secondary transition-colors" />
                    <input 
                      className="w-full pl-20 pr-8 py-10 bg-gray-50 border-none rounded-[2.5rem] focus:ring-12 focus:ring-secondary/5 transition-all font-black text-[14px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-inner" 
                      placeholder="e.g. NH-8_INDUSTRIAL_ESTATE_JAIPUR_NODE" 
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 group/input">
                  <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 ml-2 italic">PROCUREMENT_EXPIRY</label>
                  <div className="relative">
                    <Calendar className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-200 group-focus-within/input:text-secondary transition-colors" />
                    <input 
                      type="date"
                      className="w-full pl-20 pr-10 py-10 bg-gray-50 border-none rounded-[2.5rem] focus:ring-12 focus:ring-secondary/5 transition-all font-black text-[14px] text-gray-950 shadow-inner" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 group/input">
                <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 ml-2 italic">NEURAL_DESC_SPECIFICATIONS</label>
                <textarea 
                  rows={4}
                  className="w-full px-10 py-10 bg-gray-50 border-none rounded-[2.5rem] focus:ring-12 focus:ring-secondary/5 transition-all font-bold text-[14px] text-gray-700 placeholder:text-gray-200 italic shadow-inner resize-none" 
                  placeholder="Incorporate moisture vectors, packaging constraints, or mandatory certificates..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-10 relative z-10">
              <button 
                type="submit"
                className="w-full py-10 bg-gray-950 text-white rounded-[3rem] font-black text-[16px] uppercase tracking-[0.8em] italic hover:bg-secondary shadow-2xl shadow-gray-900/20 hover:shadow-secondary/30 transition-all flex items-center justify-center gap-10 group/btn relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-10">LAUNCH_DEMAND_EMISSION <ArrowRight className="w-10 h-10 group-hover/btn:translate-x-4 transition-transform duration-700" /></span>
                <div className="absolute inset-0 bg-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              </button>
              <div className="flex items-center justify-center gap-4 mt-10 text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic">
                <Signal size={16} className="text-secondary animate-pulse" />
                INSTANT_SMS_EMAIL_UPLINK_TO_SUPPLIER_NODES
              </div>
            </div>
            
            {/* Subtle Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
            <div className="absolute top-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none">
                <Target size={300} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDemand;
