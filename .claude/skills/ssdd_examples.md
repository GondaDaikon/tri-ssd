# SSDD 実例・ワークフロー

> このスキルはSSDDの実例とワークフローを提供します。ドラフト生成時に参照してください。

## L1 例: 要件ドキュメント

```markdown
---
id: REQ-20250125-001
kind: req
layer: L1
status: active
doc_status: reviewed
---

# ユーザー認証機能

## 概要

ユーザーがメールアドレスとパスワードでログインできる機能。

## 要求

### REQ-20250125-001: メールアドレス認証
- ユーザーはメールアドレスとパスワードでログインできる
- パスワードは8文字以上、英数字記号を含む
- ログイン失敗は5回までロックアウト

### REQ-20250125-002: パスワードリセット
- ユーザーはパスワードを忘れた場合、メールでリセットできる
- リセットリンクは24時間有効
```

## L2 例: フェーズ定義（phases.md）

```markdown
---
id: PH-20250125-001
kind: phase
layer: L2
status: active
doc_status: reviewed
---

# Phase 1: 基盤構築

## 目的

認証基盤とデータベース基盤を構築し、後続フェーズの土台を作る。

## 対象機能

| 機能ID | 機能名 | 実装順序 | 依存 |
|--------|--------|---------|------|
| F-20250125-001 | ユーザー登録 | 1 | なし |
| F-20250125-002 | ログイン | 2 | F-20250125-001 |
| F-20250125-003 | パスワードリセット | 3 | F-20250125-002 |

## 完了条件（Exit Criteria）

- [ ] すべての機能が実装・単体テスト完了
- [ ] 結合テスト完了（登録→ログイン→リセットのフロー）
- [ ] セキュリティレビュー完了
```

## L3 例: 機能ドキュメント

```markdown
---
id: F-20250125-001
kind: feature
layer: L3
status: active
doc_status: implemented
req_ids:
  - REQ-20250125-001
nfr_ids:
  - NF-20250125-001
phase: PH-20250125-001
---

# ユーザー登録機能

## 概要

新規ユーザーがメールアドレスとパスワードで登録できる機能。

## 入出力

**入力**:
- メールアドレス（必須）
- パスワード（必須、8文字以上）
- パスワード確認（必須）

**出力**:
- 成功: ユーザーID、確認メール送信
- 失敗: エラーメッセージ

## 受け入れ条件

### AC-001: 正常登録
Given: 未登録のメールアドレス
When: 有効なパスワードで登録
Then: ユーザーが作成され、確認メールが送信される

### AC-002: メールアドレス重複
Given: 既に登録済みのメールアドレス
When: 登録を試みる
Then: "このメールアドレスは既に登録されています"エラーが表示される

## タスクチェックリスト

- [x] バリデーション実装
- [x] データベーススキーマ作成
- [x] メール送信機能実装
- [x] 単体テスト作成
- [x] 結合テスト作成

## 実装メモ

- パスワードハッシュ: bcrypt（コスト10）
- メール送信: SendGrid API使用
- 関連ファイル: `src/auth/register.ts:42`
```

---

## 共通ワークフロー

### ワークフロー1: 新規プロジェクト開始

```bash
# 1. ディレクトリ構造初期化
/init-ssdd

# 2. L1（ビジョン・要求）作成
/draft-l1
# → AIが対話形式で要件を引き出し、L1ドキュメントを生成

# 3. L1をレビュー・承認
/review docs/l1_vision.md
# → 指摘事項を確認・修正

# 4. L1を reviewed に昇格
/promote-status docs/l1_vision.md

# 5. L2（機能設計・技術方針）生成
/gen-l2
# → AIが技術候補を提示、人間が選択
# → 2ファイル構成（overview.md + phases.md）生成

# 6. L2をレビュー・承認
/review docs/l2_system/overview.md
/review docs/l2_system/phases.md

# 7. L2を reviewed に昇格
/promote-status docs/l2_system/overview.md
/promote-status docs/l2_system/phases.md

# 8. 整合性チェック
/check
```

### ワークフロー2: 新機能追加

```bash
# 1. L2から実装する機能を選ぶ（例: F-20250125-001）

# 2. L3（機能ドキュメント）生成
/gen-l3 F-20250125-001

# 3. L3をレビュー・補正
/review docs/l3_features/F-20250125-001_xxx.md

# 4. L3を reviewed に昇格
/promote-status docs/l3_features/F-20250125-001_xxx.md

# 5. 実装・テスト
# → コードを書く
# → テストを書く

# 6. 実装完了後、L3を implemented に昇格
/promote-status docs/l3_features/F-20250125-001_xxx.md

# 7. 整合性チェック
/check
```

### ワークフロー3: 要件変更への対応

```bash
# 1. L1の変更箇所を編集
# → REQ-20250125-003を追加、または既存REQを修正

# 2. 変更影響分析
/propagate-change docs/l1_vision.md
# → 影響を受けるL2/L3ドキュメントを洗い出し

# 3. 影響ドキュメントを更新
# → L2のフェーズ定義更新
# → L3の新規作成または既存更新

# 4. 整合性チェック
/check

# 5. レビュー・承認
/review docs/l2_system/phases.md
/review docs/l3_features/F-20250125-004_xxx.md
```

### ワークフロー4: フェーズ完了時

```bash
# 1. Exit Criteriaを確認
# → docs/l2_system/phases.md の該当フェーズ

# 2. 結合テスト／E2Eテストシナリオ生成
# → AIに依頼: "PH-20250125-001の結合テストシナリオを生成"

# 3. テスト実施・結果記録

# 4. 問題があればL3/L2/L1にフィードバック
/propagate-change [問題が見つかったファイル]

# 5. フェーズ完了マーク
# → phases.md の該当フェーズのステータス更新

# 6. 整合性チェック
/check
```
