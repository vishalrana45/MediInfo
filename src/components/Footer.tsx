import React from 'react';
import { MediInfoLogo } from './MediInfoLogo';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateHome?: () => void;
  onNavigateLibrary: () => void;
  onOpenSafetyDisclaimer: () => void;
  onNavigateCareFinder?: () => void;
  onNavigateSearch?: () => void;
  onOpenScanner?: () => void;
  onOpenReminders?: () => void;
  onOpenBloodOrgan?: () => void;
  onOpenPrescriptionScanner?: () => void;
  onOpenTransport?: () => void;
  onOpenCabinet?: () => void;
  onOpenComparison?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onNavigateLibrary,
  onOpenSafetyDisclaimer,
  onNavigateCareFinder,
  onNavigateSearch,
  onOpenScanner,
  onOpenReminders,
  onOpenBloodOrgan,
  onOpenPrescriptionScanner,
  onOpenTransport,
  onOpenCabinet,
  onOpenComparison,
}) => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNavigateSearch) {
      onNavigateSearch();
    } else {
      const scanner = document.getElementById('primary-scanner-card');
      scanner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = document.getElementById('scanner-search-input');
      input?.focus();
    }
  };

  return (
    <footer id="mediinfo-footer" className="w-full bg-white border-t border-slate-200 mt-20 pt-12 pb-12 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-10">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-5 space-y-3.5">
            <MediInfoLogo
              size="md"
              showText={true}
              showTagline={true}
              tagline="From Prescription to Protection • Clinical Medicine Intelligence, Interaction Safety & 24/7 Care"
            />
            <p className="text-sm text-[#64748B] font-['Inter'] max-w-sm pt-1 leading-relaxed">
              Clear, verified information on medicines, health conditions treated, and safe dosages in everyday language to protect your family's health.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Evidence-based clinical safety monographs & pharmacopeia</span>
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="col-span-1 md:col-span-4 md:col-start-7 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-['Manrope']">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#64748B] font-['Inter']">
              <li>
                <button
                  type="button"
                  onClick={onOpenScanner || handleSearchClick}
                  className="group flex items-center text-left text-sm text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer p-0 bg-transparent border-0"
                >
                  <span>Pill Scanner & Medicine Search</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onNavigateCareFinder || handleHomeClick}
                  className="group flex items-center text-left text-sm text-[#64748B] hover:text-emerald-600 transition-colors cursor-pointer p-0 bg-transparent border-0"
                >
                  <span>Nearby 24/7 Pharmacy & Hospital Radar</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenBloodOrgan || handleHomeClick}
                  className="group flex items-center text-left text-sm text-[#64748B] hover:text-rose-600 transition-colors cursor-pointer p-0 bg-transparent border-0"
                >
                  <span>Hospital Blood & Organ Network</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrescriptionScanner || handleHomeClick}
                  className="group flex items-center text-left text-sm text-[#64748B] hover:text-indigo-600 transition-colors cursor-pointer p-0 bg-transparent border-0"
                >
                  <span>Doctor Prescription Scanner (OCR)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTransport || onOpenCabinet || handleHomeClick}
                  className="group flex items-center text-left text-sm text-[#64748B] hover:text-cyan-600 transition-colors cursor-pointer p-0 bg-transparent border-0"
                >
                  <span>Medicine Delivery & Family Vault</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenReminders || onOpenComparison || handleHomeClick}
                  className="group flex items-center text-left text-sm text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer p-0 bg-transparent border-0"
                >
                  <span>Dose Reminders & Medicine Comparison</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-['Manrope']">
              Safety & Terms
            </h4>
            <ul className="space-y-2.5 text-sm text-[#64748B] font-['Inter']">
              <li>
                <button
                  type="button"
                  onClick={onOpenSafetyDisclaimer}
                  className="group flex items-center text-left text-sm text-[#64748B] hover:text-[#2563EB] transition-colors cursor-pointer p-0 bg-transparent border-0"
                >
                  <span>Medical Disclaimer</span>
                </button>
              </li>
              <li className="flex items-center text-sm text-slate-500">
                <span>Privacy & Terms</span>
              </li>
              <li className="flex items-center text-sm text-slate-500">
                <span>How We Review Data</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Health Notice & Upgraded Tagline Copyright */}
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-xs text-[#64748B] font-['Inter'] max-w-2xl leading-relaxed">
            <strong className="text-[#0F172A]">Health Notice:</strong> MediInfo is created to help you understand your medicines, check drug interactions, and avoid dangerous errors. It is not a substitute for clinical advice from a licensed physician or pharmacist. In any acute medical emergency, contact your local emergency services immediately.
          </p>

          <p className="text-xs text-slate-500 font-['Inter'] shrink-0 font-medium">
            © {new Date().getFullYear()} MediInfo • <span className="text-blue-600 font-bold">From Prescription to Protection</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
