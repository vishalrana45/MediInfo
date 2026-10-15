import React, { useState } from 'react';
import { Sparkles, Mic, Volume2 } from 'lucide-react';
import { useLanguage } from '../../services/i18n';

interface FloatingAIAssistantButtonProps {
  onOpen: () => void;
}

export const FloatingAIAssistantButton: React.FC<FloatingAIAssistantButtonProps> = ({ onOpen }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id="floating-ai-assistant-wrapper"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech prompt bubble */}
      <div
        onClick={onOpen}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-indigo-200/80 shadow-lg text-slate-800 text-xs font-['Manrope'] font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-right-4 duration-300"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-indigo-950">
          {isHindi ? 'मदद चाहिए? बोलकर पूछें' : 'Need help? Tap to speak or ask AI'}
        </span>
        <div className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md text-[10px]">
          <Mic className="w-3 h-3" />
          <Volume2 className="w-3 h-3" />
        </div>
      </div>

      {/* Main Floating Trigger Button */}
      <button
        id="btn-floating-ai-assistant"
        type="button"
        onClick={onOpen}
        aria-label="Open Multilingual AI Health Assistant"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ring-4 ring-white/80"
      >
        {/* Glow halo */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 blur-sm group-hover:opacity-75 transition duration-300 animate-pulse pointer-events-none" />

        <div className="relative flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
          <div className="absolute -bottom-1 -right-1 bg-white text-indigo-700 rounded-full p-0.5 shadow-xs">
            <Mic className="w-3 h-3" />
          </div>
        </div>
      </button>
    </div>
  );
};
