import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Database,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  Coins,
  Check,
  Zap,
  Moon,
  Sun,
  BarChart3,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCode2,
  Copy,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

import {
  modelMetricsData,
  featureImportancesData,
  behavioralComparisonsData,
  rocCurveData,
  channelDistributionData,
  caseStudiesData,
  summaryStats,
} from './data/edaData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'eda' | 'features' | 'models' | 'cases' | 'submission'>('overview');
  const [featureCategory, setFeatureCategory] = useState<string>('All');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync dark class on root html
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const categories = ['All', 'Cash Activity', 'Bank Transfers', 'Card Volume', 'Temporal & Velocity', 'Trigger Signatures', 'Amount Extremes'];

  const filteredFeatures = featureCategory === 'All' 
    ? featureImportancesData.slice(0, 15)
    : featureImportancesData.filter(f => f.category === featureCategory).slice(0, 15);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('python3 verify_submission.py');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Ambient Glows (iNazorat Signature) */}
      <div className="fixed top-0 right-1/4 w-[600px] h-[600px] bg-[#20c997]/10 dark:bg-[#20c997]/12 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[500px] h-[500px] bg-blue-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Banner - Frosted Glass Ribbon */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20c997] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20c997]"></span>
          </span>
          <span className="font-bold text-slate-800 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
            WIUT Hackathon 2026 · FinTech & AI in Finance
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline text-[11px]">
            Elimination Task: AML Alert Prioritization
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold">
            Team: {summaryStats.teamName} ({summaryStats.teamId})
          </span>
          
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-slate-300 transition-all active:scale-95 border border-slate-200 dark:border-transparent"
            title={isDark ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Main Glass Header & Cockpit Navigation */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#0b0f19]/80 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#20c997] to-teal-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#20c997]/25 text-white">
              <ShieldAlert className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  gitcore AML Engine
                </h1>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                  ROC-AUC 0.6246
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Machine Learning-Driven Alert Prioritization for Uzbekistan Financial Monitoring
              </p>
            </div>
          </div>

          {/* Segmented Glass Tabs (iNazorat Signature) */}
          <nav className="flex items-center gap-1 bg-slate-100/80 dark:bg-white/5 backdrop-blur-sm p-1 rounded-2xl border border-slate-200/80 dark:border-white/10 overflow-x-auto custom-scrollbar">
            {[
              { id: 'overview', label: 'Umumiy Xulosa', icon: Sparkles },
              { id: 'eda', label: 'Tranzaksiya Xulqi & EDA', icon: Database },
              { id: 'features', label: '226 AML Xususiyatlari', icon: Layers },
              { id: 'models', label: 'Model ROC-AUC', icon: Cpu },
              { id: 'cases', label: 'Tergov Simulyatori', icon: AlertTriangle },
              { id: 'submission', label: 'Submission Check', icon: Award },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-[#20c997] shadow-sm border border-slate-200 dark:border-transparent'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/40 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#20c997]' : 'text-slate-400'}`} strokeWidth={1.8} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">

        {/* ---------------- SECTION 1: OVERVIEW ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid (Frosted Glass) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="relative overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-5 transition-all hover:-translate-y-0.5 duration-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Jami Signallar</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-mono">20,000</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">14,000 Train + 6,000 Hidden Test</p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Tranzaksiyalar:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">10,015,238</span>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-5 transition-all hover:-translate-y-0.5 duration-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Tarixiy Eskalatsiya</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">17.18%</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">2,405 Tasdiqlangan / 11,595 Yopilgan</p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Imbalance Nisbati:</span>
                  <span className="font-bold text-rose-500">~1 : 4.8</span>
                </div>
              </div>

              <div className="relative overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-5 transition-all hover:-translate-y-0.5 duration-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AML Xususiyatlari</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{summaryStats.engineeredFeatures}</div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Zero-leakage temporal xususiyatlar</p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Vaqt oynalari:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">24h - 60 kun</span>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-white/80 to-teal-50/90 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-teal-950/40 backdrop-blur-2xl rounded-[20px] border-2 border-emerald-300 dark:border-emerald-500/30 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-5 transition-all hover:-translate-y-0.5 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Final Ensemble AUC</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                  {modelMetricsData.ensembleAUC.toFixed(5)}
                </div>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                  +0.0219 baseline ustunligi
                </p>
                <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-mono">
                  <span>Ensemble:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">XGB + CAT + LGB Rank</span>
                </div>
              </div>
            </div>

            {/* Problem Statement & Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6 space-y-4">
                <div className="flex items-center gap-2.5 text-[#20c997]">
                  <Zap className="w-5 h-5" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Muammo Qo'yilishi & FinTech Mazmuni
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  O'zbekiston tijorat banklari va to'lov tizimlaridagi avtomatlashtirilgan monitoring qoidalari (rule engines) har kuni minglab ogohlantirish signallarini generatsiya qiladi. Biroq 2025–2026 yillardagi haqiqiy ma'lumotlar shuni ko'rsatadiki, signallarning <strong>82.8% dan ortig'i soxta ogohlantirish (false positive)</strong> bo'lib, mutaxassislar vaqtini noo'rin band etadi.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-emerald-700 dark:text-[#20c997]">gitcore</strong> jamoasi ishlab chiqqan machine learning modeli har bir signalning eskalatsiya qilinish ehtimolligini aniq baholab, monitoring xodimlariga signallarni xavf darajasiga ko'ra avtomatik tartiblab beradi.
                </p>

                {/* 3 Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1. Anti-Leakage</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">Qat'iy Tarixiy Kesim</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                      Barcha parametrlar faqat signal sanasigacha bo'lgan tranzaksiyalardan olindi.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">2. Real CV</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">5-Fold Stratified K-Fold</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                      2 yillik muddatdagi tasodifiy namunalar taqsimoti test to'plamiga 100% mos.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 rounded-xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">3. Tri-Model Ensemble</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-1 block">Weighted Rank Blending</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                      XGBoost (65%) + CatBoost (32%) + LightGBM (3%) sinergiyasi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hackathon Deliverables Status Card */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Hakaton Topshiriqlari
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Barcha 3 ta majburiy talab to'liq bajarildi:
                  </p>

                  <ul className="mt-4 space-y-3.5 text-xs">
                    <li className="flex items-start gap-3">
                      <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">team_98F12CFB.csv</span>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          6,000 ta bashorat, qat'iy tekshiruvdan o'tgan.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">final_model.ipynb</span>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          415KB reproducible Jupyter noutbuk.
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">iNazorat Glassy UI</span>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Platforma ichiga to'liq integratsiya qilingan.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Asosiy Model:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">XGBoost + CatBoost</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 2: EDA & BEHAVIOR ---------------- */}
        {activeTab === 'eda' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Eskalatsiya Qilingan (1) vs Rad Etilgan (0) Signallar Tahlili
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    14,000 ta signal bo'yicha pul yuvish (money laundering) alomatlarining statistik farqlari:
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Eskalatsiya (1)
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600 dark:text-blue-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Rad etilgan (0)
                  </span>
                </div>
              </div>

              {/* Behavioral Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">AML Indikatori Nomi</th>
                      <th className="py-3 px-4 text-blue-500">Rad Etilgan (0)</th>
                      <th className="py-3 px-4 text-rose-500">Eskalatsiya (1)</th>
                      <th className="py-3 px-4">Tafovut (Ratio)</th>
                      <th className="py-3 px-4">Mantiqiy Izoh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                    {behavioralComparisonsData.map(item => (
                      <tr key={item.key} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                        <td className="py-3 px-4 font-sans font-medium text-slate-800 dark:text-slate-200">{item.label}</td>
                        <td className="py-3 px-4 text-blue-600 dark:text-blue-400">{item.dismissed}</td>
                        <td className="py-3 px-4 text-rose-600 dark:text-rose-400 font-bold">{item.escalated}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.ratio > 1.25 ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                            item.ratio < 0.85 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                            'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                          }`}>
                            {item.ratio > 1 ? `+${item.ratio}x` : `${item.ratio}x`}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-sans text-xs text-slate-500 dark:text-slate-400">
                          {item.key === 'amount_min' && 'Hisob muzlatilishidan oldingi katta salbiy chiqim spayki'}
                          {item.key === 'naqd_sum' && 'Yuqori jismoniy naqd pul chiqarish intensivligi'}
                          {item.key === 'burst_ratio_15m' && 'Limitlardan qochish uchun 15 daqiqalik bo‘lib o‘tkazishlar (smurfing)'}
                          {item.key === 'last1_is_chiqim' && '75.1% signallarda tetiklovchi oxirgi amaliyot chiqim bo‘lgan'}
                          {item.key === 'flow_pass_through_ratio' && 'Tranzit (mule) hisob: pul tushishi bilanoq darhol tarqatilgan'}
                          {item.key === 'chiqim_ratio_3d' && 'Signal sanasidan oldingi 72 soatda chiqimlar tezlashuvi'}
                          {!['amount_min', 'naqd_sum', 'burst_ratio_15m', 'last1_is_chiqim', 'flow_pass_through_ratio', 'chiqim_ratio_3d'].includes(item.key) && 'Statistik operatsion me’yor farqi'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Oxirgi 24 Soatdagi Amaliyotlar Spayki
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  O'rtacha 500 ta tranzaksiyadan 40+ tasi aynan signal hosil bo'lishidan oldingi 24 soat ichida jamlanadi:
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { window: '180d - 30d', normal: 380, alert: 0 },
                        { window: '30d - 7d', normal: 60, alert: 0 },
                        { window: '7d - 3d', normal: 15, alert: 0 },
                        { window: 'Oxirgi 24 soat', normal: 0, alert: 41 },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                      <XAxis dataKey="window" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Bar dataKey="normal" fill="#3b82f6" name="Tarixiy fon" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="alert" fill="#ef4444" name="Tetiklovchi 24h spayk" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  To'lov Kanallari bo'yicha Xavf Taqsimoti
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  10 million tranzaksiya ichida to'lov kanallarining ulushi va xavf darajalari:
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={11} unit="%" />
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Bar dataKey="percentage" fill="#20c997" radius={[4, 4, 0, 0]} name="Ulush %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 3: FEATURES ---------------- */}
        {activeTab === 'features' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Eng Muhim 25 ta AML Xususiyati (Feature Importance)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    XGBoost, CatBoost va LightGBM modellarining o'rtacha ta'sir kuchi:
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFeatureCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                        featureCategory === cat
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Horizontal Bar Chart */}
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={filteredFeatures}
                    margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={11} unit="%" />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={135} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Ahamiyati']}
                      contentStyle={{ borderRadius: '12px' }}
                    />
                    <Bar dataKey="importance" fill="#20c997" radius={[0, 4, 4, 0]}>
                      {filteredFeatures.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.category === 'Cash Activity' ? '#f59e0b' :
                            entry.category === 'Bank Transfers' ? '#8b5cf6' :
                            entry.category === 'Temporal & Velocity' ? '#ef4444' :
                            entry.category === 'Trigger Signatures' ? '#ec4899' :
                            '#20c997'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 4: MODELS & ROC-AUC ---------------- */}
        {activeTab === 'models' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Out-of-Fold ROC Egri Chiziqlari
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Barcha modellar bo'yicha ROC-AUC ko'rsatkichlari:
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    Ensemble AUC: {modelMetricsData.ensembleAUC.toFixed(5)}
                  </span>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rocCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                      <XAxis dataKey="fpr" stroke="#64748b" fontSize={11} domain={[0, 1]} />
                      <YAxis stroke="#64748b" fontSize={11} domain={[0, 1]} />
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="4 4" name="Tasodifiy (0.500)" dot={false} />
                      <Line type="monotone" dataKey="tpr_lgb" stroke="#10b981" name={`LightGBM (${modelMetricsData.lightgbmAUC.toFixed(4)})`} dot={false} strokeWidth={1.5} />
                      <Line type="monotone" dataKey="tpr_cat" stroke="#f59e0b" name={`CatBoost (${modelMetricsData.catboostAUC.toFixed(4)})`} dot={false} strokeWidth={1.5} />
                      <Line type="monotone" dataKey="tpr_xgb" stroke="#8b5cf6" name={`XGBoost (${modelMetricsData.xgboostAUC.toFixed(4)})`} dot={false} strokeWidth={1.8} />
                      <Line type="monotone" dataKey="tpr_ensemble" stroke="#ef4444" name={`★ gitcore Ensemble (${modelMetricsData.ensembleAUC.toFixed(4)})`} dot={false} strokeWidth={2.8} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Arxitektura Taqqoslanishi
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">5-Fold OOF natijalari:</p>

                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-between border border-slate-200/80 dark:border-transparent">
                      <div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Baseline Model</span>
                        <p className="text-[10px] text-slate-400">47 ta boshlang'ich feature</p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-slate-500">0.60268</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-between border border-slate-200/80 dark:border-transparent">
                      <div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">LightGBM</span>
                        <p className="text-[10px] text-slate-400">Leaf-wise GBDT</p>
                      </div>
                      <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{modelMetricsData.lightgbmAUC.toFixed(5)}</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-between border border-slate-200/80 dark:border-transparent">
                      <div>
                        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">CatBoost</span>
                        <p className="text-[10px] text-slate-400">Oblivious trees</p>
                      </div>
                      <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">{modelMetricsData.catboostAUC.toFixed(5)}</span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-between border border-slate-200/80 dark:border-transparent">
                      <div>
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">XGBoost (Hist)</span>
                        <p className="text-[10px] text-slate-400">Exact depth regularization</p>
                      </div>
                      <span className="font-mono text-sm font-bold text-purple-600 dark:text-purple-400">{modelMetricsData.xgboostAUC.toFixed(5)}</span>
                    </div>

                    <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#20c997]" />
                          Weighted Rank Ensemble
                        </span>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">65% XGB + 32% CAT + 3% LGB</p>
                      </div>
                      <span className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {modelMetricsData.ensembleAUC.toFixed(5)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 text-xs text-slate-400 flex items-center justify-between">
                  <span>O'qitish vaqti:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{modelMetricsData.executionTimeSec} soniya</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 5: CASE STUDIES ---------------- */}
        {activeTab === 'cases' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                AML Compliance Tergov Simulyatori
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Model qanday qilib yuqori va past xavfli signallarni ajratishini ko'rsatuvchi real misollar:
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {caseStudiesData.map((cs) => (
                  <div
                    key={cs.id}
                    className={`rounded-[20px] p-6 flex flex-col justify-between border-2 transition-all ${
                      cs.status === 'ESCALATE'
                        ? 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30'
                        : 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] text-slate-400 font-mono">Signal ID</span>
                          <h4 className="text-xl font-mono font-bold text-slate-900 dark:text-white">{cs.id}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-slate-400">Eskalatsiya Ehtimolligi</span>
                          <div className={`text-2xl font-mono font-extrabold ${
                            cs.status === 'ESCALATE' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {cs.probability}%
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-white/10 border border-slate-200/80 dark:border-transparent">
                        <span className={`w-2 h-2 rounded-full ${cs.status === 'ESCALATE' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                        <span className={cs.status === 'ESCALATE' ? 'text-rose-600 dark:text-rose-300' : 'text-emerald-600 dark:text-emerald-300'}>
                          Qaror: {cs.status}
                        </span>
                      </div>

                      <p className="mt-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-black/20 border border-slate-200/60 dark:border-white/5 rounded-xl p-3.5">
                        {cs.reason}
                      </p>

                      <div className="mt-4 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Asosiy Xavf Ko'rsatkichlari:</span>
                        {cs.indicators.map((ind, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/60 dark:border-white/5">
                            <span className="text-slate-600 dark:text-slate-300">{ind.name}</span>
                            <span className={`font-mono font-bold ${
                              ind.severity === 'critical' ? 'text-rose-600 dark:text-rose-400' :
                              ind.severity === 'high' ? 'text-amber-600 dark:text-amber-400' :
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {ind.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Xavf Tasnifi:</span>
                      <span className={`font-bold ${cs.status === 'ESCALATE' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {cs.classification}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 6: SUBMISSION ---------------- */}
        {activeTab === 'submission' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl rounded-[20px] border-2 border-[#f1f2f4] dark:border-transparent shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Rasmiy Topshiriq Validatsiyasi (Submission Check)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    WIUT Hackathon 2026 qoidalari bo'yicha barcha talablar to'liq tekshirildi:
                  </p>
                </div>
              </div>

              {/* 6-Grid Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Fayl Nomi</span>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2 text-base font-mono font-bold text-slate-900 dark:text-white">team_98F12CFB.csv</div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Jamoa ID kodi bilan nomlandi.</p>
                </div>

                <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Qatorlar Soni</span>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2 text-base font-mono font-bold text-slate-900 dark:text-white">Aniq 6,000 qator</div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">test_signals.csv bilan 1:1 mos.</p>
                </div>

                <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Ustun Sarlavhalari</span>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2 text-base font-mono font-bold text-slate-900 dark:text-white">signal_id,ehtimollik</div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Qo'shimcha indekssiz toza CSV.</p>
                </div>

                <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Ehtimollik Chegarasi</span>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2 text-base font-mono font-bold text-slate-900 dark:text-white">[0.00021, 0.99936]</div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Qat'iy [0.0, 1.0] oralig'ida.</p>
                </div>

                <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Bo'sh Qiymatlar (NaN)</span>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2 text-base font-mono font-bold text-slate-900 dark:text-white">0 ta NaN / 0 ta Null</div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">100% toza ma'lumot yaxlitligi.</p>
                </div>

                <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Jupyter Noutbuk</span>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="mt-2 text-base font-mono font-bold text-slate-900 dark:text-white">final_model.ipynb</div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">415KB to'liq grafiklari bilan.</p>
                </div>
              </div>

              {/* Sample Output Card */}
              <div className="mt-8 bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                  <span>team_98F12CFB.csv (boshlang'ich 5 qator):</span>
                  <button
                    onClick={handleCopyCommand}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "Nusxalandi!" : "Tekshiruv kodi"}</span>
                  </button>
                </div>
                <div className="pt-3 space-y-1 text-slate-300">
                  <div className="text-slate-500">signal_id,ehtimollik</div>
                  <div>SG_000001,0.330856</div>
                  <div>SG_000007,0.650678</div>
                  <div>SG_000009,0.110361</div>
                  <div>SG_000010,0.094639</div>
                  <div>SG_000011,0.276664</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Glassy Footer */}
      <footer className="border-t border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-[#080d19]/80 backdrop-blur-xl py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold text-slate-900 dark:text-white">gitcore</span>
            <span>•</span>
            <span>WIUT Hackathon 2026</span>
            <span>•</span>
            <span>FinTech & AI in Finance</span>
          </div>
          <div className="font-mono text-xs">
            Model ROC-AUC: <span className="font-bold text-emerald-600 dark:text-emerald-400">{modelMetricsData.ensembleAUC.toFixed(5)}</span> • Team ID: {summaryStats.teamId}
          </div>
        </div>
      </footer>
    </div>
  );
}
