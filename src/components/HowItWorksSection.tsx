import React from 'react';
import { Camera, Sparkles, BookOpen } from 'lucide-react';

export const HowItWorksSection: React.FC<{ onScanClick: () => void }> = ({ onScanClick }) => {
  const steps = [
    {
      step: 'STEP 01',
      title: 'SCAN',
      description: 'Take a photo of your medicine package, blister strip, bottle, or tablet.',
      icon: Camera,
      badge: 'Camera or Upload',
    },
    {
      step: 'STEP 02',
      title: 'IDENTIFY',
      description: 'MediInfo analyzes physical package contours, imprinted typography, and NDC markings.',
      icon: Sparkles,
      badge: 'Optical Package Analysis',
    },
    {
      step: 'STEP 03',
      title: 'UNDERSTAND',
      description: 'Explore organized clinical indications, safety precautions, dosages, and interactions.',
      icon: BookOpen,
      badge: 'Clinical Formulary',
    },
  ];

  return (
    <section id="how-it-works-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#2563EB] font-['Manrope']">
          How It Works
        </h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-['Manrope'] tracking-tight mt-1.5">
          Scan. Identify. Understand.
        </h3>
        <p className="text-sm text-[#64748B] font-['Inter'] mt-2">
          From photo to trusted clinical breakdown in three simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_-6px_rgba(15,23,42,0.08)] hover:border-blue-200 transition-all duration-300"
            >
              {/* Step indicator pill */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-extrabold font-['Manrope'] tracking-wider text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {item.step}
                </span>
                <span className="text-[11px] font-medium text-slate-400 font-['Inter']">
                  {item.badge}
                </span>
              </div>

              {/* 3D-styled Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-[#2563EB] mb-5 shadow-inner transition-transform group-hover:scale-105">
                <Icon className="w-7 h-7" />
              </div>

              {/* Title & Description */}
              <h4 className="text-xl font-extrabold text-[#0F172A] font-['Manrope'] mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-[#64748B] font-['Inter'] leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
