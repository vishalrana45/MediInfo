import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation & Brand
  app_name: {
    en: 'MediInfo',
    hi: 'मेडिइन्फो (MediInfo)',
  },
  app_tagline: {
    en: 'Verified Clinical Safety & Medicine Guide',
    hi: 'सत्यापित चिकित्सीय सुरक्षा एवं दवाई मार्गदर्शिका',
  },
  nav_reminders: {
    en: 'Reminders',
    hi: 'दवा रिमाइंडर',
  },
  nav_profile: {
    en: 'Profile',
    hi: 'प्रोफ़ाइल',
  },
  nav_assistant: {
    en: 'AI Assistant',
    hi: 'AI सहायक',
  },
  nav_assistant_desc: {
    en: 'Voice & multilingual helper',
    hi: 'आवाज़ और आसान भाषा में मदद',
  },

  // Hero Section
  hero_badge: {
    en: 'Verified Medicine Guide & Instant Safety Verification',
    hi: 'सत्यापित दवाई गाइड और तुरंत सुरक्षा सत्यापन',
  },
  hero_title_1: {
    en: 'Know Your Medicine.',
    hi: 'अपनी दवाई को पहचानें।',
  },
  hero_title_2: {
    en: 'Protect Your Health.',
    hi: 'सेहत को सुरक्षित रखें।',
  },
  hero_subtitle: {
    en: 'Instant pill & strip verification, verified dosages, interaction warnings, and 24/7 nearby emergency care finder.',
    hi: 'दवाई की गोली व पत्ता तुरंत पहचानें, सही ख़ुराक जानें, साइड इफेक्ट्स और 24/7 नज़दीकी अस्पताल व दवाखाना खोजें।',
  },
  hero_search_placeholder: {
    en: 'Search any medicine (e.g. Paracetamol, Dolo 650, Amoxicillin)...',
    hi: 'किसी भी दवाई का नाम लिखें (जैसे पैरासिटामोल, डोलो 650, एमोक्सिसिलिन)...',
  },
  hero_search_btn: {
    en: 'Search',
    hi: 'खोजें',
  },
  hero_scan_btn: {
    en: 'Scan Medicine Strip or Pill',
    hi: 'दवाई का पत्ता या गोली स्कैन करें',
  },
  hero_popular_label: {
    en: 'Popular:',
    hi: 'लोकप्रिय:',
  },

  // Scanner section
  scanner_title: {
    en: 'Smart Medicine Scanner',
    hi: 'स्मार्ट दवाई स्कैनर',
  },
  scanner_subtitle: {
    en: 'Point your camera at any strip, blister pack, or bottle for instant clinical verification.',
    hi: 'किसी भी दवाई के पत्ते, बोतल या गोली पर कैमरा रखें और तुरंत पूरी जानकारी पाएँ।',
  },
  scanner_camera_btn: {
    en: 'Open Live Camera',
    hi: 'कैमरा खोलें',
  },
  scanner_upload_btn: {
    en: 'Upload Photo',
    hi: 'फोटो अपलोड करें',
  },
  scanner_demo_btn: {
    en: 'Try Demo Medicine',
    hi: 'डेमो दवाई देखें',
  },

  // How it works
  how_it_works_title: {
    en: 'How MediInfo Protects You',
    hi: 'मेडिइन्फो आपकी सुरक्षा कैसे करता है',
  },
  how_it_works_subtitle: {
    en: 'Three simple steps to verified medicine clarity and emergency response.',
    hi: 'दवाई की सही जानकारी और आपातकालीन सहायता के लिए 3 आसान कदम।',
  },
  step_1_title: {
    en: '1. Scan or Search',
    hi: '1. स्कैन या सर्च करें',
  },
  step_1_desc: {
    en: 'Upload a picture of any tablet, strip, or prescription, or search by generic name.',
    hi: 'किसी भी गोली, पत्ते या पर्चे की फोटो खींचें अथवा दवाई का नाम खोजें।',
  },
  step_2_title: {
    en: '2. Verify Safety & Dose',
    hi: '2. सही खुराक व सुरक्षा जाँचें',
  },
  step_2_desc: {
    en: 'View dosage guides, contraindications, severe side effects, and safe storage instructions.',
    hi: 'दवा लेने का सही समय, खाली पेट या खाने के बाद, और जरूरी सावधानियाँ समझें।',
  },
  step_3_title: {
    en: '3. Find 24/7 Care & Set Reminders',
    hi: '3. दवाखाना ढूँढें व रिमाइंडर लगाएँ',
  },
  step_3_desc: {
    en: 'Locate verified open pharmacies and hospitals near you with one-tap directions.',
    hi: 'नज़दीक में 24 घंटे खुले मेडिकल स्टोर और आपातकालीन अस्पताल तक सीधा रास्ता पाएँ।',
  },

  // Medicine Library
  library_title: {
    en: 'Essential Medicine Compendium',
    hi: 'आवश्यक दवाई डायरेक्टरी',
  },
  library_subtitle: {
    en: 'Standard clinical reference for commonly prescribed medications across therapeutic classes.',
    hi: 'दैनिक जीवन में इस्तेमाल होने वाली प्रमुख दवाओं की प्रामाणिक चिकित्सीय जानकारी।',
  },
  library_filter_all: {
    en: 'All Categories',
    hi: 'सभी वर्ग',
  },
  library_view_details: {
    en: 'View Full Safety Guide',
    hi: 'पूरी सुरक्षा जानकारी देखें',
  },

  // Care Finder Card
  finder_card_badge: {
    en: 'Live Emergency & Pharmacy Network',
    hi: 'लाइव आपातकालीन अस्पताल एवं मेडिकल स्टोर नेटवर्क',
  },
  finder_card_title: {
    en: 'Locate 24/7 Pharmacies & Emergency Hospitals',
    hi: 'नज़दीकी 24/7 मेडिकल स्टोर और इमरजेंसी अस्पताल खोजें',
  },
  finder_card_desc: {
    en: 'Find open chemist shops, trauma centers, and verified healthcare facilities near your current location with one-tap calling and live directions.',
    hi: 'अपने आसपास खुले दवाखाने और अस्पताल देखें। एक क्लिक में कॉल करें या मैप पर रास्ता देखें।',
  },
  finder_card_btn: {
    en: 'Open Nearby Care Finder',
    hi: 'केयर फाइंडर खोलें',
  },
  finder_pill_pharmacies: {
    en: 'Find 24/7 Pharmacies',
    hi: '24/7 मेडिकल स्टोर खोजें',
  },
  finder_pill_hospitals: {
    en: 'Find Emergency Hospitals',
    hi: 'इमरजेंसी अस्पताल खोजें',
  },

  // Care Finder Screen
  care_finder_title: {
    en: 'Nearby Healthcare Facilities',
    hi: 'आसपास के अस्पताल व मेडिकल स्टोर',
  },
  care_finder_subtitle: {
    en: 'Real-time verified pharmacies, emergency rooms, and clinics near you.',
    hi: 'आपके नज़दीक सत्यापित मेडिकल स्टोर, ट्रॉमा सेंटर और क्लिनिक।',
  },
  back_to_home: {
    en: 'Back to Home Page',
    hi: 'मुख्य पृष्ठ पर वापस जाएँ',
  },
  use_gps: {
    en: 'Detect GPS Location',
    hi: 'जीपीएस से वर्तमान स्थान लें',
  },
  filter_all: {
    en: 'All Facilities',
    hi: 'सभी केंद्र',
  },
  filter_pharmacies: {
    en: 'Pharmacies',
    hi: 'दवाखाने (Medical)',
  },
  filter_hospitals: {
    en: 'Hospitals & ER',
    hi: 'अस्पताल व इमरजेंसी',
  },
  filter_open_now: {
    en: 'Open 24/7 / Now',
    hi: 'अभी खुले हुए',
  },
  call_now: {
    en: 'Call Now',
    hi: 'अभी कॉल करें',
  },
  get_directions: {
    en: 'Directions',
    hi: 'दिशा-निर्देश',
  },

  // AI Assistant Modal
  assistant_title: {
    en: 'Multilingual AI Health Assistant',
    hi: 'बहुभाषी AI स्वास्थ्य सहायक',
  },
  assistant_tagline: {
    en: 'Voice assistance for anyone with language or reading barriers',
    hi: 'भाषा या पढ़ने की समस्या होने पर बोलकर या सुनकर समझें',
  },
  assistant_input_placeholder: {
    en: 'Type your question or click the microphone to speak...',
    hi: 'अपना सवाल लिखें या माइक दबाकर बोलें...',
  },
  assistant_speak_btn: {
    en: 'Speak Now',
    hi: 'बोलें',
  },
  assistant_listening: {
    en: 'Listening... Please speak your question',
    hi: 'सुन रहे हैं... कृपया अपना सवाल बोलें',
  },
  assistant_read_aloud: {
    en: 'Listen (Audio)',
    hi: 'सुनें (आवाज़)',
  },
  assistant_stop_audio: {
    en: 'Stop Audio',
    hi: 'आवाज़ रोकें',
  },
  assistant_suggested_label: {
    en: 'Suggested Questions (Tap to Ask):',
    hi: 'सुझाए गए सवाल (क्लिक करें):',
  },
  assistant_visual_aid_title: {
    en: 'Easy Visual Dosage Guide',
    hi: 'आसान सचित्र खुराक गाइड (Visual Guide)',
  },
  morning_dose: {
    en: 'Morning (After breakfast)',
    hi: 'सुबह (नाश्ते के बाद)',
  },
  afternoon_dose: {
    en: 'Afternoon (After lunch)',
    hi: 'दोपहर (दोपहर के खाने के बाद)',
  },
  night_dose: {
    en: 'Night (Before sleeping)',
    hi: 'रात (सोने से पहले)',
  },
  take_with_water: {
    en: 'Take with full glass of water',
    hi: 'एक गिलास पानी के साथ लें',
  },
  avoid_alcohol: {
    en: 'Do NOT consume alcohol',
    hi: 'शराब या नशा बिल्कुल न करें',
  },
  emergency_warning: {
    en: 'If severe reaction occurs, call emergency immediately',
    hi: 'गंभीर समस्या होने पर तुरंत डॉक्टर या अस्पताल जाएँ',
  },

  // Reminders
  reminders_title: {
    en: 'Medicine Dose Reminders',
    hi: 'दवाई खुराक रिमाइंडर',
  },
  add_reminder: {
    en: 'Add New Reminder',
    hi: 'नया रिमाइंडर जोड़ें',
  },

  // Disclaimer
  disclaimer: {
    en: 'Disclaimer: MediInfo provides educational reference and verification support. Always consult a qualified medical professional for prescriptions, diagnosis, and treatment.',
    hi: 'अस्वीकरण: मेडिइन्फो केवल शैक्षणिक एवं सामान्य जानकारी हेतु है। किसी भी रोग के उपचार या दवा के उपयोग से पहले योग्य चिकित्सक (डॉक्टर) की सलाह अवश्य लें।',
  },
};

export interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);
