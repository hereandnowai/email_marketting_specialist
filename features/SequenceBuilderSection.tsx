import React, { useState, useCallback } from 'react';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import MicrophoneButton from '../components/MicrophoneButton';
import SectionContainer from '../components/SectionContainer';
import geminiService from '../services/geminiService';
import { EmailSequenceInput, EmailSequenceResponse, EmailInSequence } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { BRANDING_CONFIG } from '../constants';

type SequenceTypeOption = 'Welcome Series' | 'Abandoned Cart' | 'Post-Purchase' | 'Re-engagement';

const SequenceBuilderSection: React.FC = () => {
  const [input, setInput] = useState<EmailSequenceInput>({
    sequenceType: 'Welcome Series', customerTrigger: '', businessGoal: '', sequenceLength: ''
  });
  const [sequence, setSequence] = useState<EmailSequenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMicField, setActiveMicField] = useState<keyof EmailSequenceInput | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  const sequenceTypeOptions: SequenceTypeOption[] = ['Welcome Series', 'Abandoned Cart', 'Post-Purchase', 'Re-engagement'];

  const inputFields: Array<{ name: keyof EmailSequenceInput, label: string, placeholder?: string, type?: 'text' | 'select', options?: string[], required?: boolean }> = [
    { name: 'sequenceType', label: 'Sequence Type', type: 'select', options: sequenceTypeOptions, required: true },
    { name: 'customerTrigger', label: 'Customer Trigger', placeholder: 'e.g., Signs up, Adds to cart but leaves, Makes a purchase, Inactive for 30 days', type: 'text', required: true },
    { name: 'businessGoal', label: 'Business Goal', placeholder: 'e.g., Onboard new users, Recover lost sales, Increase LTV, Win back customers', type: 'text', required: true },
    { name: 'sequenceLength', label: 'Sequence Length & Timeframe', placeholder: 'e.g., 3 emails over 5 days, 4 emails over 2 weeks', type: 'text', required: true },
  ];
  
  const requiredSequenceInputKeys: (keyof EmailSequenceInput)[] = inputFields
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleListening = (fieldName: keyof EmailSequenceInput) => {
    if (fieldName === 'sequenceType') return; // Not for select
    if (isListening && activeMicField === fieldName) {
      stopListening();
      setActiveMicField(null);
    } else {
      if(isListening) stopListening();
      setActiveMicField(fieldName);
      startListening();
    }
  };

  const getInputValue = (fieldName: keyof EmailSequenceInput): string => {
    const currentValue = input[fieldName] || '';
    if (isListening && activeMicField === fieldName) {
      return (currentValue ? currentValue + ' ' + interimTranscript : interimTranscript).trim();
    }
    return currentValue;
  };

  const handleSubmit = async () => {
    if (requiredSequenceInputKeys.some(field => !(input[field] || '').trim())) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSequence(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      const result = await geminiService.generateEmailSequence(input, apiKey);
      if (result) {
        setSequence(result);
      } else {
        setError('Failed to generate email sequence. Response might be malformed or empty.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while generating sequence.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderEmailCard = (email: EmailInSequence, index: number) => (
    <div key={index} className="p-4 bg-gray-700 bg-opacity-50 rounded-lg shadow">
      <h5 className="font-semibold text-lg mb-1" style={{color: BRANDING_CONFIG.brand.colors.primary}}>Email {index + 1}: {email.subjectLine}</h5>
      <p className="text-sm"><strong className="text-gray-400">Timing:</strong> {email.timing}</p>
      <p className="text-sm mt-1"><strong className="text-gray-400">Content Focus:</strong> {email.contentFocus}</p>
      <p className="text-sm mt-1"><strong className="text-gray-400">CTA:</strong> {email.cta}</p>
      {email.personalization && email.personalization.length > 0 && <p className="text-sm mt-1"><strong className="text-gray-400">Personalization:</strong> {email.personalization.join(', ')}</p>}
      {email.exitConditions && <p className="text-sm mt-1"><strong className="text-gray-400">Exit Conditions:</strong> {email.exitConditions}</p>}
    </div>
  );

  return (
    <SectionContainer title="Automated Email Sequence Builder" onSubmit={handleSubmit} isLoading={isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFields.map(({ name, label, placeholder, type = 'text', options, required }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-lg font-medium mb-1" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
              {label} {required && <span className="text-red-400">*</span>}
            </label>
            <div className="flex items-center">
                {type === 'select' ? (
                    <select id={name} name={name} value={input[name]} onChange={handleInputChange} 
                     className="w-full p-3 border rounded-md shadow-sm bg-gray-700 border-gray-600 text-gray-200 focus:ring-2 focus:outline-none transition-colors duration-150 flex-grow"
                     style={{borderColor: BRANDING_CONFIG.brand.colors.secondary, color: BRANDING_CONFIG.brand.colors.primary, backgroundColor: `rgba(0,0,0,0.2)`, caretColor: BRANDING_CONFIG.brand.colors.primary, '--tw-ring-color': BRANDING_CONFIG.brand.colors.primary} as React.CSSProperties}
                    >
                        {options?.map(opt => <option key={opt} value={opt} style={{backgroundColor: BRANDING_CONFIG.brand.colors.secondary, color: BRANDING_CONFIG.brand.colors.primary}}>{opt}</option>)}
                    </select>
                ) : (
                    <TextInput id={name} name={name} value={getInputValue(name)} onChange={handleInputChange} placeholder={placeholder} className="flex-grow"/>
                )}
                {type === 'text' && hasRecognitionSupport && ( <MicrophoneButton isListening={isListening && activeMicField === name} onClick={() => toggleListening(name)} className="ml-2"/> )}
            </div>
            {type === 'text' && isListening && activeMicField === name && <span className="text-xs text-yellow-400 mt-1">Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
          </div>
        ))}
      </div>
      {speechError && activeMicField && <p className="text-red-400 text-xs mt-1">{speechError}</p>}
      {!hasRecognitionSupport && <p className="text-yellow-400 text-xs mt-1">Speech recognition not supported.</p>}

      <Button onClick={handleSubmit} disabled={isLoading || requiredSequenceInputKeys.some(field => !(input[field] || '').trim())} className="w-full sm:w-auto mt-6">
        {isLoading ? <LoadingSpinner /> : 'Build Sequence'}
      </Button>

      {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md mt-4">{error}</p>}

      {sequence && (
        <div className="mt-8 p-6 rounded-lg shadow-inner" style={{backgroundColor: `rgba(0,0,0,0.2)`}}>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>{sequence.sequenceName}</h3>
          <p className="text-gray-300 mb-4">Generated sequence with {sequence.emails.length} email(s):</p>
          <div className="space-y-4">
            {sequence.emails.map(renderEmailCard)}
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default SequenceBuilderSection;