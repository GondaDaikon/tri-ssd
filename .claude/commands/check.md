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

全ドキュメントのフロントマターから ID を抽出し、テーブル形式で一覧を出力。

**出力形式：**

```markdown
# ID一覧

## Active

| ID | Kind | Title | Layer |
|----|------|-------|-------|
| VISION-0001 | vision | プロダクトビジョン | L1 |
| REQ-0001 | req | ユーザー認証 | L1 |
| PH-0001 | phase | 基盤構築 | L2 |
| F-0001 | feature | ログイン機能 | L3 |
| NF-0001 | nfr | レスポンス性能 | L2 |

## Deprecated/Removed

| ID | Kind | Title | Status |
|----|------|-------|--------|
| REQ-0010 | req | 旧認証方式 | deprecated |
| F-0005 | feature | レガシー機能 | removed |

## 統計

| 項目 | 件数 |
|------|------|
| Active | xx |
| Deprecated | xx |
| Removed | xx |
| **総計** | **xx** |
```

### モード2: 単一ファイルチェック

指定されたファイルに対して全チェック項目を実行。

### モード3: 全体チェック（デフォルト）

`docs/` 配下の全ドキュメントに対して全チェック項目を実行。

---

## チェック項目

### 1. フロントマター検査

#### 1-1: 共通必須フィールド（全ドキュメント）

以下が欠落していれば **エラー**：

| フィールド | 説明 |
|-----------|------|
| id | 一意なID |
| kind | ドキュメント種別 |
| layer | 所属レイヤ |
| status | ライフサイクル状態 |
| doc_status | 文書・開発状態 |

#### 1-2: L3 専用必須フィールド

L3（kind: feature）の場合、以下も必須。欠落は **エラー**：

| フィールド | 説明 |
|-----------|------|
| phase | 所属フェーズ（PH-xxxx） |
| req_ids | 対応する要件ID（1つ以上） |

#### 1-3: フィールド値の妥当性

不正な値は **エラー**：

| フィールド | 有効な値 |
|-----------|---------|
| kind | vision, req, feature, nfr, phase, spike |
| layer | L1, L2, L3, meta |
| status | active, deprecated, removed |
| doc_status | draft, reviewed, implemented |

---

### 2. 参照整合性検査

#### 2-1: req_ids の検査

各 `req_ids` について：

| 参照先の状態 | 判定 |
|-------------|------|
| L1 に存在し active | ✓ OK |
| L1 に存在し deprecated | ⚠ **警告**: deprecated への参照 |
| L1 に存在し removed | ⚠ **警告**: removed への参照（削除推奨） |
| L1 に存在しない | ✗ **エラー**: 参照先が存在しない |

#### 2-2: nfr_ids の検査

各 `nfr_ids` について：

| 参照先の状態 | 判定 |
|-------------|------|
| `docs/l2_system/nfr.md` に存在し active | ✓ OK |
| 存在し deprecated/removed | ⚠ **警告** |
| 存在しない | ✗ **エラー** |

#### 2-3: phase の検査

`phase` フィールドについて：

| 参照先の状態 | 判定 |
|-------------|------|
| `docs/l2_system/phases.md` に存在し active | ✓ OK |
| 存在し deprecated/removed | ⚠ **警告** |
| 存在しない | ✗ **エラー** |

#### 2-4: depends_on の検査

各 `depends_on` について：

| 参照先の状態 | 判定 |
|-------------|------|
| L3 に存在し active | ✓ OK |
| 存在し deprecated/removed | ⚠ **警告** |
| 存在しない | ✗ **エラー** |
| 循環参照を形成 | ✗ **エラー**: 循環参照 |

---

### 3. トレーサビリティ検査

#### 3-1: REQ → F の連鎖

L1 の各 `REQ-xxxx` について：

| 状態 | 判定 |
|------|------|
| いずれかの F-xxxx の `req_ids` に含まれている | ✓ OK |
| どの F-xxxx にも紐付いていない | ⚠ **警告**: 未実装の要件 |
| status が deprecated/removed | チェック対象外 |

#### 3-2: F（L2）→ L3 の連鎖

L2 の機能一覧（`features_index.md`）の各 `F-xxxx` について：

| 状態 | 判定 |
|------|------|
| `docs/l3_features/` に対応する L3 が存在 | ✓ OK |
| L3 が存在しない | ⚠ **警告**: 機能Docが未作成 |
| kind が spike（SP-xxxx） | チェック対象外（L3不要） |

#### 3-3: 孤立 L3 の検出

`docs/l3_features/` の各ファイルについて：

| 状態 | 判定 |
|------|------|
| L2 の機能一覧に含まれている | ✓ OK |
| L2 に含まれていない | ⚠ **警告**: 孤立した機能Doc |

---

### 4. TODO チェック

`<!-- TODO: 要確認 -->` の残存箇所を一覧化：

```markdown
### TODO 残存

| ファイル | 行番号 | 内容 |
|---------|--------|------|
| docs/l3_features/F-0001_xxx.md | 42 | <!-- TODO: 要確認 --> |
```

---

## 出力形式

```markdown
# 整合性チェック結果

## エラー（修正必須）

| ファイル | 種別 | 内容 |
|---------|------|------|
| docs/l3_features/F-0001_xxx.md | 参照エラー | req_ids の REQ-9999 が存在しない |
| docs/l3_features/F-0002_xxx.md | 必須フィールド欠落 | phase が未指定 |

## 警告（確認推奨）

| ファイル | 種別 | 内容 |
|---------|------|------|
| docs/l1_vision/vision.md | トレーサビリティ | REQ-0005 がどの機能にも紐付いていない |
| docs/l3_features/F-0003_xxx.md | 参照警告 | nfr_ids の NF-0002 は deprecated |

## TODO 残存

| ファイル | 行番号 | 内容 |
|---------|--------|------|
| docs/l2_system/overview.md | 58 | <!-- TODO: 要確認 --> |

## サマリ

| 項目 | 件数 |
|------|------|
| チェック対象 | xx ファイル |
| エラー | xx 件 |
| 警告 | xx 件 |
| TODO | xx 件 |
```

---

## 修正提案

エラーがある場合、diff 形式で具体的な修正案を提示：

```markdown
## 修正提案

### docs/l3_features/F-0001_xxx.md

**問題**: req_ids に存在しない ID が含まれている

```diff
---
id: F-0001
kind: feature
layer: L3
- req_ids: [REQ-9999]
+ req_ids: [REQ-0001]
phase: PH-0001
---
```

**適用方法**: 上記の修正を確認し、手動で適用してください。

---

### docs/l3_features/F-0002_xxx.md

**問題**: 必須フィールド phase が欠落

```diff
---
id: F-0002
kind: feature
layer: L3
req_ids: [REQ-0002]
+ phase: PH-0001
---
```
```

> **注意**: 修正提案は参考情報です。適用は人間が確認してから行ってください。

---

## 終了ステータス

| 状態 | 終了コード |
|------|-----------|
| エラー 0 件 | 正常終了 |
| エラー 1 件以上 | エラー一覧を表示 |

---

## 完了後の案内

- **エラーがある場合**: 修正提案を確認し、優先度の高いものから対応
- **警告がある場合**: トレーサビリティの観点で確認を推奨
- **TODO がある場合**: レビュー前に解消を推奨
- **全て OK の場合**: `/review` で詳細レビューを実行可能
