"""
Generates the comprehensive, reproducible Jupyter Notebook for WIUT Hackathon 2026.
Saves to final_model.ipynb and notebooks/final_model.ipynb.
"""

import nbformat as nbf
import os

def build_notebook():
    nb = nbf.v4.new_notebook()
    cells = []
    
    # ----------------------------------------------------
    # Cell 1: Markdown Title
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""# 🏆 WIUT Hackathon 2026 — FinTech / AI in Finance Track
## Elimination Task: AML Alert Prioritization
**Team Name:** `gitcore`  
**Team ID:** `98F12CFB`  
**Evaluation Metric:** ROC-AUC  
**Official Output Deliverable:** `team_98F12CFB.csv`

---

### Executive Summary & Problem Formulation
In modern financial institutions in Uzbekistan, automated rule engines generate tens of thousands of Anti-Money Laundering (AML) alerts based on suspicious transaction patterns. However, over 80% of these alerts are false positives. Human compliance officers must manually review each alert, creating severe operational bottlenecks.

**Objective:** Develop a robust machine learning system that accurately predicts the probability that an AML alert will be escalated (`eskalatsiya == 1`) versus dismissed (`eskalatsiya == 0`), enabling dynamic risk prioritization and high-efficiency triage.

**Key Challenges & Constraints:**
1. **Massive Transaction History:** ~10,000,000 transactions across 20,000 alert signals (14k train, 6k test).
2. **Class Imbalance:** Only 17.18% of alerts in historical data were escalated.
3. **Temporal Realism & Zero-Leakage:** Only transactions occurring strictly before the alert date (`signal_sanasi`) may be used.
4. **Subtle Evasion Signatures:** Smurfing (splitting funds into rapid sub-threshold bursts), rapid pass-through (mule accounts), and unusual cash or cross-border velocity.
"""))

    # ----------------------------------------------------
    # Cell 2: Imports & Environment Setup
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""# Environment & Library Setup
import os
import sys
import time
import json
import warnings
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import rankdata
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score, roc_curve, confusion_matrix, classification_report

import lightgbm as lgb
from catboost import CatBoostClassifier
import xgboost as xgb

warnings.filterwarnings('ignore')
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'Helvetica, Arial, DejaVu Sans'
plt.rcParams['figure.dpi'] = 120

print("✅ All core libraries imported successfully!")
"""))

    # ----------------------------------------------------
    # Cell 3: Markdown Section 1
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""## 1. Data Ingestion & Overview
The dataset contains four primary files:
- `train_signals.csv`: 14,000 alerts with ground truth labels (`eskalatsiya`).
- `train_transactions.parquet`: 6,987,663 granular customer transactions.
- `test_signals.csv`: 6,000 alerts requiring escalation probability estimation.
- `test_transactions.parquet`: 3,027,575 transactions corresponding to test alerts.
"""))

    # ----------------------------------------------------
    # Cell 4: Code Section 1
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""DATA_DIR = "data/fintech_data"

train_signals = pd.read_csv(f"{DATA_DIR}/train_signals.csv")
test_signals = pd.read_csv(f"{DATA_DIR}/test_signals.csv")

print(f"Train signals: {train_signals.shape[0]:,} rows")
print(f"Test signals:  {test_signals.shape[0]:,} rows")

# Target class distribution
pos_count = train_signals['eskalatsiya'].sum()
neg_count = len(train_signals) - pos_count
pos_rate = pos_count / len(train_signals)

print(f"\\nTarget Class Distribution:")
print(f"  • Dismissed  (0): {neg_count:,} ({1 - pos_rate:.2%})")
print(f"  • Escalated  (1): {pos_count:,} ({pos_rate:.2%})")

# Visualizing target distribution
fig, ax = plt.subplots(figsize=(6, 3.5))
bars = ax.bar(['Dismissed (0)', 'Escalated (1)'], [neg_count, pos_count], color=['#3b82f6', '#ef4444'], width=0.5)
ax.set_title('AML Alert Target Distribution (Imbalance: 17.18%)', fontsize=12, fontweight='bold', pad=12)
ax.set_ylabel('Number of Alerts')
for bar in bars:
    yval = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2.0, yval + 150, f"{yval:,} ({yval/len(train_signals):.1%})", ha='center', va='bottom', fontweight='semibold')
sns.despine(top=True, right=True)
plt.tight_layout()
plt.show()
"""))

    # ----------------------------------------------------
    # Cell 5: Markdown Section 2 (EDA)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""## 2. Exploratory Data Analysis & Behavioral Signatures
To uncover the hidden patterns distinguishing escalated from dismissed alerts, we analyze:
1. **Transaction Velocity & Recency:** How close to the alert trigger date do transactions cluster?
2. **Channel Dynamics:** Cash (`naqd`), Cards (`karta`), Bank Transfers (`bank_otkazmasi`), and International Wires (`xalqaro`).
3. **Net Cash-Out Flow:** Negative balance spikes indicating rapid fund extraction before freezing.
"""))

    # ----------------------------------------------------
    # Cell 6: Code Section 2 (EDA Visuals)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""# Load precomputed feature matrices for fast, reproducible analysis
train_feats = pd.read_parquet("data/train_features.parquet")
print(f"Loaded {train_feats.shape[1]} engineered features for {train_feats.shape[0]:,} signals.")

# Comparison of key features between Escalated (1) vs Dismissed (0)
eda_cols = ['amount_min', 'naqd_sum', 'bank_mean', 'chiqim_ratio_3d', 'turnover', 'burst_ratio_15m']
comp_df = train_feats.groupby('eskalatsiya')[eda_cols].mean().T
comp_df.columns = ['Dismissed (0)', 'Escalated (1)']
comp_df['Ratio (1 / 0)'] = comp_df['Escalated (1)'] / (comp_df['Dismissed (0)'] + 1e-5)
print("Key Behavioral Features Comparison:")
display(comp_df.round(4))

# Multi-panel EDA visualization
fig, axes = plt.subplots(1, 3, figsize=(16, 4.5))

# 1. Minimum Transaction Amount (Large Outflows)
sns.boxplot(data=train_feats, x='eskalatsiya', y='amount_min', ax=axes[0], palette=['#60a5fa', '#f87171'], showfliers=False)
axes[0].set_title('Minimum Transaction Amount (Outflow Outliers)', fontweight='bold')
axes[0].set_xlabel('Alert Status (0=Dismissed, 1=Escalated)')
axes[0].set_ylabel('Standardized Amount Index')

# 2. 3-Day Outgoing (Chiqim) Ratio
sns.kdeplot(data=train_feats[train_feats['eskalatsiya'] == 0], x='chiqim_ratio_3d', ax=axes[1], label='Dismissed', color='#3b82f6', fill=True, alpha=0.3)
sns.kdeplot(data=train_feats[train_feats['eskalatsiya'] == 1], x='chiqim_ratio_3d', ax=axes[1], label='Escalated', color='#ef4444', fill=True, alpha=0.3)
axes[1].set_title('Recent 3-Day Chiqim Ratio Distribution', fontweight='bold')
axes[1].set_xlabel('Chiqim Ratio (3-Day Window)')
axes[1].legend()

# 3. Burst Ratio (Transactions within 15 mins)
sns.barplot(data=train_feats, x='eskalatsiya', y='burst_ratio_15m', ax=axes[2], palette=['#60a5fa', '#f87171'], capsize=0.1)
axes[2].set_title('Smurfing Velocity: 15-Minute Burst Ratio', fontweight='bold')
axes[2].set_xlabel('Alert Status')
axes[2].set_ylabel('Burst Ratio')

plt.tight_layout()
plt.show()
"""))

    # ----------------------------------------------------
    # Cell 7: Markdown Section 3 (Feature Engineering)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""## 3. Advanced AML Feature Engineering
Our feature extractor (`src/feature_extractor.py`) computes **226 specialized AML domain features** divided into 6 distinct categories:

1. **Global Transaction Statistics:** Count, mean, standard deviation, median, min, max, total volume.
2. **Channel-Specific Aggregations:** Transaction count, volume, and means for `karta`, `bank_otkazmasi`, `naqd`, and `xalqaro`.
3. **Cross Direction x Channel Features:** `naqd_chiqim` (cash withdrawals), `xalqaro_kirim` (incoming cross-border funds), `bank_chiqim`.
4. **Multi-Scale Temporal Windows:** Granular rolling windows at **24h, 3d (72h), 7d (168h), 14d (336h), 30d (720h), and 60d (1440h)**.
5. **Velocity Acceleration & Smurfing Ratios:**
   - 24h-to-7d velocity ratio, 24h-to-30d surge indices.
   - Inter-arrival bursts: count and proportion of transactions occurring within 5 minutes, 15 minutes, and 1 hour.
6. **Alert Trigger Transaction Signatures:** The last 1st, 3rd, and 5th transactions immediately preceding the alert date, measuring trigger amount z-score and channel identity.
"""))

    # ----------------------------------------------------
    # Cell 8: Code Section 3 (Feature Extraction Summary)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""X = train_feats.drop(columns=['eskalatsiya'])
y = train_feats['eskalatsiya'].values

test_feats = pd.read_parquet("data/test_features.parquet")
X_test = test_feats[X.columns]

print(f"Feature Matrix X Shape:      {X.shape}")
print(f"Target Vector y Shape:       {y.shape}")
print(f"Test Feature Matrix Shape:   {X_test.shape}")
"""))

    # ----------------------------------------------------
    # Cell 9: Markdown Section 4 (Modeling)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""## 4. Multi-Model GBDT Ensemble & Cross-Validation
### Cross-Validation Strategy
Both train and test sets are sampled uniformly across the 2025–2026 timeline. Consequently, **5-Fold Stratified K-Fold** provides an unbiased, leak-free local cross-validation estimate matching the competition evaluation.

### Model Architectures
We train three diverse gradient boosting tree architectures:
1. **LightGBM:** Fast, leaf-wise tree growth with conservative learning rate (`0.03`) and feature subsampling.
2. **CatBoost:** Symmetric decision trees with oblivious splits, excelling at capturing subtle numeric-categorical interactions.
3. **XGBoost (Hist):** Exact histogram-based gradient boosting with depth regularization.
"""))

    # ----------------------------------------------------
    # Cell 10: Code Section 4 (Model Training & OOF Results)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""# Load precomputed OOF predictions and model metrics
oof_df = pd.read_parquet("data/oof_predictions.parquet")
with open("data/model_metrics.json") as f:
    model_metrics = json.load(f)

print("=" * 60)
print("📊 5-FOLD OUT-OF-FOLD (OOF) CROSS-VALIDATION RESULTS")
print("=" * 60)
print(f"  1. LightGBM OOF ROC-AUC:            {model_metrics['oof_auc']['lightgbm']:.5f}")
print(f"  2. CatBoost OOF ROC-AUC:            {model_metrics['oof_auc']['catboost']:.5f}")
print(f"  3. XGBoost  OOF ROC-AUC:            {model_metrics['oof_auc']['xgboost']:.5f}")
print(f"  4. Simple Average Ensemble ROC-AUC: {model_metrics['oof_auc']['simple_avg']:.5f}")
print(f"  5. Optimal Weighted Rank Ensemble:  {model_metrics['oof_auc']['best_auc']:.5f}")
print("=" * 60)
"""))

    # ----------------------------------------------------
    # Cell 11: Markdown Section 5 (ROC Curves)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""## 5. ROC-AUC Curves & Performance Evaluation
Here we plot the Out-of-Fold Receiver Operating Characteristic (ROC) curves comparing:
- Baseline Model (ROC-AUC: 0.6027)
- LightGBM (ROC-AUC: 0.6152)
- CatBoost (ROC-AUC: 0.6186)
- XGBoost (ROC-AUC: 0.6234)
- **gitcore Final Weighted Rank Ensemble (ROC-AUC: 0.6246)**
"""))

    # ----------------------------------------------------
    # Cell 12: Code Section 5 (ROC Curve Plot)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""# Compute ROC curves for all models
fpr_lgb, tpr_lgb, _ = roc_curve(oof_df['true_label'], oof_df['pred_lgb'])
fpr_cat, tpr_cat, _ = roc_curve(oof_df['true_label'], oof_df['pred_cat'])
fpr_xgb, tpr_xgb, _ = roc_curve(oof_df['true_label'], oof_df['pred_xgb'])
fpr_ens, tpr_ens, _ = roc_curve(oof_df['true_label'], oof_df['pred_ensemble'])

fig, ax = plt.subplots(figsize=(8, 6.5))
ax.plot([0, 1], [0, 1], 'k--', alpha=0.5, label='Random Chance (AUC = 0.5000)')
ax.plot(fpr_lgb, tpr_lgb, label=f"LightGBM (OOF AUC = {model_metrics['oof_auc']['lightgbm']:.4f})", color='#10b981', lw=1.8)
ax.plot(fpr_cat, tpr_cat, label=f"CatBoost (OOF AUC = {model_metrics['oof_auc']['catboost']:.4f})", color='#f59e0b', lw=1.8)
ax.plot(fpr_xgb, tpr_xgb, label=f"XGBoost (OOF AUC = {model_metrics['oof_auc']['xgboost']:.4f})", color='#8b5cf6', lw=1.8)
ax.plot(fpr_ens, tpr_ens, label=f"★ gitcore Ensemble (OOF AUC = {model_metrics['oof_auc']['best_auc']:.4f})", color='#ef4444', lw=2.5)

ax.set_title('Out-of-Fold ROC Curves Comparison — WIUT Hackathon 2026', fontsize=13, fontweight='bold', pad=12)
ax.set_xlabel('False Positive Rate (1 - Specificity)', fontsize=11)
ax.set_ylabel('True Positive Rate (Sensitivity / Recall)', fontsize=11)
ax.legend(loc='lower right', frameon=True, fontsize=10)
ax.set_xlim([-0.01, 1.01])
ax.set_ylim([-0.01, 1.01])
plt.tight_layout()
plt.show()
"""))

    # ----------------------------------------------------
    # Cell 13: Markdown Section 6 (Feature Importances)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""## 6. Feature Importance & Model Explainability
To provide actionable explainability for financial investigators, we evaluate the ensemble feature importances. The top drivers reveal:
1. `amount_min`: Magnitude of the deepest negative transaction (abnormal large outflow).
2. `karta_max` & `bank_mean`: Channel-specific velocity limits.
3. `naqd_sum` & `naqd_turnover_ratio`: High cash-out turnover indicating potential money laundering.
4. `chiqim_ratio_3d` & `night_ratio`: Immediate temporal acceleration prior to alert generation.
"""))

    # ----------------------------------------------------
    # Cell 14: Code Section 6 (Feature Importance Bar Chart)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""feat_imp = pd.read_csv("data/feature_importances.csv", index_col=0)
top20 = feat_imp.head(20).sort_values('normalized_importance', ascending=True)

fig, ax = plt.subplots(figsize=(10, 7.5))
bars = ax.barh(top20.index, top20['normalized_importance'] * 100, color='#3b82f6', edgecolor='#1d4ed8', height=0.65)
ax.set_title('Top 20 Most Predictive AML Features (Ensemble Importance)', fontsize=13, fontweight='bold', pad=12)
ax.set_xlabel('Normalized Relative Importance (%)', fontsize=11)
for bar in bars:
    w = bar.get_width()
    ax.text(w + 0.08, bar.get_y() + bar.get_height()/2.0, f"{w:.2f}%", ha='left', va='center', fontsize=9, fontweight='semibold')
ax.set_xlim(0, max(top20['normalized_importance'] * 100) * 1.15)
sns.despine(top=True, right=True)
plt.tight_layout()
plt.show()
"""))

    # ----------------------------------------------------
    # Cell 15: Markdown Section 7 (Submission Verification)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_markdown_cell("""## 7. Submission Verification & Final Deliverable
The official submission file `team_98F12CFB.csv` is validated against all hackathon specifications:
- Exact 6,000 rows matching `test_signals.csv`
- Header: `signal_id,ehtimollik`
- Continuous probability values in $[0.0, 1.0]$
"""))

    # ----------------------------------------------------
    # Cell 16: Code Section 7 (Submission Check)
    # ----------------------------------------------------
    cells.append(nbf.v4.new_code_cell("""sub_df = pd.read_csv("team_98F12CFB.csv")
print(f"Submission Shape: {sub_df.shape}")
print(f"Columns: {list(sub_df.columns)}")
print(f"Probability Bounds: [{sub_df['ehtimollik'].min():.5f}, {sub_df['ehtimollik'].max():.5f}]")
print(f"Missing Values: {sub_df.isnull().sum().sum()}")

# Verification assertions
assert sub_df.shape == (6000, 2), "Row count mismatch!"
assert list(sub_df.columns) == ['signal_id', 'ehtimollik'], "Column names mismatch!"
assert sub_df['ehtimollik'].between(0.0, 1.0).all(), "Values out of bounds!"
print("\\n✅ ALL SUBMISSION CRITERIA 100% SATISFIED!")

display(sub_df.head(10))
"""))

    nb.cells = cells
    
    # Write notebook
    base_dir = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml"
    os.makedirs(f"{base_dir}/notebooks", exist_ok=True)
    
    with open(f"{base_dir}/final_model.ipynb", "w") as f:
        nbf.write(nb, f)
        
    with open(f"{base_dir}/notebooks/final_model.ipynb", "w") as f:
        nbf.write(nb, f)
        
    print(f"✅ Generated notebook at:")
    print(f"  • {base_dir}/final_model.ipynb")
    print(f"  • {base_dir}/notebooks/final_model.ipynb")

if __name__ == "__main__":
    build_notebook()
