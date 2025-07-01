
import React from 'react';
import { AppPage } from '../types';
import SidebarItem from './SidebarItem';
import { BRANDING_CONFIG, CloseIcon } from '../constants';

interface SidebarProps {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, isOpen, toggleSidebar }) => {
  const pages = Object.values(AppPage);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-40 md:z-auto
          w-64 md:w-72 lg:w-80 
          transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 
          transition-transform duration-300 ease-in-out
          shadow-xl flex flex-col overflow-y-auto
        `}
        style={{ backgroundColor: BRANDING_CONFIG.brand.colors.secondary }}
        aria-label="Main Navigation"
      >
        <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: BRANDING_CONFIG.brand.colors.primary + '40' }}>
          <h2 className="text-xl font-bold" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
            {BRANDING_CONFIG.brand.shortName}
          </h2>
          <button onClick={toggleSidebar} className="md:hidden p-1 rounded-md hover:bg-opacity-20" style={{color: BRANDING_CONFIG.brand.colors.primary, backgroundColor: BRANDING_CONFIG.brand.colors.primary + '10'}} aria-label="Close menu">
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-grow p-3">
          <ul className="space-y-1">
            {pages.map((page) => (
              <SidebarItem
                key={page}
                page={page}
                label={page} // Uses enum value as label, which is already descriptive
                isActive={currentPage === page}
                onClick={(selectedPage) => {
                  onPageChange(selectedPage);
                  if(isOpen && window.innerWidth < 768) { // Close sidebar on mobile after selection
                     toggleSidebar();
                  }
                }}
              />
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t text-center" style={{ borderColor: BRANDING_CONFIG.brand.colors.primary + '40' }}>
           <p className="text-xs" style={{ color: BRANDING_CONFIG.brand.colors.primary, opacity: 0.6 }}>
            Version 1.1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
