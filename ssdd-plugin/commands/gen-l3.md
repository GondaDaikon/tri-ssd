---
description: L2からL3（機能ドキュメント）を生成する
argument-hint: "[F-xxxx ...] - 対象の機能ID（省略時は全体）"
allowed-tools: Read, Write, Edit, Glob
---

# L3 生成コマンド

## 引数

- `$ARGUMENTS`: 対象の機能ID（省略可、複数指定可）
  - 指定時: 指定された F-xxxx のみを対象
  - 省略時: L2 の機能一覧全体を対象

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、SSDD の基本概念を把握する
2. `skills/ssdd/examples.md` を読み込み、L3の実例を確認する
3. `skills/ssdd/templates/l3_feature.md` を読み込み、L3テンプレートを確認する
4. `docs/l2_system/overview.md` を読み込み、技術方針・NFRカタログを把握する
5. `docs/l2_system/phases.md` を読み込み、フェーズ定義・機能一覧を把握する
6. `docs/l2_system/rules.md` を読み込み、**実装ルール（コード生成制約）を把握する**（存在する場合）

## ID採番ロジック

1. 現在日時を取得: YYYYMMDD
2. 既存F IDを検索（Grepで docs/**/*.md から）
3. 同日の最大連番 + 1 で新ID生成

## 生成手順

### Step 1: 対象機能の特定
- 引数があれば指定されたF-xxxx
- なければ phases.md の全機能

### Step 2: 既存L3の確認
- `docs/l3_features/` に既存があれば確認

### Step 3: 各機能のL3生成
1. **概要**: L2の機能定義から概要・ユースケース
2. **入出力・画面イメージ**: UI/API仕様
3. **業務ルール・例外**: バリデーション・権限・例外
4. **タスクチェックリスト**: 実装・テストタスク
5. **非機能・受け入れ条件**: NF具体化、AC
6. **実装メモ**: 初期は空

## 出力ファイル

- パターン: `docs/l3_features/F-YYYYMMDD-nnn_[機能名].md`
- 例: `F-20250125-001_user-registration.md`

## 出力仕様

- **フロントマター**: `doc_status: draft`
- **曖昧箇所**: `<!-- TODO: 要確認 -->` でマーク
- **参照フィールド**: `req_ids`, `nfr_ids`, `phase` を正確に記載

## 完了後の案内

- 生成ファイルのパスを報告
- TODO箇所の数を報告
- `/check` で整合性チェックを案内
- `/review F-xxxx` でレビューを案内
