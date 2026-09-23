import pandas as pd
import numpy as np

data_dir = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"

train_signals = pd.read_csv(f"{data_dir}/train_signals.csv")
train_signals['signal_sanasi'] = pd.to_datetime(train_signals['signal_sanasi'])
train_tx = pd.read_parquet(f"{data_dir}/train_transactions.parquet")

tx_merged = train_tx.merge(train_signals[['signal_id', 'signal_sanasi', 'eskalatsiya']], on='signal_id', how='left')
tx_merged['hours_before'] = (tx_merged['signal_sanasi'] - tx_merged['tranzaksiya_vaqti']).dt.total_seconds() / 3600.0
tx_merged['hour_of_day'] = tx_merged['tranzaksiya_vaqti'].dt.hour
tx_merged['is_night'] = (tx_merged['hour_of_day'] >= 0) & (tx_merged['hour_of_day'] <= 6)
tx_merged['is_weekend'] = tx_merged['tranzaksiya_vaqti'].dt.dayofweek >= 5

# Separate kirim and chiqim
kirim_tx = tx_merged[tx_merged['kirim_chiqim'] == 'kirim']
chiqim_tx = tx_merged[tx_merged['kirim_chiqim'] == 'chiqim']

print("Kirim amount mean:", kirim_tx['miqdor_indeksi'].mean())
print("Chiqim amount mean:", chiqim_tx['miqdor_indeksi'].mean())

# Check correlations with eskalatsiya
# Let's aggregate by signal_id
grouped = tx_merged.groupby('signal_id')

features = pd.DataFrame(index=train_signals['signal_id'].values)
features['eskalatsiya'] = train_signals.set_index('signal_id')['eskalatsiya']

# Basic counts & amounts
stats = grouped.agg(
    total_tx=('miqdor_indeksi', 'count'),
    mean_amount=('miqdor_indeksi', 'mean'),
    std_amount=('miqdor_indeksi', 'std'),
    min_amount=('miqdor_indeksi', 'min'),
    max_amount=('miqdor_indeksi', 'max'),
    sum_amount=('miqdor_indeksi', 'sum'),
    night_ratio=('is_night', 'mean'),
    weekend_ratio=('is_weekend', 'mean'),
)

features = features.join(stats)

# Kirim / chiqim breakdowns
kirim_stats = kirim_tx.groupby('signal_id').agg(
    kirim_count=('miqdor_indeksi', 'count'),
    kirim_mean=('miqdor_indeksi', 'mean'),
    kirim_max=('miqdor_indeksi', 'max'),
    kirim_sum=('miqdor_indeksi', 'sum'),
)
chiqim_stats = chiqim_tx.groupby('signal_id').agg(
    chiqim_count=('miqdor_indeksi', 'count'),
    chiqim_mean=('miqdor_indeksi', 'mean'),
    chiqim_max=('miqdor_indeksi', 'max'),
    chiqim_sum=('miqdor_indeksi', 'sum'),
)

features = features.join(kirim_stats).join(chiqim_stats).fillna(0)

features['kirim_chiqim_ratio'] = features['kirim_count'] / (features['chiqim_count'] + 1)
features['net_amount'] = features['kirim_sum'] - features['chiqim_sum']

# Transaction types
for t_type in ['karta', 'bank_otkazmasi', 'naqd', 'xalqaro']:
    sub = tx_merged[tx_merged['tranzaksiya_turi'] == t_type].groupby('signal_id')
    features[f'{t_type}_count'] = sub['miqdor_indeksi'].count()
    features[f'{t_type}_ratio'] = features[f'{t_type}_count'] / features['total_tx']
    features[f'{t_type}_sum'] = sub['miqdor_indeksi'].sum()

features = features.fillna(0)

# Windowed counts (last 24h, 3d, 7d, 30d, 90d)
for hours, name in [(24, '24h'), (72, '3d'), (168, '7d'), (720, '30d')]:
    sub = tx_merged[tx_merged['hours_before'] <= hours].groupby('signal_id')
    features[f'tx_{name}'] = sub['miqdor_indeksi'].count()
    features[f'sum_{name}'] = sub['miqdor_indeksi'].sum()
    features[f'mean_{name}'] = sub['miqdor_indeksi'].mean()

features = features.fillna(0)

# Calculate correlations with eskalatsiya
corrs = features.corr()['eskalatsiya'].sort_values()
print("\n--- TOP CORRELATIONS WITH ESKALATSIYA ---")
print(corrs.to_string())
