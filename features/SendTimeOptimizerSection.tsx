import React, { useState, useCallback } from 'react';
import TextAreaInput from '../components/TextAreaInput';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import MicrophoneButton from '../components/MicrophoneButton';
import SectionContainer from '../components/SectionContainer';
import geminiService from '../services/geminiService';
import { SendTimeOptimizationInput, SendTimeOptimizationResponse } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { BRANDING_CONFIG } from '../constants';

const inputFieldsConfig: Array<{ name: keyof SendTimeOptimizationInput, label: string, placeholder: string, type?: 'text' | 'textarea', rows?: number, required?: boolean }> = [
  { name: 'historicalOpenTimes', label: 'Historical Open Times', placeholder: 'e.g., Mostly Weekdays 9-11 AM, Some Saturday afternoons; or list of timestamps', type: 'textarea', rows: 3, required: true },
  { name: 'timeZone', label: 'Primary Time Zone', placeholder: 'e.g., EST, PST, Customer Local Time', type: 'text', required: true },
  { name: 'deviceUsage', label: 'Device Usage', placeholder: 'e.g., Primarily Mobile, Mix of Desktop/Mobile', type: 'text', required: true },
  { name: 'engagementPatterns', label: 'Engagement Patterns', placeholder: 'e.g., High weekday activity, low weekends', type: 'text', required: true },
  { name: 'campaignType', label: 'Campaign Type', placeholder: 'e.g., Newsletter, Promotional, Transactional', type: 'text', required: true },
  { name: 'industry', label: 'Industry (Optional, for B2B)', placeholder: 'e.g., SaaS, Healthcare, Finance', type: 'text' },
];

const requiredFieldsForSendTime: (keyof SendTimeOptimizationInput)[] = inputFieldsConfig
  .filter(f => f.required)
  .map(f => f.name);

const SendTimeOptimizerSection: React.FC = () => {
  const [input, setInput] = useState<SendTimeOptimizationInput>({
    historicalOpenTimes: '', timeZone: '', deviceUsage: '', engagementPatterns: '', campaignType: '', industry: ''
  });
  const [recommendation, setRecommendation] = useState<SendTimeOptimizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMicField, setActiveMicField] = useState<keyof SendTimeOptimizationInput | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleListening = (fieldName: keyof SendTimeOptimizationInput) => {
    if (isListening && activeMicField === fieldName) {
      stopListening();
      setActiveMicField(null);
    } else {
      if(isListening) stopListening();
      setActiveMicField(fieldName);
      startListening();
    }
  };
  
  const getInputValue = (fieldName: keyof SendTimeOptimizationInput): string => {
    const currentValue = input[fieldName] || ''; // Ensure current value is a string
    if (isListening && activeMicField === fieldName) {
      return (currentValue ? currentValue + ' ' + interimTranscript : interimTranscript).trim();
    }
    return currentValue;
  };

  const handleSubmit = async () => {
    if (requiredFieldsForSendTime.some(field => !(input[field] || '').trim())) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendation(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const result = await geminiService.optimizeSendTime(input, apiKey);
      if (result) {
        setRecommendation(result);
      } else {
        setError('Failed to get send time optimization. Response might be malformed or empty.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionContainer title="Send Time Optimization" onSubmit={handleSubmit} isLoading={isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFieldsConfig.map(({ name, label, placeholder, type = 'text', rows, required }) => (
          <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
            <label htmlFor={name} className="block text-lg font-medium mb-1" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
              {label} {required && <span className="text-red-400">*</span>}
            </label>
             <div className="flex items-center">
                {type === 'textarea' ? (
                    <TextAreaInput id={name} name={name} value={getInputValue(name)} onChange={handleInputChange} placeholder={placeholder} rows={rows} className="flex-grow"/>
                ) : (
                    <TextInput id={name} name={name} value={getInputValue(name)} onChange={handleInputChange} placeholder={placeholder} className="flex-grow"/>
                )}
                {hasRecognitionSupport && (
                  <MicrophoneButton isListening={isListening && activeMicField === name} onClick={() => toggleListening(name)} className="ml-2"/>
                )}
            </div>
            {isListening && activeMicField === name && <span className="text-xs text-yellow-400 mt-1">Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
          </div>
        ))}
      </div>
      {speechError && activeMicField && <p className="text-red-400 text-xs mt-1">{speechError}</p>}
      {!hasRecognitionSupport && <p className="text-yellow-400 text-xs mt-1">Speech recognition not supported.</p>}

      <Button onClick={handleSubmit} disabled={isLoading || requiredFieldsForSendTime.some(field => !(input[field] || '').trim())} className="w-full sm:w-auto mt-4">
        {isLoading ? <LoadingSpinner /> : 'Optimize Send Time'}
      </Button>

      {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md mt-4">{error}</p>}

      {recommendation && (
        <div className="mt-8 p-6 rounded-lg shadow-inner" style={{backgroundColor: `rgba(0,0,0,0.2)`}}>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Optimization Results</h3>
          <div className="space-y-3 text-gray-200">
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Optimal Send Day & Time:</strong> <p className="pl-2">{recommendation.optimalSendDayTime}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Reasoning:</strong> <p className="pl-2">{recommendation.reasoning}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Alternative Options:</strong> <ul className="list-disc list-inside pl-2">{recommendation.alternativeOptions.map((opt, i) => <li key={i}>{opt}</li>)}</ul></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Time Zone Considerations:</strong> <p className="pl-2">{recommendation.timeZoneConsiderations}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Frequency Recommendations:</strong> <p className="pl-2">{recommendation.frequencyRecommendations}</p></div>
            {recommendation.seasonalAdjustments && <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Seasonal Adjustments:</strong> <p className="pl-2">{recommendation.seasonalAdjustments}</p></div>}
            {recommendation.preferenceBasedVariations && <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Preference-Based Variations:</strong> <p className="pl-2">{recommendation.preferenceBasedVariations}</p></div>}
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Testing Strategy:</strong> <p className="pl-2">{recommendation.testingStrategy}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Performance Tracking Metrics:</strong> <ul className="list-disc list-inside pl-2">{recommendation.performanceTrackingMetrics.map((metric, i) => <li key={i}>{metric}</li>)}</ul></div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default SendTimeOptimizerSection;