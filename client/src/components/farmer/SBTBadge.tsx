import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, CheckCircle, Star } from 'lucide-react';
import { useBlockchain } from '../../hooks/useBlockchain';

interface SBTBadgeProps {
  badge: {
    type: string;
    name: string;
    description: string;
    issuanceDate?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const SBTBadge = ({ badge, size = 'md', showDetails = false }: SBTBadgeProps) => {
  const { verifyTrustReceipt } = useBlockchain();
  
  const getBadgeIcon = (type: string) => {
    switch(type) {
      case 'trust': return Shield;
      case 'quality': return Star;
      case 'verified': return CheckCircle;
      default: return Award;
    }
  };
  
  const BadgeIcon = getBadgeIcon(badge.type);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
    >
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg`}>
        <BadgeIcon className="w-1/2 h-1/2 text-white" />
      </div>
      
      {showDetails && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
          <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
            <p className="font-semibold">{badge.name}</p>
            <p className="text-gray-300 text-xs">{badge.description}</p>
            {badge.issuanceDate && (
              <p className="text-gray-400 text-xs mt-1">Issued: {badge.issuanceDate}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SBTBadge;
