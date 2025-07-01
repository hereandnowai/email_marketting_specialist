
import React, { useState, useCallback } from 'react';
import TextAreaInput from '../components/TextAreaInput';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import MicrophoneButton from '../components/MicrophoneButton';
import SectionContainer from '../components/SectionContainer';
import geminiService from '../services/geminiService';
import { EmailContentInput, EmailContentResponse } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { BRANDING_CONFIG } from '../constants';

const EmailGeneratorSection: React.FC = () => {
  const [input, setInput] = useState<EmailContentInput>({
    segment: '', campaignGoal: '', productFocus: '', specialOffers: '', brandVoice: '', customerInsights: ''
  });
  const [emailContent, setEmailContent] = useState<EmailContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMicField, setActiveMicField] = useState<keyof EmailContentInput | null>(null);
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

  const toggleListening = (fieldName: keyof EmailContentInput) => {
    if (isListening && activeMicField === fieldName) {
      stopListening();
      setActiveMicField(null);
    } else {
      if(isListening) stopListening(); // Stop if listening on another field
      setActiveMicField(fieldName);
      startListening();
    }
  };
  
  const getInputValue = (fieldName: keyof EmailContentInput): string => {
    const currentValue = input[fieldName];
    if (isListening && activeMicField === fieldName) {
      return (currentValue ? currentValue + ' ' + interimTranscript : interimTranscript).trim();
    }
    return currentValue;
  };


  const handleSubmit = async () => {
    if (Object.values(input).some(val => !val.trim())) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEmailContent(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const result = await geminiService.generateEmailContent(input, apiKey);
      if (result) {
        setEmailContent(result);
      } else {
        setError('Failed to generate email content. Response might be malformed or empty.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while generating content.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputFields: Array<{ name: keyof EmailContentInput, label: string, placeholder: string, type?: 'text' | 'textarea', rows?: number }> = [
    { name: 'segment', label: 'Customer Segment', placeholder: 'e.g., High-Value, New Subscribers', type: 'text' },
    { name: 'campaignGoal', label: 'Campaign Goal', placeholder: 'e.g., Awareness, Conversion, Retention', type: 'text' },
    { name: 'productFocus', label: 'Product Focus', placeholder: 'e.g., New Summer Collection, Specific Product SKU', type: 'text' },
    { name: 'specialOffers', label: 'Special Offers', placeholder: 'e.g., 20% off, Free Shipping', type: 'text' },
    { name: 'brandVoice', label: 'Brand Voice', placeholder: 'e.g., Professional, Casual, Friendly', type: 'text' },
    { name: 'customerInsights', label: 'Customer Insights (from Analysis)', placeholder: 'e.g., Prefers organic, shops on weekends', type: 'textarea', rows: 4 },
  ];

  return (
    <SectionContainer title="Email Content Generation" onSubmit={handleSubmit} isLoading={isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFields.map(({ name, label, placeholder, type = 'text', rows }) => (
          <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
            <label htmlFor={name} className="block text-lg font-medium mb-1" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>{label}</label>
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

      <Button onClick={handleSubmit} disabled={isLoading || Object.values(input).some(val => !val.trim())} className="w-full sm:w-auto mt-4">
        {isLoading ? <LoadingSpinner /> : 'Generate Email Content'}
      </Button>

      {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md mt-4">{error}</p>}

      {emailContent && (
        <div className="mt-8 p-6 rounded-lg shadow-inner" style={{backgroundColor: `rgba(0,0,0,0.2)`}}>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Generated Email Content</h3>
          
          <div className="space-y-4 text-gray-200">
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Subject Lines:</strong>
              <ul className="list-disc list-inside pl-2">
                {emailContent.subjectLines.map((sl, i) => <li key={i}>{sl.text} {sl.emoji ? '📧' : ''}</li>)}
              </ul>
            </div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Preview Text:</strong> <p className="pl-2">{emailContent.previewText}</p></div>
            <div>
              <strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Email Body (HTML):</strong>
              <div className="mt-2 p-4 border rounded-md overflow-x-auto bg-gray-800" style={{borderColor: BRANDING_CONFIG.brand.colors.primary + '50'}}>
                 {/* Render HTML safely or show as preformatted text */}
                 <div dangerouslySetInnerHTML={{ __html: emailContent.emailBodyHtml }} className="prose prose-sm prose-invert max-w-none" />
              </div>
            </div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>CTAs:</strong>
              <div className="pl-2">
                <p>Primary: {emailContent.ctas.primary.text} ({emailContent.ctas.primary.link})</p>
                {emailContent.ctas.secondary && <p>Secondary: {emailContent.ctas.secondary.text} ({emailContent.ctas.secondary.link})</p>}
                {emailContent.ctas.urgencyDriven && emailContent.ctas.urgencyDriven.map((cta,i) => <p key={i}>Urgency: {cta.text} ({cta.link})</p>)}
              </div>
            </div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Personalization Notes:</strong>
              <ul className="list-disc list-inside pl-2">
                {emailContent.personalizationNotes.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default EmailGeneratorSection;

