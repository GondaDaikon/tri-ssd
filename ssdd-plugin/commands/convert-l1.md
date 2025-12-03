---
description: 既存のドキュメントをL1形式に変換する
argument-hint: <ファイルパス> - 変換元のドキュメントパス（必須）
allowed-tools: Read, Write, Edit
---

# L1 変換コマンド

<ssdd_context>
SSDD（Slices Specification-Driven Development）はAI/LLMコードエージェントを前提とした仕様駆動開発。

レイヤー構造:
- L1: ビジョン・要求（docs/l1_vision.md）
- L2: 技術基盤（docs/l2_system/）- foundation.md, phases.md, rules.md
- L3: 機能仕様（docs/l3_features/F-xxx.md）

ID形式: PREFIX-YYYYMMDD-nnn（REQ, PH, F, NF）
ステータス: draft → reviewed → implemented（L3のみ）
</ssdd_context>

## 変換時の原則

<avoid_over_engineering>
- 元ドキュメントにない情報を推測・捏造しない（TODOマークで対応）
- 技術詳細（実装方法、アーキテクチャ）はL1に含めない（L2へ分離）
- 元ドキュメントの曖昧な表現をそのまま明確化しようとしない
</avoid_over_engineering>

## 引数

- `$1`: 変換元のドキュメントパス（必須）

## 前提処理

1. `skills/ssdd/templates/l1_vision.md` を読み込み、L1 テンプレートを確認する
2. `$1` で指定されたファイルを読み込む

## 変換手順

### Step 1: 元ドキュメント分析
- 構造を把握
- 要件に該当する記述を抽出
- 技術詳細（L2相当）と要件（L1相当）を分離

### Step 2: 情報マッピング

| L1 セクション | 抽出対象 |
|--------------|---------|
| プロダクトの目的・背景 | 概要、背景、目的の記述 |
| 制約条件・前提 | 動作環境、前提条件 |
| 機能要求 | 機能一覧、ユースケース |
| 非機能要求 | 性能、セキュリティ等 |

### Step 3: REQ ID 付与
- REQ-YYYYMMDD-nnn 形式で採番

### Step 4: 不足情報の特定
- `<!-- TODO: 要確認 -->` でマーク

## 出力仕様

- **ファイルパス**: `docs/l1_vision.md`
- **フロントマター**: `doc_status: draft`

## 完了後の案内

- 変換結果のサマリを報告
- 抽出できなかった情報を一覧表示
- `/draft-l2` で L2 生成できることを案内
