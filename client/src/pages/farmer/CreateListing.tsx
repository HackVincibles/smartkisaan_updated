import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { 
  Camera, Upload, X, CheckCircle2, 
  Sprout, Scale, MapPin, IndianRupee, 
  ArrowRight, Image as ImageIcon 
} from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';

const CreateListing = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImages([...images, imageSrc]);
      setShowCamera(false);
    }
  }, [webcamRef, images]);

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Create New Listing</h1>
          <p className="text-gray-500 mt-2">Sell your harvest with AI-backed quality assurance</p>
        </header>

        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 px-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-gray-300 border border-gray-100'
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s ? 'text-green-600' : 'text-gray-300'}`}>
                {s === 1 ? 'Media' : s === 2 ? 'Details' : 'Pricing'}
              </span>
            </div>
          ))}
          <div className="absolute top-[182px] left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gray-100 -z-10" />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
          {step === 1 && (
            <div className="animate-in fade-in duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Camera className="w-6 h-6 text-green-600" /> Capture Harvest Quality
              </h3>
              
              {showCamera ? (
                <div className="relative rounded-3xl overflow-hidden bg-black aspect-square mb-6">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                    <button 
                      onClick={() => setShowCamera(false)}
                      className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={capture}
                      className="p-5 bg-green-600 rounded-full text-white shadow-xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <Camera className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-3xl hover:border-green-600 hover:bg-green-50 transition-all group"
                  >
                    <div className="p-4 bg-green-100 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">Open Camera</span>
                  </button>
                  <label className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-600 hover:bg-blue-50 cursor-pointer transition-all group">
                    <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Upload className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-bold text-gray-600">Upload Photo</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              )}

              {/* Preview Grid */}
              {images.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-4 mb-8 scrollbar-hide">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-green-500">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={nextStep}
                disabled={images.length === 0}
                className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                Proceed to Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Crop Specifications</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Crop Name</label>
                  <div className="relative">
                    <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all" placeholder="e.g. Wheat (Hybrid)" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 ml-1">Quantity (KG)</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="number" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all" placeholder="500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 ml-1">Harvest Date</label>
                    <input type="date" className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={prevStep} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Back</button>
                <button onClick={nextStep} className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 flex items-center justify-center gap-2 transition-all">
                  Next Step <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing & Delivery</h3>
              <div className="space-y-6">
                <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-green-600 uppercase tracking-widest">Recommended</div>
                      <div className="text-lg font-black text-green-900">â‚¹2,200 - â‚¹2,450 / KG</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-green-600 bg-white px-2 py-1 rounded-full border border-green-100">Live Mandi</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">Your Asking Price (per KG)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="number" className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-600 focus:outline-none transition-all text-xl font-black text-green-600" placeholder="2300" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button onClick={prevStep} className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Back</button>
                <button className="flex-[2] py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 flex items-center justify-center gap-2 transition-all">
                  Publish Listing <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateListing;

