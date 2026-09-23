import pandas as pd
import numpy as np

data_dir = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"

print("--- 1. LOADING SIGNALS ---")
train_signals = pd.read_csv(f"{data_dir}/train_signals.csv")
test_signals = pd.read_csv(f"{data_dir}/test_signals.csv")
sample_sub = pd.read_csv(f"{data_dir}/sample_submission (3).csv")

print(f"train_signals shape: {train_signals.shape}")
print(train_signals.head())
print("\ntrain_signals info:")
print(train_signals.info())

print(f"\ntest_signals shape: {test_signals.shape}")
print(test_signals.head())

print(f"\nsample_sub shape: {sample_sub.shape}")
print(sample_sub.head())

print("\n--- 2. TARGET DISTRIBUTION ---")
print("Target counts:")
print(train_signals['eskalatsiya'].value_counts())
print("\nTarget percentage:")
print(train_signals['eskalatsiya'].value_counts(normalize=True) * 100)

print("\n--- 3. DATE RANGES ---")
train_signals['signal_sanasi'] = pd.to_datetime(train_signals['signal_sanasi'])
test_signals['signal_sanasi'] = pd.to_datetime(test_signals['signal_sanasi'])

print(f"Train signals date range: {train_signals['signal_sanasi'].min()} to {train_signals['signal_sanasi'].max()}")
print(f"Test signals date range:  {test_signals['signal_sanasi'].min()} to {test_signals['signal_sanasi'].max()}")

print("\n--- 4. LOADING TRANSACTIONS SAMPLE ---")
train_tx = pd.read_parquet(f"{data_dir}/train_transactions.parquet")
test_tx = pd.read_parquet(f"{data_dir}/test_transactions.parquet")

print(f"train_transactions shape: {train_tx.shape}")
print(train_tx.head())
print("\ntrain_transactions info:")
print(train_tx.info())

print(f"\ntest_transactions shape: {test_tx.shape}")
print(test_tx.head())

print("\nUnique signals in train_transactions:", train_tx['signal_id'].nunique())
print("Unique signals in test_transactions:", test_tx['signal_id'].nunique())

print("\nTransactions per signal stats (Train):")
tx_per_signal = train_tx['signal_id'].value_counts()
print(tx_per_signal.describe())

print("\n--- 5. CATEGORICAL COLUMNS ---")
print("kirim_chiqim distribution:")
print(train_tx['kirim_chiqim'].value_counts(dropna=False))
print("\ntranzaksiya_turi distribution:")
print(train_tx['tranzaksiya_turi'].value_counts(dropna=False))

print("\n--- 6. MIQDOR INDEKSI STATS ---")
print(train_tx['miqdor_indeksi'].describe())
