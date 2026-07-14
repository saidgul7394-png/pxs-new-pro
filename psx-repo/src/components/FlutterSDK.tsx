import React, { useState } from "react";
import { 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Globe, 
  Cpu, 
  Database, 
  Flame,
  Search,
  Code
} from "lucide-react";
import { FLUTTER_CODEBASE, FlutterCodeFile } from "../data/flutterCodebase";

interface FlutterSDKProps {
  lang: "en" | "ur";
}

export default function FlutterSDK({ lang }: FlutterSDKProps) {
  const [selectedFile, setSelectedFile] = useState<FlutterCodeFile>(FLUTTER_CODEBASE[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = FLUTTER_CODEBASE.filter(f => {
    const matchesSearch = f.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || f.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "core": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "feature-auth": return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "feature-stocks": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "config": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  return (
    <div id="flutter-sdk-root" className="space-y-6">
      {/* Premium Architecture Header Banner */}
      <div id="sdk-banner" className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/20 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Layers className="h-40 w-40 text-indigo-400" />
        </div>
        <div className="space-y-3 z-10 max-w-3xl">
          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold border border-indigo-500/20 uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            Clean Architecture SDK Upgrade
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {lang === "en" ? "Production-Ready Flutter Architecture Blueprint" : "پروڈکشن کے لیے تیار فلٹر آرکیٹیکچر کا خاکہ"}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === "en" 
              ? "We have refactored the PSX Vision Pro codebase into a modular, testable, and robust Clean Architecture framework. This workspace implements Riverpod State Management, SQLite offline database caching, Firebase Authentication, secure JWT handshakes, and dual English/Urdu translations."
              : "ہم نے پی ایس ایکس ویژن پرو کوڈ بیس کو صاف آرکیٹیکچر میں تبدیل کر دیا ہے۔ اس میں رور پوڈ اسٹیٹ مینجمنٹ، آف لائن کیشنگ اور دو لسانی ترجمہ شامل ہے۔"}
          </p>
        </div>
      </div>

      {/* High-Level Tech Spec Bento Grid */}
      <div id="sdk-tech-specs" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Clean MVVM</h4>
            <p className="text-[10px] text-slate-400 mt-1">Separation of concerns: UI, ViewModels, Domain and Data Layer models.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">SQLite Offline</h4>
            <p className="text-[10px] text-slate-400 mt-1">Sqflite cache stores stock tickers locally with offline fallback support.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure JWT Auth</h4>
            <p className="text-[10px] text-slate-400 mt-1">Firebase core auth coupled with robust secure keychain token caching.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex items-start gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Urdu / Eng</h4>
            <p className="text-[10px] text-slate-400 mt-1">Dynamic MaterialApp locale delegates matching the active language setting.</p>
          </div>
        </div>
      </div>

      {/* Main Interactive File Explorer and Code Editor */}
      <div id="sdk-workspace-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: File Tree and categorization */}
        <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 rounded-3xl p-5 space-y-4 flex flex-col max-h-[640px]">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Folder className="h-4 w-4 text-indigo-400" />
              <span>{lang === "en" ? "Codebase Explorer" : "کوڈ بیس مینیجر"}</span>
            </h3>

            {/* Quick search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search source files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
              {(["ALL", "core", "feature-auth", "feature-stocks", "config"] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat === "ALL" ? "All Files" : cat.toUpperCase().replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive File List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected 
                      ? "bg-indigo-950/40 border-indigo-500/30 text-white" 
                      : "bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-900/60 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`h-4 w-4 flex-shrink-0 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                    <span className="text-xs font-mono truncate">{file.path}</span>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold ${getCategoryColor(file.category)}`}>
                    {file.category.replace("-", " ")}
                  </span>
                </div>
              );
            })}
            {filteredFiles.length === 0 && (
              <p className="text-xs text-slate-500 py-10 text-center">No source files match the filter.</p>
            )}
          </div>
        </div>

        {/* Right column: Source code viewport with copy/download */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-white/5 rounded-3xl overflow-hidden flex flex-col max-h-[640px]">
          {/* Editor Header Status */}
          <div className="bg-slate-900/60 p-4 border-b border-white/5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold block">Current View</span>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-mono text-white font-bold">{selectedFile.path}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/api/download-sdk"
                download="psx_vision_pro_flutter.zip"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/10 decoration-none"
              >
                <Download className="h-3.5 w-3.5" />
                Download Complete ZIP
              </a>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Source Code Content Box */}
          <div className="flex-1 overflow-auto p-5 bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed max-h-[480px]">
            <pre className="whitespace-pre scrollbar-thin">
              <code>{selectedFile.content}</code>
            </pre>
          </div>

          {/* Information banner for architecture verification */}
          <div className="bg-slate-900/40 p-4 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Fully compliant with Flutter null safety limits and Material 3 guidelines.
            </span>
            <span className="font-mono text-slate-500 text-[9px]">
              Type: {selectedFile.language.toUpperCase()} • {selectedFile.content.split('\n').length} lines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
