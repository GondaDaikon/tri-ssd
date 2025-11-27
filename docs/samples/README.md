# SSDD サンプルドキュメント

このディレクトリには、SSDDで作成されるドキュメントの具体的なサンプルが含まれています。

**TaskFlow**（タスク管理Webアプリ）を題材に、L1/L2/L3の各層のドキュメント例を提供します。

## サンプル一覧

| ファイル | 層 | kind | 内容 |
|---------|-----|------|------|
| [l1_vision_taskflow.md](l1_vision_taskflow.md) | L1 | vision | ビジョン・要求ドキュメントのサンプル |
| [l2_overview_taskflow.md](l2_overview_taskflow.md) | L2 | overview | システム概要（用語集・技術方針・NFRカタログ）のサンプル |
| [l2_phases_taskflow.md](l2_phases_taskflow.md) | L2 | phase | フェーズ定義・機能一覧のサンプル |
| [l2_rules_taskflow.md](l2_rules_taskflow.md) | L2 | rules | 実装ルール（コード生成制約）のサンプル |
| [l3_feature_taskflow.md](l3_feature_taskflow.md) | L3 | feature | 機能ドキュメントのサンプル（タスク登録機能） |

> **注**: L2は以下のファイルで構成されます。
> - **l2_overview_taskflow.md** (`kind: overview`): システム全体の用語集・技術選定・NFRカタログ
> - **l2_phases_taskflow.md** (`kind: phase`): フェーズ定義と各フェーズの機能一覧
> - **l2_rules_taskflow.md** (`kind: rules`): 実装ルール（AI/人間がコード生成時に守る制約）

## テンプレートについて

実際のプロジェクトでドキュメントを生成する際は、以下を使用してください：

- **テンプレート（正本）**: `ssdd-plugin/skills/ssdd/templates/`
- **コマンド**: `/draft-l1`, `/gen-l2`, `/gen-rules`, `/gen-l3`

これらのコマンドがテンプレートを元にドキュメントを自動生成します。

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
│   ├── 概要（用語集・アーキテクチャ・技術選定・NFRカタログ）
│   ├── フェーズ定義（MVP → β版 → 正式版）
│   └── 実装ルール（コード規約・アーキテクチャ・ドメインルール）
└── L3: 機能仕様
    └── F-20251126-002 タスク登録機能（実装例）
```

これらのサンプルを参考に、自身のプロジェクトに適したドキュメントを作成してください。
