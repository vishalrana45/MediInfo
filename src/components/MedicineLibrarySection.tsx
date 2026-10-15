import React, { useState, useMemo } from 'react';
import { Medicine } from '../types';
import { Medicine3DVisual } from './Medicine3DVisual';
import {
  getFriendlyCategory,
  getFriendlyOverview,
  getFriendlyUses,
} from '../utils/patientFriendlyText';
import {
  Search,
  Filter,
  ArrowRight,
  Check,
  X,
  Pill,
  Droplets,
  Wind,
  Sparkles,
  Flame,
  Heart,
  Activity,
  ShieldCheck,
  Layers,
  Sparkle,
} from 'lucide-react';

interface MedicineLibrarySectionProps {
  medicines: Medicine[];
  onSelectMedicine: (medicine: Medicine) => void;
  initialSearchQuery?: string;
}

export interface CollabCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CollabForm {
  id: string;
  label: string;
  shortLabel: string;
  matchTerms: string[];
}

export const COLLAB_CATEGORIES: CollabCategory[] = [
  { id: 'all', name: 'All Medicines', icon: Layers },
  { id: 'fever_pain', name: 'Fever & Pain', icon: Flame },
  { id: 'cough_cold', name: 'Cough & Cold', icon: Wind },
  { id: 'acidity_digestion', name: 'Acidity & Digestion', icon: Sparkles },
  { id: 'antibiotics', name: 'Antibiotics', icon: ShieldCheck },
  { id: 'bp_heart', name: 'Blood Pressure & Heart', icon: Heart },
  { id: 'diabetes', name: 'Diabetes Care', icon: Activity },
  { id: 'vitamins', name: 'Vitamins & Supplements', icon: Pill },
];

export const COLLAB_FORMS: CollabForm[] = [
  { id: 'all', label: 'All Forms', shortLabel: 'All', matchTerms: [] },
  { id: 'tablet', label: 'Tablets', shortLabel: 'Tablets', matchTerms: ['tablet', 'caplet', 'tab'] },
  { id: 'capsule', label: 'Capsules', shortLabel: 'Capsules', matchTerms: ['capsule', 'softgel', 'cap'] },
  { id: 'syrup', label: 'Syrup / Liquid', shortLabel: 'Syrups & Liquids', matchTerms: ['syrup', 'suspension', 'liquid', 'solution', 'oral'] },
  { id: 'chewable', label: 'Chewable', shortLabel: 'Chewable', matchTerms: ['chewable', 'chew'] },
  { id: 'inhaler', label: 'Inhaler / Respule', shortLabel: 'Inhalers', matchTerms: ['inhaler', 'respule', 'rotacap', 'spray'] },
  { id: 'topical', label: 'Gel / Balm / Spray', shortLabel: 'Topical Gels', matchTerms: ['gel', 'balm', 'ointment', 'spray'] },
  { id: 'drops_injection', label: 'Drops / Infusion', shortLabel: 'Drops & Infusions', matchTerms: ['drop', 'injection', 'infusion', 'iv'] },
];

// Popular Category + Form collaboration shortcuts
const POPULAR_COLLABORATIONS = [
  { label: 'Fever & Pain Tablets', category: 'Fever & Pain', form: 'Tablets' },
  { label: 'Cough & Cold Syrups', category: 'Cough & Cold', form: 'Syrup / Liquid' },
  { label: 'Acidity Chewables & Liquids', category: 'Acidity & Digestion', form: 'Chewable' },
  { label: 'Asthma Inhalers', category: 'Cough & Cold', form: 'Inhaler / Respule' },
  { label: 'Muscle & Joint Pain Gels', category: 'Fever & Pain', form: 'Gel / Balm / Spray' },
  { label: 'Nutritional Capsules', category: 'Vitamins & Supplements', form: 'Capsules' },
];

export const MedicineLibrarySection: React.FC<MedicineLibrarySectionProps> = ({
  medicines,
  onSelectMedicine,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('All Medicines');
  const [selectedForm, setSelectedForm] = useState('All Forms');

  // Matching helper for category
  const matchesCategory = (med: Medicine, catName: string) => {
    if (catName === 'All Medicines' || catName === 'All Categories') return true;
    const c = catName.toLowerCase();
    const mc = med.category.toLowerCase();
    const usesText = med.uses.join(' ').toLowerCase();

    if (c.includes('fever') || c.includes('pain')) {
      return (
        mc.includes('analgesic') ||
        mc.includes('antipyretic') ||
        mc.includes('pain') ||
        mc.includes('fever') ||
        mc.includes('nsaid') ||
        mc.includes('headache') ||
        usesText.includes('fever') ||
        usesText.includes('pain') ||
        usesText.includes('headache')
      );
    }
    if (c.includes('cough') || c.includes('cold')) {
      return (
        mc.includes('allerg') ||
        mc.includes('histamine') ||
        mc.includes('cough') ||
        mc.includes('cold') ||
        mc.includes('respiratory') ||
        usesText.includes('cough') ||
        usesText.includes('cold') ||
        usesText.includes('sneez') ||
        usesText.includes('allergy')
      );
    }
    if (c.includes('acidity') || c.includes('digestion')) {
      return (
        mc.includes('acid') ||
        mc.includes('antacid') ||
        mc.includes('proton') ||
        mc.includes('digest') ||
        mc.includes('gastro') ||
        mc.includes('spasm') ||
        usesText.includes('acid') ||
        usesText.includes('reflux') ||
        usesText.includes('heartburn') ||
        usesText.includes('stomach')
      );
    }
    if (c.includes('antibiotic')) {
      return (
        mc.includes('antibiotic') ||
        mc.includes('infect') ||
        mc.includes('antiviral') ||
        usesText.includes('bacterial') ||
        usesText.includes('infection')
      );
    }
    if (c.includes('blood pressure') || c.includes('heart')) {
      return (
        mc.includes('pressure') ||
        mc.includes('cardio') ||
        mc.includes('hypertens') ||
        mc.includes('statin') ||
        mc.includes('lipid') ||
        mc.includes('cholesterol')
      );
    }
    if (c.includes('diabetes')) {
      return mc.includes('diabet') || mc.includes('glycemic') || usesText.includes('sugar') || usesText.includes('diabetes');
    }
    if (c.includes('vitamin') || c.includes('supplement')) {
      return mc.includes('vitamin') || mc.includes('mineral') || mc.includes('supplement') || mc.includes('calcium') || usesText.includes('vitamin');
    }
    return mc.includes(c);
  };

  // Matching helper for form
  const matchesForm = (medForms: string[], formLabel: string) => {
    if (formLabel === 'All Forms') return true;
    const config = COLLAB_FORMS.find((f) => f.label === formLabel);
    if (!config || config.matchTerms.length === 0) return true;

    return medForms.some((formString) => {
      const fl = formString.toLowerCase();
      return config.matchTerms.some((term) => fl.includes(term));
    });
  };

  // Medicines filtered solely by Category (and search query) to calculate active Dosage Form counts
  const categoryMatchedMedicines = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return medicines.filter((med) => {
      const matchesSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        med.genericName.toLowerCase().includes(q) ||
        med.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        med.category.toLowerCase().includes(q) ||
        med.uses.some((u) => u.toLowerCase().includes(q)) ||
        (med.overview && med.overview.toLowerCase().includes(q));

      return matchesSearch && matchesCategory(med, selectedCategory);
    });
  }, [medicines, searchQuery, selectedCategory]);

  // Dynamic Dosage Form counts for the currently selected Category
  const formCountsBySelectedCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    COLLAB_FORMS.forEach((f) => {
      if (f.id === 'all') {
        counts[f.label] = categoryMatchedMedicines.length;
      } else {
        counts[f.label] = categoryMatchedMedicines.filter((m) => matchesForm(m.forms, f.label)).length;
      }
    });
    return counts;
  }, [categoryMatchedMedicines]);

  // Final filtered medicines (Search + Category + Form collaboration)
  const filteredMedicines = useMemo(() => {
    return categoryMatchedMedicines.filter((med) => matchesForm(med.forms, selectedForm));
  }, [categoryMatchedMedicines, selectedForm]);

  // Handle clicking a form badge on a medicine card to collaborate with the current category
  const handleCardFormClick = (formString: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fl = formString.toLowerCase();
    const foundForm = COLLAB_FORMS.find((f) => f.id !== 'all' && f.matchTerms.some((term) => fl.includes(term)));
    if (foundForm) {
      setSelectedForm(foundForm.label);
    }
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Medicines' ||
    selectedForm !== 'All Forms';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Medicines');
    setSelectedForm('All Forms');
  };

  return (
    <section id="medicine-library-section" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-extrabold uppercase tracking-wider font-['Manrope'] mb-2">
          <Layers className="w-3.5 h-3.5" />
          Collaborative Formulary
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-['Manrope'] tracking-tight">
          Medicine Library
        </h2>
        <p className="text-sm text-[#64748B] font-['Inter'] mt-1.5 leading-relaxed">
          Filter medicines by therapeutic category and dosage form simultaneously to find the exact formulation you need.
        </p>
      </div>

      {/* ============================================================ */}
      {/* UNIFIED FILTER CONSOLE: SEARCH + CATEGORY + FORM COLLABORATION */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] mb-8 space-y-5">
        {/* 1. SEARCH INPUT */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by medicine name, generic molecule, or health condition..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-[#0F172A] placeholder-slate-400 font-['Inter'] text-sm sm:text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2. CATEGORY SELECTOR (ROW 1 OF COLLABORATION) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold font-['Manrope'] text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              1. Choose Category:
            </span>
            {selectedCategory !== 'All Medicines' && (
              <span className="text-[11px] font-bold text-blue-600 font-['Manrope']">
                Active: {selectedCategory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
            {COLLAB_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-['Manrope'] font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-sm ring-2 ring-blue-500/20 scale-[1.02]'
                      : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. DOSAGE FORM COLLABORATION BAR (ROW 2 OF COLLABORATION) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Pill className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold font-['Manrope'] text-slate-600 uppercase tracking-wider">
                2. Dosage Forms in{' '}
                <strong className="text-emerald-700 font-black">
                  {selectedCategory === 'All Medicines' ? 'All Categories' : selectedCategory}
                </strong>
                :
              </span>
            </div>

            <span className="text-[11px] text-slate-400 font-['Inter'] hidden sm:inline">
              Select a form to collaborate with this category
            </span>
          </div>

          {/* Form Chips with Live Category Counts */}
          <div className="flex flex-wrap items-center gap-2">
            {COLLAB_FORMS.map((form) => {
              const isSelected = selectedForm === form.label;
              const count = formCountsBySelectedCategory[form.label] ?? 0;
              const isDisabled = count === 0 && form.id !== 'all';

              return (
                <button
                  key={form.id}
                  id={`form-btn-${form.id}`}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedForm(form.label);
                    }
                  }}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-['Manrope'] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500/30'
                      : isDisabled
                      ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/80 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  <span>{form.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold font-['Inter'] ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : isDisabled
                        ? 'bg-slate-100 text-slate-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. POPULAR COLLABORATIVE SHORTCUTS (Category + Form Combinations) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-bold font-['Manrope'] text-[11px] uppercase tracking-wider mr-1">
            Collaborative Combos:
          </span>
          {POPULAR_COLLABORATIONS.map((combo, idx) => {
            const isActive =
              selectedCategory === combo.category && selectedForm === combo.form;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedCategory(combo.category);
                  setSelectedForm(combo.form);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold font-['Manrope'] transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-100 text-blue-800 font-bold border border-blue-300'
                    : 'bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700'
                }`}
              >
                {combo.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Status & Reset Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] font-['Inter']">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredMedicines.length}</strong>{' '}
            {filteredMedicines.length === 1 ? 'medicine' : 'medicines'}
          </span>
          {selectedCategory !== 'All Medicines' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory('All Medicines')}
                className="hover:text-blue-900 cursor-pointer"
                title="Remove category filter"
              >
                ×
              </button>
            </span>
          )}
          {selectedForm !== 'All Forms' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
              {selectedForm}
              <button
                onClick={() => setSelectedForm('All Forms')}
                className="hover:text-emerald-900 cursor-pointer"
                title="Remove form filter"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            onClick={resetAllFilters}
            className="text-xs font-bold text-[#2563EB] hover:text-blue-800 hover:underline font-['Manrope'] cursor-pointer"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Medicine Cards Grid */}
      {filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedicines.map((med) => {
            const friendlyCategory = getFriendlyCategory(med);
            const friendlyOverview = getFriendlyOverview(med);
            const friendlyUses = getFriendlyUses(med);

            return (
              <div
                key={med.id}
                onClick={() => onSelectMedicine(med)}
                className="group bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08)] hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      <Medicine3DVisual
                        type={med.visualType}
                        brandColor={med.visualColor}
                        pillColor={med.pillColor}
                        size="sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100/80 text-[10px] font-extrabold uppercase font-['Manrope'] tracking-wider truncate max-w-[150px]">
                          {friendlyCategory}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold font-['Manrope'] flex items-center gap-1 shrink-0">
                          <Pill className="w-2.5 h-2.5 text-emerald-600" />
                          {med.forms[0]?.replace(/\d+\s*(?:mg|ml|\/5ml)/gi, '').trim() || 'Dosage Form'}
                        </span>
                      </div>
                      <h4 className="text-lg font-extrabold text-[#0F172A] font-['Manrope'] tracking-tight group-hover:text-[#2563EB] transition-colors truncate">
                        {med.name}
                      </h4>
                      <p className="text-xs text-[#64748B] font-['Inter'] truncate">
                        {med.genericName}
                      </p>
                    </div>
                  </div>

                  {/* Highlighted Uses */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 font-['Manrope'] block">
                      What It's Used For:
                    </span>
                    <p className="text-xs font-semibold text-emerald-950 font-['Inter'] mt-0.5 line-clamp-2 leading-snug">
                      {friendlyUses.slice(0, 2).join(' • ')}
                    </p>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-500 font-['Inter'] line-clamp-2 leading-relaxed">
                    {friendlyOverview}
                  </p>

                  {/* Collaborative Dosage Forms with Interactive Click */}
                  <div className="mt-4">
                    <span className="text-[10px] font-bold text-slate-400 font-['Manrope'] uppercase tracking-wider block mb-1.5">
                      Available Dosage Forms (Click to filter):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {med.forms.slice(0, 3).map((form, i) => {
                        const isMatchingActiveForm =
                          selectedForm !== 'All Forms' &&
                          matchesForm([form], selectedForm);

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => handleCardFormClick(form, e)}
                            title={`Filter library by ${form}`}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold font-['Inter'] transition-colors cursor-pointer ${
                              isMatchingActiveForm
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 border border-slate-200/60'
                            }`}
                          >
                            {form}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-['Manrope'] font-bold text-[#64748B] group-hover:text-[#2563EB]">
                  <span>View Full Information</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold font-['Manrope'] text-[#0F172A]">
            No medicines match this category and form combination
          </h4>
          <p className="text-xs sm:text-sm text-[#64748B] font-['Inter'] mt-1 max-w-sm mx-auto">
            Try choosing &quot;All Forms&quot; in {selectedCategory}, or reset your search filters.
          </p>
          <button
            onClick={resetAllFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-['Manrope'] shadow-xs transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
