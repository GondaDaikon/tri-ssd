# SSDD コア概念

> このスキルはSSDDの基本概念を定義します。コマンド実行時に必ず読み込んでください。

## 概要

SSDD は、LLM／AIコードエージェントを前提とした仕様駆動開発のフレームワークです。

## v2.0 主要変更点（2025-01）

### ID管理方式の変更
- **旧**: 連番方式（REQ-0001, F-0001）
- **新**: タイムスタンプベース（REQ-20250125-001, F-20250125-001）
- **理由**: 並行開発時のID衝突を根本的に防止

### フロントマター仕様の変更
- **廃止**: `title`フィールド（フロントマターと本文の同期問題を解決）
- **新方式**: 本文の最初の`# 見出し`がタイトルとして扱われる

### L2構成の変更
- **旧**: 4ファイル（overview.md, phases.md, nfr.md, features_index.md）
- **新**: 2ファイル（overview.md, phases.md）- NFRと機能一覧は統合
- **理由**: 小規模プロジェクトでのシンプル化

### 技術選定の変更
- **旧**: AIが自動的にWebSearchで選定
- **新**: AIが候補を提示 → 人間が選択（AskUserQuestion使用）
- **理由**: 重要な技術判断は人間が行うべき

## 三層モデル

| 層 | 名称 | 役割 | 正本の対象 |
|----|------|------|-----------|
| L1 | ビジョン・要求 | ビジネス要求・背景・制約・願望 | 要件 |
| L2 | 機能設計・技術方針 | 機能構成・技術スタック・フェーズ・NFR | 設計判断 |
| L3 | 機能ドキュメント | ミニ仕様＋タスク＋テスト＋実装メモ | **機能単位の仕様・設計意図** |

### L3の設計思想：分割統治によるAI活用

SSDDの核心は、**複雑な要件を機能単位に分割し、AIが扱える粒度に統治する**こと。

- **なぜ分割するか**: AIコードエージェントが一度に扱える複雑さには限界がある
- **L3の役割**: 「AIとのフィードバックサイクルを回す作業単位」として機能
- **サイクル**: L3仕様 → AIがコード生成 → テスト・検証 → L3更新 → 再生成...

| フェーズ | L3の役割 |
|---------|---------|
| 実装前 | AIへの入力仕様書（概要・入出力・受け入れ条件） |
| 実装中 | フィードバックサイクルの中心 |
| 実装後 | 設計意図・判断理由の記録（コードだけでは分からない文脈を保持） |

> **注意**: 実装後も設計意図は L3 に残す。ただし実装詳細はコードが正であり、完全同期は不要。

## ID 種類

| ID形式 | 用途 |
|--------|------|
| REQ-YYYYMMDD-nnn | 要件 |
| PH-YYYYMMDD-nnn | フェーズ |
| PH-POC-YYYYMMDD-nnn | 検証フェーズ |
| NF-YYYYMMDD-nnn | 非機能要求 |
| F-YYYYMMDD-nnn | 機能（Feature） |
| SP-YYYYMMDD-nnn | スパイク／PoC |

**Note**: タイムスタンプベースのID形式により、並行開発時のID衝突を防止します。

## フロントマター仕様

### 共通フィールド（必須）

**v2.0変更**: `title`フィールドは廃止。本文の最初の`# 見出し`がタイトルとして扱われます。

```yaml
---
id: [ID]
kind: [vision|req|feature|nfr|phase|spike|overview]
layer: [L1|L2|L3|meta]
status: [active|deprecated|removed]
doc_status: [draft|reviewed|implemented]
---

# 機能名またはタイトル
```

### 参照フィールド（トレーサビリティ用）

```yaml
req_ids: [REQ-20250125-001]  # 対応する要件ID
nfr_ids: [NF-20250125-001]   # 適用される非機能要求ID
phase: PH-20250125-001       # 所属フェーズ
replaced_by: [ID]            # 後継ID（deprecated時）
```

## 判断基準

### doc_status の遷移

1. **draft**: AI生成直後、または書きかけ
2. **reviewed**: 人間がレビュー済み、実装可能
3. **implemented**: 実装・テスト完了、ドキュメント追従済み

### 変更伝播の原則

- **L1変更** → L2・L3 に波及
- **L2変更** → L3 に波及、要件影響時は L1 に戻る
- **L3変更** → 局所的なら L3 のみ、設計影響時は L2 に波及

### 曖昧箇所のマーク

判断に迷う箇所、要確認事項は以下のコメントでマーク：

```markdown
<!-- TODO: 要確認 -->
```

## ID管理ポリシー

- **フロントマターが正本**（Single Source of Truth）
- catalog.yaml による二重管理は行わない
- ID一覧は `/check --list-ids` で動的生成

## ディレクトリ構成

```
docs/
  l1_vision.md          # L1: ビジョン・要求（フラット配置）
  l2_system/            # L2: 機能設計・技術方針（v2.0: 2ファイル構成）
    overview.md         # 用語集・技術方針・全体構成・NFRカタログ
    phases.md           # フェーズ定義・機能一覧
  l3_features/          # L3: 機能ドキュメント
    F-20250125-001_xxx.md
    F-20250125-002_xxx.md
```

## テンプレート参照先

### 基本テンプレート

- L1: `docs/templates/l1_vision.md`
- L2 概要: `docs/templates/l2_overview.md`
- L2 フェーズ: `docs/templates/l2_phases.md`
- L3 機能（汎用）: `docs/templates/l3_feature.md`
- フロントマター仕様: `docs/templates/README.md`

### ドメイン特化テンプレート（v2.1）

| ドメイン | テンプレート | 特徴 |
|---------|-------------|------|
| Webアプリ | `l3_feature_web.md` | 画面設計、API、レスポンシブ、セキュリティ |
| Desktopアプリ | `l3_feature_desktop.md` | ウィンドウ、メニュー、OS統合 |
| Mobileアプリ | `l3_feature_mobile.md` | 画面遷移、デバイス機能、オフライン |
| CLIツール | `l3_feature_cli.md` | コマンド仕様、入出力、POSIX準拠 |

## 詳細ドキュメント参照

- **概念ガイド**: `docs/guide.md`
- **開発フロー**: `docs/checklists.md`
- **テンプレート**: `docs/templates/README.md`
- **エラーメッセージ**: `docs/error_messages.md`
- **v2.0移行**: `docs/migration_v2.md`
