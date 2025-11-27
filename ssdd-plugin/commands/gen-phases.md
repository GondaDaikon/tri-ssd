---
description: L2 技術基盤からフェーズ定義・機能一覧（phases.md）を生成する
argument-hint: "[--include-setup] - オプション: 環境構築フェーズを含める（デフォルト: true）"
allowed-tools: Read, Write, Edit, Glob, Grep
---

# フェーズ定義生成コマンド

## 概要

L2 技術基盤（foundation.md）をベースに、フェーズ定義・機能一覧（phases.md）を生成する。

**前提**: foundation.md が確定（reviewed）していること。技術スタックが決まっていないとフェーズ計画は立てられない。

## 引数

- `--include-setup`: 環境構築フェーズを含める（デフォルト: true）
- `--skip-setup`: 環境構築フェーズをスキップ

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、SSDD の基本概念を把握する
2. `skills/ssdd/templates/l2_phases.md` を読み込み、フェーズテンプレートを確認
3. `docs/l1_vision.md` を読み込み、要件を把握する
4. `docs/l2_system/foundation.md` を読み込み、**技術スタックを把握する**

## 生成手順

### Step 1: foundation.md 確認

- `doc_status` が `reviewed` であることを確認
- `draft` の場合は警告を出し、続行するか確認する
- 技術スタックを把握

### Step 2: 環境構築フェーズ生成（--skip-setup でない場合）

選定された技術スタックに基づいて、以下の機能を含むフェーズを生成:

**PH-YYYYMMDD-001: 環境構築**
- プロジェクト初期化（例: Next.jsセットアップ）
- DB/ORMセットアップ（例: Prisma + PostgreSQL）
- 認証基盤（例: NextAuth.js）
- CI/CD設定（例: GitHub Actions）
- 開発環境構築（例: Docker Compose）

### Step 3: 機能分解

- L1の要件を機能候補に分解
- 機能IDはF-YYYYMMDD-nnn形式で採番

### Step 4: フェーズ設計

- 機能を「結合して意味のある単位」でグルーピング
- 各フェーズにExit Criteriaを定義
- 記載順＝実装順

### Step 5: 全体俯瞰用機能一覧作成

- 全機能の一覧テーブルを作成
- フェーズ・依存関係・ステータスを含む

## ID採番ロジック

### フェーズID（PH）
1. 現在日時を取得: YYYYMMDD
2. 既存PH IDを検索（Grepで docs/**/*.md から）
3. 同日の最大連番 + 1 で新ID生成

### 機能ID（F）
1. 現在日時を取得: YYYYMMDD
2. 既存F IDを検索（Grepで docs/**/*.md から）
3. 同日の最大連番 + 1 で新ID生成

## 出力ファイル

| ファイル |
|---------|
| `docs/l2_system/phases.md` |

## 完了後の案内

- 生成ファイルのパスを報告
- `/gen-rules` で実装ルールを生成することを案内
- `/gen-l3` で L3 機能ドキュメントを生成することを案内
- `/check` で整合性チェックを案内

## 環境構築フェーズの例

```markdown
## PH-20251127-001: 環境構築

### 目的

**ユーザー視点**:
- 本フェーズでは直接のユーザー機能は提供しない

**アーキテクチャ視点**:
- 開発・デプロイの基盤を整備
- 後続フェーズの前提となる技術スタックを導入

### 完了条件（Exit Criteria）

- [ ] プロジェクトが起動し、サンプルページが表示できる
- [ ] DBに接続でき、マイグレーションが成功する
- [ ] CI/CDパイプラインが動作する

### 対象機能一覧（記載順＝実装順）

#### 1. プロジェクト初期化
- **機能ID**: F-20251127-001

Next.jsプロジェクトの作成、基本設定

#### 2. DB/ORMセットアップ
- **機能ID**: F-20251127-002

Prisma + PostgreSQL の設定、初期スキーマ作成

#### 3. 認証基盤
- **機能ID**: F-20251127-003

NextAuth.js の導入、基本認証フロー実装

#### 4. CI/CD設定
- **機能ID**: F-20251127-004

GitHub Actions の設定、テスト・デプロイパイプライン構築
```
