import React, { useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    isListening?: boolean;
    className?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className }) => {
    const { isListening, transcript, startListening, stopListening, resetTranscript, hasRecognitionSupport } = useSpeechRecognition();

    useEffect(() => {
        if (transcript) {
            onTranscript(transcript);
        }
    }, [transcript, onTranscript]);

    if (!hasRecognitionSupport) {
        return null; // Or render a disabled mic icon with tooltip
    }

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            resetTranscript();
            startListening();
        }
    };

    return (
        <div className={`relative ${className}`}>
            <AnimatePresence>
                {isListening && (
                    <motion.div
                        className="absolute inset-0 bg-red-100 rounded-full opacity-50"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                )}
            </AnimatePresence>
            <button
                type="button"
                onClick={toggleListening}
                className={`relative z-10 p-2 rounded-full transition-colors ${isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-arya-600'
                    }`}
                title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
        </div>
    );
};
