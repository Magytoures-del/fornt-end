/**
 * City Localization Utility
 * Maps city names to their localized versions based on the current language
 */

// City mapping from English to Arabic
const cityTranslations = {
  // Saudi Arabia
  Riyadh: "الرياض",
  Jeddah: "جدة",
  Dammam: "الدمام",
  Makkah: "مكة المكرمة",
  Madinah: "المدينة المنورة",
  Abha: "أبها",
  Tabuk: "تبوك",
  Taif: "الطائف",
  "Khamis Mushait": "خميس مشيط",
  Hail: "حائل",
  Najran: "نجران",
  Jubail: "الجبيل",
  "Al Khobar": "الخبر",
  Qatif: "القطيف",
  Dhahran: "الظهران",
  Yanbu: "ينبع",
  "Al Bahah": "الباحة",
  Arar: "عرعر",
  Sakaka: "سكاكا",
  "Al Qunfudhah": "القنفذة",

  // UAE
  Dubai: "دبي",
  "Abu Dhabi": "أبو ظبي",
  Sharjah: "الشارقة",
  Ajman: "عجمان",
  "Ras Al Khaimah": "رأس الخيمة",
  Fujairah: "الفجيرة",
  "Umm Al Quwain": "أم القيوين",

  // Egypt
  Cairo: "القاهرة",
  Alexandria: "الإسكندرية",
  Luxor: "الأقصر",
  Aswan: "أسوان",
  "Sharm El Sheikh": "شرم الشيخ",
  Hurghada: "الغردقة",
  "Marsa Alam": "مرسى علم",
  Dahab: "دهب",
  "Port Said": "بورسعيد",
  Suez: "السويس",
  Tanta: "طنطا",
  Mansoura: "المنصورة",
  Zagazig: "الزقازيق",
  Ismailia: "الإسماعيلية",
  Minya: "المنيا",
  Assiut: "أسيوط",
  Qena: "قنا",
  Sohag: "سوهاج",

  // Turkey
  Istanbul: "إسطنبول",
  Ankara: "أنقرة",
  Izmir: "إزمير",
  Antalya: "أنطاليا",
  Bursa: "بورصة",
  Adana: "أضنة",
  Konya: "قونية",
  Gaziantep: "غازي عنتاب",
  Mersin: "مرسين",
  Diyarbakir: "دياربكر",
  Trabzon: "طرابزون",
  Samsun: "سامسون",
  Kayseri: "قيصري",
  Eskisehir: "إسكي شهير",
  Denizli: "دنيزلي",
  Sivas: "سيواس",
  Malatya: "ملاطية",
  Kahramanmaras: "قهرمان مرعش",
  Erzurum: "أرضروم",
  Van: "وان",

  // Jordan
  Amman: "عمان",
  Irbid: "إربد",
  Zarqa: "الزرقاء",
  Aqaba: "العقبة",
  Salt: "السلط",
  Karak: "الكرك",
  Madaba: "مادبا",
  Jerash: "جرش",
  Ajloun: "عجلون",
  Tafilah: "الطفيلة",
  Mafraq: "المفرق",

  // Lebanon
  Beirut: "بيروت",
  Tripoli: "طرابلس",
  Sidon: "صيدا",
  Tyre: "صور",
  Zahle: "زحلة",
  Baalbek: "بعلبك",
  Jounieh: "جونية",
  Byblos: "جبيل",
  Nabatieh: "النبطية",
  Baalbek: "بعلبك",

  // Qatar
  Doha: "الدوحة",
  "Al Rayyan": "الريان",
  "Al Wakrah": "الوكرة",
  "Al Khor": "الخور",
  Lusail: "لوسيل",
  Mesaieed: "مسيعيد",
  Dukhan: "دخان",
  "Al Shamal": "الشمال",

  // Kuwait
  "Kuwait City": "مدينة الكويت",
  Hawalli: "حولي",
  Farwaniya: "الفروانية",
  Ahmadi: "الأحمدي",
  Jahra: "الجهراء",
  "Mubarak Al-Kabeer": "مبارك الكبير",

  // Oman
  Muscat: "مسقط",
  Salalah: "صلالة",
  Nizwa: "نزوى",
  Sohar: "صحار",
  Sur: "صور",
  Ibra: "إبراء",
  Ibri: "عبري",
  Rustaq: "الرستاق",
  Bahla: "بهلاء",

  // Bahrain
  Manama: "المنامة",
  Riffa: "الرفاع",
  Muharraq: "المحرق",
  "Hamad Town": "مدينة حمد",
  "Isa Town": "مدينة عيسى",
  Sitra: "سترة",
  Arad: "عراد",

  // International Cities
  London: "لندن",
  Paris: "باريس",
  "New York": "نيويورك",
  Tokyo: "طوكيو",
  Singapore: "سنغافورة",
  Bangkok: "بانكوك",
  "Kuala Lumpur": "كوالالمبور",
  Jakarta: "جاكرتا",
  Manila: "مانيلا",
  Bombay: "بومباي",
  Mumbai: "مومباي",
  Delhi: "دلهي",
  Bangalore: "بنغالور",
  Chennai: "تشيناي",
  Hyderabad: "حيدر أباد",
  Calcutta: "كالكوتا",
  Kolkata: "كولكاتا",
  Karachi: "كراتشي",
  Lahore: "لاهور",
  Islamabad: "إسلام أباد",
  Dhaka: "داكا",
  Colombo: "كولومبو",
  Kathmandu: "كاتماندو",
  Male: "ماليه",
  "Ho Chi Minh City": "هو تشي مينه",
  Hanoi: "هانوي",
  "Phnom Penh": "بنوم بنه",
  Vientiane: "فيينتيان",
  Yangon: "يانغون",
  "Bandar Seri Begawan": "بندر سري بكاوان",
  Dili: "ديلي",
  Taipei: "تايبي",
  "Hong Kong": "هونغ كونغ",
  Macau: "ماكاو",
  Beijing: "بكين",
  Shanghai: "شانغهاي",
  Guangzhou: "غوانغتشو",
  Shenzhen: "شينزين",
  Chengdu: "تشنغدو",
  Chongqing: "تشونغتشينغ",
  "Xi'an": "شيان",
  Hangzhou: "هانغتشو",
  Nanjing: "نانجينغ",
  Wuhan: "ووهان",
  Tianjin: "تيانجين",
  Qingdao: "تشينغداو",
  Dalian: "داليان",
  Shenyang: "شنيانغ",
  Harbin: "هاربين",
  Changsha: "تشانغشا",
  Fuzhou: "فوتشو",
  Xiamen: "شيامن",
  Kunming: "كونمينغ",
  Nanchang: "نانتشانغ",
  Shijiazhuang: "شيجياتشوانغ",
  Taiyuan: "تايوان",
  Hefei: "هيفي",
  Jinan: "جينان",
  Zhengzhou: "تشنغتشو",
  Changchun: "تشانغتشون",
  Haikou: "هايكو",
  Nanchang: "نانتشانغ",
  Lanzhou: "لانتشو",
  Xining: "شينينغ",
  Yinchuan: "ينتشوان",
  Urumqi: "أورومتشي",
  Lhasa: "لاسا",
  Sydney: "سيدني",
  Melbourne: "ملبورن",
  Brisbane: "بريزبان",
  Perth: "بيرث",
  Adelaide: "أديلايد",
  Canberra: "كانبرا",
  Auckland: "أوكلاند",
  Wellington: "ويلينغتون",
  Christchurch: "كرايستشيرش",
  Suva: "سوفا",
  "Port Moresby": "بورت مورسبي",
  Honiara: "هونيارا",
  "Port Vila": "بورت فيلا",
  Apia: "أبيا",
  "Nuku'alofa": "نوكوالوفا",
  Tarawa: "تاراوا",
  Funafuti: "فونافوتي",
  Yaren: "يارين",
  Melekeok: "مليكوك",
  Majuro: "ماجورو",
  Palikir: "باليكير",
  Berlin: "برلين",
  Munich: "ميونخ",
  Hamburg: "هامبورغ",
  Cologne: "كولونيا",
  Frankfurt: "فرانكفورت",
  Stuttgart: "شتوتغارت",
  Düsseldorf: "دوسلدورف",
  Dortmund: "دورتموند",
  Essen: "إيسن",
  Leipzig: "لايبزيغ",
  Bremen: "بريمن",
  Dresden: "درسدن",
  Hannover: "هانوفر",
  Nuremberg: "نورنبرغ",
  Duisburg: "دويسبورغ",
  Bochum: "بوخوم",
  Wuppertal: "فوبرتال",
  Bielefeld: "بيليفيلد",
  Bonn: "بون",
  Mannheim: "مانهايم",
  Karlsruhe: "كارلسروه",
  Augsburg: "أوغسبورغ",
  Wiesbaden: "فيسبادن",
  Gelsenkirchen: "جيلسنكيرشن",
  Mönchengladbach: "مونشنغلادباخ",
  Braunschweig: "براونشفايغ",
  Chemnitz: "كيمنتس",
  Kiel: "كيل",
  Aachen: "آخن",
  Halle: "هاله",
  Magdeburg: "ماغدبورغ",
  Freiburg: "فرايبورغ",
  Krefeld: "كريفلد",
  Lübeck: "لوبيك",
  Oberhausen: "أوبهاوزن",
  Erfurt: "إرفورت",
  Mainz: "ماينتس",
  Rostock: "روستوك",
  Kassel: "كاسل",
  Hagen: "هاغن",
  Hamm: "هام",
  Saarbrücken: "زاربروكن",
  Mülheim: "مولهايم",
  Potsdam: "بوتسدام",
  Ludwigshafen: "لودفيغسهافن",
  Oldenburg: "أولدنبورغ",
  Leverkusen: "ليفركوزن",
  Osnabrück: "أوسنابروك",
  Solingen: "زولينغن",
  Heidelberg: "هايدلبرغ",
  Herne: "هيرنه",
  Neuss: "نويس",
  Darmstadt: "دارمشتات",
  Paderborn: "بادربورن",
  Regensburg: "ريغنسبورغ",
  Ingolstadt: "إنغولشتات",
  Würzburg: "فورتسبورغ",
  Fürth: "فورت",
  Wolfsburg: "فولفسبورغ",
  Offenbach: "أوفنباخ",
  Ulm: "أولم",
  Heilbronn: "هايلبرون",
  Pforzheim: "بفورتسهايم",
  Göttingen: "غوتينغن",
  Bottrop: "بوتروب",
  Trier: "ترير",
  Recklinghausen: "ريكلنغهاوزن",
  Reutlingen: "رويتلينغن",
  Bremerhaven: "بريمرهافن",
  Koblenz: "كوبلنتس",
  "Bergisch Gladbach": "بيرغيش غلادباخ",
  Jena: "يينا",
  Remscheid: "ريمشايد",
  Erlangen: "إرلانغن",
  Moers: "مورس",
  Siegen: "زيغن",
  Hildesheim: "هيلدسهايم",
  Salzgitter: "سالزغيتر",
};

/**
 * Get localized city name
 * @param {string} cityName - The city name in English
 * @param {string} language - Current language ('ar' or 'en')
 * @returns {string} - Localized city name
 */
export const getLocalizedCityName = (cityName, language = "en") => {
  if (!cityName) return "";

  // Clean the city name (remove extra spaces, normalize case)
  const cleanCityName = cityName.toString().trim();

  // If language is Arabic, return Arabic translation if available, otherwise return original
  if (language === "ar") {
    return cityTranslations[cleanCityName] || cleanCityName;
  }

  // For English or any other language, return the original city name
  return cleanCityName;
};

/**
 * Get all available city translations
 * @returns {object} - Object with English keys and Arabic values
 */
export const getAllCityTranslations = () => {
  return cityTranslations;
};

/**
 * Check if a city has Arabic translation
 * @param {string} cityName - The city name in English
 * @returns {boolean} - True if Arabic translation exists
 */
export const hasArabicTranslation = (cityName) => {
  return cityTranslations.hasOwnProperty(cityName?.toString().trim());
};

const cityLocalizationApi = {
  getLocalizedCityName,
  getAllCityTranslations,
  hasArabicTranslation,
};

export default cityLocalizationApi;
