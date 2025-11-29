---
description: ドキュメント変更の影響を分析し、関連ドキュメントへの伝播を支援する
argument-hint: <ファイルパス|ID> - 変更されたドキュメント（必須）
allowed-tools: Read, Glob, Grep
---

# 変更伝播分析コマンド

## 分析時の原則

<avoid_over_engineering>
- 影響を過大評価しない（直接参照のみを「高影響」とする）
- 「念のため確認」レベルの項目は低優先度として扱う
- 全てのドキュメントを更新対象にしない（本当に影響があるものだけ）
</avoid_over_engineering>

## ツール実行方針

<parallel_execution>
**並列実行すべき操作**:
- SKILL.md と対象ファイルの同時読み込み
- 複数パターンでのGrep検索（req_ids, nfr_ids, phase を同時検索）
</parallel_execution>

<thinking_process>
影響度判定時は以下を考慮する：

1. **変更の性質は？**
   - 文言修正 → 影響なし
   - ID変更 → 参照先に高影響
   - 仕様変更 → 関連機能に中〜高影響

2. **参照の種類は？**
   - req_ids で直接参照 → 高影響
   - 同フェーズ → 低影響（参照がない限り）
</thinking_process>

## 引数

- `$1`: 変更されたドキュメント（必須）
  - ファイルパス: 直接指定
  - ID: REQ-xxx, F-xxx 等で指定

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、変更伝播ルールを確認
2. `$1` で指定された対象ファイルを特定・読み込む

## 変更伝播ルール

| 変更元 | 影響先 |
|--------|--------|
| L1（REQ） | L2, L3 |
| L2（F定義） | L3 |
| L2（フェーズ） | L3 |
| L3 | 局所的（設計影響時はL2） |

## 分析手順

### Step 1: 変更元の特定
- layer と kind を確認
- 変更されたIDを抽出

### Step 2: 参照検索
- Grepで変更IDを参照しているファイルを検索
- req_ids, nfr_ids, phase をチェック

### Step 3: 影響度判定
- 直接参照: 高影響
- 間接参照: 中影響
- 同フェーズ: 低影響

## 出力形式

```markdown
# 変更影響分析

**変更ファイル**: docs/l1_vision.md
**変更ID**: REQ-20250125-001

## 影響を受けるドキュメント

### 高影響（直接参照）
1. docs/l3_features/F-20250125-001_xxx.md
   - req_ids で参照

### 中影響（間接参照）
2. docs/l2_system/phases.md
   - 関連機能を含むフェーズ

## 推奨アクション
1. F-20250125-001 の仕様を確認・更新
2. phases.md のExit Criteriaを確認
```
