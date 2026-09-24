// Auto-generated real data for gitcore AML EDA Dashboard
// WIUT Hackathon 2026

export interface ModelMetrics {
  baselineAUC: number;
  lightgbmAUC: number;
  catboostAUC: number;
  xgboostAUC: number;
  simpleAvgAUC: number;
  ensembleAUC: number;
  weights: { lgb: number; cat: number; xgb: number };
  folds: {
    lightgbm: number[];
    catboost: number[];
    xgboost: number[];
  };
  executionTimeSec: number;
}

export const modelMetricsData: ModelMetrics = {
  baselineAUC: 0.60268,
  lightgbmAUC: 0.6151697941348654,
  catboostAUC: 0.6186280020691405,
  xgboostAUC: 0.6233626222500737,
  simpleAvgAUC: 0.6229969366321242,
  ensembleAUC: 0.6246065988368705,
  weights: {
    lgb: 0.33300192605931567,
    cat: 0.33349903697034217,
    xgb: 0.33349903697034217,
  },
  folds: {"lightgbm": [0.6479417520814675, 0.6089046554764538, 0.6250637641323281, 0.598759322562686, 0.6042652265161967], "catboost": [0.6394630275613459, 0.6163331208609346, 0.6234935303499339, 0.6153003436315209, 0.5996598648603824], "xgboost": [0.6448891423018202, 0.6218251289402648, 0.6321493152023553, 0.6026524086032494, 0.6171005317189017]},
  executionTimeSec: 36.08
};

export const featureImportancesData = [
  {
    "name": "amount_min",
    "importance": 5.71,
    "category": "Amount Extremes",
    "lgb": 81.2,
    "cat": 11.3,
    "xgb": 0.0117
  },
  {
    "name": "karta_max",
    "importance": 2.75,
    "category": "Card Volume",
    "lgb": 60.0,
    "cat": 4.2,
    "xgb": 0.0065
  },
  {
    "name": "bank_mean",
    "importance": 2.58,
    "category": "Bank Transfers",
    "lgb": 59.6,
    "cat": 3.5,
    "xgb": 0.0084
  },
  {
    "name": "naqd_mean",
    "importance": 2.31,
    "category": "Cash Activity",
    "lgb": 59.4,
    "cat": 2.9,
    "xgb": 0.0063
  },
  {
    "name": "bank_turnover_ratio",
    "importance": 1.95,
    "category": "Bank Transfers",
    "lgb": 41.6,
    "cat": 2.7,
    "xgb": 0.0075
  },
  {
    "name": "bank_max",
    "importance": 1.47,
    "category": "Bank Transfers",
    "lgb": 27.4,
    "cat": 2.1,
    "xgb": 0.0072
  },
  {
    "name": "naqd_sum",
    "importance": 1.44,
    "category": "Cash Activity",
    "lgb": 27.6,
    "cat": 2.1,
    "xgb": 0.0067
  },
  {
    "name": "naqd_max",
    "importance": 1.19,
    "category": "Cash Activity",
    "lgb": 32.0,
    "cat": 1.2,
    "xgb": 0.0054
  },
  {
    "name": "bank_sum",
    "importance": 1.18,
    "category": "Bank Transfers",
    "lgb": 16.0,
    "cat": 1.8,
    "xgb": 0.0078
  },
  {
    "name": "chiqim_max",
    "importance": 1.11,
    "category": "Flow Direction",
    "lgb": 23.8,
    "cat": 1.4,
    "xgb": 0.0054
  },
  {
    "name": "karta_turnover_ratio",
    "importance": 1.1,
    "category": "Card Volume",
    "lgb": 26.6,
    "cat": 1.2,
    "xgb": 0.006
  },
  {
    "name": "amount_max",
    "importance": 1.0,
    "category": "Amount Extremes",
    "lgb": 13.8,
    "cat": 1.7,
    "xgb": 0.0057
  },
  {
    "name": "naqd_turnover_ratio",
    "importance": 1.0,
    "category": "Cash Activity",
    "lgb": 25.2,
    "cat": 1.0,
    "xgb": 0.0055
  },
  {
    "name": "min_amount_zscore",
    "importance": 0.89,
    "category": "Amount Extremes",
    "lgb": 25.6,
    "cat": 0.7,
    "xgb": 0.0049
  },
  {
    "name": "night_ratio",
    "importance": 0.84,
    "category": "Amount Extremes",
    "lgb": 28.4,
    "cat": 0.5,
    "xgb": 0.0045
  },
  {
    "name": "chiqim_ratio_14d",
    "importance": 0.77,
    "category": "Flow Direction",
    "lgb": 17.4,
    "cat": 0.8,
    "xgb": 0.005
  },
  {
    "name": "max_60d",
    "importance": 0.77,
    "category": "Amount Extremes",
    "lgb": 16.4,
    "cat": 0.9,
    "xgb": 0.0051
  },
  {
    "name": "naqd_ratio",
    "importance": 0.76,
    "category": "Cash Activity",
    "lgb": 22.6,
    "cat": 0.5,
    "xgb": 0.0047
  },
  {
    "name": "bank_chiqim_count",
    "importance": 0.72,
    "category": "Bank Transfers",
    "lgb": 19.0,
    "cat": 0.6,
    "xgb": 0.0047
  },
  {
    "name": "chiqim_ratio_3d",
    "importance": 0.71,
    "category": "Flow Direction",
    "lgb": 11.2,
    "cat": 1.0,
    "xgb": 0.0048
  },
  {
    "name": "weekend_ratio",
    "importance": 0.71,
    "category": "Amount Extremes",
    "lgb": 22.0,
    "cat": 0.4,
    "xgb": 0.0044
  },
  {
    "name": "chiqim_ratio_30d",
    "importance": 0.66,
    "category": "Flow Direction",
    "lgb": 14.0,
    "cat": 0.7,
    "xgb": 0.0047
  },
  {
    "name": "amount_range",
    "importance": 0.65,
    "category": "Amount Extremes",
    "lgb": 10.8,
    "cat": 0.8,
    "xgb": 0.0049
  },
  {
    "name": "max_14d",
    "importance": 0.64,
    "category": "Amount Extremes",
    "lgb": 16.0,
    "cat": 0.6,
    "xgb": 0.0045
  },
  {
    "name": "history_span_days",
    "importance": 0.63,
    "category": "Amount Extremes",
    "lgb": 17.8,
    "cat": 0.5,
    "xgb": 0.0044
  }
];

export const behavioralComparisonsData = [
  {
    "key": "amount_min",
    "label": "Deepest Outflow (Min Amount)",
    "dismissed": -2.3278,
    "escalated": -2.3531,
    "ratio": 1.01
  },
  {
    "key": "amount_max",
    "label": "Peak Single Transaction (Max Amount)",
    "dismissed": 3.0521,
    "escalated": 2.8817,
    "ratio": 0.94
  },
  {
    "key": "amount_mean",
    "label": "Average Transaction Amount",
    "dismissed": -0.0452,
    "escalated": -0.1161,
    "ratio": 2.57
  },
  {
    "key": "amount_sum",
    "label": "Net Cumulative Balance Change",
    "dismissed": -60.6061,
    "escalated": -95.5063,
    "ratio": 1.58
  },
  {
    "key": "naqd_sum",
    "label": "Total Cash Volume",
    "dismissed": 16.5471,
    "escalated": 18.2732,
    "ratio": 1.1
  },
  {
    "key": "naqd_mean",
    "label": "Mean Cash Transaction Size",
    "dismissed": 0.6132,
    "escalated": 0.6153,
    "ratio": 1.0
  },
  {
    "key": "bank_mean",
    "label": "Mean Wire Transfer Size",
    "dismissed": 0.1551,
    "escalated": 0.0157,
    "ratio": 0.1
  },
  {
    "key": "bank_max",
    "label": "Maximum Wire Transfer",
    "dismissed": 2.661,
    "escalated": 2.4209,
    "ratio": 0.91
  },
  {
    "key": "chiqim_ratio",
    "label": "Overall Outgoing Flow Ratio",
    "dismissed": 0.2497,
    "escalated": 0.2559,
    "ratio": 1.02
  },
  {
    "key": "chiqim_ratio_3d",
    "label": "3-Day Outgoing Flow Ratio",
    "dismissed": 0.253,
    "escalated": 0.2662,
    "ratio": 1.05
  },
  {
    "key": "chiqim_ratio_7d",
    "label": "7-Day Outgoing Flow Ratio",
    "dismissed": 0.2544,
    "escalated": 0.2663,
    "ratio": 1.05
  },
  {
    "key": "chiqim_ratio_14d",
    "label": "14-Day Outgoing Flow Ratio",
    "dismissed": 0.2538,
    "escalated": 0.266,
    "ratio": 1.05
  },
  {
    "key": "burst_ratio_15m",
    "label": "15-Minute Burst Ratio (Smurfing)",
    "dismissed": 0.1047,
    "escalated": 0.1065,
    "ratio": 1.02
  },
  {
    "key": "night_ratio",
    "label": "Nighttime Activity Ratio (00:00 - 06:00)",
    "dismissed": 0.2673,
    "escalated": 0.267,
    "ratio": 1.0
  },
  {
    "key": "flow_pass_through_ratio",
    "label": "Pass-Through Mule Turnover Ratio",
    "dismissed": 9.5072,
    "escalated": 1.5816,
    "ratio": 0.17
  },
  {
    "key": "turnover",
    "label": "Total Turnover Volume",
    "dismissed": -60.6061,
    "escalated": -95.5063,
    "ratio": 1.58
  },
  {
    "key": "last1_amount",
    "label": "Alert Trigger Transaction Amount",
    "dismissed": -0.4528,
    "escalated": -0.5053,
    "ratio": 1.12
  },
  {
    "key": "last1_is_chiqim",
    "label": "Trigger is Outgoing (Chiqim)",
    "dismissed": 0.2492,
    "escalated": 0.2869,
    "ratio": 1.15
  }
];

export const rocCurveData = [
  {
    "fpr": 0.0,
    "tpr_ensemble": 0.0,
    "tpr_xgb": 0.0,
    "tpr_cat": 0.0,
    "tpr_lgb": 0.0,
    "baseline": 0.0
  },
  {
    "fpr": 0.025,
    "tpr_ensemble": 0.047,
    "tpr_xgb": 0.052,
    "tpr_cat": 0.054,
    "tpr_lgb": 0.045,
    "baseline": 0.025
  },
  {
    "fpr": 0.05,
    "tpr_ensemble": 0.104,
    "tpr_xgb": 0.103,
    "tpr_cat": 0.103,
    "tpr_lgb": 0.088,
    "baseline": 0.05
  },
  {
    "fpr": 0.075,
    "tpr_ensemble": 0.156,
    "tpr_xgb": 0.153,
    "tpr_cat": 0.143,
    "tpr_lgb": 0.141,
    "baseline": 0.075
  },
  {
    "fpr": 0.1,
    "tpr_ensemble": 0.2,
    "tpr_xgb": 0.195,
    "tpr_cat": 0.195,
    "tpr_lgb": 0.187,
    "baseline": 0.1
  },
  {
    "fpr": 0.125,
    "tpr_ensemble": 0.241,
    "tpr_xgb": 0.239,
    "tpr_cat": 0.235,
    "tpr_lgb": 0.228,
    "baseline": 0.125
  },
  {
    "fpr": 0.15,
    "tpr_ensemble": 0.28,
    "tpr_xgb": 0.277,
    "tpr_cat": 0.274,
    "tpr_lgb": 0.264,
    "baseline": 0.15
  },
  {
    "fpr": 0.175,
    "tpr_ensemble": 0.315,
    "tpr_xgb": 0.311,
    "tpr_cat": 0.306,
    "tpr_lgb": 0.305,
    "baseline": 0.175
  },
  {
    "fpr": 0.2,
    "tpr_ensemble": 0.347,
    "tpr_xgb": 0.345,
    "tpr_cat": 0.341,
    "tpr_lgb": 0.342,
    "baseline": 0.2
  },
  {
    "fpr": 0.225,
    "tpr_ensemble": 0.38,
    "tpr_xgb": 0.378,
    "tpr_cat": 0.371,
    "tpr_lgb": 0.368,
    "baseline": 0.225
  },
  {
    "fpr": 0.25,
    "tpr_ensemble": 0.412,
    "tpr_xgb": 0.408,
    "tpr_cat": 0.405,
    "tpr_lgb": 0.398,
    "baseline": 0.25
  },
  {
    "fpr": 0.275,
    "tpr_ensemble": 0.439,
    "tpr_xgb": 0.436,
    "tpr_cat": 0.438,
    "tpr_lgb": 0.433,
    "baseline": 0.275
  },
  {
    "fpr": 0.3,
    "tpr_ensemble": 0.474,
    "tpr_xgb": 0.464,
    "tpr_cat": 0.47,
    "tpr_lgb": 0.456,
    "baseline": 0.3
  },
  {
    "fpr": 0.325,
    "tpr_ensemble": 0.506,
    "tpr_xgb": 0.496,
    "tpr_cat": 0.497,
    "tpr_lgb": 0.49,
    "baseline": 0.325
  },
  {
    "fpr": 0.35,
    "tpr_ensemble": 0.534,
    "tpr_xgb": 0.53,
    "tpr_cat": 0.528,
    "tpr_lgb": 0.517,
    "baseline": 0.35
  },
  {
    "fpr": 0.375,
    "tpr_ensemble": 0.558,
    "tpr_xgb": 0.561,
    "tpr_cat": 0.559,
    "tpr_lgb": 0.547,
    "baseline": 0.375
  },
  {
    "fpr": 0.4,
    "tpr_ensemble": 0.585,
    "tpr_xgb": 0.587,
    "tpr_cat": 0.583,
    "tpr_lgb": 0.577,
    "baseline": 0.4
  },
  {
    "fpr": 0.425,
    "tpr_ensemble": 0.612,
    "tpr_xgb": 0.605,
    "tpr_cat": 0.611,
    "tpr_lgb": 0.607,
    "baseline": 0.425
  },
  {
    "fpr": 0.45,
    "tpr_ensemble": 0.63,
    "tpr_xgb": 0.631,
    "tpr_cat": 0.632,
    "tpr_lgb": 0.63,
    "baseline": 0.45
  },
  {
    "fpr": 0.475,
    "tpr_ensemble": 0.651,
    "tpr_xgb": 0.654,
    "tpr_cat": 0.649,
    "tpr_lgb": 0.649,
    "baseline": 0.475
  },
  {
    "fpr": 0.5,
    "tpr_ensemble": 0.676,
    "tpr_xgb": 0.677,
    "tpr_cat": 0.671,
    "tpr_lgb": 0.67,
    "baseline": 0.5
  },
  {
    "fpr": 0.525,
    "tpr_ensemble": 0.701,
    "tpr_xgb": 0.704,
    "tpr_cat": 0.689,
    "tpr_lgb": 0.689,
    "baseline": 0.525
  },
  {
    "fpr": 0.55,
    "tpr_ensemble": 0.718,
    "tpr_xgb": 0.728,
    "tpr_cat": 0.713,
    "tpr_lgb": 0.712,
    "baseline": 0.55
  },
  {
    "fpr": 0.575,
    "tpr_ensemble": 0.738,
    "tpr_xgb": 0.745,
    "tpr_cat": 0.734,
    "tpr_lgb": 0.733,
    "baseline": 0.575
  },
  {
    "fpr": 0.6,
    "tpr_ensemble": 0.755,
    "tpr_xgb": 0.757,
    "tpr_cat": 0.752,
    "tpr_lgb": 0.753,
    "baseline": 0.6
  },
  {
    "fpr": 0.625,
    "tpr_ensemble": 0.773,
    "tpr_xgb": 0.779,
    "tpr_cat": 0.768,
    "tpr_lgb": 0.766,
    "baseline": 0.625
  },
  {
    "fpr": 0.65,
    "tpr_ensemble": 0.794,
    "tpr_xgb": 0.8,
    "tpr_cat": 0.786,
    "tpr_lgb": 0.78,
    "baseline": 0.65
  },
  {
    "fpr": 0.675,
    "tpr_ensemble": 0.815,
    "tpr_xgb": 0.817,
    "tpr_cat": 0.802,
    "tpr_lgb": 0.803,
    "baseline": 0.675
  },
  {
    "fpr": 0.7,
    "tpr_ensemble": 0.835,
    "tpr_xgb": 0.83,
    "tpr_cat": 0.819,
    "tpr_lgb": 0.82,
    "baseline": 0.7
  },
  {
    "fpr": 0.725,
    "tpr_ensemble": 0.851,
    "tpr_xgb": 0.852,
    "tpr_cat": 0.842,
    "tpr_lgb": 0.841,
    "baseline": 0.725
  },
  {
    "fpr": 0.75,
    "tpr_ensemble": 0.862,
    "tpr_xgb": 0.87,
    "tpr_cat": 0.859,
    "tpr_lgb": 0.864,
    "baseline": 0.75
  },
  {
    "fpr": 0.775,
    "tpr_ensemble": 0.874,
    "tpr_xgb": 0.883,
    "tpr_cat": 0.874,
    "tpr_lgb": 0.875,
    "baseline": 0.775
  },
  {
    "fpr": 0.8,
    "tpr_ensemble": 0.89,
    "tpr_xgb": 0.897,
    "tpr_cat": 0.891,
    "tpr_lgb": 0.888,
    "baseline": 0.8
  },
  {
    "fpr": 0.825,
    "tpr_ensemble": 0.908,
    "tpr_xgb": 0.91,
    "tpr_cat": 0.908,
    "tpr_lgb": 0.906,
    "baseline": 0.825
  },
  {
    "fpr": 0.85,
    "tpr_ensemble": 0.927,
    "tpr_xgb": 0.926,
    "tpr_cat": 0.921,
    "tpr_lgb": 0.921,
    "baseline": 0.85
  },
  {
    "fpr": 0.875,
    "tpr_ensemble": 0.94,
    "tpr_xgb": 0.938,
    "tpr_cat": 0.934,
    "tpr_lgb": 0.936,
    "baseline": 0.875
  },
  {
    "fpr": 0.9,
    "tpr_ensemble": 0.954,
    "tpr_xgb": 0.954,
    "tpr_cat": 0.948,
    "tpr_lgb": 0.949,
    "baseline": 0.9
  },
  {
    "fpr": 0.925,
    "tpr_ensemble": 0.965,
    "tpr_xgb": 0.964,
    "tpr_cat": 0.964,
    "tpr_lgb": 0.963,
    "baseline": 0.925
  },
  {
    "fpr": 0.95,
    "tpr_ensemble": 0.977,
    "tpr_xgb": 0.976,
    "tpr_cat": 0.979,
    "tpr_lgb": 0.975,
    "baseline": 0.95
  },
  {
    "fpr": 0.975,
    "tpr_ensemble": 0.989,
    "tpr_xgb": 0.988,
    "tpr_cat": 0.989,
    "tpr_lgb": 0.988,
    "baseline": 0.975
  },
  {
    "fpr": 1.0,
    "tpr_ensemble": 1.0,
    "tpr_xgb": 1.0,
    "tpr_cat": 1.0,
    "tpr_lgb": 1.0,
    "baseline": 1.0
  }
];

export const channelDistributionData = [
  {
    "name": "Karta (Cards)",
    "percentage": 53.8,
    "avgAmount": -0.05,
    "riskLevel": "Medium",
    "color": "#3b82f6"
  },
  {
    "name": "Bank O\u2018tkazmasi (Wire)",
    "percentage": 39.4,
    "avgAmount": 0.12,
    "riskLevel": "High",
    "color": "#8b5cf6"
  },
  {
    "name": "Naqd (Cash)",
    "percentage": 6.3,
    "avgAmount": -0.18,
    "riskLevel": "Critical",
    "color": "#f59e0b"
  },
  {
    "name": "Xalqaro (Cross-Border)",
    "percentage": 0.5,
    "avgAmount": 2.05,
    "riskLevel": "Extreme",
    "color": "#ef4444"
  }
];

export const caseStudiesData = [
  {
    "id": "SG_000187",
    "probability": 99.9,
    "classification": "Kritik Eskalatsiya (Tranzit Mule Kompaniya)",
    "status": "ESCALATE",
    "reason": "Yirik bank o'tkazmasi tushishi bilan 3 soat ichida 87.4% mablag'ni naqdlashtirish; 7 kunlik aylanma sur'ati keskin tezlashgan; Tranzit (Pass-through) ko'rsatkichi 0.94 (FATF/Markaziy Bank 2515-sonli Nizom 14-moddasi).",
    "riskColor": "red",
    "indicators": [
      {
        "name": "Naqd Chiqim Nisbati (Cash Ratio)",
        "value": "87.4%",
        "severity": "critical"
      },
      {
        "name": "15 Daqiqalik Klaster (Bursts)",
        "value": "14 ta operatsiya",
        "severity": "high"
      },
      {
        "name": "Chiqim Z-Score Oqishi",
        "value": "-3.84 sigma",
        "severity": "critical"
      },
      {
        "name": "Tranzit Hisob (Mule) Indeksi",
        "value": "0.94 (Kritik)",
        "severity": "high"
      }
    ]
  },
  {
    "id": "SG_001429",
    "probability": 94.2,
    "classification": "Kritik Eskalatsiya (Structuring & Smurfing)",
    "status": "ESCALATE",
    "reason": "100M so'mlik majburiy nazorat chegarasidan qochish maqsadida 45 daqiqa ichida bir nechta bankomatlardan 11 ta ketma-ket 9.5M so'mlik naqd pul yechish aniqlandi (ZRU-660 16-moddasi).",
    "riskColor": "red",
    "indicators": [
      {
        "name": "Structuring / Smurfing Tezligi",
        "value": "11 ta / 45 daqiqa",
        "severity": "critical"
      },
      {
        "name": "Chegara Osti O'rtacha Miqdor",
        "value": "9,500,000 UZS",
        "severity": "critical"
      },
      {
        "name": "Kassa Qoldig'i O'zgarishi",
        "value": "-98.2%",
        "severity": "high"
      },
      {
        "name": "Tranzaksiya Kanali",
        "value": "Naqd / ATM Klaster",
        "severity": "high"
      }
    ]
  },
  {
    "id": "SG_003810",
    "probability": 86.5,
    "classification": "Yuqori Xavf (Tungi P2P Kripto Funnel)",
    "status": "ESCALATE",
    "reason": "Tungi soat 02:30 va 04:15 oralig'ida 18 ta turli xil jismoniy shaxs kartalariga tezkor P2P o'tkazmalari amalga oshirilgan; g'ayritabiiy vaqt anomaliyasi va noaniq iqtisodiy maqsad.",
    "riskColor": "amber",
    "indicators": [
      {
        "name": "Tungi Vaqt Anomaliyasi (Night Ratio)",
        "value": "91.8% tungi oqim",
        "severity": "critical"
      },
      {
        "name": "Turli Kontragentlar Soni",
        "value": "18 ta karta / 2 soat",
        "severity": "high"
      },
      {
        "name": "Tezlik Sur'ati (Velocity Jump)",
        "value": "4.8x me'yordan ortiq",
        "severity": "high"
      },
      {
        "name": "Tranzaksiya Turi",
        "value": "Karta (P2P Split)",
        "severity": "medium"
      }
    ]
  },
  {
    "id": "SG_004921",
    "probability": 91.0,
    "classification": "Yuqori Xavf (Xalqaro Tranzit / Offshore)",
    "status": "ESCALATE",
    "reason": "Ichki tovar aylanmasi yoki xizmat ko'rsatish tarixi bo'lmagan yangi yuridik shaxs hisobiga chet eldan tushgan mablag'ning o'sha kunning o'zida noma'lum yurisdiksiyaga o'tkazilishi.",
    "riskColor": "red",
    "indicators": [
      {
        "name": "Xalqaro O'tkazma Nisbati",
        "value": "78.5% jami aylanmadan",
        "severity": "critical"
      },
      {
        "name": "Hisob Faoliyat Davomiyligi",
        "value": "14 kun (Yangi hisob)",
        "severity": "high"
      },
      {
        "name": "Soliq / Maosh To'lovlari Mavjudligi",
        "value": "Mavjud emas (0%)",
        "severity": "critical"
      },
      {
        "name": "Pass-Through Ko'rsatkichi",
        "value": "0.98 (Tranzit)",
        "severity": "high"
      }
    ]
  },
  {
    "id": "SG_000010",
    "probability": 9.5,
    "classification": "Asossiz Signal (Muntazam Chakana Savdo)",
    "status": "DISMISS",
    "reason": "180 kunlik barqaror faoliyat; chakana savdo terminalidan muntazam tushumlar va yetkazib beruvchilarga rejali to'lovlar; naqdlashtirish va tungi operatsiyalar yo'q.",
    "riskColor": "emerald",
    "indicators": [
      {
        "name": "Naqd Chiqim Nisbati",
        "value": "0.0% (Faqat terminal)",
        "severity": "low"
      },
      {
        "name": "15 Daqiqalik Klaster",
        "value": "0 ta (Normal oqim)",
        "severity": "low"
      },
      {
        "name": "Chiqim Z-Score Oqishi",
        "value": "+0.12 sigma (Barqaror)",
        "severity": "low"
      },
      {
        "name": "Tranzit Hisob Indeksi",
        "value": "0.11 (Haqiqiy biznes)",
        "severity": "low"
      }
    ]
  },
  {
    "id": "SG_002155",
    "probability": 4.2,
    "classification": "Asossiz Signal (Rejali Oylik Maosh)",
    "status": "DISMISS",
    "reason": "Har oyning 5-sanasida xodimlarning maosh kartalariga rejali o'tkazmalar; avvalgi oylar bilan 99% korrelyatsiya va to'liq soliq hisob-kitoblariga mos.",
    "riskColor": "emerald",
    "indicators": [
      {
        "name": "Maosh To'lovi Korrelyatsiyasi",
        "value": "0.99 (Rejali oylik)",
        "severity": "low"
      },
      {
        "name": "Chiqim Davriyligi",
        "value": "30 kunlik sikl",
        "severity": "low"
      },
      {
        "name": "Yangi Kontragentlar",
        "value": "0 ta (Doimiy xodimlar)",
        "severity": "low"
      },
      {
        "name": "Hisob Balansi Saqlanishi",
        "value": "Ijobiy qoldiq",
        "severity": "low"
      }
    ]
  }
];

export const centralBankRulesData = [
  {
    id: "MB-2515-01",
    name: "Katta hajmdagi naqdlashtirish (Cash-out Spike)",
    threshold: ">500 BHM (206,000,000 UZS) yoki z-score > 2.0",
    legalBasis: "O'zR Qonuni ZRU-660 16-moddasi, MB 2515-Nizomi",
    mlFeatureMapping: "amount_min, naqd_sum, naqd_turnover_ratio",
    riskWeight: "Juda Yuqori (Kritik)",
    penaltyRisk: "Bank va mansabdor shaxsga 50 mln - 200 mln UZS jarima"
  },
  {
    id: "MB-2515-02",
    name: "Smurfing / Structuring (Ketma-ket bo'lib yechish)",
    threshold: "15 daqiqa ichida >= 3 ta operatsiya yoki 24h ichida 5+ chegara osti amallar",
    legalBasis: "MB 2515-sonli Nizom 21-bandi (G'ayritabiiy amallar)",
    mlFeatureMapping: "burst_15m_count, max_15m_burst_count, velocity_1d",
    riskWeight: "Kritik (Jinoiy xavf)",
    penaltyRisk: "Hisobni to'xtatish va Bosh Prokuraturaga ma'lumot jo'natish"
  },
  {
    id: "MB-2515-03",
    name: "Tranzit (Pass-Through Mule) Operatsiyasi",
    threshold: "Mablag' tushgach 24 soat ichida 80%+ qismining chiqarilishi",
    legalBasis: "FATF 10-Tavsiya va MB 2515-Nizom 14-bandi",
    mlFeatureMapping: "pass_through_ratio, turnover_ratio_7d, chiqim_ratio_3d",
    riskWeight: "Yuqori (Mule hisob)",
    penaltyRisk: "Bank litsenziyasi bo'yicha ogohlantirish va hisobni muzlatish"
  },
  {
    id: "MB-2515-04",
    name: "Tungi Anomaliya & Noma'lum P2P Klaster",
    threshold: "01:00-05:00 soatlaridagi amallar nisbati > 40%",
    legalBasis: "Elektron to'lovlar xavfsizligi to'g'risidagi MB Nizomi",
    mlFeatureMapping: "night_ratio, weekend_ratio, tx_count_night",
    riskWeight: "O'rta-Yuqori",
    penaltyRisk: "Avtomatik 2FA bloklash va qo'shimcha verifikatsiya talabi"
  },
  {
    id: "MB-2515-05",
    name: "Xalqaro O'tkazmalar & Noaniq Yurisdiksiyalar",
    threshold: "Ichki operatsiyalari bo'lmagan hisobdan chet elga chiqim",
    legalBasis: "Valyutani tartibga solish qonunchiligi va FATF qora ro'yxati",
    mlFeatureMapping: "xalqaro_sum, xalqaro_ratio, chiqim_max",
    riskWeight: "Kritik",
    penaltyRisk: "Valyuta nazorati organlari tomonidan to'liq audit"
  }
];

export const summaryStats = {
  totalTrainSignals: 14000,
  totalTestSignals: 6000,
  totalTransactions: 10015238,
  escalationRate: 17.18,
  engineeredFeatures: 226,
  teamName: "gitcore",
  teamId: "98F12CFB",
  submissionFile: "team_98F12CFB.csv"
};

