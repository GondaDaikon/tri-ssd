# SSDD テンプレート仕様

## 概要

このディレクトリには、SSDD の各層で使用するドキュメントテンプレートが含まれています。

| ファイル | 用途 |
|---------|------|
| [l1_vision.md](l1_vision.md) | L1 ビジョン・要求ドキュメント |
| [l2_overview.md](l2_overview.md) | L2 概要（用語集・技術方針・全体構成） |
| [l2_phases.md](l2_phases.md) | L2 フェーズ定義 |
| [l3_feature.md](l3_feature.md) | L3 機能ドキュメント（汎用） |
| [l3_feature_web.md](l3_feature_web.md) | L3 機能ドキュメント（Webアプリ用）**v2.1** |
| [l3_feature_desktop.md](l3_feature_desktop.md) | L3 機能ドキュメント（Desktop用）**v2.1** |
| [l3_feature_mobile.md](l3_feature_mobile.md) | L3 機能ドキュメント（Mobile用）**v2.1** |
| [l3_feature_cli.md](l3_feature_cli.md) | L3 機能ドキュメント（CLI用）**v2.1** |

### ドメイン別テンプレートの選択（v2.1以降）

L3機能ドキュメントでは、プロダクトのドメインに応じて最適なテンプレートを選択できます：

| ドメイン | テンプレート | 特徴 |
|---------|-------------|------|
| **汎用** | l3_feature.md | ドメインに依存しない基本テンプレート |
| **Webアプリ** | l3_feature_web.md | 画面設計、API設計、レスポンシブ、セキュリティ |
| **Desktopアプリ** | l3_feature_desktop.md | ウィンドウ設計、メニュー、システム統合、OS別対応 |
| **Mobileアプリ** | l3_feature_mobile.md | 画面遷移、デバイス機能、オフライン対応、ストア申請 |
| **CLIツール** | l3_feature_cli.md | コマンド仕様、入出力、パイプライン、POSIX準拠 |

**使い分けの目安**:
- 単一ドメインのプロダクト → ドメイン特化テンプレートを使用
- 複数ドメインのプロダクト → ドメインごとに異なるテンプレートを使用
- ドメインが不明瞭 → 汎用テンプレートから開始

---

## YAML フロントマター仕様

### 基本方針

- 単一IDを表す Markdown ファイルは、先頭に YAML フロントマターを持つ
- 本文内に同じメタ情報を重複して書かず、**フロントマターをメタ情報の正本**とする
- AI も、まずフロントマターを参照してから本文を処理する

### 共通フィールド

```yaml
---
id: REQ-YYYYMMDD-nnn   # 一意なID（タイムスタンプベース）
kind: req              # ドキュメント種別
layer: L1              # 所属レイヤ
status: active         # ライフサイクル状態
doc_status: draft      # 文書・開発状態
---

# ユーザー認証機能  # ← 本文の見出しがタイトルとして扱われる（v2.0）
```

| フィールド | 必須 | 説明 |
|-----------|------|------|
| id | ○ | 一意なID（REQ-YYYYMMDD-nnn, F-YYYYMMDD-nnn 等） |
| kind | ○ | ドキュメント種別（下記参照） |
| layer | ○ | 所属レイヤ（L1 / L2 / L3 / meta） |
| status | ○ | ライフサイクル状態（下記参照） |
| doc_status | ○ | 文書・開発状態（下記参照） |

**重要**: v2.0以降、`title`フィールドは廃止されました。本文の最初の`# 見出し`がドキュメントのタイトルとして扱われます。これにより、フロントマターと本文の同期問題を根本的に解決します。

### kind（ドキュメント種別）

| 値 | 説明 |
|----|------|
| vision | ビジョンドキュメント |
| req | 要件 |
| feature | 機能 |
| nfr | 非機能要求 |
| phase | フェーズ定義 |
| spike | スパイク／PoC |
| overview | L2概要（用語集・技術方針・アーキテクチャ） |

### status（ライフサイクル状態）

| 値 | 説明 |
|----|------|
| active | 現役。変更・拡張の対象 |
| deprecated | 廃止予定・移行中。可能であれば `replaced_by` で後継IDを記録 |
| removed | 廃止済み。履歴としてのみ残し、新規からは参照しない |

### doc_status（文書・開発状態）

| 値 | 説明 |
|----|------|
| draft | AIドラフトや書きかけ。レビュー前 |
| reviewed | 人間が内容を確認し、実装／運用に使えるレベル |
| implemented | 実装・テスト完了済みで、ドキュメントも追従している（主にL3） |

---

## 参照フィールド（トレーサビリティ用）

L2/L3 ドキュメントでは、以下の参照フィールドを使用してトレーサビリティを確保します。

```yaml
---
id: F-YYYYMMDD-nnn
kind: feature
layer: L3
status: active
doc_status: reviewed
req_ids:              # 対応する要件ID
  - REQ-YYYYMMDD-nnn
nfr_ids:              # 適用される非機能要求ID
  - NF-YYYYMMDD-nnn
phase: PH-YYYYMMDD-nnn  # 所属フェーズ
depends_on:           # 依存する機能ID
  - F-YYYYMMDD-nnn
---

# Markdown編集機能  # ← 本文の見出しがタイトル（v2.0）
```

| フィールド | 説明 |
|-----------|------|
| req_ids | この機能が対応する要件ID（REQ-xxxx）のリスト |
| nfr_ids | この機能に適用される非機能要求ID（NF-xxxx）のリスト |
| phase | この機能が所属するフェーズID（PH-xxxx） |
| related_nfr_ids | 関連する非機能要求ID（フェーズ定義などで使用） |
| replaced_by | status: deprecated の場合、後継となるID |

---

## 規模別の運用イメージ

### 個人開発

- `doc_status` は `draft / reviewed / implemented` の3つに絞ってよい
- AI がドラフトを生成した直後は `draft`
- 自分で読み直して「一旦これで進める」と判断したら `reviewed`
- 実装とテストを終えて内容をざっくり追随させたら `implemented`

### 小〜中規模チーム

- `reviewed` にする際に、誰がレビューしたか（reviewer）を PR やコメントで残すことを推奨
- 重要な設計（アーキテクチャ方針など）は、`reviewed` への変更を特定ロール（アーキテクト等）に限定することも検討

---

## AI による整合性チェック

フロントマターを正本としているため、以下のチェックを AI に依頼できます：

- 各ドキュメントの `id / kind / layer / status` の妥当性
- `req_ids / nfr_ids / phase / depends_on` の参照先が存在するか
- 孤立したID・切れたリンク・誤った参照の検出

> ID一覧が必要な場合は `/check --list-ids` で動的生成します。
