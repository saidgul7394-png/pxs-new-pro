import React, { useState, useEffect, useRef } from "react";
import { Stock, ChatMessage, AIAnalysisResult } from "../types";
import { Sparkles, Brain, AlertCircle, Send, HelpCircle, Loader2, RefreshCw } from "lucide-react";

interface AIAnalysisProps {
  stocks: Stock[];
  selectedSymbol: string;
  lang: "en" | "ur";
  onSelectStock: (symbol: string) => void;
}

export default function AIAnalysis({ stocks, selectedSymbol, lang, onSelectStock }: AIAnalysisProps) {
  const [currentSymbol, setCurrentSymbol] = useState<string>(selectedSymbol || "SYS");
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "assistant",
      text: lang === "en" 
        ? "Assalam-o-Alaikum! I am your PSX Vision Pro AI assistant. Ask me anything about stock terms, dividends, technical charts, or specific Pakistani shares."
        : "السلام علیکم! میں آپ کا پی ایس ایکس ویژن پرو اے آئی مشیر ہوں۔ اسٹاک کی اصطلاحات، منافع، یا مخصوص کمپنیوں کے بارے میں کچھ بھی پوچھیں۔",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [sendingChat, setSendingChat] = useState<boolean>(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedSymbol) {
      setCurrentSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch AI Analysis
  const fetchAnalysis = async (symbolToFetch: string) => {
    setLoadingAnalysis(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: symbolToFetch }),
      });
      if (!res.ok) throw new Error("Failed to load Gemini analysis");
      const data: AIAnalysisResult = await res.json();
      setAnalysis(data);
    } catch (e: any) {
      console.error(e);
      setAnalysisError(e.message || "An error occurred");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(currentSymbol);
  }, [currentSymbol]);

  // Send Chat Message
  const handleSendChat = async (textToSend: string) => {
    if (!textToSend.trim() || sendingChat) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setSendingChat(true);

    try {
      const chatPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatPayload }),
      });

      if (!res.ok) throw new Error("Chat assistant response failed");
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e: any) {
      console.error(e);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: lang === "en"
          ? "I am currently running in offline-cached mode. I'd be happy to explain concepts like P/E, EPS, or RSI! Try clicking one of the sample prompt chips below."
          : "میں اس وقت آف لائن موڈ میں کام کر رہا ہوں۔ میں پی/ای، ای پی ایس، یا آر ایس آئی جیسے تصورات کی وضاحت کر سکتا ہوں! نیچے موجود معلوماتی چپس پر کلک کریں۔",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSendingChat(false);
    }
  };

  const quickQuestions = [
    lang === "en" ? "What is P/E Ratio?" : "پی/ای تناسب کیا ہے؟",
    lang === "en" ? "Explain KSE-100" : "کے ایس ای-100 کی وضاحت کریں",
    lang === "en" ? "Best dividend stocks?" : "بہترین منافع والے اسٹاکس؟",
    lang === "en" ? "Explain RSI indicator" : "آر ایس آئی کی وضاحت کریں"
  ];

  return (
    <div id="ai-analysis-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Stock Intelligence Report */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              {lang === "en" ? "Gemini AI Equity Analyzer" : "جیمنی اے آئی ایکویٹی تجزیہ کار"}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === "en"
                ? "Deep-dive fundamental & technical intelligence generated on-the-fly"
                : "برائے راست تیار کردہ تفصیلی بنیادی اور تکنیکی ڈیٹا رپورٹ"}
            </p>
          </div>

          {/* Quick Select dropdown */}
          <select
            value={currentSymbol}
            onChange={(e) => {
              setCurrentSymbol(e.target.value);
              onSelectStock(e.target.value);
            }}
            className="bg-slate-900/60 border border-slate-700/50 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
          >
            {stocks.map((s) => (
              <option key={s.symbol} value={s.symbol} className="bg-slate-950 font-mono">
                {s.symbol} - {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Intelligence Report Card */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-900/10 to-indigo-900/10 border border-purple-500/20 backdrop-blur-md space-y-6">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-purple-500/15 text-purple-300 rounded-full text-[10px] font-bold border border-purple-500/30">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Gemini 3.5 Flash
          </div>

          {loadingAnalysis ? (
            <div className="h-80 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
              <p className="text-xs text-slate-400 animate-pulse">
                {lang === "en" ? "Running advanced machine-learning audits..." : "جدید مشین لرننگ آڈٹ چلائے جا رہے ہیں..."}
              </p>
            </div>
          ) : analysisError || !analysis ? (
            <div className="h-80 flex flex-col items-center justify-center space-y-3 text-center">
              <AlertCircle className="h-8 w-8 text-rose-400" />
              <p className="text-xs text-rose-400">
                {lang === "en" ? "Failed to synchronize Gemini intelligence." : "جیمنی انٹیلیجنس کو سنکرونائز کرنے میں ناکامی۔"}
              </p>
              <button
                onClick={() => fetchAnalysis(currentSymbol)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/10 flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {lang === "en" ? "Retry" : "دوبارہ کوشش"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Core suggestion metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recommendation */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    {lang === "en" ? "AI Recommendation" : "اے آئی تجویز"}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`text-2xl font-black font-mono ${
                        analysis.suggestion === "BUY"
                          ? "text-emerald-400"
                          : analysis.suggestion === "SELL"
                          ? "text-rose-400"
                          : "text-amber-400"
                      }`}
                    >
                      {analysis.suggestion}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-slate-300 border border-white/10 font-mono">
                      {currentSymbol}
                    </span>
                  </div>
                </div>

                {/* Risk Score */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    {lang === "en" ? "Risk Score Gauge" : "خطرے کا انڈیکس"}
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-white font-mono">{analysis.riskScore}</span>
                    <span className="text-slate-500 text-sm">/ 100</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto ${
                        analysis.riskCategory === "Low"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : analysis.riskCategory === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {analysis.riskCategory}
                    </span>
                  </div>
                </div>

                {/* News sentiment */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    {lang === "en" ? "News Sentiment" : "خبروں کے اثرات"}
                  </span>
                  <div className="mt-1 block text-sm font-semibold text-emerald-400 truncate">
                    {analysis.sentimentAnalysis}
                  </div>
                </div>
              </div>

              {/* Summaries blocks */}
              <div className="space-y-4">
                {/* Technical report */}
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">
                    {lang === "en" ? "Technical Indicators Summary" : "تکنیکی اشاریوں کا خلاصہ"}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-white/5">
                    {analysis.technicalSummary}
                  </p>
                </div>

                {/* Fundamental report */}
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">
                    {lang === "en" ? "Fundamental Valuation Summary" : "بنیادی مالیت کا خلاصہ"}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-white/5">
                    {analysis.fundamentalSummary}
                  </p>
                </div>

                {/* AI forecast range */}
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">
                    {lang === "en" ? "AI Predictive Projections" : "اے آئی کی پیشن گوئی کا دائرہ"}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-white/5 font-mono">
                    {analysis.prediction}
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 text-[10px] text-rose-300 leading-relaxed">
                <strong>{lang === "en" ? "Investment Warning: " : "سرمایہ کاری کا انتباہ: "}</strong>
                {lang === "en"
                  ? "AI metrics are based on mathematical models and should be evaluated alongside independent due diligence."
                  : "اے آئی میٹرکس ریاضیاتی ماڈلز پر مبنی ہیں اور ان کا جائزہ آزادانہ تحقیق کے ساتھ لیا جانا چاہئے۔"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Advisor Chat */}
      <div className="lg:col-span-5 flex flex-col h-[520px] bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
        {/* Chat Header */}
        <div className="p-4 bg-slate-950/40 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
            <div>
              <h3 className="text-xs font-bold text-white">
                {lang === "en" ? "PSX Vision Pro Chat Advisor" : "پی ایس ایکس ویژن چیٹ ایڈوائزر"}
              </h3>
              <p className="text-[10px] text-slate-400">
                {lang === "en" ? "Ask questions & explain terms" : "سوالات پوچھیں اور اصطلاحات سمجھیں"}
              </p>
            </div>
          </div>
        </div>

        {/* Chat message logs */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-none">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] ${m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-slate-950/80 text-slate-200 border border-white/5 rounded-tl-none"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[8px] text-slate-500 mt-1 font-mono">{m.timestamp}</span>
            </div>
          ))}

          {sendingChat && (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono italic">
              <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
              {lang === "en" ? "Gemini Advisor is typing..." : "جیمنی مشیر لکھ رہا ہے..."}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/20 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendChat(q)}
              className="px-2.5 py-1 bg-slate-950/60 text-[10px] text-purple-300 font-medium rounded-full border border-purple-500/20 hover:border-purple-500/40 transition-all whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Controls */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendChat(inputMessage);
          }}
          className="p-3 bg-slate-950/40 border-t border-white/5 flex gap-2"
        >
          <input
            type="text"
            placeholder={lang === "en" ? "Ask a financial question..." : "مالیاتی سوال پوچھیں..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={sendingChat}
            className="flex-1 bg-slate-900 border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={sendingChat || !inputMessage.trim()}
            className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
