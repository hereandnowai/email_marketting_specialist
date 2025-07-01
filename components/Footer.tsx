
import React from 'react';
import { BRANDING_CONFIG, BlogIcon, LinkedInIcon, InstagramIcon, GitHubIcon, XIcon, YouTubeIcon } from '../constants';

const socialIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  blog: BlogIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  github: GitHubIcon,
  x: XIcon,
  youtube: YouTubeIcon,
};

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: BRANDING_CONFIG.brand.colors.secondary }} className="py-8 mt-12 border-t border-gray-700">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          {Object.entries(BRANDING_CONFIG.brand.socialMedia).map(([platform, url]) => {
            const IconComponent = socialIcons[platform];
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform}
                className="hover:opacity-75 transition-opacity"
                style={{ color: BRANDING_CONFIG.brand.colors.primary }}
              >
                {IconComponent ? <IconComponent className="h-6 w-6" /> : platform}
              </a>
            );
          })}
        </div>
        <p className="text-sm" style={{ color: BRANDING_CONFIG.brand.colors.primary, opacity: 0.8 }}>
          &copy; {new Date().getFullYear()} {BRANDING_CONFIG.brand.longName}. All rights reserved.
          <br />
          Developed by Bilmia M Binson.
        </p>
        <p className="text-xs mt-1" style={{ color: BRANDING_CONFIG.brand.colors.primary, opacity: 0.6 }}>
          Contact: {BRANDING_CONFIG.brand.email} | {BRANDING_CONFIG.brand.mobile}
        </p>
         <p className="text-xs mt-2" style={{ color: BRANDING_CONFIG.brand.colors.primary, opacity: 0.6 }}>
          Powered by <a href={BRANDING_CONFIG.brand.website} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80">{BRANDING_CONFIG.brand.shortName}</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
