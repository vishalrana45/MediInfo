import React from 'react';
import { Zap, Eye, ShieldAlert, BookCheck } from 'lucide-react';

export const WhyMediInfoSection: React.FC = () => {
  const points = [
    {
      title: 'Easy Identification',
      description: 'Scan or search medicine in seconds.',
      icon: Zap,
    },
    {
      title: 'Clear Information',
      description: 'Understand medicine information easily.',
      icon: Eye,
    },
    {
      title: 'Safety First',
      description: 'Important precautions and warnings are easy to find.',
      icon: ShieldAlert,
    },
    {
      title: 'Reliable References',
      description: 'Information is presented with source references.',
      icon: BookCheck,
    },
  ];

  return (
    <section id="why-mediinfo-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#2563EB] font-['Manrope']">
          Why MediInfo
        </h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-['Manrope'] tracking-tight mt-1.5">
          Built for Clarity & Patient Safety
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {points.map((point, index) => {
          const Icon = point.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:border-slate-300 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#2563EB] mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-[#0F172A] font-['Manrope'] mb-1.5">
                {point.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#64748B] font-['Inter'] leading-relaxed">
                {point.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export { WhyMediInfoSection as WhyMinaSection };

