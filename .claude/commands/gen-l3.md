---
description: L2からL3（機能ドキュメント）を生成する
argument-hint: "[F-xxxx ...] - 対象の機能ID（省略時は全体）"
allowed-tools: Read, Write, Edit, Glob
---

# L3 生成コマンド

## 引数

- `$ARGUMENTS`: 対象の機能ID（省略可、複数指定可）
  - 指定時: 指定された F-xxxx のみを対象に L3 を生成
  - 省略時: L2 の機能一覧全体を対象に L3 を生成

## 前提処理

1. `.claude/skills/ssdd.md` を読み込み、SSDD の基本概念を把握する
2. `docs/templates/l3_feature.md` を読み込み、L3 テンプレートを確認する
3. `docs/templates/README.md` を読み込み、フロントマター仕様を確認する
4. `docs/l2_system/overview.md` を読み込み、技術方針を把握する
5. `docs/l2_system/phases.md` を読み込み、フェーズ定義を把握する
6. `docs/l2_system/features_index.md` を読み込み、機能一覧を把握する
7. `docs/l2_system/nfr.md` を読み込み、非機能要求を把握する

## エラー処理

### L2 が存在しない場合

```
エラー: L2 ドキュメントが見つかりません。
必要なファイル:
- docs/l2_system/features_index.md（機能一覧）
- docs/l2_system/phases.md（フェーズ定義）
先に /gen-l2 で L2 を作成してください。
```

### テンプレートが存在しない場合

```
エラー: L3 テンプレートが見つかりません。
必要なファイル: docs/templates/l3_feature.md
先に /init-ssdd を実行するか、テンプレートを配置してください。
```

### 指定された F が存在しない場合

```
エラー: 以下の機能 ID が L2 に見つかりません: F-9999
存在する機能 ID: F-0001, F-0002, F-0003
```

### 出力先に既存ファイルがある場合

対象の L3 ファイルが既に存在する場合、各ファイルについてユーザーに確認：

```
警告: docs/l3_features/F-0001_xxx.md は既に存在します。
以下から選択してください:
1. スキップ（既存を保持）
2. 上書き（既存内容は失われます）
3. 差分表示（変更点を確認してから決定）

全ファイルに同じ操作を適用しますか？ (y/n)
```

## 実行内容

L2 の機能定義を元に、各機能の L3 ドキュメントを生成します。

## 生成手順

### Step 1: 対象機能の特定

- `$ARGUMENTS` がある場合: 指定された F-xxxx を対象
- `$ARGUMENTS` がない場合: `features_index.md` の全機能を対象

### Step 2: 既存 L3 の確認

`docs/l3_features/` 配下に既存の機能 Doc があるか確認：

- 存在する場合: スキップまたは更新（ユーザーに確認）
- 存在しない場合: 新規作成

### Step 3: 各機能の L3 生成

各 F-xxxx について以下を生成：

1. **概要**: L2 の機能定義から概要・ユースケースを記載
2. **入出力・画面イメージ**: 想定される UI/API を記載
3. **業務ルール・例外**: バリデーション・権限・例外ケースを記載
4. **タスクチェックリスト**: 実装タスク・テストタスクを記載
5. **非機能・受け入れ条件**: 該当 NF の具体化、AC を記載
6. **実装メモ**: 初期状態は空（実装後に追記）

### Step 4: フロントマター設定

```yaml
---
id: F-xxxx
kind: feature
layer: L3
title: [機能名]
status: active
doc_status: draft
req_ids:
  - REQ-xxxx
nfr_ids:
  - NF-xxxx
phase: PH-xxxx
depends_on:
  - F-yyyy
---
```

## 出力ファイル

| パターン | ファイル名 |
|---------|-----------|
| 単一機能 | `docs/l3_features/F-xxxx_[機能名].md` |
| 複数機能 | 各機能ごとに上記形式で生成 |

## 出力仕様

- **フロントマター**: `doc_status: draft` で開始
- **曖昧箇所**: `<!-- TODO: 要確認 -->` でマーク
- **参照フィールド**: `req_ids`, `nfr_ids`, `phase`, `depends_on` を正確に記載

## ファイル名規則

- 形式: `F-xxxx_[機能名（英数字・ハイフン）].md`
- 例: `F-0001_markdown-edit.md`

## 完了後の案内

- 生成したファイルのパスを報告
- 各機能の TODO 箇所の数を報告
- `/check` で整合性チェックできることを案内
- `/review F-xxxx` でレビューできることを案内
