---
description: L1からL2 技術基盤（foundation.md）を生成する
argument-hint: "[REQ-xxxx ...] - 対象のREQ ID（省略時は全体）"
allowed-tools: Read, Write, Edit, Glob, Grep, WebSearch
---

# L2 技術基盤生成コマンド

## 概要

L1（ビジョン・要求）から L2 技術基盤（foundation.md）を生成する。
技術選定はユーザーとの対話を通じて行う。

**注**: フェーズ定義・機能一覧は `/gen-phases` で生成する（技術基盤確定後）。

## 引数

- `REQ-xxxx ...`: 対象のREQ ID（省略時は全REQ）

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、SSDD の基本概念を把握する
2. `skills/ssdd/examples.md` を読み込み、L2の実例を確認する
3. `skills/ssdd/templates/l2_foundation.md` を読み込み、技術基盤テンプレートを確認
4. `docs/l1_vision.md` を読み込み、要件を把握する

## 生成手順

### Step 1: L1分析

- 要件を把握
- 用語集の抽出

### Step 2: 技術選定（対話型）

WebSearchで以下のカテゴリの候補を**最低3個**ずつ検索:
- フレームワーク
- データベース
- 認証方式
- インフラ

ユーザーに選択肢を提示し、対話を通じて選択してもらう。

**重要**: 技術選定はこのコマンドで確定させる。フェーズ計画は技術が決まってから行う。

### Step 3: アーキテクチャ設計

- コンポーネント構成図
- レイヤ構造
- モジュール間依存関係

### Step 4: NFRカタログ作成

- 性能、セキュリティ、可用性等を具体化
- NFR IDはNF-YYYYMMDD-nnn形式で採番

## ID採番ロジック

### L2 ID
1. 現在日時を取得: YYYYMMDD
2. 既存L2 IDを検索（Grepで docs/**/*.md から）
3. 同日の最大連番 + 1 で新ID生成

### 非機能要求ID（NF）
1. 現在日時を取得: YYYYMMDD
2. 既存NF IDを検索（Grepで docs/**/*.md から）
3. 同日の最大連番 + 1 で新ID生成

## 出力ファイル

| モード | ファイル |
|--------|---------|
| 通常 | `docs/l2_system/foundation.md` |

## 完了後の案内

- 生成ファイルのパスを報告
- **`/gen-phases`** でフェーズ定義・機能一覧を生成することを案内
- `/gen-rules` で実装ルールを生成することを案内
- `/check` で整合性チェックを案内
