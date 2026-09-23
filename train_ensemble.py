"""
gitcore AML Multi-Model GBDT Ensemble Pipeline
Trains LightGBM, CatBoost, and XGBoost with 5-Fold Stratified Cross-Validation.
Optimizes ensemble blending weights to maximize ROC-AUC.
Generates official submission: team_98F12CFB.csv
"""

import os
import json
import time
import numpy as np
import pandas as pd
from scipy.optimize import minimize
from scipy.stats import rankdata
from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import roc_auc_score

import lightgbm as lgb
from catboost import CatBoostClassifier
import xgboost as xgb

DATA_DIR = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data"
RAW_DIR = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/data/fintech_data"
SUBMISSION_PATH = "/Users/m1pro/Documents/Full Stack Middle/gitcore-aml/team_98F12CFB.csv"

def main():
    print("=" * 70)
    print("  🏆 GITCORE AML MULTI-MODEL GBDT ENSEMBLE (5-FOLD CV)")
    print("=" * 70)
    
    t0 = time.time()
    train_df = pd.read_parquet(f"{DATA_DIR}/train_features.parquet")
    test_df = pd.read_parquet(f"{DATA_DIR}/test_features.parquet")
    
    y = train_df['eskalatsiya'].values
    X = train_df.drop(columns=['eskalatsiya'])
    X_test = test_df[X.columns] # Ensure identical ordering
    
    feature_names = X.columns.tolist()
    print(f"Loaded train: {X.shape}, test: {X_test.shape}")
    print(f"Target distribution: {np.sum(y == 1)} positive ({np.mean(y):.4%}), {np.sum(y == 0)} negative")
    
    # K-Fold setup
    N_SPLITS = 5
    skf = StratifiedKFold(n_splits=N_SPLITS, shuffle=True, random_state=42)
    
    # Storage for OOF and test predictions
    oof_lgb = np.zeros(len(X))
    oof_cat = np.zeros(len(X))
    oof_xgb = np.zeros(len(X))
    
    test_lgb = np.zeros(len(X_test))
    test_cat = np.zeros(len(X_test))
    test_xgb = np.zeros(len(X_test))
    
    # Feature importances
    feature_importances = pd.DataFrame(index=feature_names)
    feature_importances['lgb_importance'] = 0.0
    feature_importances['cat_importance'] = 0.0
    feature_importances['xgb_importance'] = 0.0
    
    fold_scores = {'lgb': [], 'cat': [], 'xgb': []}
    
    for fold, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
        print(f"\n" + "-" * 50)
        print(f"⚡ FOLD {fold}/{N_SPLITS}")
        print("-" * 50)
        
        X_tr, y_tr = X.iloc[train_idx], y[train_idx]
        X_va, y_val = X.iloc[val_idx], y[val_idx]
        
        # ----------------------------------------------------
        # 1. LightGBM
        # ----------------------------------------------------
        print("  [1/3] Training LightGBM...")
        lgb_params = {
            'objective': 'binary',
            'metric': 'auc',
            'boosting_type': 'gbdt',
            'learning_rate': 0.03,
            'num_leaves': 31,
            'max_depth': 6,
            'min_child_samples': 40,
            'subsample': 0.8,
            'colsample_bytree': 0.7,
            'reg_alpha': 0.1,
            'reg_lambda': 1.0,
            'random_state': 42 + fold,
            'verbose': -1,
            'n_estimators': 1500,
        }
        model_lgb = lgb.LGBMClassifier(**lgb_params)
        model_lgb.fit(
            X_tr, y_tr,
            eval_set=[(X_va, y_val)],
            callbacks=[lgb.early_stopping(stopping_rounds=60, verbose=False)]
        )
        val_preds_lgb = model_lgb.predict_proba(X_va)[:, 1]
        oof_lgb[val_idx] = val_preds_lgb
        test_lgb += model_lgb.predict_proba(X_test)[:, 1] / N_SPLITS
        score_lgb = roc_auc_score(y_val, val_preds_lgb)
        fold_scores['lgb'].append(score_lgb)
        feature_importances['lgb_importance'] += model_lgb.feature_importances_ / N_SPLITS
        print(f"        -> LightGBM Fold {fold} ROC-AUC: {score_lgb:.5f} (best iter: {model_lgb.best_iteration_})")
        
        # ----------------------------------------------------
        # 2. CatBoost
        # ----------------------------------------------------
        print("  [2/3] Training CatBoost...")
        cat_params = {
            'loss_function': 'Logloss',
            'eval_metric': 'AUC',
            'learning_rate': 0.04,
            'depth': 5,
            'l2_leaf_reg': 5,
            'iterations': 1500,
            'random_seed': 42 + fold,
            'verbose': False,
            'early_stopping_rounds': 60,
        }
        model_cat = CatBoostClassifier(**cat_params)
        model_cat.fit(X_tr, y_tr, eval_set=(X_va, y_val), verbose=False)
        val_preds_cat = model_cat.predict_proba(X_va)[:, 1]
        oof_cat[val_idx] = val_preds_cat
        test_cat += model_cat.predict_proba(X_test)[:, 1] / N_SPLITS
        score_cat = roc_auc_score(y_val, val_preds_cat)
        fold_scores['cat'].append(score_cat)
        feature_importances['cat_importance'] += model_cat.get_feature_importance() / N_SPLITS
        print(f"        -> CatBoost Fold {fold} ROC-AUC: {score_cat:.5f} (best iter: {model_cat.get_best_iteration()})")
        
        # ----------------------------------------------------
        # 3. XGBoost
        # ----------------------------------------------------
        print("  [3/3] Training XGBoost...")
        xgb_params = {
            'objective': 'binary:logistic',
            'eval_metric': 'auc',
            'learning_rate': 0.03,
            'max_depth': 5,
            'min_child_weight': 5,
            'subsample': 0.8,
            'colsample_bytree': 0.7,
            'reg_alpha': 0.1,
            'reg_lambda': 1.0,
            'tree_method': 'hist',
            'n_estimators': 1500,
            'random_state': 42 + fold,
            'early_stopping_rounds': 60,
        }
        model_xgb = xgb.XGBClassifier(**xgb_params)
        model_xgb.fit(X_tr, y_tr, eval_set=[(X_va, y_val)], verbose=False)
        val_preds_xgb = model_xgb.predict_proba(X_va)[:, 1]
        oof_xgb[val_idx] = val_preds_xgb
        test_xgb += model_xgb.predict_proba(X_test)[:, 1] / N_SPLITS
        score_xgb = roc_auc_score(y_val, val_preds_xgb)
        fold_scores['xgb'].append(score_xgb)
        feature_importances['xgb_importance'] += model_xgb.feature_importances_ / N_SPLITS
        print(f"        -> XGBoost Fold {fold} ROC-AUC:  {score_xgb:.5f} (best iter: {model_xgb.best_iteration})")

    # ----------------------------------------------------
    # Overall OOF Performance Comparison
    # ----------------------------------------------------
    auc_lgb = roc_auc_score(y, oof_lgb)
    auc_cat = roc_auc_score(y, oof_cat)
    auc_xgb = roc_auc_score(y, oof_xgb)
    
    print("\n" + "=" * 70)
    print("📊 5-FOLD OUT-OF-FOLD (OOF) MODEL PERFORMANCE")
    print("=" * 70)
    print(f"  • LightGBM OOF ROC-AUC: {auc_lgb:.5f} (Mean: {np.mean(fold_scores['lgb']):.5f} +/- {np.std(fold_scores['lgb']):.5f})")
    print(f"  • CatBoost OOF ROC-AUC: {auc_cat:.5f} (Mean: {np.mean(fold_scores['cat']):.5f} +/- {np.std(fold_scores['cat']):.5f})")
    print(f"  • XGBoost  OOF ROC-AUC: {auc_xgb:.5f} (Mean: {np.mean(fold_scores['xgb']):.5f} +/- {np.std(fold_scores['xgb']):.5f})")

    # ----------------------------------------------------
    # Ensemble Weight Optimization
    # ----------------------------------------------------
    print("\n🔧 Optimizing Ensemble Blending Weights...")
    def loss_func(weights):
        w1, w2, w3 = weights
        pred = w1 * oof_lgb + w2 * oof_cat + w3 * oof_xgb
        return -roc_auc_score(y, pred)
        
    res = minimize(
        loss_func,
        [1/3, 1/3, 1/3],
        bounds=[(0, 1), (0, 1), (0, 1)],
        constraints={'type': 'eq', 'fun': lambda w: sum(w) - 1.0}
    )
    w_lgb, w_cat, w_xgb = res.x
    oof_blend = w_lgb * oof_lgb + w_cat * oof_cat + w_xgb * oof_xgb
    auc_blend = roc_auc_score(y, oof_blend)
    
    # Also evaluate simple average, rank average, and optimal weighted rank
    oof_simple = (oof_lgb + oof_cat + oof_xgb) / 3.0
    auc_simple = roc_auc_score(y, oof_simple)
    
    oof_rank = (rankdata(oof_lgb) + rankdata(oof_cat) + rankdata(oof_xgb)) / (3.0 * len(y))
    auc_rank = roc_auc_score(y, oof_rank)
    
    # Weighted rank optimization
    r_lgb = rankdata(oof_lgb) / len(y)
    r_cat = rankdata(oof_cat) / len(y)
    r_xgb = rankdata(oof_xgb) / len(y)
    
    best_wrank_auc = 0.0
    best_wrank_w = (1/3, 1/3, 1/3)
    for wx in np.linspace(0.1, 0.85, 31):
        for wc in np.linspace(0.05, 0.85, 31):
            wl = 1.0 - wx - wc
            if wl < 0: continue
            sc = roc_auc_score(y, wl * r_lgb + wc * r_cat + wx * r_xgb)
            if sc > best_wrank_auc:
                best_wrank_auc = sc
                best_wrank_w = (wl, wc, wx)
                
    w_rk_lgb, w_rk_cat, w_rk_xgb = best_wrank_w
    oof_wrank = w_rk_lgb * r_lgb + w_rk_cat * r_cat + w_rk_xgb * r_xgb
    
    print(f"  • Simple Average Ensemble ROC-AUC:        {auc_simple:.5f}")
    print(f"  • Rank Average Ensemble ROC-AUC:          {auc_rank:.5f}")
    print(f"  • Optimal Linear Weighted Blend ROC-AUC:  {auc_blend:.5f} (LGB={w_lgb:.2f}, CAT={w_cat:.2f}, XGB={w_xgb:.2f})")
    print(f"  • Optimal Weighted Rank Ensemble ROC-AUC: {best_wrank_auc:.5f} (LGB={w_rk_lgb:.2f}, CAT={w_rk_cat:.2f}, XGB={w_rk_xgb:.2f})")
    
    # Determine best method
    candidates = [
        ('linear_blend', auc_blend, w_lgb * test_lgb + w_cat * test_cat + w_xgb * test_xgb),
        ('rank_average', auc_rank, (rankdata(test_lgb) + rankdata(test_cat) + rankdata(test_xgb)) / (3.0 * len(test_lgb))),
        ('weighted_rank', best_wrank_auc, (w_rk_lgb * rankdata(test_lgb) + w_rk_cat * rankdata(test_cat) + w_rk_xgb * rankdata(test_xgb)) / len(test_lgb)),
    ]
    candidates.sort(key=lambda x: x[1], reverse=True)
    best_method, best_auc, final_test_preds = candidates[0]
    
    print(f"\n🏆 Best Strategy Selected: {best_method.upper()} with OOF ROC-AUC = {best_auc:.5f}")

    # ----------------------------------------------------
    # Generate Official Submission File
    # ----------------------------------------------------
    print("\n📝 Creating official submission file...")
    test_signals = pd.read_csv(f"{RAW_DIR}/test_signals.csv")
    
    # Save individual test predictions
    test_models_df = pd.DataFrame({
        'signal_id': test_signals['signal_id'],
        'pred_lgb': test_lgb,
        'pred_cat': test_cat,
        'pred_xgb': test_xgb,
        'pred_ensemble': final_test_preds
    })
    test_models_df.to_parquet(f"{DATA_DIR}/test_predictions_models.parquet")
    
    submission_df = pd.DataFrame({
        'signal_id': test_signals['signal_id'],
        'ehtimollik': final_test_preds
    })
    
    submission_df.to_csv(SUBMISSION_PATH, index=False)
    print(f"✅ Saved submission to: {SUBMISSION_PATH}")
    print(f"   Shape: {submission_df.shape}")
    print(f"   Sample predictions:\n{submission_df.head(5)}")

    # ----------------------------------------------------
    # Save Model Artifacts & Metrics for EDA and Notebook
    # ----------------------------------------------------
    metrics = {
        'oof_auc': {
            'lightgbm': float(auc_lgb),
            'catboost': float(auc_cat),
            'xgboost': float(auc_xgb),
            'simple_avg': float(auc_simple),
            'rank_avg': float(auc_rank),
            'weighted_ensemble': float(auc_blend),
            'best_strategy': best_method,
            'best_auc': float(best_auc),
        },
        'fold_scores': {
            'lightgbm': [float(x) for x in fold_scores['lgb']],
            'catboost': [float(x) for x in fold_scores['cat']],
            'xgboost': [float(x) for x in fold_scores['xgb']],
        },
        'weights': {
            'lightgbm': float(w_lgb),
            'catboost': float(w_cat),
            'xgboost': float(w_xgb),
        },
        'training_time_sec': round(time.time() - t0, 2),
    }
    
    with open(f"{DATA_DIR}/model_metrics.json", "w") as f:
        json.dump(metrics, f, indent=2)
        
    # Save OOF predictions DataFrame
    oof_df = pd.DataFrame({
        'signal_id': train_df.index,
        'true_label': y,
        'pred_lgb': oof_lgb,
        'pred_cat': oof_cat,
        'pred_xgb': oof_xgb,
        'pred_ensemble': oof_blend
    })
    oof_df.to_parquet(f"{DATA_DIR}/oof_predictions.parquet")
    
    # Save normalized top feature importances
    feature_importances['normalized_importance'] = (
        (feature_importances['lgb_importance'] / feature_importances['lgb_importance'].sum()) +
        (feature_importances['cat_importance'] / feature_importances['cat_importance'].sum()) +
        (feature_importances['xgb_importance'] / feature_importances['xgb_importance'].sum())
    ) / 3.0
    feature_importances.sort_values('normalized_importance', ascending=False).to_csv(f"{DATA_DIR}/feature_importances.csv")
    
    top20 = feature_importances.sort_values('normalized_importance', ascending=False).head(20)
    print("\n🔥 TOP 20 MOST IMPORTANT AML FEATURES:")
    for rank, (feat, row) in enumerate(top20.iterrows(), 1):
        print(f"  {rank:2d}. {feat:<35} {row['normalized_importance']:.5f}")

    print("\n" + "=" * 70)
    print(f"🎉 All training, ensembling, and validation completed in {time.time() - t0:.2f}s!")
    print("=" * 70)

if __name__ == "__main__":
    main()
