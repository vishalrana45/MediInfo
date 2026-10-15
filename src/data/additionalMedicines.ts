import { Medicine } from '../types';

export const ADDITIONAL_MEDICINES: Medicine[] = [
  // =========================================================================
  // 1. AMOXICILLIN (Mox 500 / Amoxil)
  // =========================================================================
  {
    id: 'amoxicillin',
    name: 'Amoxicillin 500',
    genericName: 'Amoxicillin Trihydrate 500mg',
    category: 'Antibiotics & Anti-infectives',
    brandNames: ['Mox 500', 'Amoxil', 'Novamox 500', 'Wymox', 'Almox'],
    forms: ['500mg Capsules', '250mg Capsules', '125mg/5ml Suspension'],
    visualType: 'capsule',
    visualColor: '#0284C7',
    pillColor: '#E0F2FE',
    imprintText: 'MOX 500',
    overview: 'Amoxicillin is a core penicillin-class antibiotic that stops the growth of susceptible bacteria by inhibiting bacterial cell wall synthesis. Widely prescribed for throat, ear, chest, and urinary infections.',
    uses: [
      'Bacterial ear, nose, and throat infections including tonsillitis and otitis media',
      'Lower respiratory tract infections including acute bronchitis and mild pneumonia',
      'Uncomplicated urinary tract infections (UTIs) caused by susceptible organisms',
      'Dental abscesses and post-extraction bacterial coverage'
    ],
    dosage: {
      general: 'Adults: 250mg to 500mg every 8 hours, or 500mg to 875mg every 12 hours with a full glass of water. Can be taken with or without food.',
      warning: 'Complete the entire prescribed 5 to 7 day course. Never stop prematurely when symptoms improve to prevent resistant bacteria.',
      pediatric: 'Pediatric suspension dosed strictly by pediatrician based on body weight (typically 20-40 mg/kg/day divided into 3 doses).'
    },
    sideEffects: {
      common: ['Mild diarrhea or soft stools', 'Nausea and stomach upset', 'Mild skin itching or rash'],
      severe: ['Severe allergic anaphylaxis or difficulty breathing', 'Clostridioides difficile-associated severe colitis', 'Facial swelling or hives']
    },
    precautions: [
      'Strictly contraindicated in patients with a history of penicillin or beta-lactam hypersensitivity.',
      'Stay well hydrated throughout the treatment course.',
      'Notify your doctor if watery diarrhea persists for more than 48 hours.'
    ],
    interactions: [
      'Oral contraceptives (may reduce birth control effectiveness; use barrier backup)',
      'Methotrexate (amoxicillin reduces clearance, increasing toxicity)',
      'Allopurinol (increases risk of developing an allergic skin rash)'
    ],
    warnings: [
      'DO NOT USE FOR VIRAL INFECTIONS: Amoxicillin is ineffective against common colds, seasonal influenza, or COVID-19.',
      'PENICILLIN ALLERGY ALERT: Immediate emergency care needed if wheezing or lip swelling occurs.'
    ],
    storage: 'Store capsules at room temperature (below 25°C) away from moisture. Reconstituted liquid must be refrigerated and discarded after 14 days.',
    references: [
      { source: 'British National Formulary (BNF) - Amoxicillin Monograph', type: 'Clinical Evidence' },
      { source: 'WHO Model List of Essential Medicines', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 2. CEFIXIME (Taxim-O / Zifi 200)
  // =========================================================================
  {
    id: 'cefixime',
    name: 'Cefixime 200',
    genericName: 'Cefixime 200mg',
    category: 'Antibiotics & Anti-infectives',
    brandNames: ['Taxim-O 200', 'Zifi 200', 'Cefspan', 'Omnicef-O', 'Mahacef'],
    forms: ['200mg Tablets', '100mg DT (Dispersible Tablets)', '50mg/5ml Dry Syrup'],
    visualType: 'blister',
    visualColor: '#7C3AED',
    pillColor: '#EDE9FE',
    imprintText: 'TAXIM 200',
    overview: 'Cefixime is an advanced third-generation oral cephalosporin antibiotic with broad activity against Gram-negative and selected Gram-positive pathogens. Frequently indicated for typhoid, urinary, and respiratory infections.',
    uses: [
      'Uncomplicated typhoid (enteric) fever caused by Salmonella species',
      'Acute exacerbations of chronic bronchitis and bacterial sinusitis',
      'Complicated and uncomplicated urinary tract infections',
      'Pharyngitis and bacterial tonsillitis resistant to first-line antibiotics'
    ],
    dosage: {
      general: 'Adults: 200mg twice daily (every 12 hours) or 400mg once daily with water, preferably after food to minimize gastrointestinal upset.',
      warning: 'Take at consistent 12-hour intervals. Complete the full 7 to 14 day course as directed by your physician.',
      pediatric: 'Pediatric dosing: 8 mg/kg/day administered as a single daily dose or divided into two doses (every 12 hours).'
    },
    sideEffects: {
      common: ['Loose stools or diarrhea', 'Mild abdominal cramps', 'Flatulence and nausea'],
      severe: ['Severe allergic reaction (erythema multiforme, angioedema)', 'Pseudomembranous colitis with high fever and severe cramps']
    },
    precautions: [
      'Use with caution in individuals with known cephalosporin or severe penicillin allergy.',
      'Dosage adjustment is necessary in patients with significant renal impairment.',
      'Probiotic supplementation may help restore healthy gut flora after the course.'
    ],
    interactions: [
      'Warfarin and oral anticoagulants (prolongs prothrombin time, increasing bleeding risk)',
      'Carbamazepine (cefixime elevates carbamazepine blood concentration)'
    ],
    warnings: [
      'PRESCRIPTION ONLY: Schedule H1 medicine. Discontinue immediately if breathing difficulty, hives, or severe swelling appears.'
    ],
    storage: 'Store in a cool dry place below 30°C. Protect from moisture and direct light.',
    references: [
      { source: 'Indian Pharmacopoeia (IP) - Cefixime Tablets', type: 'Regulatory' },
      { source: 'Infectious Diseases Society of America (IDSA) Guidelines', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 3. CIPROFLOXACIN (Ciplox 500 / Cifran)
  // =========================================================================
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin 500',
    genericName: 'Ciprofloxacin Hydrochloride 500mg',
    category: 'Antibiotics & Anti-infectives',
    brandNames: ['Ciplox 500', 'Cifran 500', 'Cipro', 'Alcipro', 'Ciprobid'],
    forms: ['500mg Tablets', '250mg Tablets', '0.3% Eye/Ear Drops'],
    visualType: 'blister',
    visualColor: '#0D9488',
    pillColor: '#F0FDFA',
    imprintText: 'CIPLOX',
    overview: 'Ciprofloxacin is a potent fluoroquinolone antibiotic that interferes with bacterial DNA gyrase and topoisomerase IV enzymes. Reserved for bacterial gastrointestinal, urinary, bone, and systemic infections.',
    uses: [
      'Severe bacterial gastroenteritis, traveler’s diarrhea, and infectious colitis',
      'Complicated urinary tract infections and acute pyelonephritis',
      'Skin, soft tissue, bone, and joint bacterial infections',
      'Infectious bacterial conjunctivitis and otitis externa (topical drops)'
    ],
    dosage: {
      general: 'Adults: 500mg orally every 12 hours with plenty of water. Take 2 hours before or 4 hours after antacids, dairy, or calcium/iron supplements.',
      warning: 'Drink at least 2 to 3 liters of fluids daily while on ciprofloxacin to prevent crystalluria (crystal formation in urine).',
      pediatric: 'Generally not recommended in children under 18 due to risk of arthropathy, unless specifically prescribed by a specialist.'
    },
    sideEffects: {
      common: ['Mild nausea or loss of appetite', 'Diarrhea or indigestion', 'Headache or light dizziness'],
      severe: ['Tendonitis or Achilles tendon rupture', 'Peripheral neuropathy (burning or tingling sensations)', 'QT interval prolongation']
    },
    precautions: [
      'Avoid intense sunlamps or prolonged sunlight exposure; ciprofloxacin causes marked photosensitivity.',
      'Stop taking immediately and rest your leg if tendon pain or joint swelling occurs.',
      'Do not consume antacids, milk, or calcium-fortified juice within 2 hours of dosing.'
    ],
    interactions: [
      'Antacids, sucralfate, iron, and multivitamin minerals (bind and block ciprofloxacin absorption)',
      'Theophylline (ciprofloxacin sharply increases toxic theophylline levels)',
      'NSAIDs (combining with ibuprofen may increase central nervous system excitability/seizure risk)'
    ],
    warnings: [
      'BLACK BOX TENDON WARNING: Fluoroquinolones carry risks of tendinitis and tendon rupture, especially in seniors and athletes.'
    ],
    storage: 'Store below 25°C in a dry place. Keep blister strips away from heat and light.',
    references: [
      { source: 'FDA Drug Safety Communication - Fluoroquinolones', type: 'Regulatory' },
      { source: 'US Pharmacopeia (USP) - Ciprofloxacin Monograph', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 4. METRONIDAZOLE (Flagyl 400 / Metrogyl)
  // =========================================================================
  {
    id: 'metronidazole',
    name: 'Metronidazole 400',
    genericName: 'Metronidazole 400mg',
    category: 'Antibiotics & Anti-infectives',
    brandNames: ['Flagyl 400', 'Metrogyl 400', 'Metron', 'Aristogyl'],
    forms: ['400mg Tablets', '200mg Tablets', '200mg/5ml Suspension', '5mg/ml IV Infusion'],
    visualType: 'blister',
    visualColor: '#EA580C',
    pillColor: '#FFEDD5',
    imprintText: 'FLAGYL',
    overview: 'Metronidazole is a synthetic nitroimidazole antimicrobial agent with potent activity against anaerobic bacteria and protozoa. Commonly prescribed for amoebic dysentery, dental infections, and pelvic infections.',
    uses: [
      'Amoebiasis (amoebic dysentery and amoebic liver abscess)',
      'Giardiasis and trichomoniasis parasitic infections',
      'Anaerobic dental infections and acute necrotizing ulcerative gingivitis',
      'Helicobacter pylori eradication regimens in peptic ulcer disease'
    ],
    dosage: {
      general: 'Adults: 400mg orally 3 times daily (every 8 hours) with or immediately after meals with plenty of water for 5 to 7 days.',
      warning: 'ABSOLUTE ALCOHOL BAN: Do not consume any alcohol during treatment and for at least 48 hours after finishing.',
      pediatric: 'Pediatric dosing: 30 to 50 mg/kg/day divided into 3 equal doses with meals.'
    },
    sideEffects: {
      common: ['Distinct metallic or bitter taste in the mouth', 'Nausea, loss of appetite, and dry mouth', 'Darkened or reddish-brown urine (harmless)'],
      severe: ['Severe disulfiram-like reaction if alcohol is consumed (vomiting, flushing, tachycardia)', 'Peripheral neuropathy or seizures with high prolonged doses']
    },
    precautions: [
      'Never drink beer, wine, spirits, or take alcohol-containing cough syrups while on metronidazole.',
      'Take with food to minimize gastric irritation and metallic taste.',
      'Notify your doctor if numbness or tingling in hands or feet develops.'
    ],
    interactions: [
      'Alcohol and propylene glycol (produces intense nausea, flushing, vomiting, and palpitations)',
      'Warfarin (significantly amplifies anticoagulant effect; check INR closely)',
      'Lithium (increases blood lithium levels and toxicity)'
    ],
    warnings: [
      'DISULFIRAM REACTION: Strict zero-alcohol rule for the entire treatment period plus 48 hours post-completion.'
    ],
    storage: 'Store protected from light and moisture below 25°C.',
    references: [
      { source: 'Indian Pharmacopoeia (IP) - Metronidazole Tablets', type: 'Regulatory' },
      { source: 'CDC Sexually Transmitted Infections Treatment Guidelines', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 5. DOXYCYCLINE (Doxicip 100 / Vibramycin)
  // =========================================================================
  {
    id: 'doxycycline',
    name: 'Doxycycline 100',
    genericName: 'Doxycycline Hyclate 100mg',
    category: 'Antibiotics & Anti-infectives',
    brandNames: ['Doxicip 100', 'Vibramycin', 'Doxt-SL', 'Microdox', 'Doxy-1'],
    forms: ['100mg Capsules', '100mg Tablets', '50mg Capsules'],
    visualType: 'capsule',
    visualColor: '#B45309',
    pillColor: '#FEF3C7',
    imprintText: 'DOX 100',
    overview: 'Doxycycline is a broad-spectrum tetracycline antibiotic used to treat bacterial pneumonia, acne, Lyme disease, scrub typhus, and as malaria prophylaxis.',
    uses: [
      'Moderate to severe inflammatory acne vulgaris and rosacea',
      'Community-acquired atypical pneumonia and chlamydial infections',
      'Rickettsial infections including scrub typhus and Rocky Mountain spotted fever',
      'Malaria chemoprophylaxis in chloroquine-resistant travel zones'
    ],
    dosage: {
      general: 'Adults: 100mg orally every 12 hours on day 1, followed by 100mg once or twice daily. Take with a full glass of water while sitting upright.',
      warning: 'ESOPHAGEAL SAFETY: Never take lying down or right before sleeping. Remain upright for at least 30 minutes after swallowing to avoid severe pill-induced esophageal ulcers.',
      pediatric: 'Contraindicated in children under 8 years due to permanent teeth discoloration and enamel hypoplasia.'
    },
    sideEffects: {
      common: ['Nausea, indigestion, or abdominal discomfort', 'Skin sensitivity to sunlight (sunburn rash)'],
      severe: ['Severe esophageal ulceration or painful swallowing', 'Benign intracranial hypertension (pseudotumor cerebri) with severe headache']
    },
    precautions: [
      'Take with a full 250ml glass of water while seated or standing upright.',
      'Avoid sunbathing and use sunscreen; doxycycline causes severe sunburn phototoxicity.',
      'Do not take with milk, calcium, iron, or antacids; separate by at least 2 hours.'
    ],
    interactions: [
      'Dairy, calcium, iron, and magnesium antacids (chelate doxycycline, blocking absorption)',
      'Retinoids like isotretinoin (combining increases risk of intracranial hypertension)',
      'Warfarin (potentiates blood thinning effect)'
    ],
    warnings: [
      'DO NOT LIE DOWN: Swallowing with minimal water or lying down causes painful ulcers in the esophagus.',
      'PREGNANCY WARNING: Contraindicated in pregnancy and lactation due to bone and tooth enamel damage in the fetus.'
    ],
    storage: 'Store in airtight containers protected from light and heat below 30°C.',
    references: [
      { source: 'American Academy of Dermatology Acne Guidelines', type: 'Clinical Evidence' },
      { source: 'USP-NF Doxycycline Hyclate Monograph', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 6. RANITIDINE (Rantac 150 / Aciloc 150)
  // =========================================================================
  {
    id: 'ranitidine',
    name: 'Ranitidine 150',
    genericName: 'Ranitidine Hydrochloride 150mg',
    category: 'Acidity, Gas & Digestion',
    brandNames: ['Rantac 150', 'Aciloc 150', 'Zantac', 'Histac', 'Ranitin'],
    forms: ['150mg Film-Coated Tablets', '300mg Tablets', '25mg/ml Injection'],
    visualType: 'blister',
    visualColor: '#059669',
    pillColor: '#D1FAE5',
    imprintText: 'RANTAC',
    overview: 'Ranitidine is an H2-receptor antagonist that reduces the quantity of hydrochloric acid secreted by gastric parietal cells. Widely used for heartburn, acid indigestion, and peptic ulcer relief.',
    uses: [
      'Short-term treatment of active duodenal and benign gastric ulcers',
      'Management of gastroesophageal reflux disease (GERD) and acid indigestion',
      'Prevention of NSAID-induced gastric irritation and bleeding',
      'Zollinger-Ellison pathological hypersecretory syndrome'
    ],
    dosage: {
      general: 'Adults: 150mg twice daily (morning and bedtime) or 300mg as a single dose at bedtime with water, 30 to 60 minutes before meals.',
      warning: 'Do not self-medicate continuously for more than 14 days without consulting a doctor.',
      pediatric: 'Pediatric use only under clinical prescription, dosed at 2 to 4 mg/kg twice daily.'
    },
    sideEffects: {
      common: ['Mild headache', 'Occasional constipation or diarrhea', 'Transient fatigue or dizziness'],
      severe: ['Reversible confusion in elderly patients with kidney impairment', 'Bradycardia with rapid IV administration']
    },
    precautions: [
      'Patients with kidney impairment need a reduced daily dosage.',
      'Masking warning: Relief of stomach pain does not rule out gastric malignancy.',
      'Consult a doctor if heartburn is accompanied by shortness of breath or radiating shoulder pain.'
    ],
    interactions: [
      'Ketoconazole and itraconazole (ranitidine reduces their gastric absorption)',
      'Warfarin and theophylline (minimal compared to cimetidine, but monitor occasionally)'
    ],
    warnings: [
      'LIFESTYLE AWARENESS: Pair with dietary changes (avoid late heavy meals, acidic foods, and smoking) for long-term gut health.'
    ],
    storage: 'Store protected from light and moisture below 25°C.',
    references: [
      { source: 'Indian Pharmacopoeia (IP) - Ranitidine Monograph', type: 'Regulatory' },
      { source: 'Clinical Pharmacology Formulary', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 7. RABEPRAZOLE (Rablet 20 / Razo 20)
  // =========================================================================
  {
    id: 'rabeprazole',
    name: 'Rabeprazole 20',
    genericName: 'Rabeprazole Sodium 20mg',
    category: 'Acidity, Gas & Digestion',
    brandNames: ['Rablet 20', 'Razo 20', 'Pariet', 'Happi 20', 'Rabium 20'],
    forms: ['20mg Enteric-Coated Tablets', '10mg Tablets', 'Combo with Domperidone (Razo-D)'],
    visualType: 'blister',
    visualColor: '#10B981',
    pillColor: '#ECFDF5',
    imprintText: 'RABLET',
    overview: 'Rabeprazole is a rapid-acting proton pump inhibitor (PPI) that suppresses gastric basal and stimulated acid secretion by binding the H+/K+-ATPase pump. Highly effective for healing reflux esophagitis.',
    uses: [
      'Healing of erosive or ulcerative gastroesophageal reflux disease (GERD)',
      'Maintenance of healing and symptom relief in severe acid reflux and heartburn',
      'Treatment of active duodenal ulcers and gastric ulcers',
      'Part of triple-therapy combination for Helicobacter pylori eradication'
    ],
    dosage: {
      general: 'Adults: 20mg once daily in the morning, 30 to 60 minutes before breakfast with a glass of water.',
      warning: 'SWALLOW WHOLE: Do not chew, crush, or break enteric-coated tablets; crushing destroys the acid-protective coating.',
      pediatric: 'Safety and efficacy in pediatric patients under 12 years not established.'
    },
    sideEffects: {
      common: ['Headache', 'Mild diarrhea or abdominal pain', 'Nausea, gas, or dry mouth'],
      severe: ['Hypomagnesemia with long-term continuous use (>1 year)', 'Increased risk of bone fractures with prolonged high-dose use']
    },
    precautions: [
      'Take consistently in the morning before food for maximum proton pump binding.',
      'Long-term therapy (>1 year) should be periodically evaluated by a healthcare professional.',
      'Ensure adequate dietary calcium and vitamin D intake during extended treatment.'
    ],
    interactions: [
      'Clopidogrel (minimal interference compared to omeprazole, but caution advised)',
      'Ketoconazole, itraconazole, and atazanavir (absorption dependent on gastric pH)',
      'Methotrexate (PPIs may elevate methotrexate levels)'
    ],
    warnings: [
      'DO NOT CRUSH: Chewable or crushed tablets will be inactivated by stomach acid before reaching the intestine.'
    ],
    storage: 'Store in blister pack at room temperature below 25°C away from direct moisture.',
    references: [
      { source: 'American College of Gastroenterology (ACG) GERD Guidelines', type: 'Clinical Evidence' },
      { source: 'British National Formulary (BNF) - Rabeprazole Sodium', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 8. DOMPERIDONE (Domstal 10 / Motilium)
  // =========================================================================
  {
    id: 'domperidone',
    name: 'Domperidone 10',
    genericName: 'Domperidone 10mg',
    category: 'Acidity, Gas & Digestion',
    brandNames: ['Domstal 10', 'Motilium', 'Vomisil', 'Domperon', 'Gastrolag'],
    forms: ['10mg Tablets', '10mg Dispersible Tablets', '1mg/ml Oral Suspension'],
    visualType: 'blister',
    visualColor: '#059669',
    pillColor: '#FFFFFF',
    imprintText: 'DOMSTAL',
    overview: 'Domperidone is a peripheral dopamine-receptor (D2) blocker that acts as an effective prokinetic and antiemetic. It accelerates gastric emptying and transit time to relieve bloating, fullness, and nausea.',
    uses: [
      'Relief of nausea, vomiting, and fullness associated with gastritis or food sluggishness',
      'Upper abdominal discomfort, early satiety, and postprandial heaviness',
      'Adjunct in gastroesophageal reflux to prevent upward acid regurgitation'
    ],
    dosage: {
      general: 'Adults: 10mg orally up to 3 times daily, taken 15 to 30 minutes before meals. Maximum recommended duration is 7 days.',
      warning: 'CARDIAC CAUTION: Do not exceed 30mg daily. Doses above recommended limits increase risk of cardiac arrhythmia (QT prolongation).',
      pediatric: 'Pediatric dosing: strictly on physician prescription (0.25 mg/kg up to 3 times daily).'
    },
    sideEffects: {
      common: ['Dry mouth', 'Mild headache or drowsiness', 'Abdominal cramps'],
      severe: ['Cardiac ventricular arrhythmias and QT prolongation', 'Hyperprolactinemia (breast tenderness or galactorrhea)']
    },
    precautions: [
      'Take 15 to 30 minutes BEFORE meals; taking after food significantly delays absorption.',
      'Contraindicated in patients with underlying cardiac conduction abnormalities or congestive heart failure.',
      'Do not use in patients with gastrointestinal bleeding, mechanical obstruction, or perforation.'
    ],
    interactions: [
      'QT-prolonging medicines (erythromycin, ketoconazole, amiodarone - strictly contraindicated)',
      'Anticholinergic drugs (antagonize the gastrointestinal prokinetic effect of domperidone)'
    ],
    warnings: [
      'HEART RHYTHM ALERT: Use the lowest effective dose for the shortest possible duration (maximum 1 week).'
    ],
    storage: 'Store below 25°C in a dry place. Keep out of reach of children.',
    references: [
      { source: 'European Medicines Agency (EMA) Domperidone Safety Review', type: 'Regulatory' },
      { source: 'Indian Pharmacopoeia (IP) - Domperidone Monograph', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 9. ONDANSETRON (Emeset 4 / Zofran)
  // =========================================================================
  {
    id: 'ondansetron',
    name: 'Ondansetron 4',
    genericName: 'Ondansetron Hydrochloride 4mg',
    category: 'Acidity, Gas & Digestion',
    brandNames: ['Emeset 4', 'Zofran', 'Vomikind 4', 'Ondem 4', 'Periset'],
    forms: ['4mg Tablets', '4mg Orally Disintegrating (MDT)', '2mg/ml Oral Solution', '2mg/ml Injection'],
    visualType: 'blister',
    visualColor: '#0284C7',
    pillColor: '#F8FAFC',
    imprintText: 'EMESET 4',
    overview: 'Ondansetron is a highly selective 5-HT3 serotonin receptor antagonist that blocks vomiting signals in both the peripheral vagus nerve and the central chemoreceptor trigger zone (CTZ). Gold-standard for acute nausea.',
    uses: [
      'Prevention and immediate relief of nausea and vomiting induced by gastroenteritis',
      'Prevention of chemotherapy-induced nausea and vomiting (CINV)',
      'Postoperative nausea and vomiting (PONV) prevention and management',
      'Radiation-induced nausea relief'
    ],
    dosage: {
      general: 'Adults: 4mg to 8mg orally 30 minutes before required or every 8 hours as needed. For Mouth Dissolving Tablets (MDT), place on tongue and allow to dissolve.',
      warning: 'Do not exceed 16mg in a single oral dose. Keep track of daily doses.',
      pediatric: 'Pediatric dosing: 2mg to 4mg based on age/weight, prescribed by a pediatrician for acute gastroenteritis.'
    },
    sideEffects: {
      common: ['Headache (most frequent)', 'Constipation', 'Sensation of flushing or warmth'],
      severe: ['QT interval prolongation on ECG', 'Serotonin syndrome when combined with multiple serotonergic agents']
    },
    precautions: [
      'Constipation is common after repeated doses; stay hydrated and consume dietary fiber.',
      'Caution in patients with congenital long QT syndrome or electrolyte imbalances.',
      'Orally disintegrating tablets contain aspartame; check for phenylketonuria.'
    ],
    interactions: [
      'Apomorphine (concomitant use causes profound hypotension and loss of consciousness - contraindicated)',
      'Serotonergic drugs (SSRIs, SNRIs, tramadol - increased risk of serotonin syndrome)',
      'Phenytoin, carbamazepine, and rifampicin (decrease ondansetron blood levels)'
    ],
    warnings: [
      'DO NOT CHEW MDT TABLETS: Place orally disintegrating tablets on the tongue; they dissolve rapidly with saliva without water.'
    ],
    storage: 'Store between 15°C and 30°C in blister pack away from moisture.',
    references: [
      { source: 'FDA Guidance - Ondansetron and QT Prolongation', type: 'Regulatory' },
      { source: 'American Society of Clinical Oncology (ASCO) Antiemetic Guidelines', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 10. LOPERAMIDE (Imodium 2mg / Lopamide)
  // =========================================================================
  {
    id: 'loperamide',
    name: 'Loperamide 2mg',
    genericName: 'Loperamide Hydrochloride 2mg',
    category: 'Acidity, Gas & Digestion',
    brandNames: ['Imodium', 'Lopamide', 'Eldoper', 'Roko 2mg', 'Imosec'],
    forms: ['2mg Capsules', '2mg Tablets'],
    visualType: 'capsule',
    visualColor: '#15803D',
    pillColor: '#DCFCE7',
    imprintText: 'IMODIUM',
    overview: 'Loperamide is a synthetic opioid analogue that acts selectively on the mu-opioid receptors in the circular and longitudinal intestinal muscles. It slows peristalsis, increases water absorption, and firms stools.',
    uses: [
      'Symptomatic control of acute, non-specific sudden diarrhea in adults',
      'Management of traveler’s diarrhea (in absence of high fever or bloody stools)',
      'Chronic diarrhea associated with inflammatory bowel disease (IBD) under specialist care',
      'Reducing fecal volume from ileostomies'
    ],
    dosage: {
      general: 'Adults: Initial dose of 4mg (2 capsules) immediately, followed by 2mg (1 capsule) after each subsequent loose unformed stool. Maximum 8mg (4 capsules) daily for self-care (16mg under hospital supervision).',
      warning: 'NEVER USE IN DYSENTERY: Strictly contraindicated if blood or mucus is present in the stool or if accompanied by high fever.',
      pediatric: 'CONTRAINDICATED in children under 4 years of age due to risk of toxic megacolon and paralytic ileus.'
    },
    sideEffects: {
      common: ['Constipation', 'Abdominal cramps and flatulence', 'Dizziness or drowsiness'],
      severe: ['Paralytic ileus or toxic megacolon', 'Cardiac arrest with massive deliberate overdose']
    },
    precautions: [
      'Always replace lost fluid and electrolytes with ORS while treating diarrhea.',
      'Discontinue immediately if constipation, abdominal distension, or severe pain develops.',
      'If acute diarrhea does not improve within 48 hours, stop loperamide and see a doctor.'
    ],
    interactions: [
      'P-glycoprotein inhibitors (quinidine, ritonavir - increase loperamide blood levels)',
      'Other drugs that slow intestinal motility (anticholinergics, opioids - extreme constipation risk)'
    ],
    warnings: [
      'NOT AN ANTIBIOTIC: Loperamide only controls stool frequency; it does not kill bacterial pathogens.',
      'CARDIAC WARNING: Abusing loperamide at extreme doses causes fatal ventricular arrhythmias.'
    ],
    storage: 'Store below 25°C in a dry place. Protect from excess heat.',
    references: [
      { source: 'FDA Safety Alert on Loperamide Cardiac Risks at High Doses', type: 'Regulatory' },
      { source: 'WHO Guidelines for the Management of Acute Diarrhea', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 11. ORAL REHYDRATION SALTS (Electral / ORS)
  // =========================================================================
  {
    id: 'ors',
    name: 'Oral Rehydration Salts (ORS)',
    genericName: 'WHO Standard Reduced Osmolarity Formula',
    category: 'Acidity, Gas & Digestion',
    brandNames: ['Electral', 'Enerzal', 'Walyte', 'Prolyte ORS', 'Electrokind'],
    forms: ['21.8g Sachet for 1 Liter Water', '4.2g Sachet for 200ml Water', 'Ready-to-Drink 200ml Tetrapack'],
    visualType: 'box',
    visualColor: '#0284C7',
    pillColor: '#FFFFFF',
    imprintText: 'WHO ORS',
    overview: 'WHO Reduced-Osmolarity ORS is a scientifically formulated balance of glucose, sodium chloride, potassium chloride, and sodium citrate. It exploits the sodium-glucose cotransporter in the gut to rapidly restore lost fluid and electrolytes.',
    uses: [
      'Prevention and treatment of dehydration caused by acute diarrhea or vomiting',
      'Restoration of electrolyte balance in heat exhaustion, intense sports, or fever',
      'First-line emergency management of cholera and infant gastrointestinal fluid loss'
    ],
    dosage: {
      general: 'Adults: Drink 200ml to 400ml after each loose stool, or sip steadily throughout the day (1 to 2 liters daily as tolerated).',
      warning: 'EXACT WATER RATIO: Always dissolve the 21.8g sachet in exactly 1 liter of clean drinking water. Do not make too concentrated or dilute with juice or milk.',
      pediatric: 'Infants & Children: Offer 50ml to 100ml after every loose stool using a clean spoon or small cup. Continue breastfeeding.'
    },
    sideEffects: {
      common: ['None when mixed in the correct water volume', 'Slight salt taste'],
      severe: ['Hypernatremia if prepared with insufficient water', 'Vomiting if chugged too rapidly']
    },
    precautions: [
      'Use only potable, boiled and cooled drinking water to reconstitute the powder.',
      'Sip slowly; gulping large amounts too quickly can trigger stomach reflux and vomiting.',
      'Discard any prepared solution that remains unused after 24 hours.'
    ],
    interactions: [
      'None reported; safe to co-administer with all standard clinical therapies.'
    ],
    warnings: [
      'CORRECT DILUTION IS CRITICAL: Adding extra powder without enough water can cause dangerous hyperosmolar dehydration.'
    ],
    storage: 'Store dry sachets below 30°C in a dry place. Discard reconstituted solution after 24 hours.',
    references: [
      { source: 'WHO/UNICEF Joint Statement - Clinical Management of Acute Diarrhoea', type: 'Clinical Evidence' },
      { source: 'Indian Pharmacopoeia (IP) - Oral Rehydration Salts', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 12. LEVOCETIRIZINE (Vozet 5 / Levocet)
  // =========================================================================
  {
    id: 'levocetirizine',
    name: 'Levocetirizine 5',
    genericName: 'Levocetirizine Dihydrochloride 5mg',
    category: 'Allergy, Cold & Cough',
    brandNames: ['Vozet 5', 'Levocet 5', 'Xyzal', 'Teczine', '1-AL 5mg'],
    forms: ['5mg Film-Coated Tablets', '2.5mg/5ml Syrup'],
    visualType: 'blister',
    visualColor: '#2563EB',
    pillColor: '#FFFFFF',
    imprintText: 'VOZET 5',
    overview: 'Levocetirizine is the pure active (R)-enantiomer of cetirizine. It selectively blocks peripheral H1 histamine receptors with greater potency and lower somnolence than first-generation antihistamines.',
    uses: [
      'Relief of allergic rhinitis (sneezing, runny nose, itchy palate, red watery eyes)',
      'Treatment of uncomplicated skin manifestations of chronic idiopathic urticaria (hives)',
      'Relief of seasonal outdoor and indoor pet/dust allergies'
    ],
    dosage: {
      general: 'Adults and adolescents 12 years and older: 5mg (1 tablet) once daily in the evening with or without food.',
      warning: 'Do not exceed 5mg per 24 hours. Higher doses increase sedation without adding allergic benefit.',
      pediatric: 'Children 6 to 11 years: 2.5mg (half tablet or 5ml syrup) once daily in the evening.'
    },
    sideEffects: {
      common: ['Mild somnolence or tiredness', 'Dry mouth', 'Headache or sore throat'],
      severe: ['Severe hypersensitivity or bronchospasm (rare)', 'Urinary retention in patients with prostate enlargement']
    },
    precautions: [
      'Take preferably in the evening before sleeping.',
      'Use caution if operating machinery or driving until you understand how it affects your alertness.',
      'Avoid combining with alcohol or central nervous system sedatives.'
    ],
    interactions: [
      'Alcohol and CNS depressants (additive impairment of alertness)',
      'Theophylline (minor clearance reduction; monitor in high doses)'
    ],
    warnings: [
      'EVENING DOSING RECOMMENDED: While classified as non-sedating, a small percentage of individuals experience drowsiness.'
    ],
    storage: 'Store in blister packs below 30°C in a dry place.',
    references: [
      { source: 'Allergic Rhinitis and its Impact on Asthma (ARIA) Guidelines', type: 'Clinical Evidence' },
      { source: 'European Pharmacopoeia (Ph. Eur.) - Levocetirizine Monograph', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 13. FEXOFENADINE (Allegra 120 / 180)
  // =========================================================================
  {
    id: 'fexofenadine',
    name: 'Fexofenadine 120 / 180',
    genericName: 'Fexofenadine Hydrochloride 120mg / 180mg',
    category: 'Allergy, Cold & Cough',
    brandNames: ['Allegra 120', 'Allegra 180', 'Telfast', 'Fexova', 'Histafree'],
    forms: ['120mg Tablets', '180mg Tablets', '30mg/5ml Suspension'],
    visualType: 'blister',
    visualColor: '#7C3AED',
    pillColor: '#FAF5FF',
    imprintText: 'ALLEGRA',
    overview: 'Fexofenadine is a highly selective, truly non-sedating second-generation antihistamine that does not readily cross the blood-brain barrier. It relieves allergy symptoms without causing drowsiness or cognitive slowing.',
    uses: [
      'Seasonal allergic rhinitis (hay fever): 120mg once daily',
      'Chronic idiopathic urticaria (allergic itchy hives): 180mg once daily',
      'Relief of nasal congestion, sneezing, and itchy watery eyes'
    ],
    dosage: {
      general: 'Adults: 120mg once daily for seasonal allergies, or 180mg once daily for chronic urticaria. Swallow whole with a glass of water.',
      warning: 'NO FRUIT JUICE: Do not take with grapefruit, orange, or apple juice; fruit juices reduce absorption by up to 40%.',
      pediatric: 'Children 6 to 11 years: 30mg twice daily with water.'
    },
    sideEffects: {
      common: ['Headache', 'Drowsiness (extremely low incidence, comparable to placebo)', 'Nausea or dizziness'],
      severe: ['Severe allergic angioedema (rare)', 'Palpitations']
    },
    precautions: [
      'Always take with plain water, not with fruit juices.',
      'Separate from aluminum and magnesium antacids by at least 2 hours.',
      'Safe for day-time active work and driving for most individuals.'
    ],
    interactions: [
      'Fruit juices (grapefruit, apple, orange inhibit OATP1A2 intestinal uptake transporters)',
      'Antacids containing aluminum and magnesium (reduce fexofenadine bioavailability)'
    ],
    warnings: [
      'TRUE NON-DROWSY: Gold standard choice for pilots, drivers, and students needing full daytime mental clarity.'
    ],
    storage: 'Store between 20°C and 25°C in original blister pack.',
    references: [
      { source: 'American Academy of Otolaryngology-Head and Neck Surgery Clinical Practice Guideline: Allergic Rhinitis', type: 'Clinical Evidence' },
      { source: 'FDA Package Insert - Allegra', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 14. SALBUTAMOL (Asthalin Inhaler / Ventolin)
  // =========================================================================
  {
    id: 'salbutamol',
    name: 'Salbutamol Inhaler (Asthalin)',
    genericName: 'Salbutamol (Albuterol) 100mcg per puff',
    category: 'Allergy, Cold & Cough',
    brandNames: ['Asthalin Inhaler', 'Ventolin', 'Aerolin', 'Salbair', 'Asmasal'],
    forms: ['100mcg Metered Dose Inhaler (MDI)', '2mg/4mg Tablets', 'Respules 2.5mg/2.5ml'],
    visualType: 'bottle',
    visualColor: '#0284C7',
    pillColor: '#E0F2FE',
    imprintText: 'ASTHALIN',
    overview: 'Salbutamol (albuterol) is a fast-acting selective beta-2 adrenergic agonist that stimulates bronchial smooth muscle receptors, causing rapid bronchodilation within 5 minutes. The premier rescue inhaler for asthma.',
    uses: [
      'Rapid relief of acute bronchospasm in bronchial asthma',
      'Management and prevention of exercise-induced bronchoconstriction (EIB)',
      'Symptomatic relief of reversible airway obstruction in COPD'
    ],
    dosage: {
      general: 'Adults: 1 to 2 puffs (100-200 mcg) inhaled as needed for acute wheezing or shortness of breath. For exercise prevention: 2 puffs 10-15 minutes before exertion.',
      warning: 'RESCUE ONLY: Salbutamol is for rapid relief, not a daily anti-inflammatory preventer. If needing more than 2-3 times per week, your asthma controller needs physician review.',
      pediatric: 'Children: 1 puff (100mcg) using a pediatric spacer device with facemask, repeating to 2 puffs if required.'
    },
    sideEffects: {
      common: ['Mild finger tremors or shakiness', 'Transiently increased heart rate (palpitations)', 'Headache or nervous tension'],
      severe: ['Paradoxical bronchospasm (immediate wheeze after inhaling)', 'Hypokalemia with frequent high doses']
    },
    precautions: [
      'Shake inhaler well before each use. Remove cap and breathe out completely before puffing.',
      'Using a spacer chamber improves medicine delivery to the lungs and reduces throat deposition.',
      'Check canister dose counter to ensure inhaler is not empty during an asthma flare.'
    ],
    interactions: [
      'Non-selective beta-blockers (propranolol, atenolol - block salbutamol action and trigger severe bronchospasm)',
      'Diuretics and corticosteroids (potentiate hypokalemia risk with high doses)'
    ],
    warnings: [
      'EMERGENCY RULE: If severe breathlessness does not improve after 4 to 6 puffs, seek emergency medical attention immediately.'
    ],
    storage: 'Store below 30°C. Protect from frost, direct sunlight, and heat. Do not puncture or burn canister.',
    references: [
      { source: 'Global Initiative for Asthma (GINA) Report', type: 'Clinical Evidence' },
      { source: 'British Thoracic Society (BTS) Asthma Guidelines', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 15. DEXTROMETHORPHAN (Ascoril D / Benadryl DR)
  // =========================================================================
  {
    id: 'dextromethorphan',
    name: 'Dextromethorphan Cough Syrup',
    genericName: 'Dextromethorphan Hydrobromide 10mg/5ml',
    category: 'Allergy, Cold & Cough',
    brandNames: ['Ascoril D', 'Benadryl DR', 'Robitussin Dry Cough', 'TusQ-D', 'Alex Syrup'],
    forms: ['10mg/5ml Syrup', '15mg Lozenges', '10mg Tablets'],
    visualType: 'bottle',
    visualColor: '#EA580C',
    pillColor: '#FED7AA',
    imprintText: 'DXM',
    overview: 'Dextromethorphan is a centrally acting antitussive agent that elevates the cough threshold in the brain’s medullary cough center. Indicated for the temporary suppression of non-productive, hacking dry coughs.',
    uses: [
      'Temporary relief of non-productive, irritating dry coughs due to minor throat and bronchial irritation',
      'Nocturnal cough suppression to facilitate restful sleep during viral upper respiratory infections'
    ],
    dosage: {
      general: 'Adults: 10ml to 15ml (20mg-30mg) orally every 6 to 8 hours as needed using the calibrated measuring cap. Maximum 120mg in 24 hours.',
      warning: 'NOT FOR WET/PRODUCTIVE COUGH: Do not take for phlegm-heavy chesty coughs; suppressing mucus clearance can worsen chest infections.',
      pediatric: 'Pediatric use: not recommended for children under 6 years without direct pediatric guidance.'
    },
    sideEffects: {
      common: ['Mild dizziness', 'Drowsiness or lightheadedness', 'Nausea and stomach discomfort'],
      severe: ['Serotonin syndrome when combined with antidepressants (MAOIs, SSRIs)', 'Respiratory depression with massive intentional overdose']
    },
    precautions: [
      'Do not use if you are currently taking a Monoamine Oxidase Inhibitor (MAOI) or have stopped one within the last 14 days.',
      'Stay hydrated with warm fluids to soothe irritated throat membranes.',
      'Consult a doctor if cough lasts longer than 7 days, recurs, or is accompanied by high fever or rash.'
    ],
    interactions: [
      'MAO inhibitors, SSRIs, and SNRIs (extreme risk of fatal serotonin toxicity)',
      'Alcohol and sedatives (intensifies drowsiness and psychomotor slowing)'
    ],
    warnings: [
      'DRY COUGH ONLY: Only suitable for tickly, dry hacking coughs without mucus.'
    ],
    storage: 'Store at room temperature below 25°C. Keep tightly closed and away from children.',
    references: [
      { source: 'American College of Chest Physicians (CHEST) Cough Guidelines', type: 'Clinical Evidence' },
      { source: 'US Pharmacopeia (USP) - Dextromethorphan Monograph', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 16. AMLODIPINE (Amlong 5 / Norvasc)
  // =========================================================================
  {
    id: 'amlodipine',
    name: 'Amlodipine 5',
    genericName: 'Amlodipine Besylate 5mg',
    category: 'Blood Pressure & Heart',
    brandNames: ['Amlong 5', 'Norvasc 5', 'Amlovas 5', 'Stamlo 5', 'Amlodac'],
    forms: ['5mg Tablets', '2.5mg Tablets', '10mg Tablets', 'Combo with Telmisartan (Telma-AM)'],
    visualType: 'blister',
    visualColor: '#2563EB',
    pillColor: '#EFF6FF',
    imprintText: 'AMLONG',
    overview: 'Amlodipine is a long-acting dihydropyridine calcium channel blocker. It selectively inhibits calcium ion influx across vascular smooth muscle, causing peripheral vasodilation and smooth 24-hour blood pressure reduction.',
    uses: [
      'Primary essential hypertension (high blood pressure) monotherapy or combination',
      'Chronic stable angina pectoris and vasospastic (Prinzmetal’s) angina',
      'Reduction of cardiovascular hospitalization risk in coronary artery disease'
    ],
    dosage: {
      general: 'Adults: 5mg once daily orally with or without food, taken at the same time each day. May be titrated to 10mg daily after 1 to 2 weeks if needed.',
      warning: 'DO NOT STOP ABRUPTLY: Sudden discontinuation can cause rebound hypertensive spikes. Always consult your cardiologist.',
      pediatric: 'Pediatric dosing (6-17 years): 2.5mg to 5mg once daily under pediatric cardiology supervision.'
    },
    sideEffects: {
      common: ['Peripheral ankle or foot swelling (edema)', 'Headache or facial flushing', 'Fatigue or dizziness upon standing'],
      severe: ['Marked hypotension or syncope', 'Worsening angina during initial dose titration (rare)']
    },
    precautions: [
      'Ankle edema is a common side effect caused by local capillary vasodilation; elevate feet in the evening.',
      'Check blood pressure regularly and log readings for your physician.',
      'Avoid sudden standing from a lying posture to minimize postural lightheadedness.'
    ],
    interactions: [
      'Simvastatin (amlodipine increases simvastatin levels; limit simvastatin to max 20mg daily)',
      'Grapefruit juice (mildly increases amlodipine exposure; moderate consumption acceptable)',
      'Other antihypertensives (additive blood pressure lowering - monitor for dizziness)'
    ],
    warnings: [
      'CONSISTENCY IS ESSENTIAL: Hypertension is typically asymptomatic; continue taking your tablet daily even when feeling completely healthy.'
    ],
    storage: 'Store protected from light and moisture below 30°C.',
    references: [
      { source: 'ACC/AHA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure', type: 'Clinical Evidence' },
      { source: 'Indian Pharmacopoeia (IP) - Amlodipine Besylate', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 17. LOSARTAN (Losar 50 / Cozaar)
  // =========================================================================
  {
    id: 'losartan',
    name: 'Losartan 50',
    genericName: 'Losartan Potassium 50mg',
    category: 'Blood Pressure & Heart',
    brandNames: ['Losar 50', 'Cozaar 50', 'Repace 50', 'Losacar 50', 'Tozaar'],
    forms: ['50mg Tablets', '25mg Tablets', '100mg Tablets', 'Combo with Hydrochlorothiazide'],
    visualType: 'blister',
    visualColor: '#4F46E5',
    pillColor: '#EEF2FF',
    imprintText: 'LOSAR 50',
    overview: 'Losartan is a first-in-class non-peptide Angiotensin II receptor antagonist (ARB). It blocks the vasoconstrictor and aldosterone-secreting effects of angiotensin II, lowering vascular resistance and protecting the kidneys in diabetic patients.',
    uses: [
      'Management of hypertension in adults and children 6 years and older',
      'Diabetic nephropathy with elevated serum creatinine and proteinuria in type 2 diabetes',
      'Stroke risk reduction in patients with hypertension and left ventricular hypertrophy'
    ],
    dosage: {
      general: 'Adults: 50mg once daily orally with or without water. May be adjusted between 25mg to 100mg once daily based on blood pressure response.',
      warning: 'PREGNANCY CONTRAINDICATION: Discontinue immediately if pregnancy is detected; ARBs cause severe fetal injury and death.',
      pediatric: 'Pediatric dosing: 0.7 mg/kg once daily (up to 50mg) under medical supervision.'
    },
    sideEffects: {
      common: ['Dizziness or lightheadedness', 'Nasal congestion or fatigue', 'Back pain'],
      severe: ['Hyperkalemia (elevated blood potassium)', 'Acute kidney injury in bilateral renal artery stenosis', 'Angioedema (rare)']
    },
    precautions: [
      'Avoid potassium-containing salt substitutes and potassium supplements without blood monitoring.',
      'Check renal function and serum potassium periodically with routine blood tests.',
      'Maintain adequate hydration; dehydration increases the risk of hypotension.'
    ],
    interactions: [
      'Potassium supplements and potassium-sparing diuretics (spironolactone - severe hyperkalemia risk)',
      'NSAIDs (ibuprofen, naproxen - reduce losartan efficacy and worsen kidney function)',
      'Lithium (losartan can reduce lithium excretion, increasing toxicity)'
    ],
    warnings: [
      'FETAL TOXICITY WARNING: Black box warning against use in 2nd and 3rd trimesters of pregnancy.'
    ],
    storage: 'Store between 15°C and 30°C protected from light and moisture.',
    references: [
      { source: 'KDIGO Clinical Practice Guideline for Diabetes Management in Chronic Kidney Disease', type: 'Clinical Evidence' },
      { source: 'FDA Package Insert - Cozaar (Losartan Potassium)', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 18. METOPROLOL (Betaloc 25/50 / Metolar XR)
  // =========================================================================
  {
    id: 'metoprolol',
    name: 'Metoprolol Succinate XR',
    genericName: 'Metoprolol Succinate Extended Release 25mg / 50mg',
    category: 'Blood Pressure & Heart',
    brandNames: ['Betaloc 25', 'Betaloc 50', 'Metolar XR', 'Seloken', 'Toprol-XL'],
    forms: ['25mg Extended-Release Tablets', '50mg XR Tablets', '12.5mg Tablets', '100mg Tablets'],
    visualType: 'blister',
    visualColor: '#1D4ED8',
    pillColor: '#FFFFFF',
    imprintText: 'BETA 50',
    overview: 'Metoprolol is a cardio-selective beta-1 adrenergic receptor blocker. It slows resting and exercise heart rate, decreases myocardial contractility, and lowers cardiac oxygen demand, protecting against arrhythmias and heart failure progression.',
    uses: [
      'Chronic stable heart failure with reduced ejection fraction (HFrEF)',
      'Long-term management of angina pectoris and coronary artery disease',
      'Control of resting heart rate in supraventricular tachycardia and atrial fibrillation',
      'Hypertension and post-myocardial infarction secondary cardioprotection'
    ],
    dosage: {
      general: 'Adults: 25mg to 50mg once daily orally in the morning with or immediately after food. Swallow the extended-release tablet whole with water.',
      warning: 'NEVER STOP ABRUPTLY: Sudden cessation of beta-blockers can trigger acute chest pain, rebound tachycardia, or myocardial infarction.',
      pediatric: 'Pediatric dosing strictly guided by pediatric cardiology.'
    },
    sideEffects: {
      common: ['Slow heart rate (bradycardia)', 'Tiredness and lightheadedness', 'Cold extremities (cold hands and feet)'],
      severe: ['Severe bradycardia (<50 bpm) or heart block', 'Worsening asthma or bronchospasm', 'Severe hypotension']
    },
    precautions: [
      'Take your pulse regularly; notify your doctor if resting pulse falls below 50 beats per minute with dizziness.',
      'Contraindicated in severe asthma, cardiogenic shock, and high-grade AV block.',
      'May mask symptoms of acute hypoglycemia (tremors, palpitations) in diabetic patients, though sweating remains.'
    ],
    interactions: [
      'Calcium channel blockers (verapamil, diltiazem - extreme risk of severe bradycardia and heart failure)',
      'Amiodarone and digoxin (additive slowing of AV nodal conduction)',
      'Clonidine (rebound hypertension risk if clonidine is withdrawn while on beta-blocker)'
    ],
    warnings: [
      'BLACK BOX TAPER WARNING: Must be gradually tapered over 1 to 2 weeks under medical supervision if discontinuing.'
    ],
    storage: 'Store below 25°C in original blister pack away from heat.',
    references: [
      { source: 'AHA/ACC/HFSA Guideline for the Management of Heart Failure', type: 'Clinical Evidence' },
      { source: 'US Pharmacopeia (USP) - Metoprolol Succinate', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 19. GLIMEPIRIDE (Amaryl 1mg/2mg / Glimy)
  // =========================================================================
  {
    id: 'glimepiride',
    name: 'Glimepiride 1mg / 2mg',
    genericName: 'Glimepiride 1mg / 2mg',
    category: 'Diabetes Management',
    brandNames: ['Amaryl 1', 'Amaryl 2', 'Glimy', 'Zoryl', 'Gemer (with Metformin)'],
    forms: ['1mg Tablets', '2mg Tablets', '3mg Tablets', '4mg Tablets'],
    visualType: 'blister',
    visualColor: '#059669',
    pillColor: '#D1FAE5',
    imprintText: 'AMARYL',
    overview: 'Glimepiride is an advanced third-generation sulfonylurea oral antidiabetic agent. It stimulates insulin release from functioning pancreatic beta cells by closing ATP-sensitive potassium channels.',
    uses: [
      'Adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes mellitus',
      'Combination therapy with metformin or insulin when monotherapy yields insufficient control'
    ],
    dosage: {
      general: 'Adults: Initial dose 1mg to 2mg once daily orally, taken immediately with breakfast or the first main meal of the day.',
      warning: 'ALWAYS TAKE WITH FOOD: Never take on an empty stomach or if skipping a meal, as it can cause severe hypoglycemia (low blood sugar).',
      pediatric: 'Not indicated for use in pediatric diabetes.'
    },
    sideEffects: {
      common: ['Hypoglycemia (shakiness, sweating, dizziness, hunger)', 'Mild nausea or headache', 'Modest weight gain'],
      severe: ['Severe prolonged hypoglycemia requiring emergency IV glucose', 'Allergic skin reactions (urticaria, photosensitivity)']
    },
    precautions: [
      'Always carry fast-acting glucose tablets, candy, or juice in case sudden shakiness or sweating strikes.',
      'Check blood sugar regularly, especially when initiating therapy or changing doses.',
      'Caution in elderly patients and those with renal or hepatic impairment.'
    ],
    interactions: [
      'Alcohol (potentiates hypoglycemia and can trigger disulfiram-like reactions)',
      'Fluconazole and NSAIDs (inhibit glimepiride metabolism, increasing hypoglycemia risk)',
      'Beta-blockers (may mask symptoms of low blood sugar such as tachycardia)'
    ],
    warnings: [
      'LOW BLOOD SUGAR ALERT: Educate family members on identifying low blood sugar symptoms (drowsiness, confusion, cold sweats).'
    ],
    storage: 'Store below 25°C protected from light and moisture.',
    references: [
      { source: 'American Diabetes Association (ADA) Standards of Care in Diabetes', type: 'Clinical Evidence' },
      { source: 'Indian Pharmacopoeia (IP) - Glimepiride Monograph', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 20. SITAGLIPTIN (Januvia 100 / Zita)
  // =========================================================================
  {
    id: 'sitagliptin',
    name: 'Sitagliptin 100',
    genericName: 'Sitagliptin Phosphate 100mg',
    category: 'Diabetes Management',
    brandNames: ['Januvia 100', 'Zita 100', 'Istavel 100', 'Janumet (with Metformin)'],
    forms: ['100mg Tablets', '50mg Tablets', '25mg Tablets'],
    visualType: 'blister',
    visualColor: '#D97706',
    pillColor: '#FEF3C7',
    imprintText: 'JANUVIA',
    overview: 'Sitagliptin is a dipeptidyl peptidase-4 (DPP-4) inhibitor that prolongs the action of incretin hormones (GLP-1 and GIP). It stimulates glucose-dependent insulin secretion and suppresses glucagon release with minimal hypoglycemia risk.',
    uses: [
      'Monotherapy or combination therapy for adults with type 2 diabetes mellitus to improve glycemic control',
      'Weight-neutral glycemic management with very low risk of hypoglycemia when used alone'
    ],
    dosage: {
      general: 'Adults: 100mg once daily orally with or without food, at any consistent time of the day.',
      warning: 'Renal dose adjustment required for moderate to severe chronic kidney disease (50mg for eGFR 30-45, 25mg for eGFR <30).',
      pediatric: 'Safety and efficacy not established in children under 18 years.'
    },
    sideEffects: {
      common: ['Upper respiratory tract infection or stuffy nose', 'Headache', 'Mild abdominal discomfort'],
      severe: ['Acute pancreatitis (persistent severe abdominal pain radiating to the back)', 'Severe and disabling joint pain (arthralgia)']
    },
    precautions: [
      'Stop taking immediately and contact your doctor if severe, persistent abdominal pain develops.',
      'Evaluate renal function prior to initiation and periodically thereafter.',
      'Check for symptoms of bullous pemphigoid (large blistering skin lesions).'
    ],
    interactions: [
      'Digoxin (slight increase in digoxin blood levels; monitor concentrations)',
      'Sulfonylureas or insulin (when combined, lower sulfonylurea dose to prevent hypoglycemia)'
    ],
    warnings: [
      'PANCREATITIS AWARENESS: Discontinue promptly if persistent severe stomach pain with vomiting occurs.'
    ],
    storage: 'Store between 20°C and 25°C in original packaging away from excess heat.',
    references: [
      { source: 'American Diabetes Association (ADA) Pharmacologic Approaches to Glycemic Treatment', type: 'Clinical Evidence' },
      { source: 'FDA Drug Safety Communication on DPP-4 Inhibitors', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 21. DAPAGLIFLOZIN (Forxiga 10 / Oxra)
  // =========================================================================
  {
    id: 'dapagliflozin',
    name: 'Dapagliflozin 10',
    genericName: 'Dapagliflozin Propanediol 10mg',
    category: 'Diabetes Management',
    brandNames: ['Forxiga 10', 'Oxra 10', 'Brenzys', 'Farxiga', 'Dapa-5/10'],
    forms: ['10mg Film-Coated Tablets', '5mg Tablets', 'Combo with Metformin (Xigduo)'],
    visualType: 'blister',
    visualColor: '#0D9488',
    pillColor: '#F0FDFA',
    imprintText: 'FORXIGA',
    overview: 'Dapagliflozin is a selective sodium-glucose cotransporter 2 (SGLT2) inhibitor that reduces renal glucose reabsorption in the proximal tubules, promoting urinary glucose excretion. It offers proven cardiovascular and renal protective benefits.',
    uses: [
      'Type 2 diabetes glycemic control, weight reduction, and systolic blood pressure lowering',
      'Heart failure with reduced or preserved ejection fraction to reduce hospitalization and cardiovascular death',
      'Chronic kidney disease (CKD) to slow disease progression and prevent end-stage kidney failure'
    ],
    dosage: {
      general: 'Adults: 10mg once daily orally in the morning with or without food with a full glass of water.',
      warning: 'HYDRATION & HYGIENE: Drink plenty of water throughout the day. Practice meticulous genital hygiene to prevent fungal infections.',
      pediatric: 'Not indicated for use in children under 18 years.'
    },
    sideEffects: {
      common: ['Genital mycotic (yeast) infections', 'Increased urination (mild osmotic diuresis)', 'Mild thirst'],
      severe: ['Euglycemic diabetic ketoacidosis (DKA with normal or near-normal blood glucose)', 'Fournier’s gangrene (rare necrotizing fasciitis of the perineum)', 'Urosepsis and pyelonephritis']
    },
    precautions: [
      'Stay well hydrated to prevent volume depletion, dizziness, and sudden hypotension.',
      'Temporarily withhold dapagliflozin at least 3 days before scheduled major surgery to avoid ketoacidosis.',
      'Seek prompt medical care if experiencing deep fatigue, nausea, vomiting, or abdominal pain even with normal blood sugar.'
    ],
    interactions: [
      'Loop and thiazide diuretics (additive dehydration and hypotension risk)',
      'Insulin and sulfonylureas (increased hypoglycemia risk - dose reduction may be needed)'
    ],
    warnings: [
      'DKA WARNING: Discontinue immediately if ketoacidosis symptoms occur (nausea, shortness of breath, confusion, sweet-smelling breath).'
    ],
    storage: 'Store between 20°C and 25°C in a dry place.',
    references: [
      { source: 'KDIGO 2022 Clinical Practice Guideline for Diabetes Management in CKD', type: 'Clinical Evidence' },
      { source: 'FDA Safety Communication - SGLT2 Inhibitors and Ketoacidosis', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 22. ROSUVASTATIN (Rosuvas 10 / Crestor)
  // =========================================================================
  {
    id: 'rosuvastatin',
    name: 'Rosuvastatin 10',
    genericName: 'Rosuvastatin Calcium 10mg',
    category: 'Cholesterol & Heart',
    brandNames: ['Rosuvas 10', 'Crestor 10', 'Rozavel 10', 'Roseday 10', 'Novastat'],
    forms: ['10mg Tablets', '5mg Tablets', '20mg Tablets', '40mg Tablets'],
    visualType: 'blister',
    visualColor: '#7C3AED',
    pillColor: '#F3E8FF',
    imprintText: 'ROSUVAS',
    overview: 'Rosuvastatin is a high-intensity, hydrophilic HMG-CoA reductase inhibitor (statin). It potently suppresses hepatic cholesterol synthesis and upregulates LDL receptors on hepatocytes, lowering LDL-C by up to 50%.',
    uses: [
      'Primary hyperlipidemia and mixed dyslipidemia to lower LDL-C, ApoB, and triglycerides',
      'Primary prevention of major cardiovascular events (heart attack, stroke, revascularization)',
      'Slowing the progression of coronary atherosclerosis in patients with cardiovascular disease'
    ],
    dosage: {
      general: 'Adults: 5mg to 10mg once daily orally at any time of the day, with or without food. Maximum 20mg daily (40mg restricted to severe hypercholesterolemia under close monitoring).',
      warning: 'REPORT MUSCLE PAIN: Notify your physician immediately if unexplained muscle aches, tenderness, or weakness develops, particularly with dark tea-colored urine.',
      pediatric: 'Pediatric use in familial hypercholesterolemia (ages 8-17) starting at 5mg daily under specialist care.'
    },
    sideEffects: {
      common: ['Mild headache or dizziness', 'Mild abdominal pain or constipation', 'Transient muscle stiffness'],
      severe: ['Myopathy and rhabdomyolysis with acute kidney failure', 'Elevated hepatic transaminases (liver enzymes)']
    },
    precautions: [
      'Take consistently once daily; unlike older statins, rosuvastatin has a long half-life and can be taken morning or night.',
      'Contraindicated in active liver disease or unexplained persistent elevation of serum transaminases.',
      'Avoid excessive alcohol consumption while taking statin medications.'
    ],
    interactions: [
      'Cyclosporine and gemfibrozil (significantly elevate rosuvastatin exposure - contraindicated)',
      'Warfarin (rosuvastatin moderately increases INR; monitor when starting or adjusting dose)',
      'Antacids (aluminum and magnesium antacids decrease absorption; take 2 hours apart)'
    ],
    warnings: [
      'PREGNANCY CONTRAINDICATION: Statins are contraindicated in pregnancy; cholesterol is crucial for fetal tissue development.'
    ],
    storage: 'Store between 20°C and 25°C in blister strips away from moisture.',
    references: [
      { source: 'ACC/AHA Guideline on the Management of Blood Cholesterol', type: 'Clinical Evidence' },
      { source: 'European Society of Cardiology (ESC) Dyslipidaemia Guidelines', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 23. TRAMADOL (Ultracet / Tramazac 50)
  // =========================================================================
  {
    id: 'tramadol',
    name: 'Tramadol 50mg (Ultracet)',
    genericName: 'Tramadol Hydrochloride 50mg (or Tramadol 37.5mg + Paracetamol 325mg)',
    category: 'Pain & Fever',
    brandNames: ['Ultracet', 'Tramazac 50', 'Tramal', 'Contramal', 'Urson'],
    forms: ['50mg Capsules', 'Ultracet Tablets (37.5mg/325mg)', '50mg/ml Injection'],
    visualType: 'blister',
    visualColor: '#DC2626',
    pillColor: '#FEE2E2',
    imprintText: 'TRAM 50',
    overview: 'Tramadol is a centrally acting synthetic opioid analgesic with a dual mode of action: it binds weakly to mu-opioid receptors and inhibits the reuptake of norepinephrine and serotonin. Prescribed for moderate to severe pain.',
    uses: [
      'Short-term management of acute moderate to severe post-operative or post-injury pain',
      'Severe musculoskeletal, orthopedic, and chronic pain unresponsive to standard NSAIDs'
    ],
    dosage: {
      general: 'Adults: 50mg orally every 6 to 8 hours as needed for severe pain. For Ultracet: 1 to 2 tablets every 6 hours. Maximum 400mg of tramadol per 24 hours (300mg in elderly).',
      warning: 'SCHEDULED SUBSTANCE: Prescription only. Has potential for tolerance, physical dependence, and abuse. Do not exceed prescribed duration.',
      pediatric: 'CONTRAINDICATED in children under 12 years and in adolescents following tonsillectomy/adenoidectomy.'
    },
    sideEffects: {
      common: ['Drowsiness and sedation', 'Nausea, dizziness, and constipation', 'Sweating or dry mouth'],
      severe: ['Respiratory depression with overdose or combined depressants', 'Seizures (especially in individuals with epilepsy or taking antidepressants)', 'Serotonin syndrome']
    },
    precautions: [
      'Do not drive or operate heavy machinery; tramadol impairs mental alertness and reaction speed.',
      'Absolute alcohol avoidance: combining alcohol with tramadol significantly increases respiratory depression risk.',
      'Do not crush or split extended-release formulations.'
    ],
    interactions: [
      'Alcohol, benzodiazepines, and sedatives (fatal respiratory depression risk)',
      'SSRIs, SNRIs, and triptans (drastically elevates risk of serotonin syndrome and seizures)',
      'Carbamazepine (significantly decreases tramadol pain relief)'
    ],
    warnings: [
      'ADDICTION & OVERDOSE WARNING: Opioid medication. Store securely out of sight and reach of others.'
    ],
    storage: 'Controlled room temperature below 25°C in locked medicine storage.',
    references: [
      { source: 'CDC Clinical Practice Guideline for Prescribing Opioids for Pain', type: 'Clinical Evidence' },
      { source: 'WHO Guidelines on the Pharmacological Treatment of Persisting Pain', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 24. DROTAVERINE (Drotin 40/80 / No-Spa)
  // =========================================================================
  {
    id: 'drotaverine',
    name: 'Drotaverine 40 / 80 (Drotin)',
    genericName: 'Drotaverine Hydrochloride 40mg / 80mg',
    category: 'Stomach Cramps & Spasms',
    brandNames: ['Drotin 40', 'Drotin 80', 'Drotin-DS', 'No-Spa', 'Drotikind'],
    forms: ['40mg Tablets', '80mg Tablets', '20mg/ml Injection', 'Combo with Mefenamic Acid (Drotin-M)'],
    visualType: 'blister',
    visualColor: '#7C3AED',
    pillColor: '#EDE9FE',
    imprintText: 'DROTIN',
    overview: 'Drotaverine is an isoquinoline antispasmodic agent that selectively inhibits phosphodiesterase IV (PDE4) enzymes in smooth muscle. It produces rapid, non-anticholinergic relaxation of visceral smooth muscles in the GI, biliary, and urogenital tracts.',
    uses: [
      'Relief of smooth muscle spasms in biliary colic, gallstones, and cholecystitis',
      'Relief of renal colic, ureteral spasms, and kidney stone cramping',
      'Spastic constipation, irritable bowel syndrome (IBS) spasms, and intestinal colic',
      'Severe dysmenorrhea (menstrual cramps) and uterine spasms'
    ],
    dosage: {
      general: 'Adults: 40mg to 80mg orally 2 to 3 times daily with water, with or without food. Maximum 240mg per 24 hours.',
      warning: 'Do not use as a generic painkiller for headaches or musculoskeletal back pain; it only relaxes visceral smooth muscle.',
      pediatric: 'Children 6 to 12 years: 40mg twice daily under medical guidance.'
    },
    sideEffects: {
      common: ['Mild dizziness or headache', 'Nausea and constipation', 'Feeling of warmth or mild flushing'],
      severe: ['Hypotension and palpitations with rapid administration', 'Allergic dermatitis']
    },
    precautions: [
      'Use with caution in patients with underlying low blood pressure (hypotension).',
      'Does not cause dry mouth or blurred vision typical of anticholinergics like dicyclomine.',
      'Consult doctor if acute sharp abdominal pain persists or worsens.'
    ],
    interactions: [
      'Levodopa (drotaverine may reduce the antiparkinsonian effect of levodopa and worsen tremors)'
    ],
    warnings: [
      'TARGETED SPASM RELIEF: Designed specifically for visceral cramping (renal, intestinal, uterine, biliary).'
    ],
    storage: 'Store below 25°C in original blister packaging away from moisture.',
    references: [
      { source: 'Indian Pharmacopoeia (IP) - Drotaverine Hydrochloride Monograph', type: 'Regulatory' },
      { source: 'European Journal of Clinical Pharmacology - PDE4 Inhibitors', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 25. CHOLECALCIFEROL VITAMIN D3 (Calcirol 60K / Uprise-D3)
  // =========================================================================
  {
    id: 'cholecalciferol-d3',
    name: 'Vitamin D3 60,000 IU (Calcirol)',
    genericName: 'Cholecalciferol 60,000 IU',
    category: 'Vitamins & Essential Minerals',
    brandNames: ['Calcirol 60K', 'Uprise-D3 60K', 'D-Rise 60K', 'Lumia 60K', 'Tayas D3'],
    forms: ['60,000 IU Softgel Capsules', '60,000 IU Oral Granules Sachet', 'Oral Solution Drops'],
    visualType: 'capsule',
    visualColor: '#D97706',
    pillColor: '#FEF08A',
    imprintText: 'D3 60K',
    overview: 'Cholecalciferol (Vitamin D3) is a fat-soluble secosteroid that promotes intestinal calcium and phosphorus absorption, maintains serum mineral homeostasis, and stimulates bone mineralization and immune modulation.',
    uses: [
      'Correction of clinical Vitamin D deficiency (serum 25(OH)D <20 ng/mL)',
      'Prevention and co-treatment of osteoporosis, osteopenia, and rickets',
      'Support of musculoskeletal health, muscle strength, and immune defense'
    ],
    dosage: {
      general: 'Deficiency Treatment: 1 capsule or sachet (60,000 IU) once weekly for 8 consecutive weeks, taken with a meal containing dietary fat (milk or food). Maintenance: 60,000 IU once monthly or as directed by physician.',
      warning: 'TAKE ONCE WEEKLY, NOT DAILY: High-strength 60,000 IU is formulated for weekly or monthly dosing. Taking daily causes dangerous Vitamin D toxicity (hypercalcemia).',
      pediatric: 'Pediatric dosing must be calculated strictly by pediatrician using specialized pediatric drop formulations.'
    },
    sideEffects: {
      common: ['None when taken at weekly/monthly recommended intervals'],
      severe: ['Hypercalcemia from overdose (weakness, nausea, thirst, kidney stones, confusion)']
    },
    precautions: [
      'Take with your largest meal of the day; dietary fat significantly boosts Vitamin D absorption.',
      'Check serum 25-hydroxyvitamin D levels after completing an 8-week corrective cycle.',
      'Contraindicated in patients with pre-existing hypercalcemia, hypervitaminosis D, or severe kidney stones.'
    ],
    interactions: [
      'Thiazide diuretics (increase risk of hypercalcemia by decreasing urinary calcium excretion)',
      'Orlistat and mineral oil (decrease intestinal absorption of fat-soluble Vitamin D)'
    ],
    warnings: [
      'WEEKLY DOSING ALERT: Check your calendar carefully. Do not take 60,000 IU every day.'
    ],
    storage: 'Store below 25°C in a dry place. Protect softgels from heat and melting.',
    references: [
      { source: 'Endocrine Society Clinical Practice Guideline: Evaluation, Treatment, and Prevention of Vitamin D Deficiency', type: 'Clinical Evidence' },
      { source: 'National Institutes of Health (NIH) - Vitamin D Fact Sheet', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 26. NEUROBION FORTE (B-Complex with B12)
  // =========================================================================
  {
    id: 'neurobion-forte',
    name: 'Neurobion Forte',
    genericName: 'Vitamin B1 (Thiamine) + B6 (Pyridoxine) + B12 (Cyanocobalamin)',
    category: 'Vitamins & Essential Minerals',
    brandNames: ['Neurobion Forte', 'Cobadex Forte', 'Becosules', 'Nurokind-Plus', 'Optineuron'],
    forms: ['Film-Coated Tablets', '2ml Injection (Neurobion IM)'],
    visualType: 'blister',
    visualColor: '#DC2626',
    pillColor: '#FCA5A5',
    imprintText: 'NEURO',
    overview: 'Neurobion Forte combines neurotropic vitamins B1 (10mg), B2 (10mg), B3 (45mg), B5 (50mg), B6 (3mg), and B12 (15mcg). Essential for nerve cell metabolism, myelin sheath synthesis, and red blood cell production.',
    uses: [
      'Prevention and treatment of Vitamin B deficiencies and peripheral neuropathy',
      'Support in diabetic neuropathy (numbness, pins-and-needles, nerve burning in feet)',
      'Relief of fatigue, convalescence weakness, and mouth ulcers'
    ],
    dosage: {
      general: 'Adults: 1 tablet daily orally after meals with a glass of water, or as directed by your physician.',
      warning: 'Do not exceed recommended daily dosage. Unused excess water-soluble B vitamins are excreted harmlessly in urine.',
      pediatric: 'Use pediatric formulations under medical supervision.'
    },
    sideEffects: {
      common: ['Bright yellow or neon coloration of urine (harmless effect of riboflavin B2)', 'Mild stomach flush'],
      severe: ['Peripheral sensory neuropathy with extreme mega-doses of Pyridoxine (B6) over many months']
    },
    precautions: [
      'Notice that bright yellow urine is completely normal and harmless during use.',
      'Vegetarians and vegans frequently benefit from B12 supplementation as B12 is found primarily in animal sources.',
      'Inform your doctor if taking levodopa for Parkinson’s disease.'
    ],
    interactions: [
      'Levodopa (pyridoxine B6 reduces levodopa efficacy unless paired with carbidopa)',
      'Metformin (long-term metformin use can decrease Vitamin B12 absorption; regular checks advised)'
    ],
    warnings: [
      'SAFE DAILY SUPPLEMENT: Take with food in the morning or afternoon for steady metabolic energy.'
    ],
    storage: 'Store below 25°C in a dry place away from direct sunlight.',
    references: [
      { source: 'Indian Pharmacopoeia (IP) - Vitamin B-Complex Formulations', type: 'Regulatory' },
      { source: 'Cochrane Systematic Review on B Vitamins for Peripheral Neuropathy', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 27. SHELCAL 500 (Calcium 500mg + Vitamin D3)
  // =========================================================================
  {
    id: 'shelcal-500',
    name: 'Shelcal 500',
    genericName: 'Elemental Calcium 500mg (from Calcium Carbonate) + Vitamin D3 250 IU',
    category: 'Vitamins & Essential Minerals',
    brandNames: ['Shelcal 500', 'Cipcal 500', 'Caltrate', 'Calcimax 500', 'Gemcal'],
    forms: ['500mg Tablets', 'Chewable Tablets', 'Shelcal-HD (High D3)'],
    visualType: 'bottle',
    visualColor: '#0284C7',
    pillColor: '#FFFFFF',
    imprintText: 'SHELCAL',
    overview: 'Shelcal 500 provides 500mg of elemental calcium combined with Vitamin D3 to ensure optimal intestinal absorption. Essential for maintaining bone mineral density, neuromuscular transmission, and cardiac rhythm.',
    uses: [
      'Prevention and management of osteoporosis, osteopenia, and postmenopausal bone loss',
      'Meeting increased calcium requirements during pregnancy, lactation, and aging',
      'Management of hypocalcemia and calcium deficiency states'
    ],
    dosage: {
      general: 'Adults: 1 tablet once or twice daily orally, taken with or immediately after meals with a glass of water.',
      warning: 'TAKE WITH MEALS: Calcium carbonate requires gastric acid for optimal dissolution and absorption.',
      pediatric: 'Pediatric dosing under physician supervision.'
    },
    sideEffects: {
      common: ['Constipation', 'Flatulence, bloating, and mild indigestion'],
      severe: ['Hypercalcemia, milk-alkali syndrome, or nephrolithiasis (kidney stones) with chronic excessive intake']
    },
    precautions: [
      'Drink plenty of water and maintain adequate dietary fiber to avoid constipation.',
      'Separate by at least 2 hours from iron supplements, thyroid medication, and antibiotics.',
      'Contraindicated in patients with active hypercalcemia or severe calcium kidney stones.'
    ],
    interactions: [
      'Iron supplements and Levothyroxine (calcium binds them in the gut; separate by at least 4 hours)',
      'Tetracyclines and Fluoroquinolone antibiotics (calcium blocks antibiotic absorption)'
    ],
    warnings: [
      'SEPARATE FROM OTHER MEDICINES: Always take calcium at a different time from iron, thyroid, or antibiotic pills.'
    ],
    storage: 'Keep container tightly closed below 25°C in a dry place.',
    references: [
      { source: 'National Osteoporosis Foundation (NOF) Calcium and Vitamin D Guidelines', type: 'Clinical Evidence' },
      { source: 'United States Pharmacopeia (USP) - Calcium Carbonate Monograph', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 28. LEVOTHYROXINE (Thyronorm / Eltroxin)
  // =========================================================================
  {
    id: 'levothyroxine',
    name: 'Levothyroxine (Thyronorm)',
    genericName: 'Levothyroxine Sodium 25mcg / 50mcg / 100mcg',
    category: 'Thyroid & Endocrine',
    brandNames: ['Thyronorm', 'Eltroxin', 'Synthroid', 'Thyrox', 'Levoxyl'],
    forms: ['25mcg Tablets', '50mcg Tablets', '75mcg Tablets', '100mcg Tablets', '125mcg Tablets'],
    visualType: 'bottle',
    visualColor: '#2563EB',
    pillColor: '#F1F5F9',
    imprintText: 'THYRO',
    overview: 'Levothyroxine is a synthetic crystalline levorotatory isomer of thyroxine (T4). It replaces deficient endogenous thyroid hormone to restore normal basal metabolic rate, cardiac output, and energy balance in hypothyroidism.',
    uses: [
      'Primary, secondary, and tertiary hypothyroidism (underactive thyroid gland)',
      'Pituitary thyroid-stimulating hormone (TSH) suppression in thyroid cancer management',
      'Congenital hypothyroidism in infants and children'
    ],
    dosage: {
      general: 'Adults: Take exactly the prescribed microgram dose ONCE DAILY in the morning, 30 to 60 minutes BEFORE breakfast on an empty stomach with plain water only.',
      warning: 'STRICT MORNING FASTING: Coffee, tea, milk, calcium, iron, or breakfast within 30-60 minutes drastically impairs absorption.',
      pediatric: 'Pediatric dosing titrated strictly by pediatric endocrinologist based on body weight and serum TSH/Free T4 levels.'
    },
    sideEffects: {
      common: ['None when the microgram dose is accurately matched to patient needs'],
      severe: ['Symptoms of hyperthyroidism from overdose (palpitations, heart racing, tremors, heat intolerance, weight loss, insomnia)']
    },
    precautions: [
      'Take with plain water only upon waking; wait at least 30-60 minutes before morning tea, coffee, or food.',
      'Never switch between different brands without checking with your doctor; narrow therapeutic index.',
      'Check serum TSH levels every 6 to 12 weeks during dose adjustment and annually once stabilized.'
    ],
    interactions: [
      'Calcium, iron, antacids, and soy products (severely inhibit thyroid absorption; take at least 4 hours apart)',
      'Warfarin (levothyroxine accelerates clotting factor catabolism; monitor INR)'
    ],
    warnings: [
      'NARROW THERAPEUTIC INDEX: Do not self-adjust doses or skip doses. Lifelong therapy is typical for primary hypothyroidism.'
    ],
    storage: 'Store between 15°C and 25°C protected from light, moisture, and heat.',
    references: [
      { source: 'American Thyroid Association (ATA) Hypothyroidism Guidelines', type: 'Clinical Evidence' },
      { source: 'Indian Pharmacopoeia (IP) - Levothyroxine Tablets', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 29. FLUCONAZOLE (Forcan 150 / Diflucan)
  // =========================================================================
  {
    id: 'fluconazole',
    name: 'Fluconazole 150',
    genericName: 'Fluconazole 150mg',
    category: 'Antibiotics & Anti-infectives',
    brandNames: ['Forcan 150', 'Diflucan 150', 'Flucos 150', 'Zocon 150', 'Syscan 150'],
    forms: ['150mg Single-Dose Tablets', '50mg Capsules', '200mg Tablets', '2mg/ml IV Infusion'],
    visualType: 'blister',
    visualColor: '#7C3AED',
    pillColor: '#F5F3FF',
    imprintText: 'FORCAN',
    overview: 'Fluconazole is a synthetic triazole antifungal agent that selectively inhibits fungal cytochrome P450-dependent 14-alpha-demethylase, halting ergosterol synthesis and disrupting the fungal cell membrane.',
    uses: [
      'Vaginal candidiasis (yeast infection): single 150mg oral dose',
      'Oral thrush (oropharyngeal candidiasis) and esophageal candidiasis',
      'Tinea cruris (jock itch), tinea corporis (ringworm), and fungal nail infections',
      'Cryptococcal meningitis and systemic fungal prophylaxis in immunocompromised patients'
    ],
    dosage: {
      general: 'Vaginal Candidiasis: 150mg as a single oral dose with water, with or without food. Ringworm / Tinea: 150mg once weekly for 2 to 4 weeks as prescribed.',
      warning: 'Do not repeat doses without medical evaluation if symptoms do not improve.',
      pediatric: 'Pediatric dosing: 3 to 6 mg/kg/day under pediatric supervision.'
    },
    sideEffects: {
      common: ['Mild headache', 'Nausea, abdominal pain, or mild diarrhea', 'Transient rash'],
      severe: ['QT prolongation and torsades de pointes', 'Rare hepatotoxicity or severe exfoliative skin disorders']
    },
    precautions: [
      'Contraindicated in co-administration with other drugs known to prolong the QT interval.',
      'Caution in patients with pre-existing hepatic impairment; liver function tests needed with chronic use.',
      'Use barrier contraception; single 150mg dose in pregnancy requires physician risk-benefit assessment.'
    ],
    interactions: [
      'Warfarin (fluconazole significantly increases prothrombin time; check INR)',
      'Statins (atorvastatin, simvastatin - increased myopathy risk due to CYP3A4 inhibition)',
      'Oral hypoglycemics (glimepiride, glipizide - risk of prolonged hypoglycemia)'
    ],
    warnings: [
      'TARGETED ANTIFUNGAL: Ineffective against bacterial, viral, or parasite infections.'
    ],
    storage: 'Store below 30°C in a dry place.',
    references: [
      { source: 'Infectious Diseases Society of America (IDSA) Clinical Practice Guideline for the Management of Candidiasis', type: 'Clinical Evidence' },
      { source: 'US Pharmacopeia (USP) - Fluconazole Monograph', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 30. ESCITALOPRAM (Nexito 10 / Lexapro)
  // =========================================================================
  {
    id: 'escitalopram',
    name: 'Escitalopram 10 (Nexito)',
    genericName: 'Escitalopram Oxalate 10mg',
    category: 'Mental Health & Nervous System',
    brandNames: ['Nexito 10', 'Lexapro 10', 'Cipralex', 'Stalopam 10', 'S-Citadep'],
    forms: ['10mg Film-Coated Tablets', '5mg Tablets', '20mg Tablets', 'Combo with Clonazepam (Nexito Plus)'],
    visualType: 'blister',
    visualColor: '#4F46E5',
    pillColor: '#EEF2FF',
    imprintText: 'NEXITO',
    overview: 'Escitalopram is the pure (S)-enantiomer of citalopram and the most selective serotonin reuptake inhibitor (SSRI) available. It enhances serotonergic neurotransmission to treat major depressive disorder and generalized anxiety disorder.',
    uses: [
      'Treatment of Major Depressive Disorder (MDD) in adults and adolescents',
      'Management of Generalized Anxiety Disorder (GAD) and panic disorder',
      'Obsessive-Compulsive Disorder (OCD) and social anxiety disorder'
    ],
    dosage: {
      general: 'Adults: 10mg once daily orally in the morning or evening with or without food. May be increased to 20mg daily after at least 1 week under psychiatric supervision.',
      warning: 'NEVER STOP ABRUPTLY: Sudden discontinuation causes SSRI withdrawal (dizziness, electric shock sensations, anxiety). Always taper gradually.',
      pediatric: 'Approved for MDD in adolescents 12-17 years old at 10mg daily under close specialist monitoring.'
    },
    sideEffects: {
      common: ['Mild nausea or dry mouth during initial 1-2 weeks', 'Insomnia or daytime drowsiness', 'Delayed ejaculation or decreased libido'],
      severe: ['Serotonin syndrome when combined with other serotonergic agents', 'Worsening depression or suicidal ideation during initial weeks']
    },
    precautions: [
      'Therapeutic benefits typically require 2 to 4 weeks of consistent daily use to fully develop.',
      'Close monitoring of behavioral changes and mood is crucial during the first month of treatment.',
      'Avoid alcohol consumption while taking escitalopram.'
    ],
    interactions: [
      'MAO Inhibitors (contraindicated; allow at least 14 days washout between drugs)',
      'Tramadol, triptans, and St. John’s Wort (heightened risk of serotonin syndrome)',
      'NSAIDs and aspirin (slight increase in upper gastrointestinal bleeding tendency)'
    ],
    warnings: [
      'BLACK BOX SUICIDALITY WARNING: Closely monitor patients under 24 years for emergent suicidal thoughts during initial therapy.'
    ],
    storage: 'Store between 15°C and 30°C in original blister pack.',
    references: [
      { source: 'American Psychiatric Association (APA) Practice Guideline for the Treatment of Patients With Major Depressive Disorder', type: 'Clinical Evidence' },
      { source: 'FDA Package Insert - Lexapro (Escitalopram)', type: 'Regulatory' }
    ]
  },

  // =========================================================================
  // 31. CLONAZEPAM (Clona 0.5 / Klonopin)
  // =========================================================================
  {
    id: 'clonazepam',
    name: 'Clonazepam 0.5',
    genericName: 'Clonazepam 0.5mg',
    category: 'Mental Health & Nervous System',
    brandNames: ['Clona 0.5', 'Klonopin', 'Zapiz 0.5', 'Rivotril 0.5', 'Epitril'],
    forms: ['0.5mg Tablets', '0.25mg Mouth Dissolving Tablets (MD)', '1mg Tablets', '2mg Tablets'],
    visualType: 'blister',
    visualColor: '#0284C7',
    pillColor: '#F0F9FF',
    imprintText: 'CLONA',
    overview: 'Clonazepam is a long-acting benzodiazepine that enhances the inhibitory neurotransmitter gamma-aminobutyric acid (GABA) by binding to the GABAA receptor. Prescribed for acute panic disorders and seizure syndromes.',
    uses: [
      'Short-term treatment of panic disorder with or without agoraphobia',
      'Management of seizure disorders, myoclonic jerks, and absence seizures',
      'Short-term acute management of severe anxiety and restlessness'
    ],
    dosage: {
      general: 'Adults: 0.25mg to 0.5mg orally once or twice daily, or at bedtime as directed by a psychiatrist. Maximum dose for panic disorder is typically 1mg to 2mg daily.',
      warning: 'CONTROLLED SUBSTANCE: Potential for physical dependence, tolerance, and addiction. Prescribed strictly for short-term use. Never stop abruptly.',
      pediatric: 'Pediatric dosing strictly for epilepsy under pediatric neurology supervision.'
    },
    sideEffects: {
      common: ['Drowsiness, fatigue, and muscular weakness', 'Coordination difficulties (ataxia)', 'Lightheadedness'],
      severe: ['Severe respiratory depression (especially when combined with opioids or alcohol)', 'Paradoxical agitation or severe withdrawal seizures upon abrupt cessation']
    },
    precautions: [
      'Do not drive, operate machinery, or engage in hazardous activities while on clonazepam.',
      'Absolute zero alcohol rule: alcohol exponentially multiplies central nervous system sedation and respiratory depression.',
      'Must be tapered gradually over weeks under physician guidance to prevent rebound anxiety and withdrawal.'
    ],
    interactions: [
      'Opioids and alcohol (black box warning: combining leads to profound sedation, coma, and fatal respiratory depression)',
      'Other sedatives, sleep aids, and antihistamines (additive depression of alertness)'
    ],
    warnings: [
      'BLACK BOX OPIOID & ADDICTION WARNING: Schedule H1 / Controlled medicine. Keep safely secured.'
    ],
    storage: 'Store below 25°C in a secure, dry place away from unauthorized access.',
    references: [
      { source: 'FDA Drug Safety Communication on Benzodiazepines and Opioid Combinations', type: 'Regulatory' },
      { source: 'National Institute for Health and Care Excellence (NICE) Anxiety Guidelines', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 32. DICLOFENAC (Voveran 50 / Voltaren)
  // =========================================================================
  {
    id: 'diclofenac',
    name: 'Diclofenac 50 (Voveran)',
    genericName: 'Diclofenac Sodium 50mg',
    category: 'Anti-inflammatory & Joints',
    brandNames: ['Voveran 50', 'Voltaren', 'Diclogel (topical)', 'Dynapar', 'Cataflam'],
    forms: ['50mg Enteric-Coated Tablets', '75mg SR Tablets', '1% Topical Gel', '75mg/ml Injection'],
    visualType: 'blister',
    visualColor: '#DC2626',
    pillColor: '#FEE2E2',
    imprintText: 'VOVERAN',
    overview: 'Diclofenac is a potent nonsteroidal anti-inflammatory drug (NSAID) with balanced COX-1 and COX-2 inhibition. Widely recognized for high-efficacy relief of severe joint inflammation, orthopedic trauma, and post-operative pain.',
    uses: [
      'Acute inflammatory flare-ups of osteoarthritis, rheumatoid arthritis, and ankylosing spondylitis',
      'Acute musculoskeletal trauma, sprains, strains, and sports injuries',
      'Acute gout attacks and post-operative orthopedic or dental inflammation'
    ],
    dosage: {
      general: 'Adults: 50mg orally 2 to 3 times daily, or 75mg to 100mg extended-release once daily, taken WITH or IMMEDIATELY AFTER meals with a full glass of water.',
      warning: 'ALWAYS TAKE WITH FOOD: Never take on an empty stomach. Contraindicated in active peptic ulcers, heart failure, and late pregnancy.',
      pediatric: 'Pediatric use only under specialist pediatric orthopedic supervision.'
    },
    sideEffects: {
      common: ['Gastric discomfort, nausea, or heartburn', 'Headache or mild dizziness', 'Elevated liver transaminases'],
      severe: ['Gastrointestinal ulceration, perforation, or bleeding', 'Increased risk of serious cardiovascular thrombotic events (myocardial infarction, stroke)', 'Acute renal impairment']
    },
    precautions: [
      'Always take with food or milk to safeguard the gastric mucosa.',
      'Use the lowest effective dose for the shortest duration necessary.',
      'Patients with high blood pressure, coronary artery disease, or kidney disease require physician approval.'
    ],
    interactions: [
      'Other NSAIDs and aspirin (multiplies stomach ulcer and bleeding risk)',
      'Blood thinners (warfarin, apixaban - severe bleeding risk)',
      'ACE inhibitors and diuretics (reduced antihypertensive efficacy and kidney stress)'
    ],
    warnings: [
      'CARDIOVASCULAR & GI WARNING: Long-term high doses increase cardiovascular and stomach ulceration risks.'
    ],
    storage: 'Store below 30°C in a dry place protected from moisture.',
    references: [
      { source: 'FDA Public Health Advisory - NSAIDs and Cardiovascular Risk', type: 'Regulatory' },
      { source: 'American College of Rheumatology (ACR) Osteoarthritis Guidelines', type: 'Clinical Evidence' }
    ]
  },

  // =========================================================================
  // 36. CARTINEX / LEVOCARNITINE 500mg
  // =========================================================================
  {
    id: 'cartinex',
    name: 'Cartinex',
    genericName: 'Levocarnitine 500mg (L-Carnitine)',
    category: 'Nutritional & Metabolic Therapy • Mitochondrial Energy',
    brandNames: ['Cartinex', 'Cartinex 500', 'Cartinex-Q', 'Carnitor', 'L-Carn', 'Carnisure 500', 'Calree', 'Nucarnit', 'T-Carn'],
    forms: ['500mg Film-Coated Tablets', '1000mg Chewable Tablets', '500mg/5ml Oral Syrup', '1g/5ml IV Injection'],
    visualType: 'blister',
    visualColor: '#0284C7',
    pillColor: '#FFFFFF',
    imprintText: 'CART 500',
    overview: 'Cartinex (Levocarnitine) is an essential amino acid derivative that plays a crucial metabolic role in mitochondrial fatty acid oxidation and cellular ATP energy generation. It facilitates the transport of long-chain fatty acids into mitochondria to produce energy, and is clinically prescribed for carnitine deficiency, male subfertility/sperm motility, muscle weakness, and dialysis-related metabolic fatigue.',
    uses: [
      'Treatment and prevention of primary systemic and metabolic carnitine deficiency',
      'Management of secondary carnitine deficiency in chronic hemodialysis kidney disease (relieving severe muscle cramps, fatigue, and hypotension)',
      'Male infertility and oligospermia: improving sperm motility, progressive concentration, and viability',
      'Chronic muscle weakness, exercise-induced fatigue, and mitochondrial energy depletion',
      'Adjuvant therapy in ischemic heart disease and peripheral vascular muscle fatigue'
    ],
    dosage: {
      general: 'Adults: 1 tablet (500mg) orally 2 to 3 times daily, taken with or immediately after meals with a glass of water. For male subfertility, typically 1g to 2g daily for a minimum 3 to 6 months course.',
      warning: 'Take with food to minimize potential mild gastrointestinal upset. Doses should be spaced evenly throughout the 24-hour period.',
      pediatric: 'Pediatric dosing: 50 to 100 mg/kg/day divided into 2 or 3 doses, strictly as prescribed by a pediatric nephrologist or genetic specialist.'
    },
    sideEffects: {
      common: [
        'Transient nausea, vomiting, or abdominal cramps if taken on empty stomach',
        'Mild diarrhea or loose stools with higher doses',
        'Slight fishy body odor (can be reduced by dividing into smaller doses)'
      ],
      severe: [
        'Rare seizure flare-ups in patients with pre-existing epilepsy disorders',
        'Significant allergic reactions or rash',
        'Severe persistent abdominal cramping'
      ]
    },
    precautions: [
      'Caution in patients with a history of seizure disorders, as carnitine may increase seizure frequency.',
      'Diabetic patients taking insulin or oral hypoglycemics should monitor blood glucose, as improved glucose utilization can lower blood sugar.',
      'Maintain regular hydration and take strictly after meals.'
    ],
    interactions: [
      'Warfarin / Oral Anticoagulants (may potentiate anticoagulant effects and prolong INR; monitor prothrombin time)',
      'Valproic acid and anticonvulsants (induce secondary carnitine depletion; co-administration often beneficial under physician guidance)',
      'Thyroid hormone therapies (high-dose carnitine may act as a peripheral thyroid hormone antagonist)'
    ],
    warnings: [
      'SEIZURE ALERT: Patients with underlying epilepsy or seizure history should use under close medical monitoring.',
      'ANTICOAGULANT CAUTION: Regularly monitor INR if concurrently taking blood thinners like Warfarin.'
    ],
    storage: 'Store below 25°C in a dry place protected from heat, light, and direct moisture. Keep blister strips intact.',
    references: [
      { source: 'Indian Pharmacopoeia (IP) - Levocarnitine Tablets Monograph', type: 'Regulatory' },
      { source: 'FDA Approved Prescribing Information - Carnitor / Levocarnitine', type: 'Clinical Standard' },
      { source: 'American Journal of Clinical Nutrition - L-Carnitine in Mitochondrial Energy and Reproduction', type: 'Clinical Evidence' }
    ]
  }
];
