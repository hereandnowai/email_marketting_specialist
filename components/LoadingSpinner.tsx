
import React from 'react';
import { BRANDING_CONFIG } from '../constants';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div 
        className="animate-spin rounded-full h-6 w-6 border-b-2"
        style={{ borderColor: BRANDING_CONFIG.brand.colors.primary, borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent' }}
      ></div>
      <span className="ml-2 text-sm" style={{color: BRANDING_CONFIG.brand.colors.secondary}}>Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
