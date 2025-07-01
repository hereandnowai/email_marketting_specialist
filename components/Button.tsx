
import React from 'react';
import { BRANDING_CONFIG } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ className, children, variant = 'primary', ...props }) => {
  const primaryStyles = `text-gray-900 hover:opacity-90`;
  const secondaryStyles = `bg-transparent hover:bg-opacity-20 border-2`;

  return (
    <button
      {...props}
      className={`
        px-6 py-3 rounded-md font-semibold shadow-md transition-all duration-150 ease-in-out 
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'primary' ? primaryStyles : secondaryStyles}
        ${className}
      `}
      style={{
        backgroundColor: variant === 'primary' ? BRANDING_CONFIG.brand.colors.primary : (props.disabled ? 'transparent' : 'transparent'),
        color: variant === 'primary' ? BRANDING_CONFIG.brand.colors.secondary : BRANDING_CONFIG.brand.colors.primary,
        borderColor: variant === 'secondary' ? BRANDING_CONFIG.brand.colors.primary : 'transparent',
        '--tw-ring-color': BRANDING_CONFIG.brand.colors.primary, // For focus ring
         opacity: props.disabled ? 0.6 : 1,
      } as React.CSSProperties}
    >
      {children}
    </button>
  );
};

export default Button;
