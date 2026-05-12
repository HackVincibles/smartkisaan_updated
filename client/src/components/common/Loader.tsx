import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  fullScreen?: boolean;
}

const Loader = ({ fullScreen = false }: LoaderProps) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin border-t-primary-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-dark-100 z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

export default Loader;
