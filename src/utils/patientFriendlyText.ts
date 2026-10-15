import { Medicine } from '../types';

/**
 * Transforms complex clinical pharmacology jargon into warm, clear, 
 * plain-English explanations that any patient or family member can understand.
 */

// Category plain-English translations
const CATEGORY_MAP: Record<string, string> = {
  'analgesic • antipyretic': 'Fever & Pain Relief',
  'analgesic': 'Pain Relief',
  'antipyretic': 'Fever Reducer',
  'anti-inflammatory': 'Pain & Swelling Relief',
  'proton pump inhibitor': 'Acidity, Gas & Heartburn Relief',
  'proton pump inhibitor (acid reducer)': 'Acidity, Gas & Heartburn Relief',
  'h2-receptor antagonist': 'Stomach Acid & Heartburn Relief',
  'antacid': 'Acidity & Gas Relief',
  'antibiotic': 'Bacterial Infection Fighter',
  'macrolide antibiotic': 'Antibiotic (Chest, Throat & Ear Infections)',
  'penicillin-class antibiotic': 'Antibiotic (Bacterial Infections)',
  'cephalosporin antibiotic': 'Antibiotic (Typhoid, Chest & Urinary Infections)',
  'fluoroquinolone antibiotic': 'Antibiotic (Stomach & Urinary Infections)',
  'nitroimidazole antimicrobial': 'Infection Fighter (Stomach & Dental Infections)',
  'tetracycline antibiotic': 'Antibiotic (Chest, Skin & Bacterial Infections)',
  'antihistamine': 'Allergy, Sneezing & Itch Relief',
  'allergy, cold & cough': 'Allergy, Cold & Sneezing Relief',
  'antispasmodic': 'Stomach Cramps & Period Pain Relief',
  'biguanide antidiabetic': 'Type-2 Diabetes & Blood Sugar Control',
  'sulfonylurea antidiabetic': 'Type-2 Diabetes & Blood Sugar Control',
  'dpp-4 inhibitor': 'Type-2 Diabetes & Blood Sugar Control',
  'sglt2 inhibitor': 'Blood Sugar, Heart & Kidney Protection',
  'antidiabetic': 'Diabetes & Blood Sugar Control',
  'statin': 'Cholesterol & Heart Health',
  'hmg-coa reductase inhibitor': 'Cholesterol & Heart Health',
  'antiplatelet': 'Blood Thinner (Heart & Stroke Protection)',
  'antiplatelet & nonsteroidal anti-inflammatory': 'Blood Thinner & Pain Relief',
  'angiotensin ii receptor blocker (arb)': 'High Blood Pressure & Heart Care',
  'beta-blocker': 'Blood Pressure & Heart Rate Control',
  'calcium channel blocker': 'High Blood Pressure & Chest Pain Relief',
  'antifungal': 'Fungal Infection Fighter',
  'bronchodilator': 'Asthma & Breathing Relief Inhaler',
  'antidepressant (ssri)': 'Anxiety & Mood Balance',
  'benzodiazepine': 'Calming & Panic Relief',
  'essential vitamin': 'Daily Health & Nerve Support',
  'essential mineral': 'Bone & Joint Strength Supplement',
  'essential electrolyte': 'Instant Dehydration & Energy Hydration',
};

export function getFriendlyCategory(medicine: Medicine): string {
  const lower = medicine.category.toLowerCase();
  for (const [key, label] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) {
      return label;
    }
  }
  return medicine.category.replace(/•/g, '•').trim();
}

/**
 * Returns a warm, plain-English summary of what the medicine does.
 */
export function getFriendlyOverview(medicine: Medicine): string {
  const nameLower = (medicine.name + ' ' + medicine.genericName).toLowerCase();

  // Specific high-frequency medicines
  if (nameLower.includes('saridon')) {
    return `Saridon is formulated to stop severe headaches, migraines, and throbbing temple or neck pain within 15 to 30 minutes.`;
  }
  if (nameLower.includes('aspirin') || nameLower.includes('disprin')) {
    return `${medicine.name} relieves headaches and pain, and in daily low doses, acts as a blood thinner to prevent blood clots and protect against heart attacks and strokes.`;
  }
  if (nameLower.includes('dolo') || (nameLower.includes('paracetamol') && !nameLower.includes('ibuprofen'))) {
    return `${medicine.name} brings down high fever quickly and relieves body pain, severe headaches, and dental aches. It is one of the safest medicines for fever when taken after food.`;
  }
  if (nameLower.includes('combiflam') || (nameLower.includes('ibuprofen') && nameLower.includes('paracetamol'))) {
    return `${medicine.name} combines two pain relievers to give fast, strong relief from severe body aches, toothaches, joint swelling, and fever.`;
  }
  if (nameLower.includes('pan') || nameLower.includes('pantoprazole')) {
    return `${medicine.name} stops excess stomach acid production to quickly relieve burning acidity, heartburn, gas bloating, and sour burps, while healing the stomach lining.`;
  }
  if (nameLower.includes('omeprazole') || nameLower.includes('rabeprazole') || nameLower.includes('esomeprazole')) {
    return `${medicine.name} reduces stomach acid to give long-lasting relief from acid reflux, painful heartburn, and chest burning, while protecting against ulcers.`;
  }
  if (nameLower.includes('meftal') || nameLower.includes('mefenamic') || nameLower.includes('dicyclomine') || nameLower.includes('drotaverine')) {
    return `${medicine.name} relaxes tight, cramping stomach and pelvic muscles to provide rapid relief from painful menstrual period cramps and abdominal spasms.`;
  }
  if (nameLower.includes('amoxicillin') || nameLower.includes('mox') || nameLower.includes('augmentin')) {
    return `${medicine.name} is an antibiotic that fights bacterial infections in the throat, chest, ears, teeth, and skin. (Always finish the full course prescribed by your doctor).`;
  }
  if (nameLower.includes('azithromycin') || nameLower.includes('azithral')) {
    return `${medicine.name} is a 3 to 5 day antibiotic that clears bacterial infections in the throat, tonsils, sinuses, and chest.`;
  }
  if (nameLower.includes('cefixime') || nameLower.includes('zifi') || nameLower.includes('taxim')) {
    return `${medicine.name} is a strong antibiotic used to treat typhoid fever, chest and lung infections, and urinary tract infections.`;
  }
  if (nameLower.includes('cipro') || nameLower.includes('ofloxacin') || nameLower.includes('norflox')) {
    return `${medicine.name} is an antibiotic that stops bacterial diarrhea, food poisoning, and urinary bladder infections.`;
  }
  if (nameLower.includes('metformin') || nameLower.includes('glycomet')) {
    return `${medicine.name} helps control high blood sugar in Type 2 Diabetes by helping your body use insulin better. Take with meals to protect your stomach.`;
  }
  if (nameLower.includes('glimepiride') || nameLower.includes('amaryl')) {
    return `${medicine.name} stimulates your pancreas to produce natural insulin after meals, keeping daily blood sugar at safe, healthy levels.`;
  }
  if (nameLower.includes('atorvastatin') || nameLower.includes('atorva') || nameLower.includes('rosuvastatin')) {
    return `${medicine.name} lowers bad cholesterol (LDL) and triglycerides in your blood, preventing fatty plaque buildup in arteries to protect against heart attacks.`;
  }
  if (nameLower.includes('cetirizine') || nameLower.includes('okacet') || nameLower.includes('allegra') || nameLower.includes('fexofenadine')) {
    return `${medicine.name} stops allergy reactions like a runny or blocked nose, non-stop sneezing, itchy watery eyes, and allergic skin hives.`;
  }
  if (nameLower.includes('shelcal') || (nameLower.includes('calcium') && nameLower.includes('d3'))) {
    return `${medicine.name} strengthens bones, joints, and teeth by supplying pure calcium combined with Vitamin D3 for optimal body absorption.`;
  }
  if (nameLower.includes('neurobion') || nameLower.includes('b-complex')) {
    return `${medicine.name} nourishes nerves, reduces numbness or tingling in hands and feet, and boosts daily energy with essential B-vitamins.`;
  }
  if (nameLower.includes('vitamin d3') || nameLower.includes('calcirol')) {
    return `${medicine.name} replenishes Vitamin D levels to support healthy bones, improve muscle strength, and boost immune defense.`;
  }
  if (nameLower.includes('ors') || nameLower.includes('electral')) {
    return `${medicine.name} quickly restores vital water, salts, and electrolytes lost during diarrhea, vomiting, fever, or intense summer heat.`;
  }
  if (nameLower.includes('salbutamol') || nameLower.includes('asthalin')) {
    return `${medicine.name} is a fast-acting inhaler that opens tightened airways in your lungs within minutes to relieve wheezing and breathlessness.`;
  }
  if (nameLower.includes('telmisartan') || nameLower.includes('losartan')) {
    return `${medicine.name} relaxes tightened blood vessels so your blood flows easily, lowering high blood pressure and protecting your heart and kidneys.`;
  }
  if (nameLower.includes('amlodipine')) {
    return `${medicine.name} widens blood vessels to reduce high blood pressure and prevent painful chest tightness (angina).`;
  }
  if (nameLower.includes('thyronorm') || nameLower.includes('levothyroxine')) {
    return `${medicine.name} replaces natural thyroid hormone to treat an underactive thyroid (hypothyroidism), boosting daily energy and metabolism.`;
  }

  // If the existing overview contains biochemical jargon, simplify it
  let text = medicine.overview;
  text = text.replace(/irreversibly inhibiting the H\+\/K\+\s*ATPase pump.*?cells/gi, 'reducing excess stomach acid production');
  text = text.replace(/permanently inactivates the cyclooxygenase.*?platelets/gi, 'preventing blood clots and relieving pain');
  text = text.replace(/competitive inhibitor of HMG-CoA reductase.*?biosynthesis/gi, 'lowering bad cholesterol and protecting heart health');
  text = text.replace(/biguanide antihyperglycemic agent that improves glucose tolerance.*?insulin sensitivity/gi, 'helping lower blood sugar levels and improving how your body uses insulin');
  text = text.replace(/bacteriolytic, beta-lactam antibiotic used to treat bacterial infections.*?enzymes/gi, 'antibiotic that kills bacteria causing throat, chest, ear, and dental infections');
  text = text.replace(/isoquinoline antispasmodic agent that selectively inhibits.*?tracts/gi, 'medicine that relaxes tight stomach and pelvic muscles to relieve cramping pain');

  // If still very clinical, provide clean generic guidance
  if (text.length > 220 && (text.includes('antagonist') || text.includes('inhibitor') || text.includes('receptor'))) {
    return `${medicine.name} is used to relieve symptoms and manage health conditions safely when taken as directed by your doctor.`;
  }

  return text;
}

/**
 * Returns a list of clean, everyday-language conditions treated.
 */
export function getFriendlyUses(medicine: Medicine): string[] {
  const nameLower = (medicine.name + ' ' + medicine.genericName).toLowerCase();

  // Curated plain-English symptom list for top medicines
  if (nameLower.includes('dolo') || (nameLower.includes('paracetamol') && !nameLower.includes('ibuprofen'))) {
    return [
      'High fever, chills, and viral fever',
      'Severe headaches and migraine aches',
      'Body pain, backache, and muscle soreness',
      'Toothache and dental pain relief'
    ];
  }

  if (nameLower.includes('aspirin') || nameLower.includes('disprin')) {
    return [
      'Preventing blood clots to protect against heart attacks and strokes',
      'Relief of severe headaches, toothaches, and body pain',
      'Emergency first-aid when heart attack is suspected (as directed by a doctor)',
      'Reducing fever and joint swelling'
    ];
  }

  if (nameLower.includes('saridon')) {
    return [
      'Fast relief of severe headaches and throbbing temple pain',
      'Migraine attacks and tension headaches',
      'Sudden toothache and facial nerve aches',
      'Body aches accompanied by fever chills'
    ];
  }

  if (nameLower.includes('combiflam') || (nameLower.includes('ibuprofen') && nameLower.includes('paracetamol'))) {
    return [
      'Severe muscle pain, sprains, and backaches',
      'Painful joint swelling, arthritis, and stiffness',
      'Severe toothache and dental pain',
      'High fever accompanied by intense body aches'
    ];
  }

  if (nameLower.includes('pan') || nameLower.includes('pantoprazole') || nameLower.includes('omeprazole') || nameLower.includes('rabeprazole')) {
    return [
      'Severe acidity, heartburn, and sour water burps',
      'Acid reflux (GERD) and burning sensation in chest or throat',
      'Stomach gas bloating, fullness, and indigestion',
      'Protecting stomach lining when taking strong painkillers'
    ];
  }

  if (nameLower.includes('meftal') || nameLower.includes('drotaverine') || nameLower.includes('dicyclomine')) {
    return [
      'Painful menstrual period cramps and lower belly pain',
      'Sharp stomach twisting cramps and intestinal spasms',
      'Abdominal bloating with gripping stomach aches',
      'Urinary or gallbladder muscle spasm pain'
    ];
  }

  if (nameLower.includes('amoxicillin') || nameLower.includes('augmentin')) {
    return [
      'Throat infections, tonsillitis, and painful swallowing',
      'Ear infections and sinus congestion pain',
      'Chest and bronchial bacterial infections',
      'Dental abscesses and skin bacterial infections'
    ];
  }

  if (nameLower.includes('azithral') || nameLower.includes('azithromycin')) {
    return [
      'Bacterial throat infections, tonsillitis, and pharyngitis',
      'Chest infections, bronchitis, and mild pneumonia',
      'Sinus infections with facial pressure and congestion',
      'Ear infections and bacterial skin infections'
    ];
  }

  if (nameLower.includes('cefixime') || nameLower.includes('zifi')) {
    return [
      'Typhoid (enteric) fever and bacterial illnesses',
      'Severe throat and chest bronchial infections',
      'Urinary tract infections (burning when passing urine)',
      'Persistent ear and sinus bacterial infections'
    ];
  }

  if (nameLower.includes('metformin') || nameLower.includes('glycomet')) {
    return [
      'Lowering and controlling high blood sugar in Type 2 Diabetes',
      'Helping your body respond better to natural insulin',
      'Reducing long-term diabetes risks and kidney complications',
      'Supporting healthy metabolism when combined with diet and exercise'
    ];
  }

  if (nameLower.includes('glimepiride') || nameLower.includes('sitagliptin') || nameLower.includes('dapagliflozin')) {
    return [
      'Controlling high blood sugar spikes after meals in Type 2 Diabetes',
      'Helping pancreas release the right amount of insulin',
      'Protecting heart and kidneys from diabetes-related strain'
    ];
  }

  if (nameLower.includes('atorvastatin') || nameLower.includes('rosuvastatin')) {
    return [
      'Lowering bad cholesterol (LDL) and harmful triglycerides',
      'Raising protective good cholesterol (HDL)',
      'Preventing fatty plaque buildup in blood vessels',
      'Drastically reducing the risk of heart attacks and strokes'
    ];
  }

  if (nameLower.includes('cetirizine') || nameLower.includes('allegra') || nameLower.includes('fexofenadine')) {
    return [
      'Runny nose, nasal congestion, and non-stop sneezing',
      'Itchy, red, watery eyes and throat tickle',
      'Allergic skin rashes, hives, and intense itching',
      'Seasonal hay fever and dust allergy reactions'
    ];
  }

  if (nameLower.includes('salbutamol') || nameLower.includes('asthalin')) {
    return [
      'Fast relief of sudden asthma attacks and tight wheezing',
      'Opening narrowed airways during acute breathlessness',
      'Relieving chest tightness and exercise-triggered coughing'
    ];
  }

  if (nameLower.includes('shelcal') || nameLower.includes('calcium')) {
    return [
      'Strengthening weak bones, joints, and preventing osteoporosis',
      'Fulfilling daily calcium needs during aging, pregnancy, and recovery',
      'Supporting healthy nerve signals and muscle contraction'
    ];
  }

  if (nameLower.includes('neurobion')) {
    return [
      'Relieving numbness, tingling, and pins-and-needles in hands and feet',
      'Nourishing nerve cells and repairing nerve sheath damage',
      'Reducing daily fatigue, tiredness, and mouth ulcers'
    ];
  }

  // Generic fallback: clean up any medical jargon from the raw strings
  return medicine.uses.map((u) => {
    let clean = u;
    clean = clean.replace(/otitis media/gi, 'ear infections');
    clean = clean.replace(/pharyngitis/gi, 'throat infections');
    clean = clean.replace(/sinusitis/gi, 'sinus congestion');
    clean = clean.replace(/rhinorrhea/gi, 'runny nose');
    clean = clean.replace(/nasal pruritus/gi, 'nasal itching');
    clean = clean.replace(/urticaria/gi, 'itchy hives');
    clean = clean.replace(/dysmenorrhea/gi, 'period cramps');
    clean = clean.replace(/pyelonephritis/gi, 'kidney infection');
    clean = clean.replace(/analgesic doses/gi, 'pain-relief doses');
    clean = clean.replace(/cardiovascular morbidity/gi, 'heart attack and stroke risks');
    clean = clean.replace(/atherosclerotic/gi, 'artery-clogging');
    clean = clean.replace(/glycemic control in type 2 diabetes mellitus/gi, 'blood sugar control in Type 2 Diabetes');
    return clean;
  });
}
