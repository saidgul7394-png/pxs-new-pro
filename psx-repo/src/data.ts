export interface NewsArticle {
  id: string;
  title: string;
  category: "PSX" | "Business" | "Economy" | "Company";
  source: string;
  time: string;
  summary: string;
  sentiment: "bullish" | "bearish" | "neutral";
  symbolRelated?: string;
  bookmarked?: boolean;
}

export interface EconomicEvent {
  date: string;
  event: string;
  impact: "High" | "Medium" | "Low";
  previous: string;
  forecast: string;
  actual: string;
}

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: "n1",
    title: "SBP keeps policy rate unchanged at 14.5% citing inflation stabilization",
    category: "Economy",
    source: "State Bank of Pakistan",
    time: "2 hours ago",
    summary: "The Monetary Policy Committee noted that current real interest rates remain positive and appropriate to anchor inflation expectations towards the medium-term target of 5-7%.",
    sentiment: "bullish"
  },
  {
    id: "n2",
    title: "OGDC reports high-yield gas flow discovery at Lockhart block in Kohat",
    category: "Company",
    source: "PSX Filings",
    time: "4 hours ago",
    summary: "Oil & Gas Development Company Limited (OGDCL), as operator of the Kohat Joint Venture, has discovered gas from its exploratory well Lockhart-1, producing 12.5 MMCFD of gas.",
    sentiment: "bullish",
    symbolRelated: "OGDC"
  },
  {
    id: "n3",
    title: "Information Technology exports surge 24% YoY, SYS leads volume growth",
    category: "Business",
    source: "Board of Investment",
    time: "6 hours ago",
    summary: "Pakistan's IT exports touched a record high this quarter, driven by expanded enterprise digitization projects in the GCC and North American markets.",
    sentiment: "bullish",
    symbolRelated: "SYS"
  },
  {
    id: "n4",
    title: "Hubco explores 150MW renewable solar venture in Southern Punjab",
    category: "Company",
    source: "Business Recorder",
    time: "1 day ago",
    summary: "The Hub Power Company (HUBC) is actively finalizing joint venture terms to set up decentralized solar grids, aiming to lower reliance on costly imported heavy fuel oil.",
    sentiment: "bullish",
    symbolRelated: "HUBC"
  },
  {
    id: "n5",
    title: "Circular debt accumulation crosses PKR 2.4 trillion, hitting energy marketing stocks",
    category: "Economy",
    source: "Ministry of Energy",
    time: "1 day ago",
    summary: "Rising receivables pose short-term working capital strains on PSO and gas distribution companies, prompting calls for structural power tariff reforms.",
    sentiment: "bearish",
    symbolRelated: "PSO"
  },
  {
    id: "n6",
    title: "KSE-100 hits historic high above 78,000 index points amid local buying spree",
    category: "PSX",
    source: "PSX Analytics",
    time: "2 days ago",
    summary: "Strong participation from local mutual funds and retail brokers pushed the benchmark index past key resistance levels, fueled by a positive IMF review.",
    sentiment: "bullish"
  },
  {
    id: "n7",
    title: "Meezan Bank records robust asset growth in H1, expands digital retail banking",
    category: "Company",
    source: "Dawn Finance",
    time: "3 days ago",
    summary: "MEBL remains the undisputed leader in Islamic banking, reporting double-digit growth in its financing portfolio while launching 15 new cashless branches.",
    sentiment: "bullish",
    symbolRelated: "MEBL"
  },
  {
    id: "n8",
    title: "Cement dispatches drop 4% in Northern region due to higher monsoonal rainfall",
    category: "Business",
    source: "APCMA",
    time: "4 days ago",
    summary: "Lucky Cement and other key players noted a transient seasonal slowdown in domestic construction dispatches, though export margins remained resilient.",
    sentiment: "neutral",
    symbolRelated: "LUCK"
  }
];

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    date: "July 15, 2026",
    event: "Monetary Policy Announcement",
    impact: "High",
    previous: "14.50%",
    forecast: "14.00%",
    actual: "Pending"
  },
  {
    date: "July 18, 2026",
    event: "CPI Inflation YoY (June)",
    impact: "High",
    previous: "11.2%",
    forecast: "10.8%",
    actual: "Pending"
  },
  {
    date: "July 22, 2026",
    event: "Remittances Inflow Report",
    impact: "Medium",
    previous: "$2.9B",
    forecast: "$3.1B",
    actual: "Pending"
  },
  {
    date: "July 25, 2026",
    event: "Foreign Exchange Reserves Data",
    impact: "Medium",
    previous: "$14.2B",
    forecast: "$14.5B",
    actual: "Pending"
  }
];

export const TRANSLATIONS = {
  en: {
    title: "PSX Vision Pro",
    tagline: "Pakistan's Premier Stock Intelligence Platform",
    home: "Home",
    market: "Market",
    watchlist: "Watchlist",
    portfolio: "Portfolio",
    ai_analysis: "AI Analysis",
    ai_predict: "AI Predict",
    news: "News",
    screener: "Screener",
    compare: "Compare",
    settings: "Settings",
    login: "Log In",
    guest_mode: "Guest Mode",
    logout: "Log Out",
    search: "Search Stocks...",
    kse100: "KSE-100 Index",
    kse30: "KSE-30 Index",
    gainers: "Top Gainers",
    losers: "Top Losers",
    most_active: "Most Active",
    economic_calendar: "Economic Calendar",
    breaking_news: "Financial News",
    buy: "Buy",
    sell: "Sell",
    hold: "Hold",
    risk_score: "Risk Score",
    recommendation: "AI Recommendation",
    risk_category: "Risk Level",
    chat_assistant: "AI Advisor Chat",
    predictive_trend: "Predictive Trend",
    probability: "AI Probability",
    disclaimer_title: "Disclaimer",
    disclaimer_text: "All AI analysis, trend detections, and prediction score metrics are provided for informational and educational purposes only. They do not constitute certified investment or financial advice. Investors are advised to consult with a registered financial professional before executing trades on the Pakistan Stock Exchange.",
    price: "Price",
    change: "Change",
    volume: "Volume",
    sector: "Sector",
    pe_ratio: "P/E Ratio",
    div_yield: "Div Yield",
    market_cap: "Market Cap",
    earnings_ps: "EPS",
    holding_summary: "Holdings Summary",
    total_value: "Total Value",
    profit_loss: "Profit / Loss",
    add_transaction: "Add Transaction",
    compare_companies: "Compare Companies",
    compare_placeholder: "Select companies to compare (up to 5)",
    alerts_notifications: "Alerts & Notifications",
    theme_mode: "Theme Mode",
    language: "Language",
    currency: "Preferred Currency",
    biometrics: "Biometrics Sign In",
    reset_data: "Reset Local Database",
    urdu: "Urdu (اردو)",
    english: "English"
  },
  ur: {
    title: "پی ایس ایکس ویژن پرو",
    tagline: "پاکستان کا سب سے جدید اسٹاک انٹیلیجنس پلیٹ فارم",
    home: "ہوم",
    market: "مارکیٹ",
    watchlist: "واچ لسٹ",
    portfolio: "پورٹ فولیو",
    ai_analysis: "اے آئی تجزیہ",
    ai_predict: "اے آئی پیشن گوئی",
    news: "خبریں",
    screener: "اسکرینر",
    compare: "موازنہ",
    settings: "ترتیبات",
    login: "لاگ ان کریں",
    guest_mode: "مہمان موڈ",
    logout: "لاگ آؤٹ",
    search: "اسٹاک تلاش کریں...",
    kse100: "کے ایس ای 100 انڈیکس",
    kse30: "کے ایس ای 30 انڈیکس",
    gainers: "سب سے زیادہ منافع",
    losers: "سب سے زیادہ نقصان",
    most_active: "سب سے زیادہ فعال",
    economic_calendar: "اقتصادی کیلنڈر",
    breaking_news: "مالیاتی خبریں",
    buy: "خریدیں",
    sell: "بیچیں",
    hold: "روکیں",
    risk_score: "خطرے کا اسکور",
    recommendation: "اے آئی تجویز",
    risk_category: "خطرے کی سطح",
    chat_assistant: "اے آئی مشیر چیٹ",
    predictive_trend: "پیشن گوئی کا رجحان",
    probability: "اے آئی امکان",
    disclaimer_title: "انتباہ",
    disclaimer_text: "تمام اے آئی تجزیے، رجحانات کی نشاندہی، اور پیشن گوئی کے اسکورز صرف معلوماتی اور تعلیمی مقاصد کے لیے فراہم کیے گئے ہیں۔ یہ تصدیق شدہ سرمایہ کاری یا مالیاتی مشورہ نہیں ہیں۔ سرمایہ کاروں کو مشورہ دیا جاتا ہے کہ وہ پاکستان اسٹاک ایکسچینج میں تجارت کرنے سے پہلے ایک رجسٹرڈ مالیاتی پیشہ ور سے مشورہ کریں۔",
    price: "قیمت",
    change: "تبدیلی",
    volume: "حجم",
    sector: "شعبہ",
    pe_ratio: "پی/ای تناسب",
    div_yield: "منافع کی شرح",
    market_cap: "مارکیٹ کیپ",
    earnings_ps: "فی شیئر آمدنی",
    holding_summary: "سرمایہ کاری کا خلاصہ",
    total_value: "کل مالیت",
    profit_loss: "نفع / نقصان",
    add_transaction: "لین دین شامل کریں",
    compare_companies: "کمپنیوں کا موازنہ",
    compare_placeholder: "موازنہ کرنے کے لیے کمپنیاں منتخب کریں (زیادہ سے زیادہ 5)",
    alerts_notifications: "انتباہات اور اطلاعات",
    theme_mode: "تھیم موڈ",
    language: "زبان",
    currency: "پسندیدہ کرنسی",
    biometrics: "بایومیٹرک سائن ان",
    reset_data: "مقامی ڈیٹا بیس ری سیٹ کریں",
    urdu: "اردو",
    english: "English (انگریزی)"
  }
};
