import React, { useState } from "react";
import { Stock } from "../types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Scale, Check, Plus, Trash2, HelpCircle } from "lucide-react";

interface CompareStocksProps {
  stocks: Stock[];
  lang: "en" | "ur";
}

export default function CompareStocks({ stocks, lang }: CompareStocksProps) {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["SYS", "HUBC", "OGDC"]);
  const [activeMetric, setActiveMetric] = useState<"pe" | "divYield" | "marketCap" | "eps" | "growth">("pe");

  const toggleStock = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      if (selectedSymbols.length > 1) {
        setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
      }
    } else {
      if (selectedSymbols.length < 5) {
        setSelectedSymbols([...selectedSymbols, symbol]);
      }
    }
  };

  const compareList = stocks.filter((s) => selectedSymbols.includes(s.symbol));

  // Chart data formatting
  const chartData = compareList.map((s) => ({
    symbol: s.symbol,
    pe: s.pe,
    divYield: s.divYield,
    marketCap: s.marketCap,
    eps: s.eps,
    growth: s.growth,
  }));

  const metricLabel = {
    pe: lang === "en" ? "P/E Ratio" : "پی/ای تناسب",
    divYield: lang === "en" ? "Dividend Yield (%)" : "منافع کی شرح (%)",
    marketCap: lang === "en" ? "Market Cap (PKR Billion)" : "مارکیٹ کیپ (PKR ارب)",
    eps: lang === "en" ? "Earnings Per Share (EPS)" : "فی شیئر آمدنی",
    growth: lang === "en" ? "Revenue Growth (YoY %)" : "آمدنی کی شرح نمو (%)",
  };

  const metricColor = {
    pe: "#f43f5e", // Rose
    divYield: "#10b981", // Emerald
    marketCap: "#3b82f6", // Blue
    eps: "#eab308", // Yellow
    growth: "#a855f7", // Purple
  };

  return (
    <div id="compare-stocks-view" className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Scale className="h-5 w-5 text-indigo-400" />
          {lang === "en" ? "Cross-Company Comparison Tool" : "بین کمپنی موازنہ ٹول"}
        </h2>
        <p className="text-xs text-slate-400">
          {lang === "en"
            ? "Compare up to 5 major PSX companies across key performance metrics and valuation ratios"
            : "اہم کارکردگی کے میٹرکس اور قیمتوں کے تناسب میں 5 تک کمپنیوں کا موازنہ کریں"}
        </p>
      </div>

      {/* Select Stocks Grid */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 backdrop-blur-md">
        <span className="text-xs font-bold text-slate-300 block">
          {lang === "en" ? "Select companies to compare (Max 5):" : "موازنہ کرنے کے لیے کمپنیاں منتخب کریں (زیادہ سے زیادہ 5):"}
        </span>
        <div className="flex flex-wrap gap-2">
          {stocks.map((stock) => {
            const isSelected = selectedSymbols.includes(stock.symbol);
            return (
              <button
                key={stock.symbol}
                onClick={() => toggleStock(stock.symbol)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono flex items-center gap-1 transition-all ${
                  isSelected
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-slate-900/60 text-slate-300 border border-slate-700/50 hover:bg-slate-800"
                }`}
              >
                {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {stock.symbol}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Selector tabs */}
      <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 self-start overflow-x-auto">
        {(["pe", "divYield", "marketCap", "eps", "growth"] as const).map((metric) => (
          <button
            key={metric}
            onClick={() => setActiveMetric(metric)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap font-medium ${
              activeMetric === metric ? "bg-indigo-500/10 text-indigo-300 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            {metricLabel[metric]}
          </button>
        ))}
      </div>

      {/* Visual Chart Panel */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md space-y-4">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          <span>{metricLabel[activeMetric]} {lang === "en" ? "Distribution" : "تقسیم"}</span>
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
              <XAxis dataKey="symbol" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", color: "#fff" }}
                itemStyle={{ color: metricColor[activeMetric] }}
              />
              <Bar dataKey={activeMetric} fill={metricColor[activeMetric]} radius={[6, 6, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Grid Matrix Table */}
      <div className="overflow-x-auto bg-slate-900/60 border border-white/5 rounded-2xl backdrop-blur-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/50 text-slate-400 font-medium border-b border-white/5">
              <th className="p-4">{lang === "en" ? "Parameter" : "میٹرک"}</th>
              {compareList.map((s) => (
                <th key={s.symbol} className="p-4 text-center font-bold text-white font-mono">
                  {s.symbol}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "Company Name" : "کمپنی کا نام"}</td>
              {compareList.map((s) => (
                <td key={s.symbol} className="p-4 text-center text-white font-medium">
                  {s.name}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "Sector" : "شعبہ"}</td>
              {compareList.map((s) => (
                <td key={s.symbol} className="p-4 text-center text-slate-300">
                  {s.sector}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "Current Price" : "موجودہ قیمت"}</td>
              {compareList.map((s) => (
                <td key={s.symbol} className="p-4 text-center text-white font-bold font-mono">
                  PKR {s.price.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "P/E Ratio" : "پی/ای تناسب"}</td>
              {compareList.map((s) => (
                <td
                  key={s.symbol}
                  className={`p-4 text-center font-bold font-mono ${
                    s.pe < 8 ? "text-emerald-400" : s.pe < 15 ? "text-indigo-300" : "text-amber-400"
                  }`}
                >
                  {s.pe}x
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "Dividend Yield" : "منافع کی شرح"}</td>
              {compareList.map((s) => (
                <td
                  key={s.symbol}
                  className={`p-4 text-center font-bold font-mono ${
                    s.divYield > 8 ? "text-emerald-400" : s.divYield > 0 ? "text-indigo-300" : "text-slate-400"
                  }`}
                >
                  {s.divYield}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "Earnings Per Share" : "فی شیئر آمدنی"}</td>
              {compareList.map((s) => (
                <td key={s.symbol} className="p-4 text-center text-slate-300 font-mono">
                  PKR {s.eps}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "Market Capitalization" : "کل مارکیٹ مالیت"}</td>
              {compareList.map((s) => (
                <td key={s.symbol} className="p-4 text-center text-slate-300 font-mono">
                  PKR {s.marketCap} Billion
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-slate-400 font-medium">{lang === "en" ? "Technical RSI (14-Day)" : "آر ایس آئی (14 دن)"}</td>
              {compareList.map((s) => (
                <td
                  key={s.symbol}
                  className={`p-4 text-center font-bold font-mono ${
                    s.rsi > 70 ? "text-rose-400" : s.rsi < 35 ? "text-emerald-400" : "text-slate-300"
                  }`}
                >
                  {s.rsi} ({s.rsi > 70 ? "Overbought" : s.rsi < 35 ? "Oversold" : "Neutral"})
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Educational Footer on comparison parameters */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex gap-3 items-start">
        <HelpCircle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white">
            {lang === "en" ? "Understanding Ratio Spreads" : "موازنہ کے تناسب کو سمجھنا"}
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {lang === "en"
              ? "A lower P/E ratio signifies cheaper valuation relative to current profits, which often presents strong value when paired with high dividend yields. Conversely, high P/E companies like TRG or SYS represent fast-growing technology spaces where investors pay premium margins today for future digital scaling."
              : "ایک کم پی/ای تناسب موجودہ منافع کے مقابلے میں سستی قیمت کی نشاندہی کرتا ہے، جو اکثر مضبوط قدر پیش کرتا ہے۔ اس کے برعکس، پی/ای کی حامل کمپنیاں تیزی سے بڑھتے ہوئے تکنیکی شعبے کی نمائندگی کرتی ہیں۔"}
          </p>
        </div>
      </div>
    </div>
  );
}
