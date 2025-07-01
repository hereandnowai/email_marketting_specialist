import React, { useState, useCallback } from 'react';
import TextInput from '../components/TextInput';
import TextAreaInput from '../components/TextAreaInput';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import MicrophoneButton from '../components/MicrophoneButton';
import SectionContainer from '../components/SectionContainer';
import geminiService from '../services/geminiService';
import { CampaignMetricsInput, PerformanceAnalysisResponse } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { BRANDING_CONFIG } from '../constants';

const PerformanceAnalyzerSection: React.FC = () => {
  const [input, setInput] = useState<CampaignMetricsInput>({
    openRate: '', clickThroughRate: '', conversionRate: '', unsubscribeRate: '', revenueGenerated: '', deliveryRate: '',
    segmentPerformance: '', abTestResults: { subjectLine: '', sendTime: '', cta: '' }
  });
  const [analysis, setAnalysis] = useState<PerformanceAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMicField, setActiveMicField] = useState<string | null>(null); // name of field or subfield
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  
  const metricFields: Array<{ name: keyof CampaignMetricsInput, label: string, placeholder: string, required?: boolean }> = [
    { name: 'openRate', label: 'Open Rate (%)', placeholder: 'e.g., 25', required: true },
    { name: 'clickThroughRate', label: 'Click-Through Rate (%)', placeholder: 'e.g., 5', required: true },
    { name: 'conversionRate', label: 'Conversion Rate (%)', placeholder: 'e.g., 2', required: true },
    { name: 'unsubscribeRate', label: 'Unsubscribe Rate (%)', placeholder: 'e.g., 0.5', required: true },
    { name: 'revenueGenerated', label: 'Revenue Generated ($)', placeholder: 'e.g., 1500', required: true },
    { name: 'deliveryRate', label: 'Delivery Rate (%)', placeholder: 'e.g., 99', required: true },
  ];

  const requiredMetricKeysPerf: Array<keyof CampaignMetricsInput> = metricFields
    .filter(f => f.required)
    .map(f => f.name);

  const abTestFields: Array<{ name: string, label: string, placeholder: string }> = [
      { name: 'abTestResults.subjectLine', label: 'Subject Line A/B Test', placeholder: 'e.g., A (22% OR) vs B (28% OR - Winner)'},
      { name: 'abTestResults.sendTime', label: 'Send Time A/B Test', placeholder: 'e.g., Tue 10AM (25% OR) vs Thu 2PM (23% OR)'},
      { name: 'abTestResults.cta', label: 'CTA A/B Test', placeholder: 'e.g., "Shop Now" (5% CTR) vs "Learn More" (3% CTR)'},
  ];

  const handleFinalTranscript = useCallback((transcript: string) => {
    if (activeMicField) {
      const keys = activeMicField.split('.'); // For nested like 'abTestResults.subjectLine'
      if (keys.length === 1) {
        setInput(prev => ({ ...prev, [activeMicField]: ((prev[activeMicField as keyof CampaignMetricsInput] as string) ? (prev[activeMicField as keyof CampaignMetricsInput] as string) + ' ' + transcript : transcript).trim() }));
      } else if (keys.length === 2 && keys[0] === 'abTestResults') {
        setInput(prev => ({
          ...prev,
          abTestResults: {
            ...prev.abTestResults,
            [keys[1]]: ((prev.abTestResults as any)[keys[1]] ? (prev.abTestResults as any)[keys[1]] + ' ' + transcript : transcript).trim()
          }
        }));
      }
    }
    setInterimTranscript('');
  }, [activeMicField]);

  const handleInterimTranscriptUpdate = useCallback((transcript: string) => {
    setInterimTranscript(transcript);
  }, []);

  const { isListening, startListening, stopListening, error: speechError, hasRecognitionSupport } = useSpeechRecognition(handleInterimTranscriptUpdate, handleFinalTranscript);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
     if (keys.length === 1) {
      setInput(prev => ({ ...prev, [name]: value }));
    } else if (keys.length === 2 && keys[0] === 'abTestResults') {
      setInput(prev => ({
        ...prev,
        abTestResults: { ...prev.abTestResults, [keys[1]]: value }
      }));
    }
  };

  const toggleListening = (fieldName: string) => {
    if (isListening && activeMicField === fieldName) {
      stopListening();
      setActiveMicField(null);
    } else {
      if(isListening) stopListening();
      setActiveMicField(fieldName);
      startListening();
    }
  };

  const getInputValue = (fieldName: string): string => {
    const keys = fieldName.split('.');
    let currentValue: string | undefined;
    if (keys.length === 1) {
      currentValue = input[fieldName as keyof CampaignMetricsInput] as string;
    } else if (keys.length === 2 && keys[0] === 'abTestResults') {
      currentValue = (input.abTestResults as any)[keys[1]];
    }
    currentValue = currentValue || '';

    if (isListening && activeMicField === fieldName) {
      return (currentValue ? currentValue + ' ' + interimTranscript : interimTranscript).trim();
    }
    return currentValue;
  };

  const handleSubmit = async () => {
    if (requiredMetricKeysPerf.some(field => !((input[field] as string) || '').trim())) {
      setError('Please fill in all core campaign metric fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const result = await geminiService.analyzePerformance(input, apiKey);
      if (result) {
        setAnalysis(result);
      } else {
        setError('Failed to get performance analysis. Response might be malformed or empty.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching analysis.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SectionContainer title="Campaign Performance Analysis" onSubmit={handleSubmit} isLoading={isLoading}>
      <h4 className="text-xl font-semibold mb-3" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Core Metrics</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {metricFields.map(({ name, label, placeholder, required }) => (
          <div key={name}>
            <label htmlFor={name as string} className="block text-sm font-medium mb-1" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="flex items-center">
                <TextInput id={name as string} name={name as string} value={getInputValue(name as string)} onChange={handleInputChange} placeholder={placeholder} className="flex-grow"/>
                {hasRecognitionSupport && (
                  <MicrophoneButton isListening={isListening && activeMicField === name} onClick={() => toggleListening(name as string)} className="ml-2"/>
                )}
            </div>
            {isListening && activeMicField === name && <span className="text-xs text-yellow-400 mt-1">Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
          </div>
        ))}
      </div>

      <h4 className="text-xl font-semibold mb-3 mt-6" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Optional Details</h4>
      <div>
        <label htmlFor="segmentPerformance" className="block text-sm font-medium mb-1" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Segment Performance (Optional)</label>
        <div className="flex items-center">
            <TextAreaInput id="segmentPerformance" name="segmentPerformance" value={getInputValue('segmentPerformance')} onChange={handleInputChange} placeholder="e.g., High-Value: OR 30%, CTR 7% | At-Risk: OR 15%, CTR 3%" rows={2} className="flex-grow"/>
            {hasRecognitionSupport && ( <MicrophoneButton isListening={isListening && activeMicField === 'segmentPerformance'} onClick={() => toggleListening('segmentPerformance')} className="ml-2"/> )}
        </div>
        {isListening && activeMicField === 'segmentPerformance' && <span className="text-xs text-yellow-400 mt-1">Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
         {abTestFields.map(({ name, label, placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium mb-1" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>{label} (Optional)</label>
            <div className="flex items-center">
                <TextInput id={name} name={name} value={getInputValue(name)} onChange={handleInputChange} placeholder={placeholder} className="flex-grow"/>
                {hasRecognitionSupport && ( <MicrophoneButton isListening={isListening && activeMicField === name} onClick={() => toggleListening(name)} className="ml-2"/> )}
            </div>
             {isListening && activeMicField === name && <span className="text-xs text-yellow-400 mt-1">Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
          </div>
        ))}
      </div>
      {speechError && activeMicField && <p className="text-red-400 text-xs mt-1">{speechError}</p>}
      {!hasRecognitionSupport && <p className="text-yellow-400 text-xs mt-1">Speech recognition not supported.</p>}

      <Button onClick={handleSubmit} disabled={isLoading || requiredMetricKeysPerf.some(field => !((input[field] as string) || '').trim())} className="w-full sm:w-auto mt-6">
        {isLoading ? <LoadingSpinner /> : 'Analyze Performance'}
      </Button>

      {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md mt-4">{error}</p>}

      {analysis && (
        <div className="mt-8 p-6 rounded-lg shadow-inner" style={{backgroundColor: `rgba(0,0,0,0.2)`}}>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Performance Analysis Results</h3>
          <div className="space-y-4 text-gray-200">
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Performance Summary:</strong> <p className="pl-2">{analysis.performanceSummary}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Key Wins:</strong> <ul className="list-disc list-inside pl-2">{analysis.keyWins.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Areas for Improvement:</strong> <ul className="list-disc list-inside pl-2">{analysis.areasForImprovement.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
            {analysis.benchmarkComparisons && <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Benchmark Comparisons:</strong> <p className="pl-2">{analysis.benchmarkComparisons}</p></div>}
            {analysis.roiAnalysis && <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>ROI Analysis:</strong> <p className="pl-2">{analysis.roiAnalysis}</p></div>}
            
            <div className="mt-3"><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Optimization Recommendations:</strong>
              <div className="pl-4 space-y-1">
                {analysis.optimizationRecommendations.subjectLine && <p>Subject Line: {analysis.optimizationRecommendations.subjectLine.join(', ')}</p>}
                {analysis.optimizationRecommendations.content && <p>Content: {analysis.optimizationRecommendations.content.join(', ')}</p>}
                {analysis.optimizationRecommendations.timing && <p>Timing: {analysis.optimizationRecommendations.timing.join(', ')}</p>}
                {analysis.optimizationRecommendations.segmentation && <p>Segmentation: {analysis.optimizationRecommendations.segmentation.join(', ')}</p>}
              </div>
            </div>
             <div className="mt-3"><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Next Campaign Strategy:</strong>
              <div className="pl-4 space-y-1">
                <p>Winning Elements: {analysis.nextCampaignStrategy.winningElements.join(', ')}</p>
                <p>New Testing Opportunities: {analysis.nextCampaignStrategy.newTestingOpportunities.join(', ')}</p>
                {analysis.nextCampaignStrategy.audienceExpansion && <p>Audience Expansion: {analysis.nextCampaignStrategy.audienceExpansion.join(', ')}</p>}
              </div>
            </div>
            {analysis.automatedFollowUpSequences && (
              <div className="mt-3"><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Automated Follow-up Sequences:</strong>
                <div className="pl-4 space-y-1">
                  {analysis.automatedFollowUpSequences.converters && <p>For Converters: {analysis.automatedFollowUpSequences.converters}</p>}
                  {analysis.automatedFollowUpSequences.nonOpeners && <p>For Non-Openers: {analysis.automatedFollowUpSequences.nonOpeners}</p>}
                  {analysis.automatedFollowUpSequences.engagedNonConverters && <p>For Engaged Non-Converters: {analysis.automatedFollowUpSequences.engagedNonConverters}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default PerformanceAnalyzerSection;