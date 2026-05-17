import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

// Full-scale translation dictionary containing all primary UI nodes
const translations = {
  en: {
    // Shared / Core
    welcome: "Welcome to SmartKissan",
    subtitle: "Direct Agri-Trade with Trust Escrow",
    choose_role: "Select Your Role",
    continue: "Continue",
    back: "Back",
    confirm: "Confirm",
    cancel: "Cancel",
    search: "Search...",
    
    // Auth & Terms
    sign_in: "Sign In",
    sign_up: "Sign Up",
    create_account: "Create Account",
    full_name: "Full Name",
    phone_number: "Phone Number",
    password: "Password",
    confirm_password: "Confirm Password",
    next: "Next",
    complete_reg: "Complete Registration",
    agree_terms: "I agree to the SmartKissan Terms of Service & Escrow Agreement",
    terms_link: "Terms of Service & Escrow Agreement",

    // Farmer Role
    farmer_dashboard: "Farmer Portal",
    live_mandi: "Live Mandi Prices",
    mandi_history: "Mandi Price History",
    add_listing: "Create Crop Listing",
    crop_name: "Crop Name",
    crop_volume: "Volume (Quintals)",
    base_price: "Base Price (₹/qtl)",
    submit_listing: "Publish Crop Listing",
    my_listings: "My Harvest Listings",
    bids_received: "Bids Received",
    ai_scanner: "AI Quality Scan",
    confirm_grade: "Confirm & Apply Grade",
    grade_completed: "AI Quality Grading Complete",

    // Buyer Role
    buyer_dashboard: "Buyer Portal",
    search_crops: "Search crops & harvests...",
    my_orders: "Active Escrow Ledgers",
    place_bid: "Place Custom Bid",
    group_buying: "Group Buying Pools",
    join_pool: "Join Co-Op Pool",
    pocket_cost: "Total Pocket Cost Breakdown",
    product_cost: "Product Base Cost",
    logistics_cost: "Logistics Delivery Fee",
    platform_fee: "Platform Facilitation",
    upfront_advance: "Upfront Advance Facility",
    advance_warning: "Releasing funds upfront carries counterparty risk.",
    invite_partners: "Invite Wholesale Partners",
    active_pools: "Active Co-Op Sourcing Pools",

    // Transporter
    transit_dashboard: "Transporter Portal",
    available_loads: "Available Grain Loads",
    active_deliveries: "Active Shipments",
    vehicle_no: "Vehicle Registration",
    license_id: "Driving License ID",
  },
  hi: {
    // Shared / Core
    welcome: "स्मार्टकिसान में आपका स्वागत है",
    subtitle: "सुरक्षित एस्क्रो के साथ सीधा कृषि व्यापार",
    choose_role: "अपनी भूमिका चुनें",
    continue: "आगे बढ़ें",
    back: "पीछे जाएं",
    confirm: "पुष्टि करें",
    cancel: "रद्द करें",
    search: "खोजें...",

    // Auth & Terms
    sign_in: "लॉग इन करें",
    sign_up: "रजिस्टर करें",
    create_account: "नया खाता बनाएं",
    full_name: "पूरा नाम",
    phone_number: "फ़ोन नंबर",
    password: "पासवर्ड",
    confirm_password: "पासवर्ड की पुष्टि करें",
    next: "अगला",
    complete_reg: "पंजीकरण पूरा करें",
    agree_terms: "मैं स्मार्टकिसान की सेवा शर्तों और एस्क्रो समझौते से सहमत हूँ",
    terms_link: "सेवा शर्तें और एस्क्रो समझौता",

    // Farmer Role
    farmer_dashboard: "किसान पोर्टल",
    live_mandi: "लाइव मंडी भाव",
    mandi_history: "मंडी मूल्य इतिहास",
    add_listing: "नई फसल सूची जोड़ें",
    crop_name: "फसल का नाम",
    crop_volume: "मात्रा (क्विंटल)",
    base_price: "आधार मूल्य (₹/क्विंटल)",
    submit_listing: "फसल प्रकाशित करें",
    my_listings: "मेरी फसल सूचियां",
    bids_received: "प्राप्त बोलियां",
    ai_scanner: "एआई गुणवत्ता स्कैन",
    confirm_grade: "पुष्टि करें और ग्रेड लागू करें",
    grade_completed: "एआई गुणवत्ता ग्रेडिंग पूर्ण",

    // Buyer Role
    buyer_dashboard: "बायर्स पोर्टल",
    search_crops: "फसलें और उपज खोजें...",
    my_orders: "सक्रिय एस्क्रो बहीखाता",
    place_bid: "कस्टम बोली लगाएं",
    group_buying: "समूह खरीद पूल",
    join_pool: "सहकारी समूह में जुड़ें",
    pocket_cost: "कुल जेब का खर्च विवरण",
    product_cost: "फसल का आधार मूल्य",
    logistics_cost: "लॉजिस्टिक्स वितरण शुल्क",
    platform_fee: "प्लेटफ़ॉर्म सुविधा शुल्क",
    upfront_advance: "अग्रिम भुगतान सुविधा",
    advance_warning: "अग्रिम में धनराशि जारी करने पर जोखिम हो सकता है।",
    invite_partners: "थोक भागीदारों को आमंत्रित करें",
    active_pools: "सक्रिय को-ऑप सोर्सिंग पूल",

    // Transporter
    transit_dashboard: "ट्रांसपोर्टर पोर्टल",
    available_loads: "उपलब्ध अनाज भार",
    active_deliveries: "सक्रिय डिलीवरी",
    vehicle_no: "वाहन पंजीकरण",
    license_id: "ड्राइविंग लाइसेंस आईडी",
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocaleState] = useState('en');

  const setLocale = (lang) => {
    if (translations[lang]) {
      setLocaleState(lang);
    }
  };

  const t = (key) => {
    return translations[locale]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default function LanguageContextRoute() {
  return null;
}
