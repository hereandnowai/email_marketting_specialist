
import React from 'react';
import { BRANDING_CONFIG, MenuIcon } from '../constants';

interface HeaderProps {
  toggleSidebar?: () => void; // Optional for mobile
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header style={{ backgroundColor: BRANDING_CONFIG.brand.colors.secondary }} className="py-4 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Hamburger Menu for Mobile */}
          {toggleSidebar && (
            <button 
              onClick={toggleSidebar} 
              className="md:hidden p-2 mr-3 rounded-md hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-inset"
              style={{ color: BRANDING_CONFIG.brand.colors.primary, backgroundColor: BRANDING_CONFIG.brand.colors.primary + '10', '--tw-ring-color': BRANDING_CONFIG.brand.colors.primary } as React.CSSProperties}
              aria-label="Open menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}
          <img 
            src={BRANDING_CONFIG.brand.logo.title} 
            alt={`${BRANDING_CONFIG.brand.shortName} Logo`} 
            className="h-12 sm:h-14 w-auto mr-3 sm:mr-4" // Slightly adjusted size
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
              {BRANDING_CONFIG.brand.shortName}
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: BRANDING_CONFIG.brand.colors.primary, opacity: 0.8 }}>
              AI Email Marketing Specialist
            </p>
          </div>
        </div>
        <p className="hidden sm:block text-sm sm:text-md italic" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
          "{BRANDING_CONFIG.brand.slogan}"
        </p>
      </div>
    </header>
  );
};

export default Header;
