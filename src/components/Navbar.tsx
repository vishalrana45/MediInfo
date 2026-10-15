import React from 'react';
import { MediInfoLogo } from './MediInfoLogo';
import { User, Bell, Globe } from 'lucide-react';
import { ActiveTab } from '../types';
import { useLanguage } from '../services/i18n';

interface NavbarProps {
  activeTab?: ActiveTab;
  onSelectTab?: (tab: ActiveTab) => void;
  onOpenScan?: () => void;
  onOpenHistory?: () => void;
  onOpenSaved?: () => void;
  onOpenProfile: () => void;
  onOpenReminders?: () => void;
  dueRemindersCount?: number;
  cabinetCount?: number;
  historyCount?: number;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectTab,
  onOpenProfile,
  onOpenReminders,
  dueRemindersCount = 0,
  cabinetCount,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <header className="navbar sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Unboxed, Standalone Medical Emblem & Brand Name 'MediInfo' */}
        <div className="flex items-center shrink-0">
          <button
            id="nav-logo-btn"
            onClick={() => {
              if (onSelectTab) onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center text-left focus:outline-none rounded-xl py-1 px-1.5 hover:opacity-95 transition-all cursor-pointer"
            aria-label="MediInfo Home"
          >
            <MediInfoLogo
              size="md"
              showText={true}
              showTagline={true}
              tagline={isHindi ? 'सम्पूर्ण स्वास्थ्य एवं दवा बुद्धिमत्ता' : 'Healthcare & Medicine Intelligence Platform'}
            />
          </button>
        </div>

        {/* Right: Dual Language Switcher, Reminders & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Dual Language Switcher */}
          <div
            id="nav-lang-switcher"
            className="flex items-center bg-slate-100/90 rounded-full p-1 border border-slate-200/80 text-xs font-bold font-['Manrope'] shadow-2xs"
            title="Switch Language / भाषा बदलें"
          >
            <div className="pl-1.5 pr-1 text-slate-500 hidden sm:flex items-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                !isHindi
                  ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                isHindi
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {onOpenReminders && (
            <button
              id="nav-reminders-btn"
              onClick={onOpenReminders}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-full bg-blue-50/80 hover:bg-blue-100/80 text-blue-900 border border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95 shadow-xs cursor-pointer"
              aria-label="Medicine Reminders"
              title="Medicine Reminders & Schedules"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-blue-600" />
                {dueRemindersCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                )}
              </div>
              <span className="text-xs font-bold font-['Manrope'] text-blue-900 pr-0.5 tracking-tight hidden md:inline">
                {t('nav_reminders')}
              </span>
              {dueRemindersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-black font-['Manrope']">
                  {dueRemindersCount}
                </span>
              )}
            </button>
          )}

          <button
            id="nav-profile-btn"
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-full bg-slate-100/80 hover:bg-slate-200/80 text-[#0F172A] border border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-95 shadow-xs cursor-pointer"
            aria-label="Profile and Settings"
            title="Profile & Settings"
          >
            <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold font-['Manrope'] text-[#0F172A] pr-0.5 tracking-tight hidden md:inline">
              {t('nav_profile')}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};


