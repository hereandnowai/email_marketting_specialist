
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionHook {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  hasRecognitionSupport: boolean;
}

const useSpeechRecognition = (
  onInterimTranscript: (transcript: string) => void,
  onFinalTranscript: (transcript: string) => void
): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const hasRecognitionSupport = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!hasRecognitionSupport) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
        setError('Speech recognition API could not be found in this browser.');
        return;
    }
    
    const recogInstance = new SpeechRecognitionAPI();
    recogInstance.continuous = false; // Process speech in segments
    recogInstance.interimResults = true;
    recogInstance.lang = 'en-US';

    recogInstance.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscriptChunk = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptChunk += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }
      onInterimTranscript(interimTranscript);
      if (finalTranscriptChunk) {
        onFinalTranscript(finalTranscriptChunk.trim());
      }
    };

    recogInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = `Speech recognition error: ${event.error}`;
      if (event.error === 'no-speech') {
        errorMessage = "No speech detected. Please try again.";
      } else if (event.error === 'audio-capture') {
        errorMessage = "Audio capture failed. Ensure microphone is enabled and permitted.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Microphone access denied. Please allow microphone access in browser settings.";
      }
      setError(errorMessage);
      if (recognitionRef.current && isListening) recognitionRef.current.stop();
      setIsListening(false);
    };
    
    recogInstance.onend = () => {
        // This is called when recognition stops.
        // If it was listening and stopped not by user action (e.g. end of speech segment with continuous=false)
        // we set isListening to false.
        if (isListening) {
             setIsListening(false);
        }
    };
    
    recognitionRef.current = recogInstance;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        if (isListening) { // Ensure stop is called if component unmounts while listening
            recognitionRef.current.stop();
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [hasRecognitionSupport, onInterimTranscript, onFinalTranscript]); // isListening removed from deps to avoid re-binding listeners on its change

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscriptState({ interim: '', finalAccumulated: ''}); // Reset transcripts
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (e: any) {
        setError(`Could not start recognition: ${e.message}`);
        setIsListening(false);
      }
    }
  }, [isListening]); // Removed transcriptStateRef from deps

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Helper state to manage transcript accumulation for the hook consumer
  const [transcriptState, setTranscriptState] = useState({ interim: '', finalAccumulated: '' });

  useEffect(() => {
    if (isListening) {
      const currentFinal = transcriptState.finalAccumulated;
       onInterimTranscript(currentFinal + (currentFinal ? ' ' : '') + transcriptState.interim);
    }
  }, [transcriptState.interim, isListening, transcriptState.finalAccumulated, onInterimTranscript]);


  return { isListening, startListening, stopListening, error, hasRecognitionSupport };
};

export default useSpeechRecognition;
