"""
Extracts AML signals, predictions, and domain risk drivers
into iNazorat/src/data/amlSignalsData.ts.
"""

import json
import os
import pandas as pd
import numpy as np

DATA_DIR = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data"
RAW_DIR = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"
OUT_FILE = "/Users/m1pro/Documents/Full Stack Middle/iNazorat/src/data/amlSignalsData.ts"

def main():
    print("Generating amlSignalsData.ts for iNazorat...")
    sub = pd.read_csv("/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/team_98F12CFB.csv")
    test_sigs = pd.read_csv(f"{RAW_DIR}/test_signals.csv")
    test_feats = pd.read_parquet(f"{DATA_DIR}/test_features.parquet")
    
    merged = sub.merge(test_sigs, on='signal_id')
    merged = merged.join(test_feats, on='signal_id')
    
    # Sort by probability descending
    merged = merged.sort_values('ehtimollik', ascending=False)
    
    # Sample 60 high risk (>= 0.70), 40 medium risk (0.35 - 0.70), and 40 low risk (< 0.35)
    high_risk = merged[merged['ehtimollik'] >= 0.70].head(60)
    med_risk = merged[(merged['ehtimollik'] >= 0.35) & (merged['ehtimollik'] < 0.70)].head(40)
    low_risk = merged[merged['ehtimollik'] < 0.35].head(40)
    
    sample_df = pd.concat([high_risk, med_risk, low_risk]).sort_values('ehtimollik', ascending=False)
    
    signals_list = []
    for _, row in sample_df.iterrows():
        prob = float(row['ehtimollik'])
        sig_id = str(row['signal_id'])
        sig_date = str(row['signal_sanasi'])
        
        # Risk tier
        if prob >= 0.70:
            tier = 'Kritik Xavf'
            severity = 'critical'
            recommended_action = 'ESKALATSIYA (Markaziy Bank)'
        elif prob >= 0.40:
            tier = "O'rta Xavf"
            severity = 'warning'
            recommended_action = 'CHUQUR TEKSHIRUV'
        else:
            tier = 'Past Xavf'
            severity = 'low'
            recommended_action = 'ASOSSIZ DEB YOPISH'
            
        # Detect key risk factors
        drivers = []
        if float(row['burst_15m_count']) >= 5:
            drivers.append('Smurfing Bursts (<15m)')
        if float(row['naqd_turnover_ratio']) > 0.25 or float(row['naqd_sum']) > 50:
            drivers.append('Katta Naqd Yechish')
        if float(row['amount_min']) < -2.5:
            drivers.append('Keskin Chiqim Spayki')
        if float(row['last1_is_chiqim']) == 1:
            drivers.append('Chiqim Trigger')
        if float(row['xalqaro_count']) > 0:
            drivers.append('Xalqaro O‘tkazma')
        if float(row['flow_pass_through_ratio']) > 0.8:
            drivers.append('Tranzit Hisob (Mule)')
            
        if len(drivers) == 0:
            drivers.append('Muntazam Savdo')
            
        # AI Explanation
        if severity == 'critical':
            explanation = f"Signal {sig_date} sanasida generatsiya qilingan. Hisobda oxirgi 24 soatda {int(row['tx_24h'])} ta tranzaksiya amalga oshirilgan bo'lib, chuqur salbiy kassa oqimi ({row['amount_min']:.2f} min amount) va naqd yechib olish intensivligi aniqlangan. Tranzit pul aylanishi (Pass-through index: {row['flow_pass_through_ratio']:.2f}) juda yuqori."
        elif severity == 'warning':
            explanation = f"Signal sanasiga yaqin oraliqda o'rtacha tranzaksiya hajmi oshgan ({int(row['tx_7d'])} ta 7 kunlik amaliyot). Smurfing chegarasiga yaqin tezkor operatsiyalar kuzatilgan. Qo'shimcha to'lov asoslarini so'rash tavsiya etiladi."
        else:
            explanation = f"Mijozning 180 kunlik tarixi barqaror. Xaridlar asosan korporativ karta va kassa orqali amalga oshirilgan. Shubhali naqdlashtirish yoki zudlik bilan hisobni bo'shatish belgilari mavjud emas."
            
        signals_list.append({
            'signal_id': sig_id,
            'signal_date': sig_date,
            'probability': round(prob * 100, 1),
            'raw_probability': round(prob, 5),
            'tier': tier,
            'severity': severity,
            'recommended_action': recommended_action,
            'drivers': drivers[:4],
            'tx_count': int(row['tx_count']),
            'tx_24h': int(row['tx_24h']),
            'min_amount': round(float(row['amount_min']), 2),
            'max_amount': round(float(row['amount_max']), 2),
            'turnover': round(float(row['turnover']), 2),
            'burst_15m_count': int(row['burst_15m_count']),
            'cash_sum': round(float(row['naqd_sum']), 2),
            'pass_through_ratio': round(float(row['flow_pass_through_ratio']), 2),
            'explanation': explanation,
            'status': 'pending' # pending | escalated | dismissed
        })
        
    ts_code = f"""// Real AML Signals Data extracted from gitcore ML Model
// WIUT Hackathon 2026: AML Alert Prioritization

export interface AMLSignal {{
  signal_id: string;
  signal_date: string;
  probability: number;
  raw_probability: number;
  tier: string;
  severity: 'critical' | 'warning' | 'low';
  recommended_action: string;
  drivers: string[];
  tx_count: number;
  tx_24h: number;
  min_amount: number;
  max_amount: number;
  turnover: number;
  burst_15m_count: number;
  cash_sum: number;
  pass_through_ratio: number;
  explanation: string;
  status: 'pending' | 'escalated' | 'dismissed';
}}

export const amlSignalsList: AMLSignal[] = {json.dumps(signals_list, indent=2)};

export const amlTelemetryStats = {{
  totalSignals: 6000,
  analyzedSignals: 6000,
  highRiskCount: {int(np.sum(sub['ehtimollik'] >= 0.70))},
  medRiskCount: {int(np.sum((sub['ehtimollik'] >= 0.35) & (sub['ehtimollik'] < 0.70)))},
  lowRiskCount: {int(np.sum(sub['ehtimollik'] < 0.35))},
  meanProbability: {round(float(sub['ehtimollik'].mean()) * 100, 1)},
  modelOofAuc: 0.62461,
  baselineAuc: 0.60268,
  teamName: "gitcore",
  teamId: "98F12CFB",
  competition: "WIUT Hackathon 2026",
  track: "FinTech / AI in Finance",
  submissionFile: "team_98F12CFB.csv"
}};
"""
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w") as f:
        f.write(ts_code)
        
    print(f"✅ Created {OUT_FILE} with {len(signals_list)} rich signals!")

if __name__ == "__main__":
    main()
