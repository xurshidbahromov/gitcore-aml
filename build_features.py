"""
Build and cache all train and test features for gitcore AML model.
Saves to data/train_features.parquet and data/test_features.parquet.
"""

import sys
import os
import time
import pandas as pd

sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))
from feature_extractor import extract_features

DATA_DIR = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"
OUT_DIR = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data"

def main():
    total_start = time.time()
    print("=" * 60)
    print("  🚀 GITCORE AML FEATURE BUILD & CACHE PIPELINE")
    print("=" * 60)
    
    # --- 1. TRAIN FEATURES ---
    print("\n[1/2] Processing TRAIN dataset...")
    train_signals = pd.read_csv(f"{DATA_DIR}/train_signals.csv")
    print(f"Loaded {len(train_signals)} train signals.")
    
    print("Loading train transactions (parquet)...")
    train_tx = pd.read_parquet(f"{DATA_DIR}/train_transactions.parquet")
    print(f"Loaded {len(train_tx):,} transactions.")
    
    train_features = extract_features(train_signals, train_tx)
    
    # Attach target
    train_features['eskalatsiya'] = train_signals.set_index('signal_id')['eskalatsiya'].reindex(train_features.index)
    
    train_out_path = f"{OUT_DIR}/train_features.parquet"
    train_features.to_parquet(train_out_path)
    print(f"✅ Saved train features to {train_out_path} (Shape: {train_features.shape})")
    
    # Free memory
    del train_tx
    del train_signals
    
    # --- 2. TEST FEATURES ---
    print("\n[2/2] Processing TEST dataset...")
    test_signals = pd.read_csv(f"{DATA_DIR}/test_signals.csv")
    print(f"Loaded {len(test_signals)} test signals.")
    
    print("Loading test transactions (parquet)...")
    test_tx = pd.read_parquet(f"{DATA_DIR}/test_transactions.parquet")
    print(f"Loaded {len(test_tx):,} transactions.")
    
    test_features = extract_features(test_signals, test_tx)
    
    test_out_path = f"{OUT_DIR}/test_features.parquet"
    test_features.to_parquet(test_out_path)
    print(f"✅ Saved test features to {test_out_path} (Shape: {test_features.shape})")
    
    print("\n" + "=" * 60)
    print(f"🎉 All features extracted and cached in {time.time() - total_start:.2f}s!")
    print("=" * 60)

if __name__ == "__main__":
    main()
