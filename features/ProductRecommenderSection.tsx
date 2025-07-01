import React, { useState, useCallback } from 'react';
import TextAreaInput from '../components/TextAreaInput';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import MicrophoneButton from '../components/MicrophoneButton';
import SectionContainer from '../components/SectionContainer';
import geminiService from '../services/geminiService';
import { ProductRecommendationInput, ProductRecommendationResponse, ProductRecommendation } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { BRANDING_CONFIG } from '../constants';

const ProductRecommenderSection: React.FC = () => {
  const [input, setInput] = useState<ProductRecommendationInput>({
    customerProfile: '', availableProducts: '', currentInventory: '', businessGoals: ''
  });
  const [recommendations, setRecommendations] = useState<ProductRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMicField, setActiveMicField] = useState<keyof ProductRecommendationInput | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  const inputFields: Array<{ name: keyof ProductRecommendationInput, label: string, placeholder: string, rows: number, required?: boolean }> = [
    { name: 'customerProfile', label: 'Customer Profile', placeholder: 'Summary of customer data, preferences, purchase history (from analysis or direct input)', rows: 4, required: true },
    { name: 'availableProducts', label: 'Available Products Catalog', placeholder: 'List product categories, key products, features, prices. e.g., "Skincare: Cleanser ($20, organic), Moisturizer ($30, for dry skin). Electronics: Headphones ($100, noise-cancelling)"', rows: 4, required: true },
    { name: 'currentInventory', label: 'Current Inventory (Optional)', placeholder: 'e.g., Low stock on X, New arrivals: Y, Z. Seasonal: Winter Collection', rows: 2 },
    { name: 'businessGoals', label: 'Business Goals', placeholder: 'e.g., Clear old inventory, Promote new items, Increase Average Order Value (AOV)', rows: 2, required: true },
  ];

  const requiredProductInputKeys: (keyof ProductRecommendationInput)[] = inputFields
    .filter(f => f.required)
    .map(f => f.name);

  const handleFinalTranscript = useCallback((transcript: string) => {
    if (activeMicField) {
      setInput(prev => ({ ...prev, [activeMicField]: (prev[activeMicField] ? prev[activeMicField] + ' ' + transcript : transcript).trim() }));
    }
    setInterimTranscript('');
  }, [activeMicField]);

  const handleInterimTranscriptUpdate = useCallback((transcript: string) => {
    setInterimTranscript(transcript);
  }, []);

  const { isListening, startListening, stopListening, error: speechError, hasRecognitionSupport } = useSpeechRecognition(handleInterimTranscriptUpdate, handleFinalTranscript);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name as keyof ProductRecommendationInput]: value }));
  };

  const toggleListening = (fieldName: keyof ProductRecommendationInput) => {
    if (isListening && activeMicField === fieldName) {
      stopListening();
      setActiveMicField(null);
    } else {
      if(isListening) stopListening();
      setActiveMicField(fieldName);
      startListening();
    }
  };

  const getInputValue = (fieldName: keyof ProductRecommendationInput): string => {
    const currentValue = input[fieldName] || '';
    if (isListening && activeMicField === fieldName) {
      return (currentValue ? currentValue + ' ' + interimTranscript : interimTranscript).trim();
    }
    return currentValue;
  };

  const handleSubmit = async () => {
    if (requiredProductInputKeys.some(field => !(input[field] || '').trim())) {
      setError('Please fill in Customer Profile, Available Products, and Business Goals.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const result = await geminiService.recommendProducts(input, apiKey);
      if (result) {
        setRecommendations(result);
      } else {
        setError('Failed to get product recommendations. Response might be malformed or empty.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching recommendations.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderProduct = (product: ProductRecommendation, index: number) => (
    <div key={index} className="p-3 bg-gray-700 bg-opacity-50 rounded">
      <h5 className="font-semibold" style={{color: BRANDING_CONFIG.brand.colors.primary}}>{product.name}</h5>
      {product.category && <p className="text-xs text-gray-400">Category: {product.category}</p>}
      {product.price && <p className="text-xs text-gray-400">Price: {product.price}</p>}
      <p className="text-sm mt-1">{product.reasoning}</p>
    </div>
  );

  return (
    <SectionContainer title="Personalized Product Recommendations" onSubmit={handleSubmit} isLoading={isLoading}>
      <div className="space-y-4">
        {inputFields.map(({ name, label, placeholder, rows, required }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-lg font-medium mb-1" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
              {label} {required && <span className="text-red-400">*</span>}
            </label>
             <div className="flex items-center">
                <TextAreaInput id={name} name={name} value={getInputValue(name)} onChange={handleInputChange} placeholder={placeholder} rows={rows} className="flex-grow"/>
                {hasRecognitionSupport && ( <MicrophoneButton isListening={isListening && activeMicField === name} onClick={() => toggleListening(name)} className="ml-2"/>)}
            </div>
            {isListening && activeMicField === name && <span className="text-xs text-yellow-400 mt-1">Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
          </div>
        ))}
      </div>
      {speechError && activeMicField && <p className="text-red-400 text-xs mt-1">{speechError}</p>}
      {!hasRecognitionSupport && <p className="text-yellow-400 text-xs mt-1">Speech recognition not supported.</p>}

      <Button onClick={handleSubmit} disabled={isLoading || requiredProductInputKeys.some(field => !(input[field] || '').trim())} className="w-full sm:w-auto mt-6">
        {isLoading ? <LoadingSpinner /> : 'Get Recommendations'}
      </Button>

      {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md mt-4">{error}</p>}

      {recommendations && (
        <div className="mt-8 p-6 rounded-lg shadow-inner" style={{backgroundColor: `rgba(0,0,0,0.2)`}}>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Product Recommendations</h3>
          <div className="space-y-6 text-gray-200">
            {recommendations.primaryRecommendations && recommendations.primaryRecommendations.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-2" style={{color: BRANDING_CONFIG.brand.colors.primary + 'D0'}}>Primary Recommendations:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{recommendations.primaryRecommendations.map(renderProduct)}</div>
              </div>
            )}
            {recommendations.crossSellOpportunities && recommendations.crossSellOpportunities.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-2" style={{color: BRANDING_CONFIG.brand.colors.primary + 'D0'}}>Cross-sell Opportunities:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{recommendations.crossSellOpportunities.map(renderProduct)}</div>
              </div>
            )}
            {recommendations.seasonalTrendingItems && recommendations.seasonalTrendingItems.length > 0 && (
              <div>
                <h4 className="text-xl font-semibold mb-2" style={{color: BRANDING_CONFIG.brand.colors.primary + 'D0'}}>Seasonal/Trending Items:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{recommendations.seasonalTrendingItems.map(renderProduct)}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default ProductRecommenderSection;