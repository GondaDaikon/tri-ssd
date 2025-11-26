# SSDD（Slices Specification-Driven Development）

スライス仕様駆動開発サイクル運用ガイド

## 概要

SSDD は、LLM／AIコードエージェントを前提とした仕様駆動開発のフレームワークです。

三層のドキュメント構造（L1/L2/L3）を通じて、要件から実装までのトレーサビリティを確保しながら、AIと人間の共同作業を効率化します。

### 本フレームワークの特徴

- **三層ドキュメント構造**: ビジョン（L1）→ 設計（L2）→ 機能仕様（L3）の階層管理
- **LLM活用前提**: AIによるドラフト生成・整合性チェック・差分検出を標準ワークフローに組み込み
- **フロントマターによるID管理**: 各ドキュメントのメタ情報をYAMLフロントマターで一元管理
- **変更伝播ルール**: 上位層から下位層への影響波及を明確に定義

### 背景となる考え方

SSDD は以下の考え方をベースにしています：

- 要求工学における「ステークホルダー要求 → システム要求」の多層モデル
- MBSE/MBRE（モデルベース要求工学）
- Specification-Driven Development（仕様駆動開発）
- プロダクトマネジメントにおける「ビジョンドキュメント＋プロダクトバックログ」

## バージョン情報

### v2.3（2025-01）運用改善

**主要変更点**:
- **ライト版廃止**: 標準SSDDの段階的導入を推奨（詳細: [checklists.md](checklists.md)）
- **変更ログ管理**: Git commit + CHANGELOG.md の運用方針を文書化（[changelog_management.md](changelog_management.md)）
- **バリデーションツール**: `/check`, `/review` の使い分けガイド（[validation_tools.md](validation_tools.md)）
- **スキルモジュール化**: ssdd.mdを3モジュール（core/examples/troubleshooting）に分割

### v2.2（2025-01）品質向上

**主要変更点**:
- **定量的指標**: REQ数5-50、機能数10-100等の規模目安（[review.md](.claude/commands/review.md)）
- **フェーズ vs イテレーション**: 機能的マイルストーン vs 時間的マイルストーンの明確化（[guide.md](guide.md)）
- **エラーメッセージ標準化**: E###/W###/I### コード体系の導入（[error_messages.md](error_messages.md)）

### v2.1（2025-01）機能拡張

**主要変更点**:
- **doc_status管理**: `/promote-status` コマンドで状態遷移を管理（[promote-status.md](.claude/commands/promote-status.md)）
- **変更伝播**: `/propagate-change` コマンドで影響分析（[propagate-change.md](.claude/commands/propagate-change.md)）
- **ドメイン特化テンプレート**: Web/Desktop/Mobile/CLI用L3テンプレート（[templates/README.md](templates/README.md)）
- **NFR優先度**: Must/Should/Could/Won'tによる優先度分類

### v2.0（2025-01）基盤改善

SSDD v2.0 では、運用上の問題点を根本的に解決する重要な変更が行われました：

#### 1. ID管理方式の変更
- **変更内容**: 連番方式 → タイムスタンプベース方式
- **旧形式**: `REQ-0001`, `F-0001`, `PH-0001`
- **新形式**: `REQ-20250125-001`, `F-20250125-001`, `PH-20250125-001`
- **理由**: 並行開発時のID衝突を根本的に防止

#### 2. フロントマター仕様の変更
- **変更内容**: `title`フィールドの廃止
- **新方式**: 本文の最初の`# 見出し`がドキュメントタイトルとして扱われる
- **理由**: フロントマターと本文の同期問題を解決

#### 3. L2構成のシンプル化
- **変更内容**: デフォルトを4ファイル構成から2ファイル構成に変更
- **新構成**: `overview.md`（用語集・技術方針・NFR）+ `phases.md`（フェーズ・機能一覧）
- **理由**: 小規模プロジェクトでの使いやすさ向上

#### 4. 技術選定プロセスの変更
- **変更内容**: AI自動選定 → AI提案＋人間選択方式
- **実装**: `AskUserQuestion`ツールを使用した対話的選定
- **理由**: 重要な技術判断は人間が主導すべき

詳細は [migration_v2.md](migration_v2.md) を参照してください。

## ドキュメント構成

### コアドキュメント

| ファイル | 内容 |
|---------|------|
| [guide.md](guide.md) | 概念説明・三層モデル・変更伝播ルール・AI活用ポリシー |
| [glossary.md](glossary.md) | SSDD用語集 |
| [checklists.md](checklists.md) | 開発フロー・段階的導入ガイド（v2.3: ライト版廃止） |
| [migration_v2.md](migration_v2.md) | v1.x → v2.0 移行ガイド |
| [templates/](templates/) | 各層のドキュメントテンプレート |

### 運用ドキュメント（v2.2-v2.3）

| ファイル | 内容 |
|---------|------|
| [error_messages.md](error_messages.md) | エラーメッセージ標準化ガイド（E###/W###/I### コード体系） |
| [changelog_management.md](changelog_management.md) | 変更ログ管理方針（Git commit + CHANGELOG.md） |
| [validation_tools.md](validation_tools.md) | バリデーションツール使い分けガイド（`/check`, `/review`） |

### テンプレート一覧

#### 基本テンプレート

| ファイル | 用途 |
|---------|------|
| [templates/README.md](templates/README.md) | フロントマター仕様・共通ルール |
| [templates/l1_vision.md](templates/l1_vision.md) | L1ビジョン・要求ドキュメント |
| [templates/l2_overview.md](templates/l2_overview.md) | L2概要（用語集・技術方針・NFRカタログ） |
| [templates/l2_phases.md](templates/l2_phases.md) | L2フェーズ定義・機能一覧 |
| [templates/l3_feature.md](templates/l3_feature.md) | L3機能ドキュメント（汎用） |

#### ドメイン特化テンプレート（v2.1）

| ファイル | 用途 |
|---------|------|
| [templates/l3_feature_web.md](templates/l3_feature_web.md) | L3機能（Webアプリ用） |
| [templates/l3_feature_desktop.md](templates/l3_feature_desktop.md) | L3機能（Desktopアプリ用） |
| [templates/l3_feature_mobile.md](templates/l3_feature_mobile.md) | L3機能（Mobileアプリ用） |
| [templates/l3_feature_cli.md](templates/l3_feature_cli.md) | L3機能（CLIツール用） |

## 想定読者

- プロダクトオーナー／業務担当
- アーキテクト／テックリード／ビジネスアナリスト（BA）
- 開発者／テスター
- プロジェクトマネージャ

## 適用範囲

- 個人開発〜小〜中規模チーム
- Web / ネイティブ / デスクトップ等の一般的なアプリケーション開発
- イテレーティブな開発

組織的なセキュリティ／コンプライアンス規定は本ガイドのスコープ外とします。

## 前提条件

- 単一プロダクト、または Monorepo 内の 1 プロダクトを対象
- L1〜L3 ドキュメント、ソースコードをすべて同一 Git リポジトリで管理
- LLM／コードエージェントを常用し、以下の作業を AI 経由で行う
  - L1 → L2 → L3 のドラフト生成
  - ドキュメントの更新・整合性チェック
  - コード／テストのドラフト生成
- AI による生成物は、必ず人間のレビューと修正を経て確定させる

> AI を用いない運用は本ガイドの対象外とし、SSDD は「AI を前提とした開発フロー」として位置づけます。

## クイックスタート

1. **guide.md を読む**: 三層モデルの概念を理解する
2. **テンプレートをコピー**: `templates/` 配下のファイルをプロジェクトに配置
3. **L1から始める**: ビジョン・要求を `l1_vision.md` に記載
4. **AIでL2を生成**: L1を元にAIで機能構成・技術方針をドラフト
5. **L3で実装**: 各機能ごとに機能Docを作成し、実装を進める
