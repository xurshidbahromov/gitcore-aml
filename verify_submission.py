"""
Rigorous submission verification script for WIUT Hackathon 2026.
Checks all format requirements for team_98F12CFB.csv.
"""

import sys
import os
import pandas as pd
import numpy as np

SUBMISSION_FILE = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/team_98F12CFB.csv"
TEST_SIGNALS_FILE = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data/test_signals.csv"

def verify():
    print("=" * 60)
    print("  🔍 VERIFYING SUBMISSION: team_98F12CFB.csv")
    print("=" * 60)
    
    if not os.path.exists(SUBMISSION_FILE):
        print(f"❌ ERROR: File does not exist at {SUBMISSION_FILE}")
        return False
        
    df = pd.read_csv(SUBMISSION_FILE)
    test_signals = pd.read_csv(TEST_SIGNALS_FILE)
    
    # 1. Row count
    print(f"1. Checking row count: {len(df)} rows...", end=" ")
    assert len(df) == 6000, f"Expected exactly 6000 rows, got {len(df)}"
    print("✅ OK")
    
    # 2. Columns
    print(f"2. Checking column names: {list(df.columns)}...", end=" ")
    assert list(df.columns) == ['signal_id', 'ehtimollik'], f"Expected ['signal_id', 'ehtimollik'], got {list(df.columns)}"
    print("✅ OK")
    
    # 3. ID alignment
    print("3. Checking signal_id alignment with test_signals.csv...", end=" ")
    assert (df['signal_id'].values == test_signals['signal_id'].values).all(), "signal_id ordering does not match test_signals.csv!"
    print("✅ OK")
    
    # 4. Null & NaN check
    print("4. Checking for missing / NaN / Inf values...", end=" ")
    assert not df.isnull().values.any(), "Submission contains null/NaN values!"
    assert not np.isinf(df['ehtimollik'].values).any(), "Submission contains infinite values!"
    print("✅ OK")
    
    # 5. Probability range
    print(f"5. Checking probability bounds [0.0, 1.0]...", end=" ")
    min_val = df['ehtimollik'].min()
    max_val = df['ehtimollik'].max()
    assert 0.0 <= min_val <= 1.0, f"Minimum probability out of bounds: {min_val}"
    assert 0.0 <= max_val <= 1.0, f"Maximum probability out of bounds: {max_val}"
    print(f"✅ OK (Min: {min_val:.5f}, Max: {max_val:.5f})")
    
    # 6. Distribution summary
    print("\n--- 📈 Prediction Distribution Summary ---")
    print(f"Mean predicted probability:   {df['ehtimollik'].mean():.4f}")
    print(f"Median predicted probability: {df['ehtimollik'].median():.4f}")
    print(f"Std dev:                     {df['ehtimollik'].std():.4f}")
    print(f"Quantiles:\n{df['ehtimollik'].quantile([0.05, 0.25, 0.50, 0.75, 0.95])}")
    
    print("\n" + "=" * 60)
    print("🎉 ALL CHECKS PASSED! Submission file is 100% compliant and ready.")
    print("=" * 60)
    return True

if __name__ == "__main__":
    verify()
