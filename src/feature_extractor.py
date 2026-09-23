"""
gitcore AML Feature Engineering Engine
Extracts ~200 domain-driven AML features from transaction histories.
Optimized for memory and speed with vectorized operations.
Zero-leakage: all features strictly use transactions before signal_sanasi.
"""

import pandas as pd
import numpy as np
import time

def extract_features(signals_df: pd.DataFrame, tx_df: pd.DataFrame) -> pd.DataFrame:
    t0 = time.time()
    print(f"Starting feature extraction for {len(signals_df)} signals and {len(tx_df)} transactions...")
    
    # 1. Prepare datetimes
    signals = signals_df.copy()
    signals['signal_sanasi'] = pd.to_datetime(signals['signal_sanasi'])
    
    tx = tx_df.copy()
    tx['tranzaksiya_vaqti'] = pd.to_datetime(tx['tranzaksiya_vaqti'])
    
    # Merge signal date to compute relative time
    print("  -> Computing temporal offsets and domain indicators...")
    tx = tx.merge(signals[['signal_id', 'signal_sanasi']], on='signal_id', how='left')
    tx['hours_before'] = (tx['signal_sanasi'] - tx['tranzaksiya_vaqti']).dt.total_seconds() / 3600.0
    tx['days_before'] = tx['hours_before'] / 24.0
    
    # Transactions occurring on the same day as signal_sanasi (00:00:00) clip to 0.0
    tx['hours_before'] = tx['hours_before'].clip(lower=0.0)
    tx['days_before'] = tx['days_before'].clip(lower=0.0)
    
    # Temporal & Hour flags
    tx['hour'] = tx['tranzaksiya_vaqti'].dt.hour
    tx['is_night'] = ((tx['hour'] >= 0) & (tx['hour'] <= 6)).astype(np.int8)
    tx['is_weekend'] = (tx['tranzaksiya_vaqti'].dt.dayofweek >= 5).astype(np.int8)
    tx['tx_date'] = tx['tranzaksiya_vaqti'].dt.date
    
    # Direction flags
    tx['is_kirim'] = (tx['kirim_chiqim'] == 'kirim').astype(np.int8)
    tx['is_chiqim'] = (tx['kirim_chiqim'] == 'chiqim').astype(np.int8)
    
    # Channel type flags
    tx['is_karta'] = (tx['tranzaksiya_turi'] == 'karta').astype(np.int8)
    tx['is_bank'] = (tx['tranzaksiya_turi'] == 'bank_otkazmasi').astype(np.int8)
    tx['is_naqd'] = (tx['tranzaksiya_turi'] == 'naqd').astype(np.int8)
    tx['is_xalqaro'] = (tx['tranzaksiya_turi'] == 'xalqaro').astype(np.int8)
    
    # Signed amount (kirim positive, chiqim negative)
    tx['signed_amount'] = np.where(tx['is_kirim'] == 1, tx['miqdor_indeksi'], -tx['miqdor_indeksi'])
    
    # Cross Type x Direction
    tx['naqd_chiqim'] = tx['is_naqd'] * tx['is_chiqim']
    tx['naqd_kirim'] = tx['is_naqd'] * tx['is_kirim']
    tx['xalqaro_chiqim'] = tx['is_xalqaro'] * tx['is_chiqim']
    tx['xalqaro_kirim'] = tx['is_xalqaro'] * tx['is_kirim']
    tx['bank_chiqim'] = tx['is_bank'] * tx['is_chiqim']
    tx['bank_kirim'] = tx['is_bank'] * tx['is_kirim']
    tx['karta_chiqim'] = tx['is_karta'] * tx['is_chiqim']
    tx['karta_kirim'] = tx['is_karta'] * tx['is_kirim']
    
    # Extreme magnitude flags
    tx['is_large'] = (tx['miqdor_indeksi'] > 1.5).astype(np.int8)
    tx['is_very_large'] = (tx['miqdor_indeksi'] > 2.5).astype(np.int8)
    tx['is_small'] = (tx['miqdor_indeksi'] < -1.5).astype(np.int8)
    
    # Inter-arrival bursts
    print("  -> Calculating transaction inter-arrival times and burst signatures...")
    tx = tx.sort_values(['signal_id', 'tranzaksiya_vaqti'])
    tx['diff_sec'] = tx.groupby('signal_id')['tranzaksiya_vaqti'].diff().dt.total_seconds()
    tx['diff_hours'] = tx['diff_sec'] / 3600.0
    tx['is_burst_5m'] = ((tx['diff_sec'] <= 300) & (tx['diff_sec'] >= 0)).astype(np.int8)
    tx['is_burst_15m'] = ((tx['diff_sec'] <= 900) & (tx['diff_sec'] >= 0)).astype(np.int8)
    tx['is_burst_1h'] = ((tx['diff_sec'] <= 3600) & (tx['diff_sec'] >= 0)).astype(np.int8)

    # 2. Global Aggregations
    print("  -> Computing global statistics...")
    agg_global = tx.groupby('signal_id').agg(
        tx_count=('miqdor_indeksi', 'count'),
        amount_mean=('miqdor_indeksi', 'mean'),
        amount_std=('miqdor_indeksi', 'std'),
        amount_min=('miqdor_indeksi', 'min'),
        amount_max=('miqdor_indeksi', 'max'),
        amount_sum=('miqdor_indeksi', 'sum'),
        amount_median=('miqdor_indeksi', 'median'),
        
        # Directions
        kirim_count=('is_kirim', 'sum'),
        chiqim_count=('is_chiqim', 'sum'),
        
        # Types
        karta_count=('is_karta', 'sum'),
        bank_count=('is_bank', 'sum'),
        naqd_count=('is_naqd', 'sum'),
        xalqaro_count=('is_xalqaro', 'sum'),
        
        # Crosses
        naqd_chiqim_count=('naqd_chiqim', 'sum'),
        naqd_kirim_count=('naqd_kirim', 'sum'),
        xalqaro_chiqim_count=('xalqaro_chiqim', 'sum'),
        xalqaro_kirim_count=('xalqaro_kirim', 'sum'),
        bank_chiqim_count=('bank_chiqim', 'sum'),
        bank_kirim_count=('bank_kirim', 'sum'),
        karta_chiqim_count=('karta_chiqim', 'sum'),
        karta_kirim_count=('karta_kirim', 'sum'),
        
        # Extremes
        large_count=('is_large', 'sum'),
        very_large_count=('is_very_large', 'sum'),
        small_count=('is_small', 'sum'),
        
        # Behavioral
        night_ratio=('is_night', 'mean'),
        weekend_ratio=('is_weekend', 'mean'),
        burst_5m_count=('is_burst_5m', 'sum'),
        burst_15m_count=('is_burst_15m', 'sum'),
        burst_1h_count=('is_burst_1h', 'sum'),
        diff_hours_mean=('diff_hours', 'mean'),
        diff_hours_median=('diff_hours', 'median'),
        diff_hours_min=('diff_hours', 'min'),
        
        # Recency
        hours_to_last_tx=('hours_before', 'min'),
        history_span_days=('days_before', 'max'),
        active_days=('tx_date', 'nunique'),
    )

    # Direction sums
    kirim_sums = tx[tx['is_kirim'] == 1].groupby('signal_id')['miqdor_indeksi'].agg(
        kirim_sum='sum', kirim_mean='mean', kirim_max='max', kirim_std='std'
    )
    chiqim_sums = tx[tx['is_chiqim'] == 1].groupby('signal_id')['miqdor_indeksi'].agg(
        chiqim_sum='sum', chiqim_mean='mean', chiqim_max='max', chiqim_std='std'
    )
    
    # Type sums
    channel_dfs = []
    for col, name in [('is_karta', 'karta'), ('is_bank', 'bank'), ('is_naqd', 'naqd'), ('is_xalqaro', 'xalqaro')]:
        sub = tx[tx[col] == 1].groupby('signal_id')['miqdor_indeksi'].agg(
            **{f'{name}_sum': 'sum', f'{name}_mean': 'mean', f'{name}_max': 'max'}
        )
        channel_dfs.append(sub)

    # Combine initial global features
    feats = pd.concat([agg_global, kirim_sums, chiqim_sums] + channel_dfs, axis=1).reindex(signals['signal_id'].values).fillna(0)

    # Computed global ratios (vectorized dictionary for anti-fragmentation)
    ratios = {}
    ratios['amount_range'] = feats['amount_max'] - feats['amount_min']
    ratios['kirim_ratio'] = feats['kirim_count'] / feats['tx_count']
    ratios['chiqim_ratio'] = feats['chiqim_count'] / feats['tx_count']
    ratios['kirim_chiqim_count_ratio'] = feats['kirim_count'] / (feats['chiqim_count'] + 1)
    ratios['net_flow'] = feats['kirim_sum'] - feats['chiqim_sum']
    ratios['turnover'] = feats['kirim_sum'] + feats['chiqim_sum']
    ratios['flow_pass_through_ratio'] = np.abs(ratios['net_flow']) / (np.abs(ratios['turnover']) + 1e-5)
    
    ratios['karta_ratio'] = feats['karta_count'] / feats['tx_count']
    ratios['bank_ratio'] = feats['bank_count'] / feats['tx_count']
    ratios['naqd_ratio'] = feats['naqd_count'] / feats['tx_count']
    ratios['xalqaro_ratio'] = feats['xalqaro_count'] / feats['tx_count']
    
    # Financial AML ratios
    ratios['naqd_turnover_ratio'] = feats['naqd_sum'] / (ratios['turnover'] + 1e-5)
    ratios['xalqaro_turnover_ratio'] = feats['xalqaro_sum'] / (ratios['turnover'] + 1e-5)
    ratios['bank_turnover_ratio'] = feats['bank_sum'] / (ratios['turnover'] + 1e-5)
    ratios['karta_turnover_ratio'] = feats['karta_sum'] / (ratios['turnover'] + 1e-5)
    
    ratios['tx_per_active_day'] = feats['tx_count'] / (feats['active_days'] + 1e-5)
    ratios['burst_ratio_5m'] = feats['burst_5m_count'] / feats['tx_count']
    ratios['burst_ratio_15m'] = feats['burst_15m_count'] / feats['tx_count']
    ratios['burst_ratio_1h'] = feats['burst_1h_count'] / feats['tx_count']
    
    feats = pd.concat([feats, pd.DataFrame(ratios, index=feats.index)], axis=1)

    # 3. Rolling Window Aggregations (24h, 3d, 7d, 14d, 30d, 60d)
    print("  -> Computing multi-scale temporal windows (24h, 3d, 7d, 14d, 30d, 60d)...")
    window_dfs = []
    windows = [(24, '24h'), (72, '3d'), (168, '7d'), (336, '14d'), (720, '30d'), (1440, '60d')]
    for max_hours, w_name in windows:
        w_tx = tx[tx['hours_before'] <= max_hours]
        w_agg = w_tx.groupby('signal_id').agg(
            **{
                f'tx_{w_name}': ('miqdor_indeksi', 'count'),
                f'sum_{w_name}': ('miqdor_indeksi', 'sum'),
                f'mean_{w_name}': ('miqdor_indeksi', 'mean'),
                f'max_{w_name}': ('miqdor_indeksi', 'max'),
                f'std_{w_name}': ('miqdor_indeksi', 'std'),
                f'kirim_count_{w_name}': ('is_kirim', 'sum'),
                f'chiqim_count_{w_name}': ('is_chiqim', 'sum'),
                f'naqd_count_{w_name}': ('is_naqd', 'sum'),
                f'xalqaro_count_{w_name}': ('is_xalqaro', 'sum'),
                f'bank_count_{w_name}': ('is_bank', 'sum'),
                f'karta_count_{w_name}': ('is_karta', 'sum'),
                f'large_count_{w_name}': ('is_large', 'sum'),
                f'burst_15m_{w_name}': ('is_burst_15m', 'sum'),
                f'night_count_{w_name}': ('is_night', 'sum'),
            }
        )
        window_dfs.append(w_agg)

    feats = pd.concat([feats] + window_dfs, axis=1).fillna(0)

    # Multi-scale ratios & velocity accelerations
    print("  -> Computing velocity acceleration and surge indices...")
    vel = {}
    for _, w_name in windows:
        vel[f'tx_ratio_{w_name}'] = feats[f'tx_{w_name}'] / (feats['tx_count'] + 1e-5)
        vel[f'chiqim_ratio_{w_name}'] = feats[f'chiqim_count_{w_name}'] / (feats[f'tx_{w_name}'] + 1e-5)
        vel[f'naqd_ratio_{w_name}'] = feats[f'naqd_count_{w_name}'] / (feats[f'tx_{w_name}'] + 1e-5)
        vel[f'xalqaro_ratio_{w_name}'] = feats[f'xalqaro_count_{w_name}'] / (feats[f'tx_{w_name}'] + 1e-5)

    vel['velocity_tx_24h_to_7d'] = feats['tx_24h'] / (feats['tx_7d'] / 7.0 + 0.1)
    vel['velocity_tx_24h_to_30d'] = feats['tx_24h'] / (feats['tx_30d'] / 30.0 + 0.1)
    vel['velocity_tx_3d_to_30d'] = feats['tx_3d'] / (feats['tx_30d'] / 10.0 + 0.1)
    vel['velocity_tx_7d_to_30d'] = feats['tx_7d'] / (feats['tx_30d'] / 4.28 + 0.1)
    
    vel['velocity_sum_24h_to_7d'] = feats['sum_24h'] / (feats['sum_7d'] / 7.0 + 0.1)
    vel['velocity_sum_24h_to_30d'] = feats['sum_24h'] / (feats['sum_30d'] / 30.0 + 0.1)
    vel['velocity_sum_7d_to_30d'] = feats['sum_7d'] / (feats['sum_30d'] / 4.28 + 0.1)
    
    vel['spike_chiqim_24h'] = vel['chiqim_ratio_24h'] - feats['chiqim_ratio']
    vel['spike_chiqim_7d'] = vel['chiqim_ratio_7d'] - feats['chiqim_ratio']
    vel['spike_naqd_24h'] = vel['naqd_ratio_24h'] - feats['naqd_ratio']
    vel['spike_naqd_7d'] = vel['naqd_ratio_7d'] - feats['naqd_ratio']
    vel['spike_xalqaro_7d'] = vel['xalqaro_ratio_7d'] - feats['xalqaro_ratio']

    feats = pd.concat([feats, pd.DataFrame(vel, index=feats.index)], axis=1)

    # 4. Trigger / Last N Transaction Signatures
    print("  -> Computing trigger transaction signatures...")
    tx_desc = tx.sort_values(['signal_id', 'tranzaksiya_vaqti'], ascending=[True, False])
    
    # Last 1 transaction (the potential alert trigger)
    last1 = tx_desc.groupby('signal_id').first()
    trig = {}
    trig['last1_amount'] = last1['miqdor_indeksi']
    trig['last1_is_chiqim'] = last1['is_chiqim']
    trig['last1_is_naqd'] = last1['is_naqd']
    trig['last1_is_xalqaro'] = last1['is_xalqaro']
    trig['last1_is_bank'] = last1['is_bank']
    trig['last1_is_karta'] = last1['is_karta']
    trig['last1_is_night'] = last1['is_night']
    trig['last1_is_large'] = last1['is_large']
    trig['last1_hours_before'] = last1['hours_before']
    trig['last1_diff_hours'] = last1['diff_hours']

    # Trigger interactions with account baseline
    trig['last1_amount_vs_mean'] = trig['last1_amount'] - feats['amount_mean']
    trig['last1_amount_zscore'] = trig['last1_amount_vs_mean'] / (feats['amount_std'] + 1e-5)
    trig['max_amount_zscore'] = (feats['amount_max'] - feats['amount_mean']) / (feats['amount_std'] + 1e-5)
    trig['min_amount_zscore'] = (feats['amount_min'] - feats['amount_mean']) / (feats['amount_std'] + 1e-5)

    # Last 3 transactions
    last3 = tx_desc.groupby('signal_id').head(3).groupby('signal_id').agg(
        last3_mean_amount=('miqdor_indeksi', 'mean'),
        last3_max_amount=('miqdor_indeksi', 'max'),
        last3_sum_amount=('miqdor_indeksi', 'sum'),
        last3_chiqim_count=('is_chiqim', 'sum'),
        last3_naqd_count=('is_naqd', 'sum'),
        last3_xalqaro_count=('is_xalqaro', 'sum'),
        last3_large_count=('is_large', 'sum'),
    )
    
    # Last 5 transactions
    last5 = tx_desc.groupby('signal_id').head(5).groupby('signal_id').agg(
        last5_mean_amount=('miqdor_indeksi', 'mean'),
        last5_sum_amount=('miqdor_indeksi', 'sum'),
        last5_chiqim_ratio=('is_chiqim', 'mean'),
        last5_naqd_ratio=('is_naqd', 'mean'),
        last5_burst_count=('is_burst_15m', 'sum'),
    )

    feats = pd.concat([feats, pd.DataFrame(trig, index=feats.index), last3, last5], axis=1).fillna(0)

    # 5. Calendar Features from Signal Date
    print("  -> Computing calendar features...")
    sig_dates = signals.set_index('signal_id')['signal_sanasi'].reindex(feats.index)
    cal = {}
    cal['signal_month'] = sig_dates.dt.month
    cal['signal_dayofweek'] = sig_dates.dt.dayofweek
    cal['signal_day'] = sig_dates.dt.day
    cal['signal_is_weekend'] = (sig_dates.dt.dayofweek >= 5).astype(np.int8)
    cal['signal_is_monthend'] = (sig_dates.dt.day >= 25).astype(np.int8)
    cal['signal_quarter'] = sig_dates.dt.quarter
    
    feats = pd.concat([feats, pd.DataFrame(cal, index=feats.index)], axis=1)

    # Clean infinities and NaNs
    feats = feats.replace([np.inf, -np.inf], np.nan).fillna(0)
    
    # Ensure all float columns are float32 to conserve RAM
    float_cols = feats.select_dtypes(include=['float64']).columns
    feats[float_cols] = feats[float_cols].astype(np.float32)
    
    print(f"Feature extraction completed in {time.time() - t0:.2f}s! Total features: {feats.shape[1]}")
    return feats

if __name__ == "__main__":
    data_dir = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"
    signals = pd.read_csv(f"{data_dir}/train_signals.csv", nrows=500)
    tx = pd.read_parquet(f"{data_dir}/train_transactions.parquet")
    tx_sub = tx[tx['signal_id'].isin(signals['signal_id'])].copy()
    df = extract_features(signals, tx_sub)
    print("Test passed! Shape:", df.shape)
