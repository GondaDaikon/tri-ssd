# SSDD 実例・ワークフロー

## L1 例: ビジョン・要求

```yaml
---
id: VISION-20250125-001
kind: vision
layer: L1
status: active
doc_status: reviewed
---

# プロダクト名 ビジョン・要求

## プロダクトの目的
...

## 機能要求

### REQ-20250125-001: ユーザー認証
- メールアドレスとパスワードでログイン
- パスワードは8文字以上
```

## L2 例: フェーズ定義

```yaml
---
id: PH-20250125-001
kind: phase
layer: L2
status: active
doc_status: reviewed
---

# Phase 1: 基盤構築

## 対象機能

| 機能ID | 機能名 | 依存 |
|--------|--------|------|
| F-20250125-001 | ユーザー登録 | なし |
| F-20250125-002 | ログイン | F-20250125-001 |

## Exit Criteria
- [ ] 全機能の実装・単体テスト完了
- [ ] 結合テスト完了
```

## L3 例: 機能ドキュメント

```yaml
---
id: F-20250125-001
kind: feature
layer: L3
status: active
doc_status: implemented
req_ids: [REQ-20250125-001]
phase: PH-20250125-001
---

# ユーザー登録機能

## 概要
新規ユーザーがメールアドレスとパスワードで登録できる。

## 入出力
- 入力: メールアドレス、パスワード
- 出力: ユーザーID、確認メール送信

## 受け入れ条件

### AC-001: 正常登録
Given: 未登録のメールアドレス
When: 有効なパスワードで登録
Then: ユーザーが作成され確認メールが送信される
```

---

## ワークフロー

### 新規プロジェクト開始

```bash
/init-ssdd           # ディレクトリ構造初期化
/draft-l1            # L1作成（対話形式）
/review l1_vision.md # レビュー
/promote-status l1_vision.md  # reviewed に昇格
/gen-l2              # L2生成
/check               # 整合性チェック
```

### 機能実装

```bash
/gen-l3 F-20250125-001       # L3生成
/review F-20250125-001       # レビュー
/promote-status F-20250125-001  # reviewed に昇格
# 実装・テスト
/promote-status F-20250125-001  # implemented に昇格
```

### 複数機能の一括処理

```bash
# 複数のL3を一括生成
/gen-l3 F-20250125-001 F-20250125-002 F-20250125-003

# 特定フェーズの全機能を生成
/gen-l3 PH-20250125-001

# 全機能を一括生成（引数なし）
/gen-l3
```

### 要件変更対応

```bash
# L1を編集
/propagate-change l1_vision.md  # 影響分析
# 影響ドキュメントを更新
/check                          # 整合性チェック
```
