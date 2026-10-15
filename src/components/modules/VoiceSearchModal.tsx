import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Search,
  Sparkles,
  Pill,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MEDICINES, searchMedicinesQuick, findMedicineByNameOrQuery } from '../../data/medicineDatabase';
import { Medicine } from '../../types';
import { useLanguage } from '../../services/i18n';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedicine: (medicine: Medicine) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectMedicine,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchedResults, setMatchedResults] = useState<Medicine[]>([]);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setTranscript('');
      setMatchedResults([]);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError(
        isHindi
          ? 'आपके ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है। कृपया नीचे दिए गए उदाहरणों का उपयोग करें।'
          : 'Speech recognition is not supported in this browser. You can click any test phrase below.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isHindi ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        if (currentTranscript.trim().length > 1) {
          const results = searchMedicinesQuick(currentTranscript, 4);
          setMatchedResults(results);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError(
            isHindi
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत है। कृपया ब्राउज़र में माइक अनुमति दें।'
              : 'Microphone permission was denied. Please allow microphone access or pick a prompt below.'
          );
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Speech initialization exception:', e);
      setIsListening(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen, isHindi]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setMatchedResults([]);
      setMicError(null);
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 150);
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSelectSimulatedPrompt = (query: string) => {
    setTranscript(query);
    setIsListening(false);
    const results = searchMedicinesQuick(query, 4);
    setMatchedResults(results);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col font-['Inter']"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <Mic className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-['Manrope'] text-white">
                  {isHindi ? 'आवाज से दवाई खोजें' : 'Hands-Free Voice Medicine Search'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold font-['Manrope']">
                  Voice Ready
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">
                {isHindi
                  ? 'दवाई या बीमारी का नाम बोलें — जैसे "पैरासिटामोल" या "सिर दर्द"'
                  : 'Say any brand name, active molecule or symptom'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-center">
          {/* Pulsing Mic Circle */}
          <div className="py-4 flex flex-col items-center justify-center">
            <div className="relative">
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                  <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-pulse" />
                </>
              )}
              <button
                type="button"
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white ring-4 ring-rose-200'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white hover:shadow-xl'
                }`}
              >
                {isListening ? (
                  <Mic className="w-10 h-10 animate-bounce" />
                ) : (
                  <MicOff className="w-10 h-10 text-white/80" />
                )}
              </button>
            </div>

            <div className="mt-4">
              <span className="text-sm font-extrabold font-['Manrope'] text-slate-900 block">
                {isListening
                  ? isHindi
                    ? 'सुन रहे हैं... बोलिए'
                    : 'Listening... Speak medicine name or symptom'
                  : isHindi
                  ? 'शुरू करने के लिए माइक दबाएँ'
                  : 'Tap microphone to start speaking'}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {isHindi ? 'भाषा: हिन्दी / अंग्रेजी' : 'Language: English / Hindi phonetics'}
              </span>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 min-h-[64px] flex items-center justify-center text-slate-800">
            {transcript ? (
              <span className="text-base font-bold text-blue-900 font-['Manrope']">
                "{transcript}"
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">
                {isHindi ? 'यहाँ आपकी आवाज़ दिखाई देगी...' : 'Your spoken words will appear here...'}
              </span>
            )}
          </div>

          {/* Mic Error Notice */}
          {micError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{micError}</span>
            </div>
          )}

          {/* Matched Medicines */}
          {matchedResults.length > 0 && (
            <div className="text-left space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 font-['Manrope']">
                {isHindi ? 'पहचानी गई दवाइयाँ:' : 'Matches Found:'}
              </span>
              <div className="space-y-2">
                {matchedResults.map((med) => (
                  <button
                    key={med.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectMedicine(med);
                    }}
                    className="w-full p-3.5 rounded-2xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between text-left group shadow-2xs cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 font-['Manrope']">
                          {med.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {med.genericName} • {med.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Click Prompts */}
          <div className="pt-2 text-left">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {isHindi ? 'या सीधे क्लिक करके आज़माएँ:' : 'Or tap sample voice queries:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Dolo 650',
                'Combiflam',
                'Pan 40',
                'Azithromycin',
                'Cetirizine',
                'Fever & Body pain',
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSelectSimulatedPrompt(q)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold border border-slate-200/80 transition cursor-pointer"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Microphone audio processed locally on-device.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-['Manrope'] font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
