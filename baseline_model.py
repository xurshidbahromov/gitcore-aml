import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score

data_dir = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"

train_signals = pd.read_csv(f"{data_dir}/train_signals.csv")
train_signals['signal_sanasi'] = pd.to_datetime(train_signals['signal_sanasi'])
train_tx = pd.read_parquet(f"{data_dir}/train_transactions.parquet")

tx_merged = train_tx.merge(train_signals[['signal_id', 'signal_sanasi', 'eskalatsiya']], on='signal_id', how='left')
tx_merged['hours_before'] = (tx_merged['signal_sanasi'] - tx_merged['tranzaksiya_vaqti']).dt.total_seconds() / 3600.0

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
    median_amount=('miqdor_indeksi', 'median'),
    q25_amount=('miqdor_indeksi', lambda x: x.quantile(0.25)),
    q75_amount=('miqdor_indeksi', lambda x: x.quantile(0.75)),
)
features = features.join(stats)

# Direction
kirim_tx = tx_merged[tx_merged['kirim_chiqim'] == 'kirim']
chiqim_tx = tx_merged[tx_merged['kirim_chiqim'] == 'chiqim']

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

# Windowed features
for hours, name in [(24, '24h'), (72, '3d'), (168, '7d'), (720, '30d')]:
    sub = tx_merged[tx_merged['hours_before'] <= hours].groupby('signal_id')
    features[f'tx_{name}'] = sub['miqdor_indeksi'].count()
    features[f'sum_{name}'] = sub['miqdor_indeksi'].sum()
    features[f'mean_{name}'] = sub['miqdor_indeksi'].mean()
    features[f'tx_ratio_{name}'] = features[f'tx_{name}'] / features['total_tx']

features = features.fillna(0)

X = features.drop(columns=['eskalatsiya'])
y = features['eskalatsiya']

print(f"Dataset shape for modeling: {X.shape}")

# 5-Fold Stratified CV
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
oof_preds = np.zeros(len(X))
fold_aucs = []

params = {
    'objective': 'binary',
    'metric': 'auc',
    'boosting_type': 'gbdt',
    'learning_rate': 0.05,
    'num_leaves': 31,
    'feature_fraction': 0.8,
    'verbose': -1,
    'random_state': 42
}

for fold, (train_idx, val_idx) in enumerate(skf.split(X, y)):
    X_train, y_train = X.iloc[train_idx], y.iloc[train_idx]
    X_val, y_val = X.iloc[val_idx], y.iloc[val_idx]
    
    train_data = lgb.Dataset(X_train, label=y_train)
    val_data = lgb.Dataset(X_val, label=y_val, reference=train_data)
    
    model = lgb.train(
        params,
        train_data,
        num_boost_round=1000,
        valid_sets=[val_data],
        callbacks=[lgb.early_stopping(stopping_rounds=50, verbose=False)]
    )
    
    val_preds = model.predict(X_val, num_iteration=model.best_iteration)
    oof_preds[val_idx] = val_preds
    fold_auc = roc_auc_score(y_val, val_preds)
    fold_aucs.append(fold_auc)
    print(f"Fold {fold+1} ROC-AUC: {fold_auc:.5f}")

overall_auc = roc_auc_score(y, oof_preds)
print(f"\n==========================================")
print(f"Overall Baseline Out-of-Fold ROC-AUC: {overall_auc:.5f}")
print(f"Mean Fold ROC-AUC: {np.mean(fold_aucs):.5f} +/- {np.std(fold_aucs):.5f}")
print(f"==========================================")

# Feature importance
importances = pd.Series(model.feature_importance(importance_type='gain'), index=X.columns).sort_values(ascending=False)
print("\nTop 15 Most Important Features:")
print(importances.head(15))
