import React from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-['Manrope'] text-[#0F172A]">
                Clinical Safety & Policy
              </h3>
              <p className="text-xs text-[#64748B] font-['Inter']">
                Emergency pill identification & toxicology triage standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm text-slate-700 font-['Inter'] leading-relaxed">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold font-['Manrope'] text-sm text-rose-900">
                Notice of Non-Medical Status & Emergency Protocol
              </h4>
              <p className="text-xs text-rose-800 leading-relaxed">
                MediInfo provides medicine educational guidance and is not a substitute for clinical diagnosis. In a medical emergency, acute allergic reaction, or accidental overdose, contact your local emergency medical services or visit the nearest hospital emergency room immediately.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Manrope']">
              Our Safety Standards
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700">
                <strong>Uncertainty Transparency:</strong> If package typography or physical pill imprints are blurry, damaged, or unverified, MediInfo will always warn you and refuse to guess.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700">
                <strong>Evidence-Based Sourcing:</strong> All drug monographs, dosages, and contraindications originate from peer-reviewed compendia (FDA, WHO, PubChem, DailyMed, and British National Formulary).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700">
                <strong>Always Consult a Professional:</strong> In emergency situations or when experiencing an adverse allergic reaction, immediately contact local emergency medical services or a licensed doctor.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-['Manrope'] font-bold text-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
};
