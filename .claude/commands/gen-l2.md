---
description: L1からL2（機能設計・技術方針）ドキュメントを生成する
argument-hint: "[REQ-xxxx ...] - 対象の要件ID（省略時は全体）"
allowed-tools: Read, Write, Edit, WebSearch, Glob
---

# L2 生成コマンド

## 引数

- `$ARGUMENTS`: 対象の要件ID（省略可、複数指定可）
  - 指定時: 指定された REQ のみを対象に L2 を生成/更新
  - 省略時: L1 全体を対象に L2 を生成

## 前提処理

1. `.claude/skills/ssdd.md` を読み込み、SSDD の基本概念を把握する
2. `docs/templates/l2_overview.md` を読み込み、L2 概要テンプレートを確認する
3. `docs/templates/l2_phases.md` を読み込み、L2 フェーズテンプレートを確認する
4. `docs/templates/README.md` を読み込み、フロントマター仕様を確認する
5. `docs/l1_vision/vision.md` を読み込み、L1 の内容を把握する

## 実行内容

L1 の要求を分析し、L2 ドキュメント群を生成します。

## 生成手順

### Step 1: L1 分析

- REQ-xxxx の一覧を抽出
- 要件の依存関係を分析
- 非機能要求を分類

### Step 2: 技術スタック調査（WebSearch活用）

以下の観点で技術情報を検索：

- プロダクト種別に適した技術スタック
- 類似プロダクトの技術選定事例
- 最新のベストプラクティス

検索例：
- `[プロダクト種別] 技術スタック 2024`
- `[フレームワーク名] vs [比較対象] 比較`

### Step 3: 用語集抽出

L1 からドメイン用語・業務用語を抽出し、定義を記載

### Step 4: 機能分解

REQ を F-xxxx（機能）に分解：

- 1つの REQ から複数の F が生まれることがある
- F 間の依存関係を明確化
- 各 F に対応する REQ を `req_ids` に記録

### Step 5: フェーズ設計

機能群を PH-xxxx（フェーズ）にグルーピング：

- 「結合して動かして意味がある」単位で束ねる
- 各フェーズの Exit Criteria を定義
- フェーズ内の機能は実装順に並べる

### Step 6: 非機能カタログ作成

L1 の高レベル非機能要求を NF-xxxx に具体化

## 出力ファイル

| ファイル | 内容 |
|---------|------|
| `docs/l2_system/overview.md` | 用語集・技術方針・全体構成 |
| `docs/l2_system/phases.md` | フェーズ定義 |
| `docs/l2_system/nfr.md` | 非機能要求カタログ |
| `docs/l2_system/features_index.md` | 機能一覧（全体俯瞰用） |

## 出力仕様

- **フロントマター**: `doc_status: draft` で開始
- **曖昧箇所**: `<!-- TODO: 要確認 -->` でマーク
- **参照フィールド**: `req_ids`, `related_nfr_ids` を正確に記載

## 完了後の案内

- 生成したファイルのパスを報告
- 抽出した F-xxxx, PH-xxxx, NF-xxxx の数を報告
- `/gen-l3` で L3 を生成できることを案内
- 技術選定でユーザー判断が必要な箇所を明示
