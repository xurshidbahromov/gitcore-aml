import pandas as pd
import numpy as np

data_dir = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"

train_signals = pd.read_csv(f"{data_dir}/train_signals.csv")
train_signals['signal_sanasi'] = pd.to_datetime(train_signals['signal_sanasi'])

train_tx = pd.read_parquet(f"{data_dir}/train_transactions.parquet")

# Merge signal date with transactions
tx_merged = train_tx.merge(train_signals[['signal_id', 'signal_sanasi', 'eskalatsiya']], on='signal_id', how='left')
tx_merged['days_before_signal'] = (tx_merged['signal_sanasi'] - tx_merged['tranzaksiya_vaqti']).dt.total_seconds() / 86400.0

print("--- TIMING CHECK ---")
print("Min days before signal:", tx_merged['days_before_signal'].min())
print("Max days before signal:", tx_merged['days_before_signal'].max())
print("Negative days before signal count (Transactions after signal date):", (tx_merged['days_before_signal'] < 0).sum())

# Check how far back transactions go
print("\nQuantiles of days_before_signal:")
print(tx_merged['days_before_signal'].quantile([0.01, 0.05, 0.1, 0.25, 0.5, 0.75, 0.95, 0.99]))

# Check comparison between Escalated (1) vs Dismissed (0)
print("\n--- ESCA vs DISMISSED COMPARISON ---")

# Group by signal_id
signal_stats = tx_merged.groupby(['signal_id', 'eskalatsiya']).agg(
    tx_count=('miqdor_indeksi', 'count'),
    mean_amount=('miqdor_indeksi', 'mean'),
    max_amount=('miqdor_indeksi', 'max'),
    sum_amount=('miqdor_indeksi', 'sum'),
    std_amount=('miqdor_indeksi', 'std'),
    xalqaro_count=('tranzaksiya_turi', lambda x: (x == 'xalqaro').sum()),
    naqd_count=('tranzaksiya_turi', lambda x: (x == 'naqd').sum()),
    karta_count=('tranzaksiya_turi', lambda x: (x == 'karta').sum()),
    bank_count=('tranzaksiya_turi', lambda x: (x == 'bank_otkazmasi').sum()),
    kirim_count=('kirim_chiqim', lambda x: (x == 'kirim').sum()),
    chiqim_count=('kirim_chiqim', lambda x: (x == 'chiqim').sum()),
    tx_last_1d=('days_before_signal', lambda x: (x <= 1).sum()),
    tx_last_3d=('days_before_signal', lambda x: (x <= 3).sum()),
    tx_last_7d=('days_before_signal', lambda x: (x <= 7).sum()),
    tx_last_30d=('days_before_signal', lambda x: (x <= 30).sum()),
).reset_index()

print("\nMean feature values by eskalatsiya (0 vs 1):")
comp = signal_stats.drop(columns=['signal_id']).groupby('eskalatsiya').mean().T
comp['ratio_1_to_0'] = comp[1] / comp[0]
print(comp)
