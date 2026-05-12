import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  X, 
  TrendingUp, 
  Info,
  CheckCircle,
  Truck
} from 'lucide-react';
// @ts-ignore
import farmerService from '../../services/farmerService';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import toast from 'react-hot-toast';

const categories = [
  { id: 'grains', label: 'Grains & Pulses', varieties: ['Wheat', 'Rice', 'Corn', 'Bajra', 'Moong', 'Arhar'] },
  { id: 'vegetables', label: 'Vegetables', varieties: ['Potato', 'Onion', 'Tomato', 'Cabbage', 'Cauliflower', 'Peas'] },
  { id: 'fruits', label: 'Fruits', varieties: ['Mango', 'Apple', 'Banana', 'Grapes', 'Pomegranate'] },
  { id: 'spices', label: 'Spices', varieties: ['Turmeric', 'Cumin', 'Red Chili', 'Coriander', 'Black Pepper'] },
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
      // Simulating AI Analysis for now
      setTimeout(() => {
        setAiAnalysis({
          grade: 'A',
          metrics: {
            moisture: parseFloat(formData.moisture) || 12.5,
            purity: parseFloat(formData.purity) || 98.2,
            size: 8.5,
            color: 'Natural'
          },
          pricePrediction: {
            marketAvg: parseFloat(formData.price) * 0.95 || 2050,
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Add New Produce Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Variety *</label>
              <select
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select variety</option>
                {categories.find(c => c.id === formData.category)?.varieties.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity (Quintal) *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price per Quintal (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input"
                placeholder="e.g., 2150"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="Describe your produce quality, farming practices, etc."
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Quality Parameters</h2>
            <button
              type="button"
              onClick={analyzeWithAI}
              disabled={analyzing}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm hover:shadow-lg transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              {analyzing ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Moisture Content (%) *</label>
              <input
                type="number"
                name="moisture"
                value={formData.moisture}
                onChange={handleChange}
                className="input"
                step="0.1"
                placeholder="e.g., 12.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Purity (%)</label>
              <input
                type="number"
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                className="input"
                step="0.1"
                placeholder="e.g., 98"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Protein Content (%)</label>
              <input
                type="number"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                className="input"
                step="0.1"
                placeholder="e.g., 11.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="Village/City, State"
              />
            </div>
          </div>

          {aiAnalysis && (
            <div className="mt-4">
              <AIGradeCard 
                grade={aiAnalysis.grade}
                qualityMetrics={aiAnalysis.metrics}
                pricePrediction={aiAnalysis.pricePrediction}
              />
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Product Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.qualityImages.map((image: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={image.preview}
                  alt={`Product ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index, 'qualityImages')}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="border-2 border-dashed border-gray-300 dark:border-dark-300 rounded-lg flex flex-col items-center justify-center h-32 cursor-pointer hover:border-primary-500 transition-colors">
              <Camera className="w-8 h-8 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Upload Image</span>
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

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Delivery Terms</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Arrangement</label>
              <select
                name="deliveryTerms"
                value={formData.deliveryTerms}
                onChange={handleChange}
                className="input"
              >
                <option value="buyer-arranges">Buyer Arranges Pickup</option>
                <option value="seller-delivers">Seller Delivers (Extra charge)</option>
                <option value="transporter">Platform Transporter</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/farmer/listings')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Listing...
              </div>
            ) : (
              'Create Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListingPage;
