
import React from 'react';
import { BRANDING_CONFIG } from '../constants';

interface TextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ className, ...props }) => {
  return (
    <textarea
      {...props}
      className={`
        w-full p-3 border rounded-md shadow-sm 
        bg-gray-700 border-gray-600 text-gray-200 
        focus:ring-2 focus:outline-none transition-colors duration-150
        ${className}
      `}
      style={{
        borderColor: BRANDING_CONFIG.brand.colors.secondary, // Or a neutral dark border
        color: BRANDING_CONFIG.brand.colors.primary, // Text color when typing
        backgroundColor: `rgba(0,0,0,0.2)`, // Slightly transparent dark background
        caretColor: BRANDING_CONFIG.brand.colors.primary,
        '--tw-ring-color': BRANDING_CONFIG.brand.colors.primary // For focus ring
      } as React.CSSProperties} // Cast to React.CSSProperties to allow custom properties
    />
  );
};

export default TextAreaInput;
