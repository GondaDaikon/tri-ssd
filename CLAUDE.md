# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このリポジトリは **Tri-SSD Claude Code プラグインの開発リポジトリ** です。

Tri-SSD（Tri-Layer Slice Spec Driven）は、AI/LLMコードエージェントを前提とした仕様駆動開発フレームワークです。このリポジトリでは、そのフレームワークを Claude Code で利用するためのプラグイン（コマンド・スキル）を開発しています。

## ディレクトリ構成

```
commands/           # コマンド定義（.md）
skills/             # スキル定義
  tri-ssd-orchestrator/  # メインスキル
docs/               # フレームワーク仕様・ガイド
  samples/          # サンプルドキュメント（TaskFlowアプリ題材）
templates/          # L1/L2/L3テンプレート
```

## コマンド定義の書き方（commands/*.md）

### フロントマター形式

```yaml
---
description: コマンドの説明（1行）
argument-hint: "[引数] - 説明"
allowed-tools: Read, Write, Edit, Glob, Grep
---
```

| フィールド | 必須 | 説明 |
|-----------|------|------|
| description | ○ | コマンドの簡潔な説明 |
| argument-hint | △ | 引数がある場合の説明 |
| allowed-tools | ○ | 使用を許可するツール |

### 本文の重要な構成要素

#### 1. 共通コンテキストブロック

```markdown
<tri_ssd_context>
Tri-SSD（Tri-Layer Slice Spec Driven）はAI/LLMコードエージェントを前提とした仕様駆動開発。

レイヤー構造:
- L1: ビジョン・要求（docs/l1_vision.md）
- L2: 技術基盤（docs/l2_system/）- foundation.md, phases.md, rules.md
- L3: 機能仕様（docs/l3_features/PH-xxx_name/F-xxx.md）

ID形式: PREFIX-YYYYMMDD-nnn（REQ, PH, F, NF）
ステータス: draft → reviewed → implemented（L3のみ）
</tri_ssd_context>
```

#### 2. 過剰設計回避の指示

```markdown
<avoid_over_engineering>
- 必要以上に詳細を聞き出さない
- 「わからない」→ TODOマークして先に進む
- テンプレートの全セクションを埋める必要はない
- 「念のため」でセクションを追加しない
</avoid_over_engineering>
```

#### 3. 出力フォーマット（必須セクション）

- YAMLフロントマター形式の定義
- 必須構造（Markdownテンプレート）
- 省略可能なセクションの明記

#### 4. 再生成モード

既存ファイルがある場合の動作を定義:

| 保持するもの | 理由 |
|-------------|------|
| 既存ID | トレーサビリティ維持 |
| 実装メモ | 知見の保持 |
| doc_status: reviewed以上 | 承認済み保護 |

| 更新するもの | 条件 |
|-------------|------|
| 概要・仕様 | 上位層が変更された場合 |
| 受け入れ条件 | 要件変更時 |

#### 5. ID採番ロジック

```markdown
## ID採番ロジック

1. 現在日時を取得: YYYYMMDD
2. 既存IDを検索（Grepで docs/**/*.md から）
3. 同日の最大連番 + 1 で新ID生成
```

#### 6. 完了後の案内

- 作成ファイルのパスを報告
- TODO箇所の数を報告
- 次のコマンドを案内

## スキル定義の書き方（skills/*/SKILL.md）

### フロントマター形式

```yaml
---
name: スキル名
description: >
  スキルの説明（複数行可）。
  使用タイミングとトリガーワードを含める。
---
```

### 本文構成

```markdown
# スキル名

概要説明

## Instructions

スキルが呼び出されたときの動作手順

## 利用可能なコマンド

| コマンド | 用途 |
|---------|------|
| /xxx | 説明 |

## Examples

使用例

## Limitations

制限事項
```

## ドキュメントのフロントマター仕様

Tri-SSD ドキュメント（L1/L2/L3）のフロントマター:

```yaml
---
id: PREFIX-YYYYMMDD-nnn     # 一意なID
kind: vision|foundation|phase|rules|feature
layer: L1|L2|L3
status: active|deprecated|removed
doc_status: draft|reviewed|implemented
---
```

### ID プレフィックス

| プレフィックス | 用途 |
|---------------|------|
| VISION | L1ビジョン |
| REQ | 要件（L1内でインライン定義） |
| NF | 非機能要求（L2内で定義） |
| PH | フェーズ |
| F | 機能 |

### doc_status 遷移

```
draft → reviewed → implemented
```

- `draft`: AI生成直後・書きかけ
- `reviewed`: レビュー済み、実装可能
- `implemented`: 実装・テスト完了（主にL3）

## 参照すべきドキュメント

| ドキュメント | 内容 |
|-------------|------|
| `docs/frontmatter_spec.md` | フロントマター仕様 |
| `docs/guide.md` | 概念ガイド |
| `docs/samples/` | TaskFlowアプリのサンプル |

## 開発時の注意

- **レイヤーをスキップしない**: L1/L2なしでL3を生成しない、reviewedでないL3からコード生成しない
- **コマンドは Markdown で定義**: `commands/*.md` に配置
- **ID形式を守る**: タイムスタンプベース `PREFIX-YYYYMMDD-nnn`
- **フロントマターを正本とする**: 本文内に同じメタ情報を重複して書かない
- **変更時はバージョン更新を忘れない**: 変更を加えたら `CHANGELOG.md`、`.claude-plugin/plugin.json`、`.claude-plugin/marketplace.json` のバージョンを同期

## プラグイン開発原則

コマンド/スキルを開発する際は、以下の原則を遵守してください。

### 必須ルール

| 原則 | 要件 |
|------|------|
| ファイルサイズ | 200-400行推奨、最大800行厳守 |
| テスト | TDD推奨、80%以上のカバレッジ目標 |
| 単一責任 | 1コマンド = 1つの明確な責任 |
| 段階的開示 | 基本機能→詳細機能の順で設計 |

### コンテキスト効率

- 大きなファイルを一度に読み込まない
- 必要な部分のみを参照
- ドキュメント間の重複を避ける

### 詳細ガイド

包括的なプラグイン開発ガイドは `docs/plugin-development-guide.md` を参照
