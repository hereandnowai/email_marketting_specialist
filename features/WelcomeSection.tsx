
import React from 'react';
import { BRANDING_CONFIG } from '../constants';
import { AppPage } from '../types'; 

interface WelcomeSectionProps {
  navigateToPage: (page: AppPage) => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ navigateToPage }) => {
  const primaryColor = BRANDING_CONFIG.brand.colors.primary;
  const secondaryColor = BRANDING_CONFIG.brand.colors.secondary;
  const textColor = '#E0E0E0'; 
  const highlightTextColor = primaryColor; 

  const sectionStyle: React.CSSProperties = {
    backgroundColor: `rgba(0, 0, 0, 0.1)`,
    border: `1px solid ${primaryColor}30`,
    color: textColor,
    padding: '2rem', 
    borderRadius: '1rem', 
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

  const featureTitleClassName = "text-xl font-semibold mb-2 cursor-pointer hover:underline focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent rounded focus:ring-yellow-400";

  const handleKeyDown = (e: React.KeyboardEvent, page: AppPage) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateToPage(page);
    }
  };

  const quickNavPages = Object.values(AppPage).filter(page => page !== AppPage.Welcome);

  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-xl shadow-2xl animate-fadeIn" style={sectionStyle}>
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center" style={headingStyle}>
        Welcome to the AI Email Marketing Specialist!
      </h2>

      <p className="mb-4 sm:mb-6 text-md sm:text-lg text-center">
        Your intelligent assistant for crafting impactful email marketing campaigns, brought to you by the <strong style={headingStyle}>{BRANDING_CONFIG.brand.longName}</strong>. 
        Powered by Google's Gemini AI, this tool helps you analyze customer data, generate personalized content, optimize send times, and much more.
      </p>
      
      <p className="mb-6 sm:mb-8 text-sm sm:text-md italic text-center" style={{color: primaryColor, opacity: 0.8}}>
        "{BRANDING_CONFIG.brand.slogan}"
      </p>

      {/* Quick Access Navigation Cards */}
      <h3 className="text-2xl font-semibold mt-10 mb-5 text-center sm:text-left" style={headingStyle}>
        Quick Access to Features
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {quickNavPages.map((page) => (
          <div
            key={page}
            role="button"
            tabIndex={0}
            onClick={() => navigateToPage(page)}
            onKeyDown={(e) => handleKeyDown(e, page)}
            aria-label={`Navigate to ${page}`}
            className="p-4 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              backgroundColor: `${secondaryColor}99`, // Semi-transparent secondary
              borderColor: `${primaryColor}50`,
              borderWidth: '1px',
              color: primaryColor,
              '--tw-ring-color': primaryColor,
              '--tw-ring-offset-color': `rgba(0,0,0,0.2)`
            } as React.CSSProperties }
          >
            <h5 className="text-lg font-semibold text-center">{page}</h5>
            {/* Optional: Add a brief description or icon here later */}
            <p className="text-xs text-center opacity-70 mt-1">Click to explore &rarr;</p>
          </div>
        ))}
      </div>


      <h3 className="text-2xl font-semibold mt-10 mb-5" style={headingStyle}>
        Getting Started & Feature Overview
      </h3>
      <p className="mb-6">
        Navigate through the application using the menu on the left, the quick access cards above, or click the titles below. Each section is dedicated to a core email marketing capability:
      </p>

      <div className="space-y-8">
        <div>
          <h4 
            className={featureTitleClassName}
            style={subHeadingStyle}
            onClick={() => navigateToPage(AppPage.AiAssistant)}
            onKeyDown={(e) => handleKeyDown(e, AppPage.AiAssistant)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${AppPage.AiAssistant}`}
          >
            {AppPage.AiAssistant} <span aria-hidden="true" className="text-sm">&rarr;</span>
          </h4>
          <p className="mb-1 text-sm sm:text-base">
            Engage with a general AI assistant. Ask questions, brainstorm marketing ideas, or get quick advice using text or voice input.
          </p>
          <p className="text-xs sm:text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Perfect for quick queries or when you need a creative spark outside of specialized tools.</p>
        </div>

        <div>
          <h4 
            className={featureTitleClassName}
            style={subHeadingStyle}
            onClick={() => navigateToPage(AppPage.CustomerAnalysis)}
            onKeyDown={(e) => handleKeyDown(e, AppPage.CustomerAnalysis)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${AppPage.CustomerAnalysis}`}
          >
            {AppPage.CustomerAnalysis} <span aria-hidden="true" className="text-sm">&rarr;</span>
          </h4>
          <p className="mb-1 text-sm sm:text-base">
            Input raw customer data (demographics, purchase history, etc.) to generate profiles, segments, personalization opportunities, content themes, product suggestions, and optimal email frequency/timing.
          </p>
          <p className="text-xs sm:text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Detailed and structured customer data yields more insightful AI analysis.</p>
        </div>

        <div>
          <h4 
            className={featureTitleClassName}
            style={subHeadingStyle}
            onClick={() => navigateToPage(AppPage.EmailGeneration)}
            onKeyDown={(e) => handleKeyDown(e, AppPage.EmailGeneration)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${AppPage.EmailGeneration}`}
          >
            {AppPage.EmailGeneration} <span aria-hidden="true" className="text-sm">&rarr;</span>
          </h4>
          <p className="mb-1 text-sm sm:text-base">
            Specify your target segment, campaign goals, product focus, offers, brand voice, and customer insights. The AI generates subject lines, preview text, HTML email body, CTAs, and personalization notes.
          </p>
          <p className="text-xs sm:text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Use insights from "Customer Analysis" for highly relevant email copy.</p>
        </div>

        <div>
          <h4 
            className={featureTitleClassName}
            style={subHeadingStyle}
            onClick={() => navigateToPage(AppPage.SendTimeOptimization)}
            onKeyDown={(e) => handleKeyDown(e, AppPage.SendTimeOptimization)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${AppPage.SendTimeOptimization}`}
          >
            {AppPage.SendTimeOptimization} <span aria-hidden="true" className="text-sm">&rarr;</span>
          </h4>
          <p className="mb-1 text-sm sm:text-base">
            Provide historical open times, time zones, device usage, and engagement patterns. The AI recommends optimal send times, reasoning, A/B testing alternatives, and frequency strategies.
          </p>
          <p className="text-xs sm:text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Accurate historical data improves send time predictions.</p>
        </div>

        <div>
          <h4 
            className={featureTitleClassName}
            style={subHeadingStyle}
            onClick={() => navigateToPage(AppPage.PerformanceAnalysis)}
            onKeyDown={(e) => handleKeyDown(e, AppPage.PerformanceAnalysis)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${AppPage.PerformanceAnalysis}`}
          >
            {AppPage.PerformanceAnalysis} <span aria-hidden="true" className="text-sm">&rarr;</span>
          </h4>
          <p className="mb-1 text-sm sm:text-base">
            Enter campaign metrics (open rate, CTR, conversions). The AI summarizes performance, highlights wins/areas for improvement, and offers optimization recommendations.
          </p>
          <p className="text-xs sm:text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Regularly analyze performance to refine your strategy.</p>
        </div>

        <div>
          <h4 
            className={featureTitleClassName}
            style={subHeadingStyle}
            onClick={() => navigateToPage(AppPage.ProductRecommendation)}
            onKeyDown={(e) => handleKeyDown(e, AppPage.ProductRecommendation)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${AppPage.ProductRecommendation}`}
          >
            {AppPage.ProductRecommendation} <span aria-hidden="true" className="text-sm">&rarr;</span>
          </h4>
          <p className="mb-1 text-sm sm:text-base">
            Based on customer profiles, product catalogs, inventory, and business goals, the AI generates personalized product recommendations, including cross-sells and seasonal items.
          </p>
          <p className="text-xs sm:text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Clear product details and specific business goals lead to targeted recommendations.</p>
        </div>

        <div>
          <h4 
            className={featureTitleClassName}
            style={subHeadingStyle}
            onClick={() => navigateToPage(AppPage.EmailSequence)}
            onKeyDown={(e) => handleKeyDown(e, AppPage.EmailSequence)}
            role="button"
            tabIndex={0}
            aria-label={`Navigate to ${AppPage.EmailSequence}`}
          >
            {AppPage.EmailSequence} <span aria-hidden="true" className="text-sm">&rarr;</span>
          </h4>
          <p className="mb-1 text-sm sm:text-base">
            Define sequence type (Welcome, Abandoned Cart, etc.), triggers, goals, and length. The AI drafts a full email series with timing, subject, content, and CTAs.
          </p>
          <p className="text-xs sm:text-sm italic" style={{color: `${primaryColor}B3`}}><strong>Tip:</strong> Precise triggers and goals ensure effective automated sequences.</p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mt-10 mb-5" style={headingStyle}>
        AI Assistance (Microphone Input) <span role="img" aria-label="microphone icon" style={{color: primaryColor, display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>🎤</span>
      </h3>
      <p className="mb-6 text-sm sm:text-base">
        Most text fields feature a microphone icon. Click it to activate voice input. Speak clearly, and your words will appear. Click again or pause to stop. This uses your browser's speech recognition; ensure microphone access is permitted.
      </p>

      <h3 className="text-2xl font-semibold mt-10 mb-5" style={headingStyle}>
        API Key Configuration
      </h3>
      <p className="mb-4 text-sm sm:text-base">
        This application requires a Google Gemini API Key. It attempts to use a placeholder specified in <code>index.tsx</code>. A console warning will appear if a valid key isn't configured.
      </p>
      <p className="mb-6 text-sm sm:text-base">
        In a real deployment, securely set the <code>API_KEY</code> environment variable. <strong >The application does not provide a UI to enter the API key.</strong>
      </p>

      <p className="mt-10 text-center text-md sm:text-lg">
        We hope you find this tool invaluable for your marketing endeavors!
      </p>
      <p className="mt-2 text-center text-sm sm:text-md" style={{color:primaryColor}}>
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