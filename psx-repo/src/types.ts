export interface StockAnnouncement {
  date: string;
  title: string;
  sentiment: string;
}

export interface StockDividend {
  date: string;
  amount: number;
  type: string;
}

export interface StockFinancials {
  quarters: string[];
  revenue: number[]; // in billions PKR
  profit: number[]; // in billions PKR
}

export interface StockShareholding {
  directors: number;
  institutions: number;
  public: number;
  foreign: number;
}

export interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  marketCap: number; // in billions PKR
  pe: number;
  divYield: number; // %
  eps: number;
  growth: number; // % YoY
  rsi: number;
  macd: number;
  sma20: number;
  ema50: number;
  upperBB: number;
  lowerBB: number;
  announcements: StockAnnouncement[];
  dividends: StockDividend[];
  financials: StockFinancials;
  shareholding: StockShareholding;
}

export interface StockHistoryItem {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  rsi?: number;
  macd?: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  qty: number;
  price: number;
  date: string;
}

export interface Holding {
  symbol: string;
  avgPrice: number;
  qty: number;
}

export interface Portfolio {
  cash: number;
  transactions: Transaction[];
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  type: "ABOVE" | "BELOW";
  active: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface AIAnalysisResult {
  symbol: string;
  suggestion: "BUY" | "HOLD" | "SELL";
  riskScore: number;
  riskCategory: "Low" | "Medium" | "High";
  technicalSummary: string;
  fundamentalSummary: string;
  sentimentAnalysis: string;
  prediction: string;
}

export interface AIPredictionResult {
  symbol: string;
  trend: string;
  probabilityScore: number;
  volatilityIndex: string;
  insight: string;
}

export interface AppSettings {
  theme: "dark" | "light";
  language: "en" | "ur";
  currency: "PKR" | "USD";
  notifications: boolean;
  biometrics: boolean;
}
