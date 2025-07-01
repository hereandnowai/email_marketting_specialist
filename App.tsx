
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import WelcomeSection from './features/WelcomeSection';
import AiAssistantSection from './features/AiAssistantSection'; // Import new section
import CustomerAnalysisSection from './features/CustomerAnalysisSection';
import EmailGeneratorSection from './features/EmailGeneratorSection';
import SendTimeOptimizerSection from './features/SendTimeOptimizerSection';
import PerformanceAnalyzerSection from './features/PerformanceAnalyzerSection';
import ProductRecommenderSection from './features/ProductRecommenderSection';
import SequenceBuilderSection from './features/SequenceBuilderSection';
import { AppPage } from './types';
import { BRANDING_CONFIG } from './constants';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.Welcome);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar on larger screens if it was open from mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
        setIsSidebarOpen(false); 
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const renderCurrentPageContent = () => {
    switch (currentPage) {
      case AppPage.Welcome:
        return <WelcomeSection navigateToPage={setCurrentPage} />;
      case AppPage.AiAssistant: // Add case for AI Assistant
        return <AiAssistantSection />;
      case AppPage.CustomerAnalysis:
        return <CustomerAnalysisSection />;
      case AppPage.EmailGeneration:
        return <EmailGeneratorSection />;
      case AppPage.SendTimeOptimization:
        return <SendTimeOptimizerSection />;
      case AppPage.PerformanceAnalysis:
        return <PerformanceAnalyzerSection />;
      case AppPage.ProductRecommendation:
        return <ProductRecommenderSection />;
      case AppPage.EmailSequence:
        return <SequenceBuilderSection />;
      default:
        return <WelcomeSection navigateToPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BRANDING_CONFIG.brand.colors.secondary, color: '#E0E0E0' }}>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderCurrentPageContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;