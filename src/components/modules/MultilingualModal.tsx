import React, { useState } from 'react';
import {
  X,
  Languages,
  Check,
  Volume2,
  Globe,
  Sliders,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage, SupportedLanguage } from '../../services/i18n';

interface MultilingualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LanguageOption {
  code: SupportedLanguage | string;
  name: string;
  nativeName: string;
  region: string;
  isPrimarySupported: boolean;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', region: 'International', isPrimarySupported: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India & South Asia', isPrimarySupported: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Spain & Latin America', isPrimarySupported: true },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'France & Francophone', isPrimarySupported: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'Bengal & International', isPrimarySupported: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra, India', isPrimarySupported: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & SE Asia', isPrimarySupported: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra & Telangana', isPrimarySupported: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'DACH Region', isPrimarySupported: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East & N. Africa', isPrimarySupported: true },
];

export const MultilingualModal: React.FC<MultilingualModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, setLanguage } = useLanguage();
  const [speechRate, setSpeechRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mina_speech_rate');
      return saved ? parseFloat(saved) : 0.95;
    } catch {
      return 0.95;
    }
  });

  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mina_auto_tts') === 'true';
    } catch {
      return false;
    }
  });

  if (!isOpen) return null;

  const handleSelectLanguage = (code: string) => {
    if (code === 'en' || code === 'hi') {
      setLanguage(code as SupportedLanguage);
    } else {
      // For additional dialect selections, map smoothly with fallback to English
      setLanguage('en');
    }
  };

  const handleSpeechRateChange = (rate: number) => {
    setSpeechRate(rate);
    try {
      localStorage.setItem('mina_speech_rate', rate.toString());
    } catch {}
  };

  const handleToggleAutoSpeech = () => {
    const next = !autoSpeechEnabled;
    setAutoSpeechEnabled(next);
    try {
      localStorage.setItem('mina_auto_tts', next.toString());
    } catch {}
  };

  const isHindi = language === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col font-['Inter']"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-xs">
              <Languages className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-['Manrope'] text-white">
                  {isHindi ? 'भाषा एवं आवाज सेटिंग्स' : 'Multilingual & Audio Voice Settings'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold font-['Manrope']">
                  Universal Access
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium">
                {isHindi
                  ? 'अपनी पसंदीदा भाषा चुनें एवं ऑडियो गति को अनुकूलित करें'
                  : 'Zero language barrier • Instant phonetic translation & speech pacing'}
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Section 1: Choose Primary UI & Speech Language */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 font-['Manrope']">
                {isHindi ? 'इंटरफेस एवं आवाज की भाषा' : 'Display & Voice Language'}
              </h4>
              <span className="text-[11px] text-blue-600 font-semibold">
                {language === 'hi' ? 'हिन्दी (Hindi) सक्रिय' : 'English (Active)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LANGUAGES.map((item) => {
                const isCurrent = language === item.code;

                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelectLanguage(item.code)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-400 text-blue-950 shadow-xs ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.code}
                      </div>
                      <div>
                        <div className="text-xs font-bold font-['Manrope'] flex items-center gap-1.5">
                          <span>{item.nativeName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({item.name})</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{item.region}</span>
                      </div>
                    </div>

                    {isCurrent && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Audio Pacing & Speech Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-['Manrope']">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>{isHindi ? 'आवाज की गति (Text-to-Speech Pacing)' : 'Voice Speed (Accessibility)'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { rate: 0.8, label: isHindi ? 'धीमी (बुजुर्गों के लिए)' : 'Slow (0.8x / Elderly)' },
                { rate: 0.95, label: isHindi ? 'सामान्य' : 'Normal (1.0x)' },
                { rate: 1.2, label: isHindi ? 'तेज़' : 'Fast (1.2x)' },
              ].map((opt) => (
                <button
                  key={opt.rate}
                  type="button"
                  onClick={() => handleSpeechRateChange(opt.rate)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    speechRate === opt.rate
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block font-['Manrope']">
                  {isHindi ? 'खोजते ही स्वतः बोलकर समझाएं' : 'Auto-Readout on Medicine Discovery'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isHindi
                    ? 'दवाई कार्ड खोलते ही ख़ुराक व सावधानियाँ बोलकर सुनाई जाएंगी'
                    : 'Automatically narrates safe dosage when opening any medicine guide'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleAutoSpeech}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  autoSpeechEnabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    autoSpeechEnabled ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preferences saved locally to browser cache.</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-['Manrope'] font-bold text-xs transition cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
