
import React from 'react';
import { MicrophoneIcon, StopIcon, BRANDING_CONFIG } from '../constants';

interface MicrophoneButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ isListening, onClick, disabled, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-full transition-colors duration-150 ${
        isListening ? 'bg-red-500 hover:bg-red-600' : 'hover:opacity-80'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ 
        backgroundColor: isListening ? '#EF4444' : BRANDING_CONFIG.brand.colors.primary,
        color: isListening ? 'white' : BRANDING_CONFIG.brand.colors.secondary
      }}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
    >
      {isListening ? (
        <StopIcon className="h-5 w-5" />
      ) : (
        <MicrophoneIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default MicrophoneButton;
