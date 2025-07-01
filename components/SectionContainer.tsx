
import React from 'react';
import { BRANDING_CONFIG } from '../constants';

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  isLoading: boolean;
  actionButtonText?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ title, children, onSubmit, isLoading, actionButtonText = "Generate" }) => {
  return (
    <div 
      className="p-6 sm:p-8 rounded-xl shadow-2xl" 
      style={{ 
        backgroundColor: `rgba(0, 0, 0, 0.1)`, // Slightly more transparent than secondary for depth
        border: `1px solid ${BRANDING_CONFIG.brand.colors.primary}30` // Primary color with low opacity for border
      }}
    >
      <h2 
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: BRANDING_CONFIG.brand.colors.primary }}
      >
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default SectionContainer;

