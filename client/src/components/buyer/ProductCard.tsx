import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Shield, Star, Scale } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    location: string;
    aiGrade: string;
    farmerName: string;
    rating: number;
    image?: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card hover:shadow-lg transition-all"
    >
      <div className="aspect-video bg-gray-100 dark:bg-dark-300 relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 rounded-lg bg-white/90 dark:bg-dark-200/90 backdrop-blur text-xs font-bold text-primary-600 flex items-center gap-1 shadow-sm">
            <Shield className="w-3 h-3" />
            Grade {product.aiGrade || 'A'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-lg truncate">{product.name}</h4>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Star className="w-3 h-3 fill-current" />
            {product.rating || '4.5'}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <MapPin className="w-3 h-3" />
          {product.location}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm font-medium">
            <Scale className="w-4 h-4 text-gray-400" />
            {product.quantity} Quintal
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary-600">{formatCurrency(product.price)}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Per Quintal</p>
          </div>
        </div>
        
        <Link 
          to={`/buyer/product/${product.id}`}
          className="btn-primary w-full py-2 text-sm"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
