import React, { useState, useCallback } from 'react';
import TextAreaInput from '../components/TextAreaInput';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import MicrophoneButton from '../components/MicrophoneButton';
import SectionContainer from '../components/SectionContainer';
import geminiService from '../services/geminiService';
import { GeneralAiQueryInput, GeneralAiResponse } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { BRANDING_CONFIG } from '../constants';

const AiAssistantSection: React.FC = () => {
  const [userQuery, setUserQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');

  const handleFinalTranscript = useCallback((transcript: string) => {
    setUserQuery(prev => (prev ? prev + ' ' + transcript : transcript).trim());
    setInterimTranscript('');
  }, []);

  const handleInterimTranscriptUpdate = useCallback((transcript: string) => {
    setInterimTranscript(transcript);
  }, []);

  const { isListening, startListening, stopListening, error: speechError, hasRecognitionSupport } = useSpeechRecognition(handleInterimTranscriptUpdate, handleFinalTranscript);

  const handleSubmit = async () => {
    if (!userQuery.trim()) {
      setError('Please enter your query or question.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      
      const input: GeneralAiQueryInput = { userQuery };
      const result = await geminiService.getGeneralAiResponse(input, apiKey);
      
      if (result && result.responseText) {
        setAiResponse(result.responseText);
      } else {
        setError('Failed to get a response from the AI assistant. The response might be malformed or empty.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while communicating with the AI assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentQueryDisplay = isListening ? (userQuery ? userQuery + ' ' + interimTranscript : interimTranscript) : userQuery;

  return (
    <SectionContainer title="AI Assistant" onSubmit={handleSubmit} isLoading={isLoading}>
      <div>
        <label htmlFor="userQuery" className="block text-lg font-medium mb-2" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
          Your Query or Question
        </label>
        <p className="text-sm text-gray-300 mb-2">
          Ask the AI assistant anything related to email marketing, campaign ideas, content suggestions, or general advice. Use the microphone for voice input or type your query below.
        </p>
        <TextAreaInput
          id="userQuery"
          value={currentQueryDisplay}
          onChange={(e) => {
            if(!isListening) setUserQuery(e.target.value);
          }}
          placeholder="e.g., How can I improve my email subject lines for a B2B audience? or What are some creative ideas for a holiday email campaign?"
          rows={6}
        />
        <div className="mt-2 flex items-center space-x-2">
          {hasRecognitionSupport && (
            <MicrophoneButton
              isListening={isListening}
              onClick={isListening ? stopListening : startListening}
            />
          )}
          {isListening && <span className="text-sm" style={{color: BRANDING_CONFIG.brand.colors.primary}}>Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
        </div>
        {speechError && <p className="text-red-400 text-xs mt-1">{speechError}</p>}
        {!hasRecognitionSupport && <p className="text-yellow-400 text-xs mt-1">Speech recognition not supported by your browser.</p>}
      </div>

      <Button onClick={handleSubmit} disabled={isLoading || !userQuery.trim()} className="w-full sm:w-auto">
        {isLoading ? <LoadingSpinner /> : 'Send Query to AI'}
      </Button>

      {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md mt-4">{error}</p>}

      {aiResponse && (
        <div className="mt-8 p-6 rounded-lg shadow-inner" style={{backgroundColor: `rgba(0,0,0,0.2)`}}>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>AI Assistant's Response</h3>
          <div className="space-y-4 text-gray-200 whitespace-pre-wrap">
            {aiResponse}
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default AiAssistantSection;