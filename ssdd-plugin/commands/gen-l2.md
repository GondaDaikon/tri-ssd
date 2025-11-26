---
description: L1からL2（機能設計・技術方針）ドキュメントを生成する
argument-hint: "[--simple] [REQ-xxxx ...] - オプション: --simple（1ファイル生成）、対象のREQ ID（省略時は全体）"
allowed-tools: Read, Write, Edit, Glob, Grep, WebSearch
---

# L2 生成コマンド

## 引数

- `--simple`: 1ファイル構成で生成（小規模プロジェクト向け）
- `REQ-xxxx ...`: 対象のREQ ID（省略時は全REQ）

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、SSDD の基本概念を把握する
2. `skills/ssdd/examples.md` を読み込み、L2の実例を確認する
3. `skills/ssdd/templates/l2_overview.md` を読み込み、L2概要テンプレートを確認
4. `skills/ssdd/templates/l2_phases.md` を読み込み、フェーズテンプレートを確認
5. `docs/l1_vision.md` を読み込み、要件を把握する

## 生成手順

### Step 1: L1分析
- 要件を機能候補に分解
- 依存関係を推定

### Step 2: 技術選定（対話型）

WebSearchで以下のカテゴリの候補を**最低3個**ずつ検索:
- フレームワーク
- データベース
- 認証方式
- インフラ

AskUserQuestionで選択肢を提示し、ユーザーに選択してもらう。

### Step 3: フェーズ設計
- 機能を「結合して意味のある単位」でグルーピング
- Exit Criteriaを定義

### Step 4: NFRカタログ作成
- 性能、セキュリティ、可用性等を具体化

## 出力ファイル

| モード | ファイル |
|--------|---------|
| 通常 | `docs/l2_system/overview.md`, `docs/l2_system/phases.md` |
| --simple | `docs/l2_system/overview.md`（1ファイルに統合） |

## 完了後の案内

- 生成ファイルのパスを報告
- `/gen-l3` で L3 生成できることを案内
- `/check` で整合性チェックを案内
