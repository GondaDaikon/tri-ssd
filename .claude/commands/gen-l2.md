---
description: L1からL2（機能設計・技術方針）ドキュメントを生成する
argument-hint: "[--simple] [REQ-xxxx ...] - オプション: --simple（1ファイル生成）、対象の要件ID（省略時は全体）"
allowed-tools: Read, Write, Edit, WebSearch, Glob, AskUserQuestion
---

# L2 生成コマンド

## 引数

- `$ARGUMENTS`: オプションフラグと対象の要件ID（いずれも省略可）
  - `--simple`: 小規模プロジェクト向けに1ファイル（l2_overview.md）のみ生成
  - `REQ-xxxx ...`: 指定された REQ のみを対象に L2 を生成/更新
  - 省略時: L1 全体を対象に通常の4ファイル構成で L2 を生成

## 前提処理

1. `.claude/skills/ssdd_core.md` を読み込み、SSDD の基本概念を把握する
2. `.claude/skills/ssdd_examples.md` を読み込み、L2の実例を確認する
3. `docs/templates/l2_overview.md` を読み込み、L2 概要テンプレートを確認する
4. `docs/templates/l2_phases.md` を読み込み、L2 フェーズテンプレートを確認する
5. `docs/templates/README.md` を読み込み、フロントマター仕様を確認する
6. `docs/l1_vision.md` を読み込み、L1 の内容を把握する

## エラー処理

### L1 が存在しない場合

```
エラー: L1 ドキュメントが見つかりません。
必要なファイル: docs/l1_vision.md
先に /draft-l1 または /convert-l1 で L1 を作成してください。
```

### テンプレートが存在しない場合

```
エラー: L2 テンプレートが見つかりません。
必要なファイル:
- docs/templates/l2_overview.md
- docs/templates/l2_phases.md
先に /init-ssdd を実行するか、テンプレートを配置してください。
```

### 出力先に既存ファイルがある場合

`docs/l2_system/` 配下に既存ファイルがある場合、ユーザーに確認：

```
警告: 以下のファイルが既に存在します:
- docs/l2_system/overview.md
- docs/l2_system/phases.md

以下から選択してください:
1. 上書き（既存内容は失われます）
2. 差分更新（既存内容を保持しつつ追記）
3. キャンセル
```

### 指定された REQ が存在しない場合

```
警告: 以下の REQ ID が L1 に見つかりません: REQ-9999
存在する REQ ID: REQ-0001, REQ-0002, REQ-0003
続行しますか？ (y/n)
```

## 実行内容

L1 の要求を分析し、L2 ドキュメント群を生成します。

## 生成手順

### Step 0: 引数解析

`$ARGUMENTS` を解析し、生成モードと対象要件を決定する：

1. **--simple フラグの検出**
   - `$ARGUMENTS` に `--simple` が含まれる場合、`simple_mode = true`
   - simple_mode では1ファイル（`docs/l2_overview.md`）のみ生成

2. **対象要件の抽出**
   - REQ-xxxx 形式の引数を抽出
   - 指定がない場合は L1 全体を対象

3. **出力先の決定**
   - simple_mode: `docs/l2_overview.md`
   - 通常モード: `docs/l2_system/*.md`（4ファイル構成）

### Step 1: L1 分析

- REQ-xxxx の一覧を抽出
- 要件の依存関係を分析
- 非機能要求を分類

### ID採番ロジック

各ID種別（PH, F, NF）について、タイムスタンプベースで採番：

```
形式: {PREFIX}-YYYYMMDD-nnn

採番手順:
1. 現在日時を取得: YYYYMMDD = "20250125"
2. Grepで既存IDを検索: `{PREFIX}-{YYYYMMDD}-`
3. 最大連番+1で新ID生成
4. 例: PH-20250125-001, F-20250125-001, NF-20250125-001
```

### Step 2: 技術スタック検討（人間優先・AI補助）

技術選定は以下のサブステップで行う。

#### Step 2-1: L1から技術制約を抽出

以下の観点でL1を読み、制約を列挙する：

| 観点 | 確認内容 |
|------|---------|
| 対象プラットフォーム | Web / Desktop / Mobile / CLI |
| オフライン要件 | オフライン動作が必要か |
| リアルタイム性 | WebSocket等が必要か |
| データ量・パフォーマンス | 大量データ処理、高速レスポンス |
| セキュリティ要件 | 認証方式、暗号化等 |
| 明示的な技術指定 | L1で指定された技術（最優先） |

**出力**: 制約一覧をMarkdownで記録

#### Step 2-2: 技術カテゴリごとに候補を検索（AI実行）

WebSearchで以下のカテゴリの候補を**最低3個**ずつ検索:

| カテゴリ | 検索クエリ例 |
|---------|-------------|
| 言語/ランタイム | `[プラットフォーム] programming language 2025` |
| UIフレームワーク | `[プラットフォーム] UI framework comparison 2025` |
| データストア | `[要件] database 比較 2025` |

各候補について、Step 2-1の制約を満たすかチェック。

**出力**: 候補一覧（制約適合度付き）

#### Step 2-3: 候補をユーザーに提示（AskUserQuestion使用）

AIが検出した候補を、AskUserQuestionツールで対話的に提示：

**質問1**: 「プログラミング言語を選択してください」
- 選択肢1: TypeScript（理由: xxx、制約適合: ○）
- 選択肢2: Python（理由: xxx、制約適合: ○）
- 選択肢3: Rust（理由: xxx、制約適合: △）
- multiSelect: false

**質問2**: 「UIフレームワークを選択してください」（該当する場合）
- 選択肢を**最低3個**提示
- multiSelect: false

**質問3**: 「データストアを選択してください」
- 選択肢を**最低3個**提示
- multiSelect: false

#### Step 2-4: 選択結果の妥当性チェック（AI実行）

ユーザーが選択した技術スタックの組み合わせについて：
- L1の制約を満たすか最終確認
- 技術間の相性をチェック
- 問題がある場合は警告を表示し、再選択を促す

#### Step 2-5: L2に記録

選択された技術スタックを記録。

### Step 3: 用語集抽出

L1 からドメイン用語・業務用語を抽出し、定義を記載

### Step 4: 機能分解

REQ を F-xxxx（機能）に分解：

- 1つの REQ から複数の F が生まれることがある
- F 間の依存関係を明確化
- 各 F に対応する REQ を `req_ids` に記録

### Step 5: フェーズ設計

機能群を PH-xxxx（フェーズ）にグルーピング：

- 「結合して動かして意味がある」単位で束ねる
- 各フェーズの Exit Criteria を定義
- フェーズ内の機能は実装順に並べる

### Step 6: 非機能カタログ作成

L1 の高レベル非機能要求を NF-xxxx に具体化

### Step 7: ファイル生成

**デフォルト（2ファイル構成）:**

| ファイル | 内容 |
|---------|------|
| `docs/l2_system/overview.md` | 用語集・技術方針・全体構成・NFRカタログ |
| `docs/l2_system/phases.md` | フェーズ定義・機能一覧 |

**--simple フラグ指定時（1ファイル構成）:**

単一ファイル `docs/l2_overview.md` に全て統合。

## 出力仕様

- **フロントマター**: `doc_status: draft` で開始
- **曖昧箇所**: `<!-- TODO: 要確認 -->` でマーク
- **参照フィールド**: `req_ids`, `related_nfr_ids` を正確に記載

## 完了後の案内

- 生成したファイルのパスを報告（2ファイル構成または1ファイル構成）
- 抽出した F-xxxx, PH-xxxx, NF-xxxx の数を報告
- `/gen-l3` で L3 を生成できることを案内
- 技術選定で対話型プロセスを経由したことを報告
