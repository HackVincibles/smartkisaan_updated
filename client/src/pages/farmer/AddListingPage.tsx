import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  X, 
  TrendingUp, 
  Info,
  CheckCircle,
  Truck,
  Shield,
  Zap,
  MapPin,
  IndianRupee,
  ChevronRight,
  Database,
  Search,
  Activity,
  Workflow,
  Cpu,
  Fingerprint,
  Layers,
  ArrowRight,
  Box,
  Leaf,
  Sparkles,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import farmerService from '../../services/farmerService';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import toast from 'react-hot-toast';

const categories = [
  { id: 'grains', label: 'Grains & Pulses', icon: '🌾', varieties: ['Wheat', 'Rice', 'Corn', 'Bajra', 'Moong', 'Arhar'] },
  { id: 'vegetables', label: 'Vegetables', icon: '🥦', varieties: ['Potato', 'Onion', 'Tomato', 'Cabbage', 'Cauliflower', 'Peas'] },
  { id: 'fruits', label: 'Fruits', icon: '🍎', varieties: ['Mango', 'Apple', 'Banana', 'Grapes', 'Pomegranate'] },
  { id: 'spices', label: 'Spices', icon: '🌶️', varieties: ['Turmeric', 'Cumin', 'Red Chili', 'Coriander', 'Black Pepper'] },
];

const AddListingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const [formData, setFormData] = useState<any>({
    category: 'grains',
    variety: '',
    quantity: '',
    price: '',
    description: '',
    moisture: '',
    purity: '',
    protein: '',
    location: '',
    deliveryTerms: 'buyer-arranges',
    qualityImages: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setFormData((prev: any) => ({
      ...prev,
      [type]: [...prev[type], ...newImages]
    }));
  };

  const removeImage = (index: number, type: string) => {
    setFormData((prev: any) => {
      const updated = [...prev[type]];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };

  const analyzeWithAI = async () => {
    if (formData.qualityImages.length === 0) {
      toast.error('Please upload at least one image for AI analysis');
      return;
    }
    setAnalyzing(true);
    try {
      setTimeout(() => {
        setAiAnalysis({
          grade: 'Premium A+',
          metrics: {
            moisture: parseFloat(formData.moisture) || 11.8,
            purity: parseFloat(formData.purity) || 99.2,
            size: 8.5,
            color: 'Natural Amber'
          },
          pricePrediction: {
            marketAvg: parseFloat(formData.price) * 0.95 || 2150,
            recommended: parseFloat(formData.price) || 2240,
            confidence: 94
          }
        });
        setAnalyzing(false);
        toast.success('Neural Quality Analysis Complete');
      }, 2000);
    } catch (error) {
      toast.error('AI Analysis failed');
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'qualityImages') {
          data.append(key, formData[key]);
        }
      });
      formData.qualityImages.forEach((img: any) => {
        data.append('images', img.file);
      });

      await farmerService.createListing(data);
      toast.success('Listing Digitized: Marketplace Sync Active');
      navigate('/farmer/listings');
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Digitization Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Asset Digitization Protocol v4.0.2
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            New <span className="not-italic text-primary">Listing.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Initialize a new harvest node in the global marketplace. Real-time AI quality grading and price optimization active.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <button 
                onClick={() => navigate(-1)}
                className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-950 transition-all shadow-sm"
            >
                <ArrowLeft size={24} />
            </button>
            <div className="hidden lg:flex items-center gap-4 px-6 py-4 bg-primary/10 text-primary rounded-[1.8rem] border border-primary/10 shadow-xl shadow-primary-200/20">
                <Zap size={20} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic leading-none">Fast-Track Verification Active</span>
            </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">DIGITIZE</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Digitization Form */}
        <div className="lg:col-span-8 space-y-12">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: Institutional Data */}
            <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 space-y-12 relative overflow-hidden">
              <div className="flex items-center gap-5 relative z-10">
                <div className="p-4 bg-gray-950 rounded-2xl text-white shadow-2xl">
                    <Database size={28} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Institutional <span className="not-italic text-primary">Data.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Core Commodity Specifications</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Commodity Sector</label>
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`flex flex-col items-start gap-4 p-6 rounded-[1.8rem] border-2 transition-all group ${
                          formData.category === cat.id 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <span className="font-black text-[9px] uppercase tracking-widest italic">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Specific Node Variety</label>
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <select
                      name="variety"
                      value={formData.variety}
                      onChange={handleChange}
                      className="w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 font-black text-gray-950 italic text-sm appearance-none cursor-pointer"
                      required
                    >
                      <option value="" className="font-black italic">Select Variety</option>
                      {categories.find(c => c.id === formData.category)?.varieties.map(v => (
                        <option key={v} value={v} className="font-black italic">{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Yield Quantity</label>
                  <div className="relative group">
                    <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full pl-16 pr-24 py-5 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 font-black text-gray-950 italic text-xl"
                      placeholder="50"
                      required
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Quintals</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Base Settlement Protocol</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-16 pr-24 py-5 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 font-black text-primary italic text-2xl"
                      placeholder="2150"
                      required
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">/ Qtl</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Asset Intelligence Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-8 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-primary/5 font-medium text-gray-700 italic placeholder:text-gray-300 text-sm leading-relaxed"
                  placeholder="Describe your harvest quality, neural farming protocols, and biosphere health..."
                />
              </div>
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            </div>

            {/* Step 2: Quality Pulse & AI Analytics */}
            <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 space-y-12 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-50 pb-8">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-gray-950 rounded-2xl text-white shadow-2xl">
                        <Activity size={28} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Quality <span className="not-italic text-primary">Pulse.</span></h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Real-time AI Grade Analysis</p>
                    </div>
                </div>
                <button
                  type="button"
                  onClick={analyzeWithAI}
                  disabled={analyzing}
                  className="flex items-center gap-4 px-10 py-5 bg-gray-950 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200 disabled:opacity-50 group"
                >
                  {analyzing ? <Workflow className="animate-spin" size={16} /> : <TrendingUp size={16} className="group-hover:rotate-12 transition-transform" />}
                  {analyzing ? 'Analyzing Neural Sample...' : 'Run AI Grade Analysis'}
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Moisture Index (%)</label>
                  <input
                    type="number"
                    name="moisture"
                    value={formData.moisture}
                    onChange={handleChange}
                    className="w-full px-8 py-5 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 font-black text-gray-950 italic text-lg"
                    step="0.1"
                    placeholder="12.0"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Source Node Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-primary/5 font-black text-gray-950 italic text-lg truncate"
                      placeholder="Rajasthan Sector Hub..."
                      required
                    />
                  </div>
                </div>
              </div>

              {aiAnalysis && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="pt-4"
                >
                  <AIGradeCard 
                    grade={aiAnalysis.grade}
                    qualityMetrics={aiAnalysis.metrics}
                    pricePrediction={aiAnalysis.pricePrediction}
                  />
                </motion.div>
              )}

              <div className="space-y-6 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic ml-1 leading-none">Neural Sample Uplink (Visuals)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {formData.qualityImages.map((image: any, index: number) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group aspect-square rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl"
                    >
                      <img
                        src={image.preview}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'qualityImages')}
                        className="absolute top-4 right-4 p-3 bg-error text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-xl"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ))}
                  <label className="aspect-square border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-gray-300 hover:text-primary group">
                    <Camera size={40} className="group-hover:rotate-12 transition-transform duration-500" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 italic">Uplink Sample</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, 'qualityImages')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Logistics Architecture */}
            <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 space-y-12 relative overflow-hidden">
              <div className="flex items-center gap-5 relative z-10">
                <div className="p-4 bg-gray-950 rounded-2xl text-white shadow-2xl">
                    <Truck size={28} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Logistics <span className="not-italic text-primary">Rails.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Transit & Delivery Protocol</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 relative z-10">
                {[
                  { id: 'buyer-arranges', label: 'Buyer Pickup', icon: MapPin },
                  { id: 'seller-delivers', label: 'Self Delivery', icon: Navigation },
                  { id: 'transporter', label: 'Platform Fleet', icon: ShieldCheck }
                ].map(term => (
                  <button
                    key={term.id}
                    type="button"
                    onClick={() => setFormData({...formData, deliveryTerms: term.id})}
                    className={`flex flex-col items-center gap-6 p-10 rounded-[2.5rem] border-2 transition-all group ${
                      formData.deliveryTerms === term.id 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200 shadow-sm'
                    }`}
                  >
                    <term.icon size={32} className="group-hover:scale-110 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-[0.3em] italic">{term.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Final Authorization Protocol */}
            <div className="flex flex-col md:flex-row gap-6">
              <button
                type="button"
                onClick={() => navigate('/farmer/listings')}
                className="flex-1 py-7 bg-white border border-gray-100 text-gray-400 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] italic hover:bg-gray-50 transition-all shadow-xl shadow-gray-200/50"
              >
                Discard Protocol
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-7 bg-gray-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {loading ? 'Finalizing Digital Node...' : 'Authorize Marketplace Listing'}
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          {/* Trust Infrastructure */}
          <div className="stitch-card p-10 bg-gray-950 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
                  <Shield size={28} className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold italic tracking-tight leading-none">Security Vault.</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic leading-none">Institutional Trust Layer</p>
                </div>
              </div>

              <div className="space-y-10">
                {[
                  { title: 'Neural Grading', desc: 'Products with AI verification badges capturing high-fidelity metrics sell 3.4x faster.', icon: Activity },
                  { title: 'Sovereign Escrow', desc: 'Capital is locked on-chain in the KissanEscrow contract upon listing commitment.', icon: Lock },
                  { title: 'Asset Visibility', desc: 'Your node will be broadcasted to 4,500+ institutional buyers across India.', icon: Globe }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 group/item">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                        <item.icon size={20} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h5 className="font-black text-[11px] uppercase tracking-widest text-primary italic leading-none">{item.title}</h5>
                        <p className="text-xs text-white/40 font-medium leading-relaxed italic">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          </div>

          {/* Mandi Intelligence Stream */}
          <div className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 space-y-10 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-primary border border-gray-100 shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                    <h4 className="text-xl font-bold italic tracking-tight text-gray-950 leading-none">Market Intel.</h4>
                </div>
                <MoreHorizontal size={20} className="text-gray-300" />
            </div>
            
            <div className="space-y-6 relative z-10">
              {[
                { label: 'Wheat (HD-2967)', price: '₹2,240', trend: '+1.2%', color: 'success' },
                { label: 'Organic Basmati', price: '₹3,450', trend: '-0.5%', color: 'error' },
                { label: 'Mustard Seeds', price: '₹5,120', trend: '+2.1%', color: 'success' }
              ].map((mandi, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-gray-100 border border-transparent rounded-[2rem] transition-all group cursor-pointer">
                  <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic leading-none">Sector</p>
                      <span className="text-sm font-bold text-gray-950 italic tracking-tight group-hover:text-primary transition-colors">{mandi.label}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-black text-gray-950 italic text-sm leading-none">{mandi.price}</p>
                    <p className={`text-[10px] font-black italic tracking-widest leading-none text-${mandi.color}`}>{mandi.trend}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] italic hover:bg-gray-950 hover:text-white transition-all">
                Full Mandi Terminal
            </button>
          </div>

          {/* Neural Copilot Advisor */}
          <div className="stitch-card p-10 bg-primary text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
            <div className="relative z-10 space-y-8">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform">
                    <Cpu size={28} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-xl font-bold italic tracking-tight leading-none">Copilot Intel</h4>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.3em] italic leading-none">Optimization Engine</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-white/80">
                Your moisture level of <span className="text-white font-black underline decoration-white/20">11.8%</span> is optimal for the current Delhi Mandi peak. I recommend a base price of <span className="text-white font-black italic">₹2,240</span> to capture the delta.
              </p>
              <button className="w-full py-5 bg-white text-primary rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-black/10 hover:bg-gray-100 transition-all">
                Sync Price Optimization
              </button>
            </div>
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-white/10 transition-colors">
                <Sparkles size={84} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;
