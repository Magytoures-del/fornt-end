/**
 * Airline Localization Utility
 * Maps airline names to their localized versions based on the current language
 */

// Comprehensive airline mapping from English to Arabic
const airlineTranslations = {
  // Middle East Airlines
  Saudia: "الخطوط السعودية",
  "Saudi Arabian Airlines": "الخطوط الجوية السعودية",
  "Saudi Airline": "الخطوط السعودية",
  "Saudi Airlines": "الخطوط السعودية",
  "Saudia Airlines": "الخطوط السعودية",
  Flynas: "طيران ناس",
  Flyadeal: "طيران أديل",
  Emirates: "طيران الإمارات",
  "Emirates Airline": "طيران الإمارات",
  "Etihad Airways": "طيران الاتحاد",
  Etihad: "طيران الاتحاد",
  flydubai: "فلاي دبي",
  "Fly Dubai": "فلاي دبي",
  FlyDubai: "فلاي دبي",
  "Air Arabia": "العربية للطيران",
  "Qatar Airways": "الخطوط الجوية القطرية",
  Qatar: "الخطوط الجوية القطرية",
  "Gulf Air": "طيران الخليج",
  "Kuwait Airways": "الخطوط الجوية الكويتية",
  Kuwait: "الخطوط الجوية الكويتية",
  "Jazeera Airways": "طيران الجزيرة",
  "Oman Air": "الطيران العماني",
  "Royal Jordanian": "الملكية الأردنية",
  "Middle East Airlines": "طيران الشرق الأوسط",
  MEA: "طيران الشرق الأوسط",
  EgyptAir: "مصر للطيران",
  "Egypt Air": "مصر للطيران",
  "Egypt Airline": "مصر للطيران",
  "Egypt Airlines": "مصر للطيران",
  "Nile Air": "طيران النيل",
  "Air Cairo": "طيران القاهرة",
  Yemenia: "اليمنية",
  "Air Algerie": "الخطوط الجوية الجزائرية",
  Tunisair: "الخطوط التونسية",
  "Royal Air Maroc": "الخطوط الملكية المغربية",
  "Libyan Airlines": "الخطوط الليبية",
  "Sudan Airways": "الخطوط الجوية السودانية",
  "Iraqi Airways": "الخطوط الجوية العراقية",
  "Syrian Air": "الخطوط الجوية السورية",

  // Turkish Airlines
  "Turkish Airlines": "الخطوط الجوية التركية",
  "Turkish Airline": "الخطوط الجوية التركية",
  "Turk Hava Yollari": "الخطوط الجوية التركية",
  THY: "الخطوط الجوية التركية",
  "Pegasus Airlines": "بيجاسوس",
  Pegasus: "بيجاسوس",
  SunExpress: "صن اكسبريس",
  AnadoluJet: "أنادولو جت",

  // Asian Airlines
  "Emirates Airlines": "طيران الإمارات",
  "Singapore Airlines": "الخطوط الجوية السنغافورية",
  "Cathay Pacific": "كاثي باسيفيك",
  "Japan Airlines": "الخطوط الجوية اليابانية",
  JAL: "الخطوط الجوية اليابانية",
  "All Nippon Airways": "أول نيبون",
  ANA: "أول نيبون",
  "Korean Air": "الخطوط الكورية",
  "Asiana Airlines": "أسيانا",
  "China Southern Airlines": "الصين الجنوبية",
  "China Eastern Airlines": "الصين الشرقية",
  "Air China": "الصين",
  "Hainan Airlines": "هاينان",
  "Thai Airways": "الخطوط التايلاندية",
  "Bangkok Airways": "بانكوك ايرويز",
  "Malaysia Airlines": "الخطوط الماليزية",
  AirAsia: "اير اسيا",
  "Vietnam Airlines": "الخطوط الفيتنامية",
  "VietJet Air": "فيتجيت",
  "Philippine Airlines": "الخطوط الفلبينية",
  "Cebu Pacific": "سيبو باسيفيك",
  "Garuda Indonesia": "جارودا إندونيسيا",
  "Lion Air": "لايون اير",
  IndiGo: "إنديجو",
  "Air India": "إير إنديا",
  SpiceJet: "سبايس جيت",
  GoAir: "جو اير",
  Vistara: "فيستارا",
  "Pakistan International Airlines": "الخطوط الباكستانية",
  PIA: "الخطوط الباكستانية",
  "SriLankan Airlines": "الخطوط السريلانكية",
  "Bangladesh Biman": "بيمان بنغلاديش",
  "Nepal Airlines": "الخطوط النيبالية",
  Maldivian: "مالديفيان",

  // European Airlines
  Lufthansa: "لوفتهانزا",
  "British Airways": "الخطوط الجوية البريطانية",
  "Air France": "الخطوط الجوية الفرنسية",
  KLM: "كيه إل إم",
  "KLM Royal Dutch Airlines": "الخطوط الملكية الهولندية",
  Alitalia: "أليتاليا",
  "ITA Airways": "آي تي إيه",
  Iberia: "ايبيريا",
  Vueling: "فويلينج",
  "TAP Air Portugal": "تاب البرتغالية",
  "Swiss International Air Lines": "الخطوط السويسرية",
  SWISS: "الخطوط السويسرية",
  "Austrian Airlines": "الخطوط النمساوية",
  "Brussels Airlines": "خطوط بروكسل",
  "Scandinavian Airlines": "الخطوط الاسكندنافية",
  SAS: "الخطوط الاسكندنافية",
  Finnair: "فين اير",
  "Norwegian Air": "نورويجيان",
  Ryanair: "ريان اير",
  easyJet: "إيزي جيت",
  "Wizz Air": "ويز اير",
  "Aegean Airlines": "ايجيان",
  "LOT Polish Airlines": "لوت البولندية",
  "Czech Airlines": "الخطوط التشيكية",
  Aeroflot: "ايروفلوت",
  "S7 Airlines": "إس سفن",
  "Ukraine International Airlines": "الخطوط الأوكرانية",
  Tarom: "تاروم",
  "Air Serbia": "الخطوط الصربية",
  "Croatia Airlines": "الخطوط الكرواتية",

  // American Airlines
  "American Airlines": "الخطوط الأمريكية",
  "United Airlines": "يونايتد",
  "Delta Air Lines": "دلتا",
  "Southwest Airlines": "ساوث ويست",
  "JetBlue Airways": "جيت بلو",
  "Alaska Airlines": "ألاسكا",
  "Spirit Airlines": "سبيريت",
  "Frontier Airlines": "فرونتير",
  "Hawaiian Airlines": "هاواي",
  "Air Canada": "الخطوط الكندية",
  WestJet: "ويست جيت",
  Aeromexico: "ايروميكسيكو",
  "Copa Airlines": "كوبا",
  Avianca: "افيانكا",
  "LATAM Airlines": "لاتام",
  "Gol Linhas Aereas": "جول",
  "Azul Brazilian Airlines": "ازول البرازيلية",

  // African Airlines
  "South African Airways": "الخطوط الجنوب أفريقية",
  "Ethiopian Airlines": "الخطوط الإثيوبية",
  "Kenya Airways": "الخطوط الكينية",
  RwandAir: "رواند اير",
  "Air Mauritius": "موريشيوس",
  "Air Seychelles": "سيشل",
  "Air Tanzania": "تنزانيا",

  // Oceania Airlines
  Qantas: "كوانتاس",
  "Virgin Australia": "فيرجن أستراليا",
  Jetstar: "جيت ستار",
  "Air New Zealand": "الخطوط النيوزيلندية",
  "Fiji Airways": "الخطوط الفيجية",

  // Low-Cost Carriers
  "Wizz Air Abu Dhabi": "ويز اير أبوظبي",
  "Air Arabia Abu Dhabi": "العربية للطيران أبوظبي",
  "Fly Jinnah": "فلاي جناح",

  // Cargo Airlines (if needed)
  "DHL Aviation": "دي اتش ال",
  "FedEx Express": "فيديكس",
  "UPS Airlines": "يو بي اس",

  // Additional Major Airlines
  "Virgin Atlantic": "فيرجن أتلانتيك",
  "Air New Zealand": "الخطوط النيوزيلندية",
  "TAP Portugal": "تاب البرتغالية",
  "Edelweiss Air": "إيدلويس",
  Condor: "كوندور",
  Eurowings: "يوروينجز",
  "Air Transat": "اير ترانسات",
  "WOW air": "واو اير",
  Icelandair: "ايسلاند اير",
  "Aer Lingus": "اير لينغس",
  Jet2: "جيت2",
  "TUI Airways": "تي يو اي",
  "Thomas Cook Airlines": "توماس كوك",
  "Corendon Airlines": "كوريندون",
  "Small Planet Airlines": "سمول بلانيت",
};

/**
 * Get localized airline name
 * @param {string} airlineName - The airline name (usually in English)
 * @param {string} language - The current language ('en' or 'ar')
 * @returns {string} - The localized airline name
 */
export function getLocalizedAirlineName(airlineName, language = "en") {
  // If language is English or airline name is not found, return original
  if (!airlineName) return "";

  if (language === "ar") {
    // Try exact match first
    if (airlineTranslations[airlineName]) {
      return airlineTranslations[airlineName];
    }

    // Try case-insensitive match
    const lowerCaseName = airlineName.toLowerCase();
    const matchedKey = Object.keys(airlineTranslations).find(
      (key) => key.toLowerCase() === lowerCaseName
    );

    if (matchedKey) {
      return airlineTranslations[matchedKey];
    }

    // Try partial match (if airline name contains the key)
    const partialMatch = Object.keys(airlineTranslations).find(
      (key) => airlineName.includes(key) || key.includes(airlineName)
    );

    if (partialMatch) {
      return airlineTranslations[partialMatch];
    }
  }

  // Return original name if no translation found or language is English
  return airlineName;
}

/**
 * Get all airline translations
 * @returns {Object} - All airline translations
 */
export function getAllAirlineTranslations() {
  return { ...airlineTranslations };
}

/**
 * Add or update airline translation
 * @param {string} englishName - English airline name
 * @param {string} arabicName - Arabic airline name
 */
export function addAirlineTranslation(englishName, arabicName) {
  airlineTranslations[englishName] = arabicName;
}

export default getLocalizedAirlineName;
