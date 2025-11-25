---
description: SSDDドキュメントの整合性をチェックする
argument-hint: "[--list-ids | ファイルパス] - オプション"
allowed-tools: Read, Glob, Grep
---

# 整合性チェックコマンド

## 引数

- `$1`: オプション（省略可）
  - `--list-ids`: 全 ID 一覧を出力
  - ファイルパス: 指定ファイルのみをチェック
  - 省略時: 全ドキュメントをチェック

## 前提処理

1. `.claude/skills/ssdd.md` を読み込み、SSDD の基本概念を把握する
2. `docs/templates/README.md` を読み込み、フロントマター仕様を確認する

## 実行内容

### モード1: `--list-ids`

全ドキュメントのフロントマターから ID を抽出し、一覧を出力。

出力形式：

```
## ID 一覧

### L1（要件）
- VISION-0001: [title]
- REQ-0001: [title]
- REQ-0002: [title]

### L2（設計）
- PH-0001: [title]
- PH-0002: [title]
- F-0001: [title]
- F-0002: [title]
- NF-0001: [title]

### L3（機能Doc）
- F-0001: [title] (doc_status: [status])
- F-0002: [title] (doc_status: [status])

### 統計
- 総ID数: xx
- L1: xx, L2: xx, L3: xx
```

### モード2: 単一ファイルチェック

指定されたファイルに対して以下をチェック：

1. フロントマターの必須フィールド
2. 参照先 ID の存在確認
3. フォーマットの妥当性

### モード3: 全体チェック（デフォルト）

`docs/` 配下の全ドキュメントに対して以下をチェック：

## チェック項目

### 1. フロントマター検証

- [ ] 必須フィールドの存在（id, kind, layer, title, status, doc_status）
- [ ] kind の値が有効（vision, req, feature, nfr, phase, spike）
- [ ] layer の値が有効（L1, L2, L3, meta）
- [ ] status の値が有効（active, deprecated, removed）
- [ ] doc_status の値が有効（draft, reviewed, implemented）

### 2. ID 参照チェック

- [ ] `req_ids` の参照先が存在するか
- [ ] `nfr_ids` の参照先が存在するか
- [ ] `phase` の参照先が存在するか
- [ ] `depends_on` の参照先が存在するか
- [ ] `replaced_by` の参照先が存在するか

### 3. 整合性チェック

- [ ] L3 の機能 ID が L2 の機能一覧に存在するか
- [ ] L2 のフェーズ内機能が L3 として存在するか
- [ ] 孤立した ID（どこからも参照されていない）がないか
- [ ] 循環参照がないか

### 4. TODO チェック

- [ ] `<!-- TODO: 要確認 -->` の残存箇所を一覧化

## 出力形式

```
## 整合性チェック結果

### エラー（修正必須）
- [ファイルパス]: [エラー内容]

### 警告（確認推奨）
- [ファイルパス]: [警告内容]

### TODO 残存
- [ファイルパス:行番号]: [TODO内容]

### サマリ
- チェック対象: xx ファイル
- エラー: xx 件
- 警告: xx 件
- TODO: xx 件
```

## 終了ステータス

- エラー 0 件: 正常終了
- エラー 1 件以上: エラー一覧を表示

## 完了後の案内

- エラーがある場合: 修正方法を提案
- 警告がある場合: 確認ポイントを説明
- TODO がある場合: 優先的に確認すべき箇所を案内
