import React from 'react';
import { Medicine } from '../types';
import { Medicine3DVisual } from './Medicine3DVisual';
import { X, Bookmark, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SavedMedicinesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedMedicines: Medicine[];
  onSelectMedicine: (medicine: Medicine) => void;
  onRemoveSaved: (medicineId: string) => void;
}

export const SavedMedicinesDrawer: React.FC<SavedMedicinesDrawerProps> = ({
  isOpen,
  onClose,
  savedMedicines,
  onSelectMedicine,
  onRemoveSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-['Manrope'] text-[#0F172A]">
                Saved Medicines
              </h3>
              <p className="text-xs text-[#64748B] font-['Inter']">
                {savedMedicines.length} saved {savedMedicines.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {savedMedicines.length > 0 ? (
            savedMedicines.map((med) => (
              <div
                key={med.id}
                className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition-all flex items-center justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onSelectMedicine(med);
                    onClose();
                  }}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Medicine3DVisual
                      type={med.visualType}
                      brandColor={med.visualColor}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold font-['Manrope'] text-[#0F172A] truncate group-hover:text-[#2563EB]">
                      {med.name}
                    </h4>
                    <p className="text-xs text-[#64748B] font-['Inter'] truncate">
                      {med.genericName}
                    </p>
                    <span className="text-[10px] text-blue-600 font-semibold font-['Manrope']">
                      {med.forms[0]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onRemoveSaved(med.id)}
                    title="Remove from saved"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onSelectMedicine(med);
                      onClose();
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold font-['Manrope'] text-[#0F172A]">
                No saved medicines
              </h4>
              <p className="text-xs text-[#64748B] font-['Inter'] mt-1 max-w-xs">
                Click "Save Medicine" on any medicine profile to keep personal references for quick inspection.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
