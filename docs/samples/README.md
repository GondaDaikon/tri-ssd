# Tri-SSD サンプルドキュメント

このディレクトリには、Tri-SSDで作成されるドキュメントの具体的なサンプルが含まれています。

**TaskFlow**（タスク管理Webアプリ）を題材に、L1/L2/L3の各層のドキュメント例を提供します。

## サンプル一覧

| ファイル | 層 | kind | 内容 |
|---------|-----|------|------|
| [l1_vision_taskflow.md](l1_vision_taskflow.md) | L1 | vision | ビジョン・要求ドキュメントのサンプル |
| [l2_foundation_taskflow.md](l2_foundation_taskflow.md) | L2 | foundation | 技術基盤（用語集・技術方針・アーキテクチャ・NFR）のサンプル |
| [l2_phases_taskflow.md](l2_phases_taskflow.md) | L2 | phase | フェーズ定義・機能一覧のサンプル |
| [l2_rules_taskflow.md](l2_rules_taskflow.md) | L2 | rules | 実装ルール（コード生成制約）のサンプル |
| [l3_feature_taskflow.md](l3_feature_taskflow.md) | L3 | feature | 機能ドキュメントのサンプル（タスク登録機能） |

> **注**: L2は以下のファイルで構成されます。
> - **l2_foundation_taskflow.md** (`kind: foundation`): 技術基盤（用語集・技術選定・アーキテクチャ・NFR）
> - **l2_phases_taskflow.md** (`kind: phase`): フェーズ定義と機能一覧
> - **l2_rules_taskflow.md** (`kind: rules`): 実装ルール（AI/人間がコード生成時に守る制約）

## ドキュメント生成

実際のプロジェクトでは、以下のコマンドでドキュメントを生成します：

| コマンド | 用途 |
|---------|------|
| `/draft-l1` | L1 ビジョン・要求 |
| `/draft-l2` | L2 技術基盤 |
| `/gen-phases` | L2 フェーズ定義 |
| `/draft-rules` | L2 実装ルール |
| `/gen-l3` | L3 機能ドキュメント |
| `/gen-code` | コード生成 |

各コマンドに出力フォーマットが埋め込まれており、正しいYAMLフロントマター形式でドキュメントを生成します。

## フロントマター仕様

フロントマターの仕様については [frontmatter_spec.md](../frontmatter_spec.md) を参照してください。

## TaskFlowサンプルの構造

```
TaskFlow（タスク管理Webアプリ）
├── L1: ビジョン・要求
│   ├── 課題・ペルソナ・ゴール
│   ├── 機能要求（REQ-20251126-001〜010）
│   └── 非機能要求（NF-20251126-001〜008）
├── L2: システム設計
│   ├── 技術基盤（用語集・アーキテクチャ・技術選定・NFR）
│   ├── フェーズ定義（MVP → β版 → 正式版）
│   └── 実装ルール（コード規約・アーキテクチャ・ドメインルール）
└── L3: 機能仕様
    └── F-20251126-002 タスク登録機能（実装例）
```

これらのサンプルを参考に、自身のプロジェクトに適したドキュメントを作成してください。
