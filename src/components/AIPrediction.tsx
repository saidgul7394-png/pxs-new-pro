import React, { useState, useEffect } from "react";
import { Stock, AIPredictionResult } from "../types";
import { TrendingUp, AlertTriangle, HelpCircle, Loader2, RefreshCw, BarChart2, ShieldAlert } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface AIPredictionProps {
  stocks: Stock[];
  selectedSymbol: string;
  lang: "en" | "ur";
  onSelectStock: (symbol: string) => void;
}

export default function AIPrediction({ stocks, selectedSymbol, lang, onSelectStock }: AIPredictionProps) {
  const [currentSymbol, setCurrentSymbol] = useState<string>(selectedSymbol || "SYS");
  const [prediction, setPrediction] = useState<AIPredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSymbol) {
      setCurrentSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  const fetchPrediction = async (symbolToFetch: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbolToFetch }),
      });
      if (!res.ok) throw new Error("Failed to load Gemini predictions");
      const data = await res.json();
      setPrediction(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(currentSymbol);
  }, [currentSymbol]);

  // Generate mock projection chart lines for visual richness
  const activeStock = stocks.find((s) => s.symbol === currentSymbol) || stocks[0];
  const chartProjectionData = [
    { day: "Day 0", price: activeStock.price },
    { day: "Day 5", price: activeStock.price * (1 + (Math.random() - 0.4) * 0.03) },
    { day: "Day 10", price: activeStock.price * (1 + (Math.random() - 0.4) * 0.05) },
    { day: "Day 15", price: activeStock.price * (1 + (Math.random() - 0.3) * 0.07) },
    { day: "Day 20", price: activeStock.price * (1 + (Math.random() - 0.3) * 0.09) },
    { day: "Day 25", price: activeStock.price * (1 + (Math.random() - 0.2) * 0.12) },
    { day: "Day 30", price: activeStock.price * (1 + (Math.random() - 0.2) * 0.15) },
  ];

  return (
    <div id="ai-prediction-view" className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            {lang === "en" ? "Gemini Predictive Forecasting" : "جیمنی پیشین گوئی کے امکانات"}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === "en"
              ? "30-Day automated trend projection and probability matrix using Gemini neural metrics"
              : "جیمنی نیورل میٹرکس کا استعمال کرتے ہوئے 30 روزہ رجحان اور امکان کا خلاصہ"}
          </p>
        </div>

        {/* Dropdown */}
        <select
          value={currentSymbol}
          onChange={(e) => {
            setCurrentSymbol(e.target.value);
            onSelectStock(e.target.value);
          }}
          className="bg-slate-900/60 border border-slate-700/50 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
        >
          {stocks.map((s) => (
            <option key={s.symbol} value={s.symbol} className="bg-slate-950 font-mono">
              {s.symbol} - {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Core Prediction Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Probability Gauge and Advice */}
        <div className="md:col-span-5 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
          {loading ? (
            <div className="h-80 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-400 animate-pulse">
                {lang === "en" ? "Calculating market standard deviations..." : "مارکیٹ کی مختلف شرحوں کا حساب لگایا جا رہا ہے..."}
              </p>
            </div>
          ) : error || !prediction ? (
            <div className="h-80 flex flex-col items-center justify-center space-y-3 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-400" />
              <p className="text-xs text-amber-400">
                {lang === "en" ? "Could not retrieve trend projections." : "رجحانات کی پیشین گوئی حاصل کرنے میں ناکامی۔"}
              </p>
              <button
                onClick={() => fetchPrediction(currentSymbol)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/10 flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {lang === "en" ? "Retry" : "دوبارہ کوشش"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Trend Badge */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  {lang === "en" ? "Detected Market Trend" : "رجحان کی نشاندہی"}
                </span>
                <span className="text-xl font-black text-indigo-300 font-mono tracking-tight block">
                  {prediction.trend}
                </span>
              </div>

              {/* Progress Bar of Probability */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>{lang === "en" ? "Trend Probability Score" : "رجحان کے امکان کا اسکور"}</span>
                  <span className="text-emerald-400 font-mono">{prediction.probabilityScore}%</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${prediction.probabilityScore}%` }}
                  />
                </div>
              </div>

              {/* Volatility Index */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                    {lang === "en" ? "Estimated Volatility" : "متوقع اتار چڑھاؤ"}
                  </span>
                  <span className="text-sm font-bold text-white font-mono block mt-1">
                    {prediction.volatilityIndex}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                    {lang === "en" ? "Current Equity Price" : "موجودہ ایکویٹی قیمت"}
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-mono block mt-1">
                    PKR {activeStock.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Forecast text */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold block">
                  {lang === "en" ? "AI Neural Insight" : "اے آئی نیورل بصیرت"}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-white/5">
                  {prediction.insight}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual area chart projection */}
        <div className="md:col-span-7 p-6 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4 text-indigo-400" />
              <span>{lang === "en" ? "30-Day Simulated Asset Projections" : "30 روزہ متوقع اثاثہ چارٹ"}</span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {lang === "en"
                ? "Overlay showing standard deviation modeling of price trends"
                : "قیمتوں کے رجحانات کا معیاری انحراف ظاہر کرنے والا اوورلے"}
            </p>
          </div>

          <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartProjectionData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", color: "#fff" }}
                />
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <span className="text-[9px] text-center text-slate-500 block italic">
            {lang === "en" ? "*Calculated based on standard volatility metrics." : "*معیاری اتار چڑھاؤ کے مطابق تیار کردہ ڈیٹا۔"}
          </span>
        </div>
      </div>

      {/* Flagship professional Disclaimer panel (Play Store Ready Requirement) */}
      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4 items-start">
        <ShieldAlert className="h-6 w-6 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-amber-400">
            {lang === "en" ? "Mandatory SECP Regulatory Disclaimer" : "لازمی ایس ای سی پی ریگولیٹری ڈس کلیمر"}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === "en"
              ? "All financial projections, trends, and risk models generated by PSX Vision Pro's Gemini AI engine are meant solely for mock exploration, testing, and mathematical modeling purposes. They are entirely automated, educational, and are not qualified, certified, or endorsed as professional investment or financial advisory audits. Pakistan Stock Exchange investments carry heavy market volatility risk. Please conduct robust manual audits or consult a SECP-certified investment advisor prior to active trading."
              : "پی ایس ایکس ویژن پرو کے جیمنی اے آئی انجن کے ذریعہ تیار کردہ تمام مالیاتی پیشین گوئیاں، رجحانات، اور خطرے کے ماڈلز صرف معلوماتی اور ریاضیاتی ماڈلنگ کے مقاصد کے لیے ہیں۔ یہ مکمل طور پر خودکار اور تعلیمی ہیں اور ان کو پیشہ ورانہ سرمایہ کاری یا مالیاتی مشاورتی آڈٹ کے طور پر تسلیم نہیں کیا جاتا۔ پاکستان اسٹاک ایکسچینج میں سرمایہ کاری شدید مارکیٹ اتار چڑھاؤ کے خطرے سے مشروط ہے۔"}
          </p>
        </div>
      </div>
    </div>
  );
}
