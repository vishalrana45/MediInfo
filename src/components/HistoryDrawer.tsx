import React from 'react';
import { ScanHistoryItem, Medicine } from '../types';
import { Medicine3DVisual } from './Medicine3DVisual';
import { X, Clock, Trash2, ArrowRight, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanHistoryItem[];
  onSelectMedicine: (medicine: Medicine) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectMedicine,
  onClearHistory,
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
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold font-['Manrope'] text-[#0F172A]">
                Scan History
              </h3>
              <p className="text-xs text-[#64748B] font-['Inter']">
                {history.length} recent {history.length === 1 ? 'scan' : 'scans'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Clear history"
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {history.length > 0 ? (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectMedicine(item.medicine);
                  onClose();
                }}
                className="group p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Medicine3DVisual
                      type={item.medicine.visualType}
                      brandColor={item.medicine.visualColor}
                      size="sm"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold font-['Manrope'] text-[#0F172A] truncate group-hover:text-[#2563EB]">
                      {item.medicine.name}
                    </h4>
                    <p className="text-xs text-[#64748B] font-['Inter'] truncate">
                      {item.medicine.genericName}
                    </p>
                    <span className="text-[10px] text-slate-400 font-['Inter']">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold font-['Manrope'] text-[#0F172A]">
                No scans yet
              </h4>
              <p className="text-xs text-[#64748B] font-['Inter'] mt-1 max-w-xs">
                When you scan or upload medicine packages, your past scans will appear here for quick access.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
