import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-primary-700 font-medium">Processing...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
