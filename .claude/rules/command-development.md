---
globs: commands/**/*.md
---

# コマンド開発ルール

このルールは `commands/` ディレクトリ内のファイルを編集する際に適用されます。

## フロントマター必須フィールド

```yaml
---
description: コマンドの説明（1行、必須）
argument-hint: "[引数] - 説明"  # 引数がある場合
allowed-tools: Read, Write, Edit, Glob, Grep  # 必須
---
```

## 必須コンテキストブロック

### `<tri_ssd_context>` ブロック（必須）

すべてのコマンドに含める:

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

### `<avoid_over_engineering>` ブロック（推奨）

過剰設計を防ぐために含める:

```markdown
<avoid_over_engineering>
- 必要以上に詳細を聞き出さない
- 「わからない」→ TODOマークして先に進む
- テンプレートの全セクションを埋める必要はない
- 「念のため」でセクションを追加しない
</avoid_over_engineering>
```

## ファイルサイズ制限

| 推奨 | 最大 |
|------|------|
| 200-400行 | 800行 |

800行を超える場合は分割を検討。

## 必須セクション

1. **出力フォーマット定義**
   - YAMLフロントマター形式
   - 必須Markdown構造
   - 省略可能なセクション

2. **ID採番ロジック**（ID生成を行う場合）
   - 現在日時の取得
   - 既存IDの検索
   - 連番の決定

3. **完了後の案内**
   - 作成ファイルのパス
   - TODO箇所の数
   - 次のコマンド

## 単一責任

1コマンド = 1つの明確な責任

複数の責任を持つ場合は分割を検討。
