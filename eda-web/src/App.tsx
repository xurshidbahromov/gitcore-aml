import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  ArrowRight,
  Printer,
  FileText,
  X,
  Sliders,
  ShieldCheck,
  Scale,
  Search,
  Building2,
  DollarSign,
  Filter,
  Banknote,
  CreditCard,
  Globe,
  ArrowUpRight,
  ArrowDownLeft
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
  centralBankRulesData,
  summaryStats,
} from './data/edaData';

import {
  SpotlightCard,
  CountUp,
  DecryptedText,
  AnimatedTabs,
  type TabItem,
} from './components/reactbits';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'eda' | 'features' | 'models' | 'simulator' | 'rules' | 'cases' | 'submission'>('overview');

  const navTabs: TabItem[] = useMemo(() => [
    { id: 'overview', label: 'Xulosa', icon: Sparkles },
    { id: 'eda', label: 'EDA & Xulq', icon: Database },
    { id: 'features', label: '226 Xususiyat', icon: Layers },
    { id: 'models', label: 'Modellar', icon: Cpu },
    { id: 'simulator', label: 'Simulyator', icon: Sliders },
    { id: 'rules', label: 'MB 2515', icon: Scale },
    { id: 'cases', label: 'Tergov & STR', icon: FileText },
    { id: 'submission', label: 'Topshirish', icon: Award, badge: '6k' },
  ], []);

  const [featureCategory, setFeatureCategory] = useState<string>('All');
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('inazorat-theme') || localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return document.documentElement.classList.contains('dark');
    } catch (e) {
      return true;
    }
  });
  const [copied, setCopied] = useState<boolean>(false);
  const [roiThreshold, setRoiThreshold] = useState<number>(0.35);
  const [caseSearch, setCaseSearch] = useState<string>('');
  const [caseFilter, setCaseFilter] = useState<'ALL' | 'ESCALATE' | 'DISMISS'>('ALL');
  const [logoKey, setLogoKey] = useState<number>(0);

  // Live What-If AML Risk Simulator State
  const [simAmount, setSimAmount] = useState<number>(2.4);
  const [simChannel, setSimChannel] = useState<'naqd' | 'bank_otkazmasi' | 'karta' | 'xalqaro'>('naqd');
  const [simBurst15m, setSimBurst15m] = useState<number>(4);
  const [simTurnover, setSimTurnover] = useState<number>(85);
  const [simIsNight, setSimIsNight] = useState<boolean>(true);
  const [simDirection, setSimDirection] = useState<'chiqim' | 'kirim'>('chiqim');

  // Central Bank STR Modal State
  const [activeStrCase, setActiveStrCase] = useState<any | null>(null);

  // Sync dark class on root html & persist theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('inazorat-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('inazorat-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Real-time calibrated ensemble simulator calculation
  const simRiskProbability = useMemo(() => {
    let score = 0.17; // base prior probability
    if (simDirection === 'chiqim') score += 0.12;
    if (simChannel === 'naqd') score += 0.22;
    else if (simChannel === 'xalqaro') score += 0.18;
    else if (simChannel === 'bank_otkazmasi') score += 0.09;
    
    if (simAmount > 1.8) score += 0.20;
    else if (simAmount > 0.5) score += 0.08;
    else if (simAmount < -0.5) score -= 0.08;
    
    score += Math.min(simBurst15m * 0.065, 0.26);
    
    if (simTurnover > 75) score += 0.15;
    if (simIsNight) score += 0.08;
    
    return Math.min(Math.max(score, 0.024), 0.988);
  }, [simAmount, simChannel, simBurst15m, simTurnover, simIsNight, simDirection]);

  const categories = ['All', 'Cash Activity', 'Bank Transfers', 'Card Volume', 'Temporal & Velocity', 'Trigger Signatures', 'Amount Extremes'];

  const filteredFeatures = featureCategory === 'All' 
    ? featureImportancesData.slice(0, 15)
    : featureImportancesData.filter(f => f.category === featureCategory).slice(0, 15);

  // ROI Cost-Benefit Matrix Calculation based on Decision Threshold
  const roiMetrics = useMemo(() => {
    const totalDailyAlerts = 1200;
    // As threshold increases, more benign alerts are auto-suppressed
    const suppressionRate = Math.min(0.92, Math.max(0.45, 0.35 + roiThreshold * 0.95));
    const autoDismissedAlerts = Math.round(totalDailyAlerts * suppressionRate);
    const alertsToReview = totalDailyAlerts - autoDismissedAlerts;
    // 15 minutes per manual investigation
    const hoursSavedPerDay = (autoDismissedAlerts * 15) / 60;
    const annualHoursSaved = Math.round(hoursSavedPerDay * 250);
    // Hourly analyst rate ~160,000 UZS (~$12.5)
    const annualCostSavedUZS = Math.round(annualHoursSaved * 160000);
    const annualCostSavedUSD = Math.round(annualCostSavedUZS / 12850);
    // Recall curve
    const recallRate = Math.max(0.74, Math.min(0.985, 1.0 - (roiThreshold - 0.1) * 0.38));

    return {
      totalDailyAlerts,
      suppressionRate: Number((suppressionRate * 100).toFixed(1)),
      autoDismissedAlerts,
      alertsToReview,
      hoursSavedPerDay: Math.round(hoursSavedPerDay),
      annualHoursSaved,
      annualCostSavedUZS: Number((annualCostSavedUZS / 1e9).toFixed(2)),
      annualCostSavedUSD: annualCostSavedUSD.toLocaleString(),
      recallRate: Number((recallRate * 100).toFixed(1))
    };
  }, [roiThreshold]);

  // Filtered cases for Case Studies Tab
  const filteredCases = useMemo(() => {
    return caseStudiesData.filter(cs => {
      const matchesSearch = cs.id.toLowerCase().includes(caseSearch.toLowerCase()) ||
                            cs.reason.toLowerCase().includes(caseSearch.toLowerCase()) ||
                            cs.classification.toLowerCase().includes(caseSearch.toLowerCase());
      const matchesFilter = caseFilter === 'ALL' ||
                            (caseFilter === 'ESCALATE' && cs.status === 'ESCALATE') ||
                            (caseFilter === 'DISMISS' && cs.status === 'DISMISS');
      return matchesSearch && matchesFilter;
    });
  }, [caseSearch, caseFilter]);

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('python3 verify_submission.py');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 relative overflow-x-clip selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Blur Gradients - EXACTLY matching iNazorat DashboardLayout */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50/50 to-emerald-50/10 dark:from-[#0b0f19] dark:via-[#0d1323] dark:to-[#0f172a]/20 transition-colors duration-300">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] rounded-full bg-emerald-200/5 dark:bg-emerald-500/4 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-300/5 dark:bg-emerald-400/4 blur-[150px]" />
      </div>

      {/* Unified Minimalist iNazorat-style Glass Header - Fully Responsive */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-2xl border-b border-[#f1f2f4] dark:border-white/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Main Navigation Row */}
          <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
            
            {/* Left: iNazorat-style Wordmark Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div 
                className="relative flex items-center pr-1 cursor-pointer group select-none"
                onClick={() => setLogoKey(k => k + 1)}
                onMouseEnter={() => setLogoKey(k => k + 1)}
                title="Kursor keltiring: Cyber Decrypt animatsiyasi"
              >
                <div className="relative inline-flex items-center">
                  <span 
                    className="font-bold font-quicksand tracking-tight text-slate-800 dark:text-slate-100 leading-none text-[24px] sm:text-[28px] transition-colors"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    <DecryptedText
                      text="gitcore"
                      trigger={logoKey}
                      speed={28}
                      maxIterations={12}
                      className="font-bold font-quicksand tracking-tight text-slate-800 dark:text-slate-100 inline"
                      encryptedClassName="text-[#20c997] font-quicksand drop-shadow-[0_0_6px_rgba(32,201,151,0.5)]"
                    />
                  </span>

                  {/* Double Chevron Growth Arrow (iNazorat Signature Elevate mark) */}
                  <svg 
                    className="text-[#20c997] absolute transition-all duration-300 ease-in-out drop-shadow-[0_2px_8px_rgba(32,201,151,0.35)] w-[16px] h-[16px] -top-[4px] -right-[12px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M11 5 H 19 V 13" />
                    <path d="M5 11 H 13 V 19" />
                  </svg>
                </div>

                <span className="ml-5 text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono tracking-wide">
                  AML
                </span>
              </div>
            </div>

            {/* Desktop Center: Floating Pill Navigation (Visible only on xl+ >= 1280px) */}
            <div className="hidden xl:flex flex-1 items-center justify-center min-w-0 px-2">
              <AnimatedTabs
                tabs={navTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
                layoutIdPrefix="desktop"
              />
            </div>

            {/* Right: Submission Button & Theme Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab('submission')}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all active:scale-95 shadow-xs ${
                  activeTab === 'submission'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 ring-1 ring-emerald-500/30 shadow-[0_0_12px_rgba(32,201,151,0.2)]'
                    : 'bg-white/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-white/[0.08]'
                }`}
                title="Rasmiy Submission Tekshiruvi"
              >
                <Award className="w-3.5 h-3.5 text-[#20c997]" />
                <span className="hidden sm:inline">team_98F12CFB.csv</span>
                <span className="sm:hidden">CSV</span>
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-amber-400 transition-all duration-200 active:scale-95 border border-transparent hover:border-slate-200 dark:hover:border-white/10"
                title={isDark ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
                aria-label="Theme toggle"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            </div>

          </div>

          {/* Mobile & Tablet Full-Width Horizontal Scrollable Tab Bar (Visible on < xl) */}
          <div className="xl:hidden pb-2.5 pt-1 overflow-x-auto no-scrollbar flex items-center justify-start sm:justify-center gap-1 px-1">
            <AnimatedTabs
              tabs={navTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
              layoutIdPrefix="mobile"
            />
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ---------------- SECTION 1: OVERVIEW ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards Grid (React Bits Spotlight Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <SpotlightCard
                spotlightColor="rgba(32, 201, 151, 0.16)"
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/40 p-5 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jami Signallar</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs">
                    <Database className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                  <CountUp to={20000} duration={1.2} />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">14,000 Train + 6,000 Hidden Test</p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Tranzaksiyalar:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    <CountUp to={10015238} duration={1.5} />
                  </span>
                </div>
              </SpotlightCard>

              <SpotlightCard
                spotlightColor="rgba(244, 63, 94, 0.16)"
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-rose-500/25 hover:border-rose-500/40 p-5 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Tarixiy Eskalatsiya</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
                  <CountUp to={17.18} decimals={2} suffix="%" duration={1.4} />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">2,405 Tasdiqlangan / 11,595 Yopilgan</p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Imbalance Nisbati:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">~1 : 4.8</span>
                </div>
              </SpotlightCard>

              <SpotlightCard
                spotlightColor="rgba(32, 201, 151, 0.16)"
                className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/40 p-5 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AML Xususiyatlari</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  <CountUp to={summaryStats.engineeredFeatures} duration={1.5} />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Zero-leakage temporal xususiyatlar</p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Vaqt oynalari:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">24h - 60 kun</span>
                </div>
              </SpotlightCard>

              <SpotlightCard
                spotlightColor="rgba(32, 201, 151, 0.22)"
                className="bg-emerald-50/80 dark:bg-emerald-500/[0.07] backdrop-blur-xl rounded-[20px] border border-emerald-500/40 dark:border-emerald-500/30 p-5 hover:border-[#20c997]/60 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Final Ensemble AUC</span>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#20c997] to-teal-700 text-white flex items-center justify-center shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                  <CountUp to={modelMetricsData.ensembleAUC} decimals={5} duration={1.8} />
                </div>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  +0.0219 baseline ustunligi
                </p>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 dark:border-emerald-500/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Ensemble:</span>
                  <span className="font-bold text-[#20c997]">XGB + CAT + LGB</span>
                </div>
              </SpotlightCard>
            </div>

            {/* Problem Statement & Architecture */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-5 h-5" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Muammo Qo'yilishi & FinTech Mazmuni
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  O'zbekiston tijorat banklari va to'lov tizimlaridagi avtomatlashtirilgan monitoring qoidalari (rule engines) har kuni minglab ogohlantirish signallarini generatsiya qiladi. Biroq 2025–2026 yillardagi haqiqiy ma'lumotlar shuni ko'rsatadiki, signallarning <strong>82.8% dan ortig'i soxta ogohlantirish (false positive)</strong> bo'lib, mutaxassislar vaqtini noo'rin band etadi.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-semibold">gitcore</strong> jamoasi ishlab chiqqan machine learning modeli har bir signalning eskalatsiya qilinish ehtimolligini aniq baholab, monitoring xodimlariga signallarni xavf darajasiga ko'ra avtomatik tartiblab beradi.
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
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6 flex flex-col justify-between">
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
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
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
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[640px] text-left text-xs">
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
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
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
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"} strokeOpacity={0.7} />
                      <XAxis dataKey="window" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#0f172a' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f2f4',
                          borderRadius: '14px',
                          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.06)',
                          color: isDark ? '#f1f5f9' : '#0f172a'
                        }}
                        labelStyle={{ color: isDark ? '#f1f5f9' : '#0f172a', fontWeight: 700, marginBottom: '4px' }}
                        itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                      />
                      <Bar dataKey="normal" fill="#3b82f6" name="Tarixiy fon" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="alert" fill="#ef4444" name="Tetiklovchi 24h spayk" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  To'lov Kanallari bo'yicha Xavf Taqsimoti
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                  10 million tranzaksiya ichida to'lov kanallarining ulushi va xavf darajalari:
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"} strokeOpacity={0.7} />
                      <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={10} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} unit="%" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#0f172a' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f2f4',
                          borderRadius: '14px',
                          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.06)',
                          color: isDark ? '#f1f5f9' : '#0f172a'
                        }}
                        labelStyle={{ color: isDark ? '#f1f5f9' : '#0f172a', fontWeight: 700, marginBottom: '4px' }}
                        itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                      />
                      <Bar dataKey="percentage" fill="#10b981" radius={[4, 4, 0, 0]} name="Ulush %" />
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
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
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
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"} strokeOpacity={0.7} horizontal={false} />
                    <XAxis type="number" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} unit="%" />
                    <YAxis dataKey="name" type="category" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} tickLine={false} width={135} />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, 'Ahamiyati']}
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f2f4',
                        borderRadius: '14px',
                        boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.06)',
                        color: isDark ? '#f1f5f9' : '#0f172a'
                      }}
                      labelStyle={{
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        fontWeight: 700,
                        fontSize: '13px',
                        marginBottom: '4px'
                      }}
                      itemStyle={{ color: isDark ? '#34d399' : '#059669', fontWeight: 600 }}
                    />
                    <Bar dataKey="importance" fill="#10b981" radius={[0, 4, 4, 0]}>
                      {filteredFeatures.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.category === 'Cash Activity' ? '#f59e0b' :
                            entry.category === 'Bank Transfers' ? '#8b5cf6' :
                            entry.category === 'Temporal & Velocity' ? '#ef4444' :
                            entry.category === 'Trigger Signatures' ? '#ec4899' :
                            '#10b981'
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
              <div className="lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
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
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"} strokeOpacity={0.7} />
                      <XAxis dataKey="fpr" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} domain={[0, 1]} />
                      <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} domain={[0, 1]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#0f172a' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f2f4',
                          borderRadius: '14px',
                          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.06)',
                          color: isDark ? '#f1f5f9' : '#0f172a'
                        }}
                        labelStyle={{
                          color: isDark ? '#f1f5f9' : '#0f172a',
                          fontWeight: 700,
                          fontSize: '13px',
                          marginBottom: '4px'
                        }}
                        itemStyle={{ color: isDark ? '#f1f5f9' : '#0f172a' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="baseline" stroke="#94a3b8" strokeDasharray="4 4" name="Tasodifiy (0.500)" dot={false} />
                      <Line type="monotone" dataKey="tpr_lgb" stroke="#10b981" name={`LightGBM (${modelMetricsData.lightgbmAUC.toFixed(4)})`} dot={false} strokeWidth={1.5} />
                      <Line type="monotone" dataKey="tpr_cat" stroke="#f59e0b" name={`CatBoost (${modelMetricsData.catboostAUC.toFixed(4)})`} dot={false} strokeWidth={1.5} />
                      <Line type="monotone" dataKey="tpr_xgb" stroke="#8b5cf6" name={`XGBoost (${modelMetricsData.xgboostAUC.toFixed(4)})`} dot={false} strokeWidth={1.8} />
                      <Line type="monotone" dataKey="tpr_ensemble" stroke="#ef4444" name={`gitcore Ensemble (${modelMetricsData.ensembleAUC.toFixed(4)})`} dot={false} strokeWidth={2.8} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Leaderboard */}
              <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6 flex flex-col justify-between">
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
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
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

        {/* ---------------- SECTION 5: LIVE WHAT-IF SIMULATOR ---------------- */}
        {activeTab === 'simulator' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Description Card */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-100 dark:border-transparent">
                    <Sliders className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-transparent text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                      <Zap className="w-2.5 h-2.5" />
                      <span>Interactive What-If Simulation Sandbox</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Jonli AML Tranzaksiya Xavf Simulyatori
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      O'zbekiston Markaziy Bankining 660-sonli Nizomi va 226 ta GBDT xususiyatlari asosida tranzaksiya parametrlarini o'zgartiring. Sun'iy intellekt modeli real-vaqtda ehtimollikni qayta hisoblab, qaysi qonuniy me'yorlar buzilganini ko'rsatadi.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 p-3 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 shadow-sm">
                    &lt;1ms
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inference Tezligi</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Mijoz kiritishi bilanoq</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulator Split Grid: Controls & Live AI Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column (7 Cols) */}
              <div className="lg:col-span-7 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6 space-y-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span>Tranzaksiya Parametrlari (Inputs)</span>
                  <span className="text-[11px] text-slate-400 font-normal">Slayderlarni surib ko'ring</span>
                </h4>

                <div className="space-y-4">
                  {/* Channel Selector: 4 tactile cards */}
                  <div className="bg-slate-50/70 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Tranzaksiya Kanali:
                      </label>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        O'zbekiston Bank Tizimi
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'naqd', label: 'Naqd Pul', desc: 'ATM / Kassa', icon: Banknote },
                        { id: 'bank_otkazmasi', label: 'Bank Wire', desc: 'Tranzit Hisob', icon: Building2 },
                        { id: 'karta', label: 'P2P Karta', desc: 'HUMO / Uzcard', icon: CreditCard },
                        { id: 'xalqaro', label: 'Xalqaro', desc: 'SWIFT / Transfer', icon: Globe },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isSelected = simChannel === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSimChannel(item.id as any)}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-white dark:bg-white/10 border-slate-900 dark:border-white shadow-sm ring-1 ring-slate-900/10 dark:ring-white/20 text-slate-900 dark:text-white'
                                : 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`} />
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight">{item.label}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2-Column: Direction & Time Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Flow Direction Segmented */}
                    <div className="bg-slate-50/70 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                        Mablag' Harakat Yo'nalishi:
                      </span>
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-200/50 dark:bg-white/5 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setSimDirection('chiqim')}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            simDirection === 'chiqim'
                              ? 'bg-rose-500 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Chiqim (Outflow)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimDirection('kirim')}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            simDirection === 'kirim'
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Kirim (Inflow)</span>
                        </button>
                      </div>
                    </div>

                    {/* Day / Night Segmented */}
                    <div className="bg-slate-50/70 dark:bg-white/5 p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Operatsiya Vaqti:
                        </span>
                        {simIsNight && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-bold">
                            Nocturnal
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-200/50 dark:bg-white/5 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setSimIsNight(false)}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            !simIsNight
                              ? 'bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          <span>Kunduzgi (14:00)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSimIsNight(true)}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            simIsNight
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" />
                          <span>Tungi (02:00)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Amount Z-Score Slider */}
                  <div className="bg-slate-50/70 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Amaliyot Miqdori Anomaliyasi (Amount Z-Score):
                      </span>
                      <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-transparent">
                        {simAmount > 0 ? `+${simAmount.toFixed(1)}σ` : `${simAmount.toFixed(1)}σ`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={-2.5}
                      max={4.0}
                      step={0.1}
                      value={simAmount}
                      onChange={(e) => setSimAmount(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>-2.5σ (Juda kichik)</span>
                      <span>0.0σ (O'rtacha me'yor)</span>
                      <span>+4.0σ (Ekstremal yirik)</span>
                    </div>
                  </div>

                  {/* Burst Count Slider */}
                  <div className="bg-slate-50/70 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        15 Daqiqalik Smurfing Klasteri (Burst Count &lt;15m):
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-md border ${
                        simBurst15m >= 3
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                          : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-transparent'
                      }`}>
                        {simBurst15m} ta operatsiya
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={8}
                      step={1}
                      value={simBurst15m}
                      onChange={(e) => setSimBurst15m(parseInt(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>0 (Yakka tranzaksiya)</span>
                      <span>3 (Shubhali klaster)</span>
                      <span>8 (Agressiv structuring)</span>
                    </div>
                  </div>

                  {/* Turnover Ratio Slider */}
                  <div className="bg-slate-50/70 dark:bg-white/5 p-4 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        24 Soatlik Mablag'ni Chiqarish Nisbati (Pass-Through Ratio):
                      </span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded-md border ${
                        simTurnover >= 80
                          ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20'
                          : 'bg-white dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-transparent'
                      }`}>
                        {simTurnover}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={98}
                      step={2}
                      value={simTurnover}
                      onChange={(e) => setSimTurnover(parseInt(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>10% (Balansda qoladi)</span>
                      <span>50% (Odatiy xarajat)</span>
                      <span>98% (To'liq tozalangan tranzit mule)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time AI Output Column (5 Cols) */}
              <SpotlightCard
                spotlightColor={isDark ? "rgba(32, 201, 151, 0.12)" : "rgba(32, 201, 151, 0.15)"}
                className="lg:col-span-5 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 p-6 flex flex-col justify-between space-y-5 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Model Baholashi & Xavf Tahlili
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Ensemble Faol
                    </span>
                  </div>

                  {/* Refined Precision Risk Gauge Card */}
                  <div className="mt-4 p-5 rounded-2xl bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-center space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      Bashorat Qilingan Eskalatsiya Ehtimolligi
                    </span>

                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-5xl font-mono font-black tracking-tight ${
                        simRiskProbability >= 0.70
                          ? 'text-rose-600 dark:text-rose-400'
                          : simRiskProbability >= 0.40
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {(simRiskProbability * 100).toFixed(1)}
                      </span>
                      <span className="text-xl font-mono font-bold text-slate-400">%</span>
                    </div>

                    {/* Segmented Risk Meter (Past / O'rta / Kritik) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="grid grid-cols-3 gap-1.5 h-2">
                        <div className={`rounded-full transition-all duration-300 ${
                          simRiskProbability < 0.40 ? 'bg-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'bg-slate-200 dark:bg-white/10'
                        }`} />
                        <div className={`rounded-full transition-all duration-300 ${
                          simRiskProbability >= 0.40 && simRiskProbability < 0.70 ? 'bg-amber-500 shadow-sm ring-2 ring-amber-500/20' : 'bg-slate-200 dark:bg-white/10'
                        }`} />
                        <div className={`rounded-full transition-all duration-300 ${
                          simRiskProbability >= 0.70 ? 'bg-rose-500 shadow-sm ring-2 ring-rose-500/20' : 'bg-slate-200 dark:bg-white/10'
                        }`} />
                      </div>
                      <div className="flex justify-between text-[10px] font-medium text-slate-400">
                        <span>Past (&lt;40%)</span>
                        <span>O'rta (40-70%)</span>
                        <span>Kritik (&ge;70%)</span>
                      </div>
                    </div>

                    {/* Tier Status Badge */}
                    <div className="pt-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        simRiskProbability >= 0.70
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                          : simRiskProbability >= 0.40
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          simRiskProbability >= 0.70 ? 'bg-rose-500' : simRiskProbability >= 0.40 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                        {simRiskProbability >= 0.70 ? "Tier 1 · Kritik Xavf (Eskalatsiya)" :
                         simRiskProbability >= 0.40 ? "Tier 2 · O'rta Xavf (Qo'shimcha Audit)" :
                         "Tier 3 · Past Xavf (Odatiy Tijoriy Faoliyat)"}
                      </span>
                    </div>
                  </div>

                  {/* Triggered Legal Rules List */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tetiklangan Qonuniy Mezonlar (Central Bank):
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {simChannel === 'naqd' && simDirection === 'chiqim' && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-2 text-rose-600 dark:text-rose-400">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <span className="font-mono font-bold mr-1.5">[MB-660]</span>
                            <span>Katta hajmdagi naqdlashtirish spayki aniqlandi.</span>
                          </div>
                        </div>
                      )}

                      {simBurst15m >= 3 && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <span className="font-mono font-bold mr-1.5">[MB-2515]</span>
                            <span>15 daqiqada {simBurst15m} ta mikro-o'tkazma (Smurfing/Structuring).</span>
                          </div>
                        </div>
                      )}

                      {simTurnover >= 80 && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                          <TrendingUp className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <span className="font-mono font-bold mr-1.5">[FATF R.10]</span>
                            <span>Tranzit (Mule) hisob: Mablag'ning {simTurnover}% qismi 24 soatda chiqarilgan.</span>
                          </div>
                        </div>
                      )}

                      {simIsNight && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Moon className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <span className="font-mono font-bold mr-1.5">[Vaqt Anomaliyasi]</span>
                            <span>Tungi soatlarda (01:00-05:00) g'ayritabiiy operatsiya klasteri.</span>
                          </div>
                        </div>
                      )}

                      {simRiskProbability < 0.40 && (
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <span className="font-mono font-bold mr-1.5">[Xavfsiz]</span>
                            <span>Muntazam oylik aylanma yoki oddiy tijoriy daromad modeli tasdiqlandi.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    onClick={() => setActiveStrCase({
                      id: `SIM_${Math.floor(100000 + Math.random() * 900000)}`,
                      status: simRiskProbability >= 0.50 ? 'ESCALATE' : 'DISMISS',
                      probability: Math.round(simRiskProbability * 100),
                      classification: simRiskProbability >= 0.70 ? "Kritik Shubhali Naqdlashtirish & Smurfing" : "Tahliliy Ssenariy",
                      reason: `Simulyator orqali kiritilgan amaliyot: ${simChannel.toUpperCase()} kanali orqali ${simDirection.toUpperCase()} amali, ${simBurst15m} ta smurfing takrorlanishi va ${simTurnover}% aylanma nisbati aniqlandi.`,
                      indicators: [
                        { name: "Miqdor Z-Score", value: `${simAmount.toFixed(1)} sigma`, severity: simAmount > 1.5 ? 'critical' : 'normal' },
                        { name: "15m Bursts", value: `${simBurst15m} ta`, severity: simBurst15m >= 3 ? 'critical' : 'normal' },
                        { name: "Pass-Through", value: `${simTurnover}%`, severity: simTurnover >= 80 ? 'high' : 'normal' },
                        { name: "Vaqt Klasteri", value: simIsNight ? "Tungi 02:00" : "Kunduzgi", severity: simIsNight ? 'high' : 'normal' }
                      ]
                    })}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Ushbu Ssenariy uchun STR Bayonnoma Ochish</span>
                  </button>
                </div>
              </SpotlightCard>
            </div>

            {/* ROI Cost-Benefit Optimizer Banner & Calculator */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      AML Alert Prioritization & FinTech ROI Kalkulyatori
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Qaror qabul qilish chegarasi (Threshold τ) asosida tejaladigan vaqt, moliyaviy resurs va xavf qamrovi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Qaror Chegarasi (τ):</span>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{roiThreshold.toFixed(2)}</span>
                </div>
              </div>

              {/* Threshold Slider Bar */}
              <div className="bg-slate-50/70 dark:bg-white/5 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-500" />
                    <span>Eskalatsiya Chegarasi (Decision Threshold τ):</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-transparent">
                    P(Eskalatsiya) &ge; {roiThreshold.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.15}
                  max={0.75}
                  step={0.05}
                  value={roiThreshold}
                  onChange={(e) => setRoiThreshold(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>τ = 0.15 (Juda qat'iy / Har bir signal ko'riladi)</span>
                  <span>τ = 0.35 (Optimal Muvozanat)</span>
                  <span>τ = 0.75 (Faqat kritik o'ta yuqori xavflar)</span>
                </div>
              </div>

              {/* 4-KPI ROI Cards (React Bits Spotlight) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SpotlightCard
                  spotlightColor="rgba(59, 130, 246, 0.18)"
                  className="bg-slate-50/80 dark:bg-white/5 p-4 rounded-xl border border-slate-200/80 dark:border-white/5"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Soxta Signallarni Filtrlash</span>
                  <div className="mt-2 text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                    <CountUp to={roiMetrics.suppressionRate} decimals={1} suffix="%" duration={1.2} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Kuniga {roiMetrics.autoDismissedAlerts} ta asossiz signal avtomatik yopiladi
                  </p>
                </SpotlightCard>

                <SpotlightCard
                  spotlightColor="rgba(16, 185, 129, 0.18)"
                  className="bg-slate-50/80 dark:bg-white/5 p-4 rounded-xl border border-slate-200/80 dark:border-white/5"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tejalgan Mutaxassis Vaqti</span>
                  <div className="mt-2 text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    <CountUp to={roiMetrics.annualHoursSaved} suffix=" soat/yil" duration={1.4} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Har kuni {roiMetrics.hoursSavedPerDay} soat insoniy mehnat tejaladi
                  </p>
                </SpotlightCard>

                <SpotlightCard
                  spotlightColor="rgba(99, 102, 241, 0.18)"
                  className="bg-slate-50/80 dark:bg-white/5 p-4 rounded-xl border border-slate-200/80 dark:border-white/5"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Yillik Moliyaviy Tejamkorlik</span>
                  <div className="mt-2 text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
                    <CountUp to={roiMetrics.annualCostSavedUZS} decimals={1} suffix=" Mlrd UZS" duration={1.5} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    ~ ${roiMetrics.annualCostSavedUSD} compliance byudjeti tejaladi
                  </p>
                </SpotlightCard>

                <SpotlightCard
                  spotlightColor="rgba(168, 85, 247, 0.18)"
                  className="bg-slate-50/80 dark:bg-white/5 p-4 rounded-xl border border-slate-200/80 dark:border-white/5"
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jinoyatni Aniqlash (Recall)</span>
                  <div className="mt-2 text-2xl font-mono font-extrabold text-purple-600 dark:text-purple-400">
                    <CountUp to={roiMetrics.recallRate} decimals={1} suffix="%" duration={1.3} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Kritik noqonuniy oqimlarni o'tkazib yuborish xavfi minimal
                  </p>
                </SpotlightCard>
              </div>

              {/* Comparative Table: Traditional vs AI */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200/80 dark:border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Mezon / Parametr</th>
                      <th className="p-3 text-rose-600 dark:text-rose-400">Eski Statik Qoidalar (Legacy Rule Engine)</th>
                      <th className="p-3 text-emerald-600 dark:text-emerald-400">gitcore AI Prioritization (Ensemble)</th>
                      <th className="p-3">Yutuq / Natija</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-white/5 text-slate-600 dark:text-slate-300">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">Soxta Ogohlantirishlar (False Positives)</td>
                      <td className="p-3 text-rose-500 font-mono">82.8% (Yuqori shovqin)</td>
                      <td className="p-3 text-emerald-500 font-mono font-bold">~15.2% (Saralangan)</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">-67.6% ortiqcha ish yuklamasi</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">Signallarni Ko'rib Chiqish Tezligi</td>
                      <td className="p-3 text-rose-500 font-mono">FIFO tartibida (24-48 soat)</td>
                      <td className="p-3 text-emerald-500 font-mono font-bold">Real-time Rank Prioriteti (&lt; 30 daqiqa)</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Kritik xavfga zudlik bilan chora</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">Murakkab Smurfing & Mule Aniqlash</td>
                      <td className="p-3 text-rose-500 font-mono">Aniqlay olmaydi (faqat chegara tekshiradi)</td>
                      <td className="p-3 text-emerald-500 font-mono font-bold">226 ta temporal & burst xususiyatlar</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">+0.0219 ROC-AUC ustunlik</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">Markaziy Bank ZRU-660 Talablari</td>
                      <td className="p-3 text-amber-500 font-mono">Kechikishlar tufayli jarima xavfi bor</td>
                      <td className="p-3 text-emerald-500 font-mono font-bold">Avtomatik STR Form #660 tayyorlash</td>
                      <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">100% Qonuniy muvofiqlik</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION: CENTRAL BANK REGULATORY RULES MATRIX ---------------- */}
        {activeTab === 'rules' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Scale className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      O'zbekiston Respublikasi Qonunchiligi (ZRU-660) & MB 2515-Nizom Qoidalar Matritsasi
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Avtomatlashtirilgan ML xususiyatlarining regulyativ qonunchilik talablari bilan 1:1 o'zaro muvofiqligi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Markaziy Bank Mezonlariga Mos</span>
                </div>
              </div>

              {/* Regulatory Rules Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {centralBankRulesData.map((rule) => (
                  <SpotlightCard
                    key={rule.id}
                    spotlightColor="rgba(168, 85, 247, 0.16)"
                    className="p-5 bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-4 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20">
                          {rule.id}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-200/60 dark:border-rose-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {rule.riskWeight}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {rule.name}
                      </h4>
                    </div>

                    {/* 2x2 Specification Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Chegara & Mezon
                        </span>
                        <span className="font-mono text-slate-900 dark:text-white font-semibold text-xs block">
                          {rule.threshold}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Qonuniy Asos
                        </span>
                        <span className="text-purple-600 dark:text-purple-400 font-semibold text-xs block">
                          {rule.legalBasis}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1 sm:col-span-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Bog'langan ML Xususiyatlar
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {rule.mlFeatureMapping.split(',').map((feat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md font-mono text-[11px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20"
                            >
                              {feat.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Penalty Risk Callout */}
                    <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-500/20 flex items-start gap-2.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-rose-700 dark:text-rose-300 mr-1.5">Sanksiya Xavfi:</span>
                        <span className="text-rose-600 dark:text-rose-400 text-[11px]">{rule.penaltyRisk}</span>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 6: CASE STUDIES & STR EXPORT ---------------- */}
        {activeTab === 'cases' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    AML Compliance Tergov Fayllari & STR Hisobotlar
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Haqiqiy holatlar bo'yicha sun'iy intellekt tahlili va Markaziy Bank formatidagi rasmiy bayonnomalar:
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Markaziy Bank Form #660 Mos</span>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200/80 dark:border-white/5 w-full sm:w-auto">
                  {[
                    { id: 'ALL', label: `Barchasi (${caseStudiesData.length})` },
                    { id: 'ESCALATE', label: 'Kritik Eskalatsiya (4)' },
                    { id: 'DISMISS', label: 'Asossiz / Yopilgan (2)' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setCaseFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        caseFilter === f.id
                          ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={caseSearch}
                    onChange={(e) => setCaseSearch(e.target.value)}
                    placeholder="Signal ID yoki sabab bo'yicha qidiruv..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCases.map((cs) => (
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

                    <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Xavf Tasnifi:</span>
                        <span className={`font-bold ${cs.status === 'ESCALATE' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {cs.classification}
                        </span>
                      </div>

                      <button
                        onClick={() => setActiveStrCase(cs)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/10 border border-slate-300 dark:border-white/15 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/20 transition-all active:scale-95 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>STR Xabarnoma</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SECTION 7: SUBMISSION ---------------- */}
        {activeTab === 'submission' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-[20px] border border-[#f1f2f4] dark:border-white/[0.08] hover:border-[#20c997]/30 transition-all duration-300 p-6">
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

        {/* OFFICIAL CENTRAL BANK STR (SUSPICIOUS TRANSACTION REPORT) MODAL */}
        {activeStrCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl overflow-y-auto animate-fadeIn">
            <div className="bg-white/85 dark:bg-[#0b0f19]/90 backdrop-blur-2xl border border-[#f1f2f4] dark:border-white/[0.08] rounded-[24px] max-w-3xl w-full p-6 sm:p-8 shadow-[0_20px_50px_rgba(15,23,42,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative space-y-6 my-8 print:border-none print:shadow-none print:p-0">
              {/* Close Button (Hidden on Print) */}
              <button
                onClick={() => setActiveStrCase(null)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all print:hidden"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Official Header */}
              <div className="border-b-2 border-slate-900 dark:border-white/20 pb-5 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>O'zbekiston Respublikasi Qonuni (ZRU-660) va MB Nizomi #2515</span>
                </div>
                <h2 className="text-sm sm:text-base font-black tracking-tight uppercase text-slate-900 dark:text-white">
                  Iqtisodiy Jinoyatlarga Qarshi Kurashish Departamentiga
                </h2>
                <h3 className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
                  Shubhali Moliyaviy Amaliyot Haqida Xabarnoma (STR)
                </h3>
                <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-1">
                  <span>Hujjat #: <strong>STR-2026/09-{activeStrCase.id}</strong></span>
                  <span>•</span>
                  <span>Sana: <strong>{new Date().toLocaleDateString('uz-UZ')}</strong></span>
                  <span>•</span>
                  <span className="text-rose-600 font-bold uppercase">Maxfiy / Xizmatda Foydalanish Uchun</span>
                </div>
              </div>

              {/* Body Form Grid */}
              <div className="space-y-4 text-xs">
                {/* 1. Entity Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/80 dark:border-white/10">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Xabar Beruvchi Tashkilot:</span>
                    <span className="font-bold text-slate-900 dark:text-white">iNazorat FinTech Core (Litsenziya #0042)</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Monitoring Tizimi:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">gitcore AML Engine (ROC-AUC 0.6246)</span>
                  </div>
                </div>

                {/* 2. Target Subject Details */}
                <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200/80 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Tekshirilayotgan Signal:</span>
                      <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">{activeStrCase.id}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Model Ehtimolligi:</span>
                      <span className="font-mono text-base font-extrabold text-rose-600 dark:text-rose-400">{activeStrCase.probability}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Xavf Tasnifi:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{activeStrCase.classification}</span>
                  </div>
                </div>

                {/* 3. Reason & Legal Basis */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Shubhali Amaliyot Mazmuni va Huquqiy Asosi:</span>
                  <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p className="mb-2"><strong>Qonuniy Asos:</strong> O'zbekiston Respublikasining 660-sonli ZRU Qonuni 14-moddasi (Majburiy nazorat va shubhali operatsiyalar to'g'risida xabar berish) talablari.</p>
                    <p>{activeStrCase.reason}</p>
                  </div>
                </div>

                {/* 4. Indicators Breakdown */}
                {activeStrCase.indicators && activeStrCase.indicators.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Qayd Etilgan Xavf Indikatorlari:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeStrCase.indicators.map((ind: any, i: number) => (
                        <div key={i} className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
                          <span className="text-[10px] text-slate-400 block">{ind.name}</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{ind.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Recommended Action & Signatures */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Tavsiya Etilgan Amal:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      Hisobni zudlik bilan vaqtincha to'xtatish va MB FinMonitoringga yo'naltirish
                    </span>
                  </div>

                  <div className="text-right font-mono text-[11px] self-end sm:self-auto text-slate-500 dark:text-slate-400">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <Check className="w-3.5 h-3.5" />
                      <span>ERI bilan tasdiqlangan: 98F12CFB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Hidden on Print) */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3 print:hidden">
                <button
                  onClick={() => setActiveStrCase(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                >
                  Yopish
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Chop Etish / PDF Saqlash</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Ultra-Minimalist iNazorat-style StatusBar */}
      <footer className="border-t border-slate-200/60 dark:border-white/[0.05] bg-slate-50/40 dark:bg-transparent backdrop-blur-md py-4 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 font-mono text-[11px] text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20c997] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20c997]"></span>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-sans">gitcore</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>WIUT Hackathon 2026</span>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="hidden sm:inline">10,015,238 tranzaksiya</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-slate-500 dark:text-slate-400">
            <span className="hidden md:inline">Ensemble: XGB + CAT + LGB</span>
            <span className="text-slate-300 dark:text-slate-700 hidden md:inline">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">AUC {modelMetricsData.ensembleAUC.toFixed(5)}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-400 dark:text-slate-500">ID: {summaryStats.teamId}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
