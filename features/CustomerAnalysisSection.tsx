
import React, { useState, useCallback, useRef } from 'react';
import TextAreaInput from '../components/TextAreaInput';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import MicrophoneButton from '../components/MicrophoneButton';
import SectionContainer from '../components/SectionContainer';
import geminiService from '../services/geminiService';
import { CustomerAnalysisInput, CustomerAnalysisResponse } from '../types';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { BRANDING_CONFIG } from '../constants';

const CustomerAnalysisSection: React.FC = () => {
  const [customerData, setCustomerData] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<CustomerAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFinalTranscript = useCallback((transcript: string) => {
    setCustomerData(prev => (prev ? prev + ' ' + transcript : transcript).trim());
    setInterimTranscript('');
  }, []);

  const handleInterimTranscriptUpdate = useCallback((transcript: string) => {
    setInterimTranscript(transcript);
  }, []);

  const { isListening, startListening, stopListening, error: speechError, hasRecognitionSupport } = useSpeechRecognition(handleInterimTranscriptUpdate, handleFinalTranscript);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCustomerData(text);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setSelectedFileName(null);
        setCustomerData('');
      };
      reader.readAsText(file);
    }
    // Reset file input value so the same file can be re-uploaded if needed
    if (event.target) {
        event.target.value = '';
    }
  };

  const clearFile = () => {
    setSelectedFileName(null);
    setCustomerData('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!customerData.trim()) {
      setError('Please enter or upload customer data.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key not found.");
      
      const input: CustomerAnalysisInput = { customerData };
      const result = await geminiService.analyzeCustomerData(input, apiKey);
      if (result) {
        setAnalysisResult(result);
      } else {
        setError('Failed to get analysis. The response might be malformed or empty.');
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionContainer title="Customer Data Analysis" onSubmit={handleSubmit} isLoading={isLoading}>
      <div>
        <label htmlFor="customerData" className="block text-lg font-medium mb-2" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>
          Customer Data Input
        </label>
        <p className="text-sm text-gray-300 mb-1">
          Paste customer data, type directly, use voice input, or upload a file (.txt, .csv, .json). 
          The data can be a plain text description, a JSON object/array string, or CSV data. 
          Uploading a file will replace existing content in the text area. The AI will attempt to understand the provided format.
        </p>
        
        <input
          type="file"
          id="fileUpload"
          ref={fileInputRef}
          accept=".txt,.csv,.json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload customer data file"
        />
        <div className="flex flex-wrap items-center gap-2 mb-2">
            <Button onClick={triggerFileInput} variant="secondary" type="button" className="text-sm py-2 px-4">
            Upload File
            </Button>
            {selectedFileName && (
            <div className="flex items-center gap-2 text-sm p-2 rounded-md" style={{backgroundColor: `rgba(0,0,0,0.1)`, color: BRANDING_CONFIG.brand.colors.primary}}>
                <span>{selectedFileName}</span>
                <button 
                    onClick={clearFile} 
                    className="text-red-400 hover:text-red-300 text-xs"
                    aria-label="Clear selected file"
                >
                    &times; Clear
                </button>
            </div>
            )}
        </div>

        <TextAreaInput
          id="customerData"
          value={isListening ? (customerData ? customerData + ' ' + interimTranscript : interimTranscript) : customerData}
          onChange={(e) => {
            if(!isListening) {
                setCustomerData(e.target.value);
                // If user types, it implies they are not using the uploaded file's content directly
                // We could clear selectedFileName here, or let it persist as an indicator of original source
                // For simplicity, let's allow edits without clearing selectedFileName immediately.
                // If they re-upload, it will naturally update.
            }
          }}
          placeholder="Enter customer data details here (plain text, JSON, or CSV), or upload a file..."
          rows={10}
          aria-label="Customer data text area"
        />
        <div className="mt-2 flex items-center space-x-2">
          {hasRecognitionSupport && (
            <MicrophoneButton
              isListening={isListening}
              onClick={isListening ? stopListening : startListening}
              aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            />
          )}
          {isListening && <span className="text-sm" style={{color: BRANDING_CONFIG.brand.colors.primary}}>Listening... {interimTranscript && `"${interimTranscript}"`}</span>}
        </div>
        {speechError && <p className="text-red-400 text-xs mt-1">{speechError}</p>}
        {!hasRecognitionSupport && <p className="text-yellow-400 text-xs mt-1">Speech recognition not supported by your browser.</p>}
      </div>

      <Button onClick={handleSubmit} disabled={isLoading || !customerData.trim()} className="w-full sm:w-auto mt-4">
        {isLoading ? <LoadingSpinner /> : 'Analyze Data'}
      </Button>

      {error && <p className="text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md mt-4">{error}</p>}

      {analysisResult && (
        <div className="mt-8 p-6 rounded-lg shadow-inner" style={{backgroundColor: `rgba(0,0,0,0.2)`}}>
          <h3 className="text-2xl font-semibold mb-4" style={{ color: BRANDING_CONFIG.brand.colors.primary }}>Analysis Results</h3>
          <div className="space-y-4 text-gray-200">
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Profile Summary:</strong> <p className="pl-2 whitespace-pre-wrap">{analysisResult.profileSummary}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Segments:</strong> <p className="pl-2">{analysisResult.segments.join(', ')}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Personalization Opportunities:</strong> <ul className="list-disc list-inside pl-2">{analysisResult.personalizationOpportunities.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Content Themes:</strong> <ul className="list-disc list-inside pl-2">{analysisResult.contentThemes.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Product Suggestions:</strong> <ul className="list-disc list-inside pl-2">{analysisResult.productSuggestions.map((item, i) => <li key={i}>{item}</li>)}</ul></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Optimal Frequency:</strong> <p className="pl-2">{analysisResult.optimalFrequency}</p></div>
            <div><strong style={{color: BRANDING_CONFIG.brand.colors.primary}}>Optimal Timing:</strong> <p className="pl-2">{analysisResult.optimalTiming}</p></div>
          </div>
        </div>
      )}
    </SectionContainer>
  );
};

export default CustomerAnalysisSection;
