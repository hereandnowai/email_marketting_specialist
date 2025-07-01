
import React from 'react';
import { BRANDING_CONFIG } from '../constants';
import { AppPage } from '../types';

interface SidebarItemProps {
  page: AppPage;
  label: string;
  isActive: boolean;
  onClick: (page: AppPage) => void;
  // Add icon prop later if needed
  // icon?: React.ReactNode; 
}

const SidebarItem: React.FC<SidebarItemProps> = ({ page, label, isActive, onClick }) => {
  const activeClasses = `font-semibold shadow-inner rounded-md`;
  const inactiveClasses = `opacity-80 hover:opacity-100 hover:bg-opacity-20`;

  return (
    <li>
      <button
        onClick={() => onClick(page)}
        className={`
          w-full text-left px-4 py-3 text-sm transition-all duration-150 ease-in-out 
          focus:outline-none focus:ring-1 focus:ring-opacity-50 focus:ring-[${BRANDING_CONFIG.brand.colors.primary}]
          flex items-center space-x-3 group
          ${isActive ? activeClasses : inactiveClasses}
        `}
        style={{ 
          color: BRANDING_CONFIG.brand.colors.primary, 
          backgroundColor: isActive ? BRANDING_CONFIG.brand.colors.primary + '20' : 'transparent', // Light primary bg for active
          borderColor: isActive ? BRANDING_CONFIG.brand.colors.primary : 'transparent', // For active border
        } as React.CSSProperties}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Icon placeholder if we add icons later */}
        {/* {icon && <span className={`w-5 h-5 ${isActive ? 'text-yellow-300' : 'text-yellow-400 group-hover:text-yellow-300'}`}>{icon}</span>} */}
        <span>{label}</span>
      </button>
    </li>
  );
};

export default SidebarItem;
