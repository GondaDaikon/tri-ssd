# Tri-SSD（Tri-Layer Slice Spec Driven）

三層仕様駆動開発サイクル運用ガイド

## 概要

Tri-SSD は、LLM／AIコードエージェントを前提とした仕様駆動開発のフレームワークです。三層のドキュメント構造（L1/L2/L3）を通じて、要件から実装までのトレーサビリティを確保しながら、AIと人間の共同作業を効率化します。

> 詳細な概念説明は [guide.md](guide.md) を参照してください。

## 変更履歴

[CHANGELOG.md](../CHANGELOG.md) を参照してください。

## ドキュメント構成

### コアドキュメント

| ファイル | 内容 |
|---------|------|
| [guide.md](guide.md) | 概念説明・三層モデル・変更伝播ルール・AI活用ポリシー |
| [glossary.md](glossary.md) | Tri-SSD用語集 |
| [checklists.md](checklists.md) | 開発フロー・段階的導入・バリデーションコマンド（`/check`, `/review`） |
| [frontmatter_spec.md](frontmatter_spec.md) | フロントマター仕様・共通ルール |
| [samples/](samples/) | 具体的なサンプルドキュメント（TaskFlowアプリ） |

### サンプルドキュメント

「TaskFlow」（タスク管理Webアプリ）を題材にした具体的なドキュメント例です。

| ファイル | 用途 |
|---------|------|
| [samples/l1_vision_taskflow.md](samples/l1_vision_taskflow.md) | L1ビジョン・要求ドキュメントのサンプル |
| [samples/l2_foundation_taskflow.md](samples/l2_foundation_taskflow.md) | L2技術基盤のサンプル |
| [samples/l2_phases_taskflow.md](samples/l2_phases_taskflow.md) | L2フェーズ定義のサンプル |
| [samples/l2_rules_taskflow.md](samples/l2_rules_taskflow.md) | L2実装ルールのサンプル |
| [samples/l3_feature_taskflow.md](samples/l3_feature_taskflow.md) | L3機能ドキュメントのサンプル |

> **出力フォーマット**: 各コマンド（`/draft-l1`, `/draft-l2`, `/gen-phases`, `/draft-rules`, `/gen-l3`）に出力フォーマットが埋め込まれており、正しいYAMLフロントマター形式でドキュメントを生成します。

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

> AI を用いない運用は本ガイドの対象外とし、Tri-SSD は「AI を前提とした開発フロー」として位置づけます。

## クイックスタート

1. **guide.md を読む**: 三層モデルの概念を理解する
2. **tri-ssd プラグインをインストール**: Claude Codeにプラグインを追加
3. **L1を生成**: `/draft-l1` コマンドでビジョン・要求ドキュメントを作成
4. **L2技術基盤を生成**: `/draft-l2` コマンドで技術方針をドラフト
5. **フェーズ設計**: `/gen-phases` コマンドでフェーズ定義・機能一覧を生成
6. **実装ルールを生成**: `/draft-rules` コマンドで実装ルールのたたき台を生成
7. **L3で実装**: `/gen-l3` コマンドで機能Docを作成し、実装を進める

> サンプルを参照したい場合は [samples/](samples/) ディレクトリを確認してください。
