import React, { useState, useMemo } from "react";
import { Stock } from "../types";
import { Sliders, Search, DollarSign, PieChart, TrendingUp, Info } from "lucide-react";

interface ScreenerProps {
  stocks: Stock[];
  onSelectStock: (symbol: string) => void;
  lang: "en" | "ur";
}

export default function Screener({ stocks, onSelectStock, lang }: ScreenerProps) {
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [maxPE, setMaxPE] = useState<number>(25);
  const [minYield, setMinYield] = useState<number>(0);
  const [minCap, setMinCap] = useState<number>(0); // in billions PKR
  const [searchQuery, setSearchQuery] = useState<string>("");

  const sectors = useMemo(() => {
    const set = new Set(stocks.map((s) => s.sector));
    return ["All", ...Array.from(set)];
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter((stock) => {
      const matchSector = selectedSector === "All" || stock.sector === selectedSector;
      const matchPE = stock.pe <= maxPE || stock.pe === 0;
      const matchYield = stock.divYield >= minYield;
      const matchCap = stock.marketCap >= minCap;
      const matchSearch =
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSector && matchPE && matchYield && matchCap && matchSearch;
    });
  }, [stocks, selectedSector, maxPE, minYield, minCap, searchQuery]);

  return (
    <div id="screener-view" className="space-y-6">
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="h-5 w-5 text-emerald-400" />
            {lang === "en" ? "Interactive Equity Screener" : "انٹرایکٹو ایکویٹی اسکرینر"}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === "en"
              ? "Filter Pakistani blue-chips by fundamental metrics and valuation ratios"
              : "بنیادی میٹرکس اور قیمت کے تناسب کے ذریعے اسٹاکس کو فلٹر کریں"}
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-mono border border-emerald-500/20">
          {filteredStocks.length} {lang === "en" ? "Matches" : "مطابقت"}
        </span>
      </div>

      {/* Screener Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400 block">
            {lang === "en" ? "Search" : "تلاش"}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. SYS, Lucky..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Sector Select */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-400 block">
            {lang === "en" ? "Sector" : "شعبہ"}
          </label>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector} className="bg-slate-950">
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Max PE Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>{lang === "en" ? "Max P/E Ratio" : "زیادہ سے زیادہ پی/ای تناسب"}</span>
            <span className="text-emerald-400 font-mono">{maxPE}x</span>
          </div>
          <input
            type="range"
            min="3"
            max="25"
            step="1"
            value={maxPE}
            onChange={(e) => setMaxPE(parseInt(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Min Dividend Yield Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>{lang === "en" ? "Min Dividend Yield" : "کم سے کم منافع کی شرح"}</span>
            <span className="text-emerald-400 font-mono">{minYield}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={minYield}
            onChange={(e) => setMinYield(parseFloat(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Min Market Cap Slider */}
        <div className="space-y-2 md:col-span-4 border-t border-white/5 pt-3">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>{lang === "en" ? "Minimum Market Cap (PKR Billion)" : "کم سے کم مارکیٹ کیپ (PKR ارب)"}</span>
            <span className="text-emerald-400 font-mono">PKR {minCap}B</span>
          </div>
          <input
            type="range"
            min="0"
            max="600"
            step="20"
            value={minCap}
            onChange={(e) => setMinCap(parseInt(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        {filteredStocks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 font-medium border-b border-white/5">
                  <th className="p-4">{lang === "en" ? "Symbol" : "علامت"}</th>
                  <th className="p-4">{lang === "en" ? "Company" : "کمپنی"}</th>
                  <th className="p-4">{lang === "en" ? "Price" : "قیمت"}</th>
                  <th className="p-4">{lang === "en" ? "P/E" : "پی/ای"}</th>
                  <th className="p-4 text-center">{lang === "en" ? "Yield" : "منافع"}</th>
                  <th className="p-4 text-right">{lang === "en" ? "Mkt Cap" : "مارکیٹ کیپ"}</th>
                  <th className="p-4 text-right">{lang === "en" ? "EPS" : "ای پی ایس"}</th>
                  <th className="p-4 text-center">{lang === "en" ? "Growth (YoY)" : "شرح نمو"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock.symbol)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-emerald-400 font-mono">{stock.symbol}</td>
                    <td className="p-4 font-medium text-white max-w-[150px] truncate">
                      {stock.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{stock.sector}</span>
                    </td>
                    <td className="p-4 text-white font-semibold font-mono">
                      PKR {stock.price.toFixed(2)}
                      <span
                        className={`block text-[10px] font-normal ${
                          stock.change >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {stock.change >= 0 ? "+" : ""}
                        {stock.changePercent}%
                      </span>
                    </td>
                    <td className="p-4 text-slate-200 font-mono">{stock.pe}x</td>
                    <td className="p-4 text-slate-200 text-center font-mono">{stock.divYield}%</td>
                    <td className="p-4 text-right text-slate-300 font-mono">PKR {stock.marketCap}B</td>
                    <td className="p-4 text-right text-slate-300 font-mono">{stock.eps}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium font-mono ${
                          stock.growth >= 0
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {stock.growth >= 0 ? "+" : ""}
                        {stock.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center text-slate-400 space-y-2">
            <Info className="h-8 w-8 mx-auto text-slate-500" />
            <p className="text-sm">
              {lang === "en"
                ? "No companies match the selected screening criteria."
                : "منتخب کردہ معیار کے مطابق کوئی کمپنی نہیں ملی۔"}
            </p>
            <p className="text-xs text-slate-500">
              {lang === "en" ? "Try loosening your filters." : "براہ کرم اپنے فلٹرز کو نرم کریں۔"}
            </p>
          </div>
        )}
      </div>

      {/* Educational Tips on Screener */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex gap-3 items-start">
        <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white">
            {lang === "en" ? "Equity Valuation Pro Tip" : "ایکویٹی ویلیوایشن پرو ٹپ"}
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {lang === "en"
              ? "For long-term value investing, prioritize companies with high YoY revenue growth, sound P/E ratios (below 10x), and robust dividend yields. For example, dividend blue-chips in Pakistan's power sector offer yields over 14%, while technological leaders trade at higher P/E premiums due to substantial scalability."
              : "طویل مدتی ویلیو انویسٹنگ کے لیے، ان کمپنیوں کو ترجیح دیں جن کی سالانہ آمدنی کی شرح نمو زیادہ، پی/ای تناسب معقول (10x سے کم)، اور منافع کی شرح مضبوط ہو۔ مثال کے طور پر، پاکستان کے پاور سیکٹر میں ڈیویڈنڈ بلیو چپس 14 فیصد سے زیادہ منافع پیش کرتے ہیں۔"}
          </p>
        </div>
      </div>
    </div>
  );
}
