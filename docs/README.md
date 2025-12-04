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

## 変更履歴

[CHANGELOG.md](../CHANGELOG.md) を参照してください。

## ドキュメント構成

### コアドキュメント

| ファイル | 内容 |
|---------|------|
| [guide.md](guide.md) | 概念説明・三層モデル・変更伝播ルール・AI活用ポリシー |
| [glossary.md](glossary.md) | SSDD用語集 |
| [checklists.md](checklists.md) | 開発フロー・段階的導入ガイド |
| [frontmatter_spec.md](frontmatter_spec.md) | フロントマター仕様・共通ルール |
| [samples/](samples/) | 具体的なサンプルドキュメント（TaskFlowアプリ） |

### 運用ドキュメント

| ファイル | 内容 |
|---------|------|
| [error_messages.md](error_messages.md) | エラーメッセージ標準化ガイド（E###/W###/I### コード体系） |
| [changelog_management.md](changelog_management.md) | 変更ログ管理方針（Git commit + CHANGELOG.md） |
| [validation_tools.md](validation_tools.md) | バリデーションツール使い分けガイド（`/check`, `/review`） |

### サンプルドキュメント

「TaskFlow」（タスク管理Webアプリ）を題材にした具体的なドキュメント例です。

| ファイル | 用途 |
|---------|------|
| [samples/l1_vision_taskflow.md](samples/l1_vision_taskflow.md) | L1ビジョン・要求ドキュメントのサンプル |
| [samples/l2_foundation_taskflow.md](samples/l2_foundation_taskflow.md) | L2技術基盤のサンプル |
| [samples/l2_phases_taskflow.md](samples/l2_phases_taskflow.md) | L2フェーズ定義のサンプル |
| [samples/l2_rules_taskflow.md](samples/l2_rules_taskflow.md) | L2実装ルールのサンプル |
| [samples/l3_feature_taskflow.md](samples/l3_feature_taskflow.md) | L3機能ドキュメントのサンプル |

> **テンプレート（正本）**: 実際のプロジェクトでは `ssdd-plugin/skills/ssdd/templates/` のテンプレートを使用します。コマンド（`/draft-l1`, `/draft-l2`, `/gen-phases`, `/draft-rules`, `/gen-l3`, `/gen-code`）が自動的にテンプレートからドキュメントを生成します。

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
2. **ssdd-plugin をインストール**: Claude Codeにプラグインを追加
3. **L1を生成**: `/draft-l1` コマンドでビジョン・要求ドキュメントを作成
4. **L2技術基盤を生成**: `/draft-l2` コマンドで技術方針をドラフト
5. **フェーズ設計**: `/gen-phases` コマンドでフェーズ定義・機能一覧を生成
6. **実装ルールを生成**: `/draft-rules` コマンドで実装ルールのたたき台を生成
7. **L3で実装**: `/gen-l3` コマンドで機能Docを作成し、実装を進める

> サンプルを参照したい場合は [samples/](samples/) ディレクトリを確認してください。
