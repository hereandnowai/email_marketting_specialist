
import React from 'react';
import { BRANDING_CONFIG } from '../constants';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextInput: React.FC<TextInputProps> = ({ className, ...props }) => {
  return (
    <input
      type="text"
      {...props}
      className={`
        w-full p-3 border rounded-md shadow-sm 
        bg-gray-700 border-gray-600 text-gray-200 
        focus:ring-2 focus:outline-none transition-colors duration-150
        ${className}
      `}
      style={{
        borderColor: BRANDING_CONFIG.brand.colors.secondary,
        color: BRANDING_CONFIG.brand.colors.primary,
        backgroundColor: `rgba(0,0,0,0.2)`,
        caretColor: BRANDING_CONFIG.brand.colors.primary,
        '--tw-ring-color': BRANDING_CONFIG.brand.colors.primary
      } as React.CSSProperties}
    />
  );
};

export default TextInput;
