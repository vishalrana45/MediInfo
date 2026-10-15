import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Search, ArrowRight, Sparkles, CheckCircle2, Clock, AlertTriangle, Pill, X } from 'lucide-react';
import { searchMedicinesQuick } from '../data/medicineDatabase';
import { Medicine } from '../types';
import { getFriendlyCategory, getFriendlyUses } from '../utils/patientFriendlyText';
import { useLanguage } from '../services/i18n';

interface PrimaryScannerProps {
  onOpenScanCamera: () => void;
  onUploadImage: (file: File) => void;
  onSearchMedicine: (query: string) => void;
  onSelectMedicineName: (name: string) => void;
}

export const PrimaryScanner: React.FC<PrimaryScannerProps> = ({
  onOpenScanCamera,
  onUploadImage,
  onSearchMedicine,
  onSelectMedicineName,
}) => {
  const { language, t } = useLanguage();
  const isHindi = language === 'hi';
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
    e.target.value = '';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (quickMatches.length > 0) {
        handleSelectQuickMatch(quickMatches[0]);
      } else {
        onSelectMedicineName(searchQuery.trim());
        setSearchQuery('');
        setIsSearchFocused(false);
      }
    }
  };

  const handleSelectQuickMatch = (med: Medicine) => {
    onSelectMedicineName(med.name);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const popularMedicines = ['Dolo 650', 'Combiflam', 'Pan 40', 'Azithromycin', 'Paracetamol', 'Meftal-Spas', 'Montair LC', 'Cetirizine'];
  const quickMatches = searchQuery.trim() ? searchMedicinesQuick(searchQuery, 4) : [];

  return (
    <section id="primary-scanner-section" className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
      {/* One Large White Rounded Card */}
      <div
        id="primary-scanner-card"
        className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_12px_40px_-10px_rgba(15,23,42,0.08),0_2px_8px_0_rgba(15,23,42,0.03)]"
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Emergency Pill Identifier Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-xs font-black uppercase tracking-wider font-['Manrope'] mb-3">
            <span>{isHindi ? 'सत्यापित क्लिनिकल पहचान' : 'Instant Identification & Guidance'}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] tracking-tight text-[#0F172A]">
            {isHindi ? 'किसी भी दवाई की तुरंत जाँच करें' : 'Identify Any Medicine Instantly'}
          </h2>

          {/* Purpose Description */}
          <p className="mt-2 text-sm sm:text-base text-[#64748B] font-['Inter']">
            {isHindi
              ? 'कैमरे से दवाई का पत्ता या गोली स्कैन करें अथवा नाम लिखकर उपयोग, सही ख़ुराक, साइड इफेक्ट्स व सावधानियाँ जानें।'
              : 'Scan a pill or package with your camera, or search by name to get plain-English uses, safe dosages, and critical warnings.'}
          </p>

          {/* Two Large Action Buttons (Medicine Scan & Upload) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* 1. Scan Medicine Button */}
            <button
              id="btn-scan-medicine-primary"
              onClick={onOpenScanCamera}
              className="group relative flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-sm shadow-[0_4px_16px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_22px_rgba(37,99,235,0.35)] transition-all duration-200 active:scale-[0.99] cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-white/15 flex items-center justify-center transition-transform group-hover:scale-110">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span>{isHindi ? 'दवाई स्कैन करें (Pill)' : 'Scan Medicine'}</span>
            </button>

            {/* 2. Upload Image Button */}
            <button
              id="btn-upload-image-primary"
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[#0F172A] border border-slate-200/90 font-['Manrope'] font-bold text-sm transition-all duration-200 hover:border-slate-300 active:scale-[0.99] cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 transition-transform group-hover:scale-110">
                <Upload className="w-4 h-4 text-[#2563EB]" />
              </div>
              <span>{isHindi ? 'फोटो अपलोड करें' : 'Upload Image'}</span>
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Divider: OR */}
          <div className="relative my-7 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-white px-4">
              <span className="text-xs font-bold font-['Manrope'] tracking-widest text-[#64748B] uppercase">
                {isHindi ? 'अथवा नाम से खोजें' : 'OR SEARCH QUICKLY'}
              </span>
            </div>
          </div>

          {/* Search Bar Container with Live Instant Dropdown */}
          <div ref={searchContainerRef} className="relative text-left">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <div className="absolute left-4.5 text-slate-400 pointer-events-none">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  id="scanner-search-input"
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  placeholder={
                    isHindi
                      ? 'दवाई का नाम लिखें (जैसे पैरासिटामोल, डोलो 650, एमोक्सिसिलिन)...'
                      : 'Type a medicine name (e.g. Paracetamol, Ibuprofen)...'
                  }
                  className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-slate-50/90 border border-slate-200 text-[#0F172A] placeholder-slate-400 font-['Inter'] text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                />
                {searchQuery.trim() && (
                  <button
                    type="submit"
                    id="scanner-search-submit-btn"
                    className="absolute right-2.5 p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
                    title={isHindi ? 'सर्च करें' : 'Search medicine'}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* INSTANT HIGH-YIELD SEARCH PREVIEW (Zero Clutter, Fast Understanding) */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 overflow-hidden max-h-[380px] overflow-y-auto">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-['Manrope']">
                  <span className="font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Instant Clinical Summary
                  </span>
                  <span>Click to view guide</span>
                </div>

                {quickMatches.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {quickMatches.map((med) => (
                      <div
                        key={med.id}
                        id={`quick-search-${med.id}`}
                        onClick={() => handleSelectQuickMatch(med)}
                        className="p-3.5 sm:p-4 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                      >
                        {/* Title Row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: med.visualColor || '#2563EB' }}
                            />
                            <h4 className="font-black text-sm sm:text-base text-slate-900 font-['Manrope'] group-hover:text-blue-600 transition-colors">
                              {med.name}
                            </h4>
                            <span className="text-xs text-slate-400 font-medium font-['Inter']">
                              ({med.genericName})
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-['Manrope'] shrink-0">
                            {getFriendlyCategory(med)}
                          </span>
                        </div>

                        {/* Clear Use & Dosage info */}
                        <div className="mt-2 space-y-1 text-xs font-['Inter']">
                          {/* Treats */}
                          <div className="flex items-start gap-1.5 text-emerald-900 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>What It Treats:</strong> {getFriendlyUses(med).slice(0, 2).join(' • ')}
                            </span>
                          </div>

                          {/* Dose */}
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>
                              {med.dosage.general.split('.')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-['Inter']">
                      <span>Press <b>Enter</b> or click any result to view full guide</span>
                      <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => handleSelectQuickMatch(quickMatches[0])}>
                        Open {quickMatches[0].name} &rarr;
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center text-xs text-slate-500 font-['Inter']">
                    <p className="font-semibold text-slate-700">Open instant safety profile for &quot;{searchQuery}&quot;</p>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Manrope'] shadow-xs transition-colors cursor-pointer"
                    >
                      <span>View &quot;{searchQuery}&quot; Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Below Search: Popular Medicines */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            <span className="text-[#64748B] font-['Inter'] font-medium">Popular:</span>
            {popularMedicines.map((med) => (
              <button
                key={med}
                id={`popular-med-${med.toLowerCase()}`}
                onClick={() => onSelectMedicineName(med)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-[#0F172A] font-['Manrope'] font-semibold transition-colors border border-slate-200/60 hover:border-blue-200 cursor-pointer"
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
