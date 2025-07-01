
import React from 'react';
import { BRANDING_CONFIG } from '../constants';
import { AppPage } from '../types'; // Import AppPage for consistency, though not used for linking here

const WelcomeSection: React.FC = () => {
  const primaryColor = BRANDING_CONFIG.brand.colors.primary;
  // const secondaryColorText = BRANDING_CONFIG.brand.colors.secondary; // For contrast if needed on light backgrounds.
  const textColor = '#E0E0E0'; // Main text color on dark background
  const highlightTextColor = primaryColor; // For headings and important bits

  const sectionStyle: React.CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, 0.1)`,
    border: `1px solid ${primaryColor}30`,
    color: textColor,
    padding: '2rem', // Increased padding
    borderRadius: '1rem', // More rounded corners
  };

  const headingStyle: React.CSSProperties = {
    color: highlightTextColor,
  };

  const subHeadingStyle: React.CSSProperties = {
    color: highlightTextColor,
    opacity: 0.9,
  };
  
  const linkStyle: React.CSSProperties = {
    color: primaryColor,
    textDecoration: 'underline',
  };

  return (
    <div className="p-6 sm:p-8 rounded-xl shadow-2xl animate-fadeIn" style={sectionStyle}>
      <h2 className="text-4xl font-bold mb-8 text-center" style={headingStyle}>
        Welcome to the AI Email Marketing Specialist!
      </h2>

      <p className="mb-6 text-lg text-center">
        Your intelligent assistant for crafting impactful email marketing campaigns, brought to you by the <strong style={headingStyle}>{BRANDING_CONFIG.brand.longName}</strong>. 
        Powered by Google's Gemini AI, this tool helps you analyze customer data, generate personalized content, optimize send times, and much more.
      </p>
      
      <p className="mb-8 text-md italic text-center" style={{color: primaryColor, opacity: 0.8}}>
        "{BRANDING_CONFIG.brand.slogan}"
      </p>

      <h3 className="text-2xl font-semibold mt-10 mb-5" style={headingStyle}>
        Getting Started
      </h3>
      <p className="mb-6">
        Navigate through the application using the menu on the left. Each section is dedicated to a core email marketing capability:
      </p>

      <div className="space-y-8">
        <div>
          <h4 className="text-xl font-semibold mb-2" style={subHeadingStyle}>{AppPage.CustomerAnalysis}</h4>
          <p className="mb-1">
            Input raw customer data (demographics, purchase history, etc.) to generate profiles, segments, personalization opportunities, content themes, product suggestions, and optimal email frequency/timing.
          </p>
          <p className="text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Detailed and structured customer data yields more insightful AI analysis.</p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2" style={subHeadingStyle}>{AppPage.EmailGeneration}</h4>
          <p className="mb-1">
            Specify your target segment, campaign goals, product focus, offers, brand voice, and customer insights. The AI generates subject lines, preview text, HTML email body, CTAs, and personalization notes.
          </p>
          <p className="text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Use insights from "Customer Analysis" for highly relevant email copy.</p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2" style={subHeadingStyle}>{AppPage.SendTimeOptimization}</h4>
          <p className="mb-1">
            Provide historical open times, time zones, device usage, and engagement patterns. The AI recommends optimal send times, reasoning, A/B testing alternatives, and frequency strategies.
          </p>
          <p className="text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Accurate historical data improves send time predictions.</p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2" style={subHeadingStyle}>{AppPage.PerformanceAnalysis}</h4>
          <p className="mb-1">
            Enter campaign metrics (open rate, CTR, conversions). The AI summarizes performance, highlights wins/areas for improvement, and offers optimization recommendations.
          </p>
          <p className="text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Regularly analyze performance to refine your strategy.</p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2" style={subHeadingStyle}>{AppPage.ProductRecommendation}</h4>
          <p className="mb-1">
            Based on customer profiles, product catalogs, inventory, and business goals, the AI generates personalized product recommendations, including cross-sells and seasonal items.
          </p>
          <p className="text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Clear product details and specific business goals lead to targeted recommendations.</p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-2" style={subHeadingStyle}>{AppPage.EmailSequence}</h4>
          <p className="mb-1">
            Define sequence type (Welcome, Abandoned Cart, etc.), triggers, goals, and length. The AI drafts a full email series with timing, subject, content, and CTAs.
          </p>
          <p className="text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Precise triggers and goals ensure effective automated sequences.</p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mt-10 mb-5" style={headingStyle}>
        AI Assistance (Microphone Input) <span role="img" aria-label="microphone icon" style={{color: primaryColor, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>🎤</span>
      </h3>
      <p className="mb-6">
        Most text fields feature a microphone icon. Click it to activate voice input. Speak clearly, and your words will appear. Click again or pause to stop. This uses your browser's speech recognition; ensure microphone access is permitted.
      </p>

      <h3 className="text-2xl font-semibold mt-10 mb-5" style={headingStyle}>
        API Key Configuration
      </h3>
      <p className="mb-4">
        This application requires a Google Gemini API Key. It attempts to use a placeholder specified in <code>index.tsx</code>. A console warning will appear if a valid key isn't configured.
      </p>
      <p className="mb-6">
        In a real deployment, securely set the <code>API_KEY</code> environment variable. <strong >The application does not provide a UI to enter the API key.</strong>
      </p>

      <p className="mt-10 text-center text-lg">
        We hope you find this tool invaluable for your marketing endeavors!
      </p>
      <p className="mt-2 text-center text-md" style={{color:primaryColor}}>
        Explore, experiment, and elevate your email campaigns.
      </p>
       <p className="text-xs mt-8 text-center" style={{ color: BRANDING_CONFIG.brand.colors.primary, opacity: 0.7 }}>
          For more information, visit <a href={BRANDING_CONFIG.brand.website} target="_blank" rel="noopener noreferrer" style={linkStyle}>{BRANDING_CONFIG.brand.website}</a>
        </p>
      <style>
      {`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}
      </style>
    </div>
  );
};

export default WelcomeSection;
