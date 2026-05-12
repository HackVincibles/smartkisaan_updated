import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Leaf, Droplets, Scale } from 'lucide-react';

interface AIGradeCardProps {
  grade: string;
  qualityMetrics: {
    moisture: string;
    purity: string;
    protein: string;
    weight: string;
  };
  pricePrediction?: {
    estimatedPrice: number;
    minPrice: number;
    maxPrice: number;
    confidence: number;
    bestTimeframe: string;
  };
}

const AIGradeCard = ({ grade, qualityMetrics, pricePrediction }: AIGradeCardProps) => {
  const getGradeColor = (grade: string) => {
    switch(grade?.toLowerCase()) {
      case 'excellent': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'average': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  const getGradeBg = (grade: string) => {
    switch(grade?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/20';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'average': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };
  
  const metrics = [
    { label: 'Moisture', value: qualityMetrics?.moisture || '12.5%', icon: Droplets, ideal: '<13%' },
    { label: 'Purity', value: qualityMetrics?.purity || '98%', icon: Award, ideal: '>95%' },
    { label: 'Protein', value: qualityMetrics?.protein || '11.5%', icon: Leaf, ideal: '>10%' },
    { label: 'Weight', value: qualityMetrics?.weight || '100 Quintal', icon: Scale, ideal: 'Standard' }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">AI Quality Assessment</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Based on current market standards
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${getGradeBg(grade)}`}>
          <span className={`text-xl font-bold ${getGradeColor(grade)}`}>
            {grade || 'Excellent'}
          </span>
        </div>
      </div>
      
      {/* Quality Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <metric.icon className="w-5 h-5 mx-auto mb-2 text-primary-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
            <p className="text-lg font-semibold">{metric.value}</p>
            <p className="text-xs text-green-600 dark:text-green-400">Ideal: {metric.ideal}</p>
          </div>
        ))}
      </div>
      
      {/* Price Prediction */}
      {pricePrediction && (
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <span className="font-semibold">AI Price Prediction</span>
            </div>
            <span className="text-2xl font-bold text-primary-600">
              ₹{pricePrediction.estimatedPrice}/Quintal
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Range: ₹{pricePrediction.minPrice} - ₹{pricePrediction.maxPrice}
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${pricePrediction.confidence}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Confidence: {pricePrediction.confidence}% • Best to sell within {pricePrediction.bestTimeframe}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default AIGradeCard;
