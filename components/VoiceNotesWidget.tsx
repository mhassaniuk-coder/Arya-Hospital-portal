import React, { useState } from 'react';
import { Mic, MicOff, Loader2, Sparkles, FileText, Heart, Brain, X, ChevronDown, ChevronUp } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface ClinicalNote {
    structuredNote: string;
    symptoms: string[];
    mood: string;
    recommendations: string[];
}

export const VoiceNotesWidget: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [note, setNote] = useState<ClinicalNote | null>(null);
    const [expanded, setExpanded] = useState(true);
    const [savedNotes, setSavedNotes] = useState<ClinicalNote[]>([]);

    const startListening = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = 0; i < event.results.length; i++) {
                    finalTranscript += event.results[i][0].transcript;
                }
                setTranscript(finalTranscript);
            };
            recognition.onerror = () => setIsListening(false);

            if (isListening) {
                recognition.stop();
            } else {
                setTranscript('');
                setNote(null);
                recognition.start();
            }
        } else {
            alert('Speech recognition is not supported in this browser.');
        }
    };

    const processNote = async () => {
        if (!transcript.trim()) return;
        setIsProcessing(true);
        try {
            const result = await geminiService.generateClinicalNote(transcript);
            setNote(result);
        } catch {
            setNote({ structuredNote: transcript, symptoms: [], mood: 'Unknown', recommendations: [] });
        }
        setIsProcessing(false);
    };

    const saveNote = () => {
        if (note) {
            setSavedNotes(prev => [note, ...prev]);
            setNote(null);
            setTranscript('');
        }
    };

    const getMoodEmoji = (mood: string) => {
        const m = mood.toLowerCase();
        if (m.includes('happy') || m.includes('good') || m.includes('positive')) return '😊';
        if (m.includes('anxious') || m.includes('worried') || m.includes('nervous')) return '😟';
        if (m.includes('sad') || m.includes('down') || m.includes('depressed')) return '😢';
        if (m.includes('pain') || m.includes('hurt')) return '😣';
        if (m.includes('tired') || m.includes('fatigue')) return '😴';
        return '🔵';
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-arya-50 to-indigo-50 border-b border-arya-100"
            >
                <div className="flex items-center gap-2">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                        <Mic size={16} className="text-arya-600" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm">AI Voice Notes</span>
                    <span className="text-[10px] bg-arya-100 text-arya-700 px-2 py-0.5 rounded-full font-bold">
                        {savedNotes.length} saved
                    </span>
                </div>
                {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>

            {expanded && (
                <div className="p-4 space-y-4">
                    {/* Recording Control */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={startListening}
                            className={`p-3 rounded-full transition-all ${isListening
                                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                                    : 'bg-arya-100 text-arya-600 hover:bg-arya-200'
                                }`}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <div className="flex-grow">
                            <p className="text-sm font-medium text-slate-700">
                                {isListening ? '🔴 Recording... Speak now' : 'Tap to record how you are feeling'}
                            </p>
                            <p className="text-xs text-slate-400">AI will structure your note</p>
                        </div>
                    </div>

                    {/* Live Transcript */}
                    {transcript && (
                        <div className="space-y-3 animate-fade-in">
                            <textarea
                                value={transcript}
                                onChange={(e) => setTranscript(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none h-20 focus:ring-2 focus:ring-arya-200 outline-none"
                                placeholder="Your transcribed text appears here..."
                            />
                            <button
                                onClick={processNote}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-arya-600 to-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {isProcessing ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <><Brain size={14} /> Structure with AI</>}
                            </button>
                        </div>
                    )}

                    {/* Structured Note Result */}
                    {note && (
                        <div className="space-y-3 animate-fade-in">
                            <div className="bg-arya-50 p-4 rounded-2xl border border-arya-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-arya-900 text-sm flex items-center gap-1">
                                        <FileText size={14} /> Clinical Note
                                    </h4>
                                    <span className="text-lg">{getMoodEmoji(note.mood)} </span>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-line">{note.structuredNote}</p>
                            </div>

                            {note.symptoms.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {note.symptoms.map((s, i) => (
                                        <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded-full border border-red-100">{s}</span>
                                    ))}
                                </div>
                            )}

                            {note.recommendations.length > 0 && (
                                <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                                    <p className="text-[10px] font-bold text-green-600 uppercase mb-1">AI Recommendations</p>
                                    {note.recommendations.map((r, i) => (
                                        <p key={i} className="text-xs text-green-700">• {r}</p>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={saveNote}
                                className="w-full py-2 border border-arya-200 text-arya-700 rounded-xl font-medium text-sm hover:bg-arya-50 transition-all"
                            >
                                Save Note
                            </button>
                        </div>
                    )}

                    {/* Saved Notes */}
                    {savedNotes.length > 0 && (
                        <div className="space-y-2 border-t border-slate-100 pt-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Previous Notes</p>
                            {savedNotes.map((sn, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                                    <span>{getMoodEmoji(sn.mood)}</span>
                                    <p className="line-clamp-2">{sn.structuredNote}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
