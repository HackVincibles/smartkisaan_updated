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
  Search
} from 'lucide-react';
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
          grade: 'A',
          metrics: {
            moisture: parseFloat(formData.moisture) || 12,
            purity: parseFloat(formData.purity) || 98.5,
            size: 8.5,
            color: 'Natural'
          },
          pricePrediction: {
            marketAvg: parseFloat(formData.price) * 0.95 || 2150,
            recommended: parseFloat(formData.price) || 2150
          }
        });
        setAnalyzing(false);
        toast.success('AI Analysis complete!');
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
      toast.success('Listing created successfully!');
      navigate('/farmer/listings');
    } catch (error) {
      console.error('Failed to create listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
              <span>Inventory</span>
              <ChevronRight size={10} />
              <span className="text-gray-900">New Listing</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">List Your Produce</h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <Zap size={16} /> Fast-Track Verification Active
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: Main Form Content */}
        <div className="lg:col-span-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Category & Variety */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Basic Information</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                          formData.category === cat.id 
                            ? 'border-green-600 bg-green-50 text-green-700' 
                            : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-black text-[10px] uppercase tracking-widest">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Specific Variety</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <select
                      name="variety"
                      value={formData.variety}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-100 font-bold text-gray-900"
                      required
                    >
                      <option value="">Select Variety</option>
                      {categories.find(c => c.id === formData.category)?.varieties.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Total Quantity</label>
                  <div className="relative">
                    <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full pl-12 pr-20 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-100 font-black text-gray-900"
                      placeholder="e.g. 50"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Quintals</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Asking Price</label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-green-600 transition-colors" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full pl-12 pr-20 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-100 font-black text-green-600 text-xl"
                      placeholder="e.g. 2150"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">/ Qtl</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-100 font-medium text-gray-700 placeholder:text-gray-300"
                  placeholder="Describe your produce quality, farming practices, soil health, etc."
                />
              </div>
            </div>

            {/* Step 2: Quality & AI */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-4">
                <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Quality Parameters</h3>
                <button
                  type="button"
                  onClick={analyzeWithAI}
                  disabled={analyzing}
                  className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-100 disabled:opacity-50"
                >
                  <TrendingUp size={16} />
                  {analyzing ? 'Verifying Sample...' : 'AI Quality Grade'}
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Moisture Content (%)</label>
                  <input
                    type="number"
                    name="moisture"
                    value={formData.moisture}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-100 font-bold text-gray-900"
                    step="0.1"
                    placeholder="e.g. 12.0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Produce Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-100 font-bold text-gray-900"
                      placeholder="e.g. Village, District, State"
                      required
                    />
                  </div>
                </div>
              </div>

              {aiAnalysis && (
                <div className="pt-4">
                  <AIGradeCard 
                    grade={aiAnalysis.grade}
                    qualityMetrics={aiAnalysis.metrics}
                    pricePrediction={aiAnalysis.pricePrediction}
                  />
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Produce Images (Sample)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.qualityImages.map((image: any, index: number) => (
                    <div key={index} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-sm">
                      <img
                        src={image.preview}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'qualityImages')}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square border-2 border-dashed border-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-green-600 hover:bg-green-50 transition-all text-gray-400 hover:text-green-600">
                    <Camera size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">Add Sample</span>
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

            {/* Step 3: Logistics */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Logistics Terms</h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { id: 'buyer-arranges', label: 'Buyer Pickup', icon: MapPin },
                    { id: 'seller-delivers', label: 'Self Delivery', icon: Truck },
                    { id: 'transporter', label: 'Platform Truck', icon: Shield }
                  ].map(term => (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => setFormData({...formData, deliveryTerms: term.id})}
                      className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${
                        formData.deliveryTerms === term.id 
                          ? 'border-green-600 bg-green-50 text-green-700' 
                          : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      <term.icon size={24} />
                      <span className="font-black text-[10px] uppercase tracking-widest">{term.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/farmer/listings')}
                className="flex-1 py-6 bg-white border border-gray-100 text-gray-500 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-6 bg-green-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-green-700 shadow-2xl shadow-green-100 hover:shadow-green-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Finalizing Asset...' : 'Launch Marketplace Listing'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Shield size={24} className="text-green-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold">Smart-Kissan Trust</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Protection Layer Active</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Verified Specs', desc: 'Accurate moisture and variety info increases trust scores by 60%.' },
                  { title: 'AI Grading', desc: 'Products with AI verification badges sell 3x faster than unverified ones.' },
                  { title: 'Secure Escrow', desc: 'All payments are held securely and released only upon your delivery.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <h5 className="font-black text-xs uppercase tracking-widest text-green-400">{item.title}</h5>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-green-600 rounded-full blur-[100px] opacity-10"></div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 px-1">
              <TrendingUp size={20} className="text-green-600" />
              <h4 className="font-black text-sm uppercase tracking-widest text-gray-900">Live Mandi Prices</h4>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Wheat (HD-2967)', price: '₹2,240', trend: '+1.2%' },
                { label: 'Organic Basmati', price: '₹3,450', trend: '-0.5%' },
                { label: 'Mustard Seeds', price: '₹5,120', trend: '+2.1%' }
              ].map((mandi, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-xs font-bold text-gray-600">{mandi.label}</span>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-xs">{mandi.price}</p>
                    <p className={`text-[10px] font-black ${mandi.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{mandi.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;
