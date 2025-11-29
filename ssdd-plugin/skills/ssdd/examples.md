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

## L2 例: 技術基盤（foundation.md）

```yaml
---
id: L2-20250125-001
kind: foundation
layer: L2
status: active
doc_status: reviewed
---

# プロダクト名 技術基盤

## 技術スタック

| 項目 | 選定技術 | 理由 |
|------|---------|------|
| フレームワーク | Next.js 14 | SSR/SSG対応、React Server Components |
| DB | PostgreSQL 16 | ACID準拠、JSON対応 |
| ORM | Prisma | 型安全、マイグレーション管理 |

## セキュリティ方針

### 認証・認可
| 項目 | 方針 |
|------|------|
| 認証方式 | NextAuth.js + JWT |
| 認可モデル | RBAC（admin/user） |

### データ保護
| 対象 | 保護方法 |
|------|---------|
| 通信 | HTTPS/TLS 1.3 |
| パスワード | bcrypt (cost=12) |

## エラーハンドリング方針

### エラーコード体系
| プレフィックス | 説明 |
|---------------|------|
| VAL | バリデーション |
| AUTH | 認証・認可 |
| BIZ | ビジネスルール |

## NFRカタログ

| NF ID | 名称 | 優先度 |
|-------|------|--------|
| NF-20250125-001 | レスポンス3秒以内 | Must |
| NF-20250125-002 | WCAG AA準拠 | Should |
```

## L2 例: フェーズ定義（phases.md）

```yaml
---
id: PH-20250125-001
kind: phase
layer: L2
status: active
doc_status: reviewed
---

# プロダクト名 フェーズ定義

## フェーズ間の依存関係

```
PH-ENV (環境構築)
    │
    ▼
PH-001 (認証基盤)
    │
    ▼
PH-002 (コア機能)
```

## 機能一覧（全体俯瞰用）

| 機能ID | 機能名 | フェーズ | 優先度 | ステータス |
|--------|--------|---------|--------|-----------|
| F-20250125-001 | ユーザー登録 | PH-001 | Must | 未着手 |
| F-20250125-002 | ログイン | PH-001 | Must | 未着手 |

## PH-20250125-ENV: 環境構築

### 完了条件（Exit Criteria）
- [ ] Next.jsプロジェクト起動確認
- [ ] DB接続・マイグレーション成功
- [ ] CI/CDパイプライン動作

### リスク・前提条件
| 項目 | 内容 | 対策 |
|------|------|------|
| 外部サービス | Vercelアカウント準備 | 早めに申請 |

## PH-20250125-001: 認証基盤

### 目的
**ユーザー視点**: ユーザーが登録・ログインできる
**アーキテクチャ視点**: 認証基盤を確立

### 完了条件（Exit Criteria）
- [ ] ユーザー登録・ログイン動作
- [ ] テストカバレッジ80%以上

### 対象機能一覧（記載順＝実装順）

#### 1. ユーザー登録
- **機能ID**: F-20250125-001
- **優先度**: Must
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
nfr_ids: [NF-20250125-001]
phase: PH-20250125-001
---

# ユーザー登録機能

## 1. 概要

### 1.1 この機能でできること
新規ユーザーがメールアドレスとパスワードで登録できる。

### 1.2 技術基盤との整合性

| 参照元 | 関連セクション |
|--------|---------------|
| foundation.md | セキュリティ方針（bcryptハッシュ） |
| rules.md | バリデーションルール |

## 2. データモデル

### 2.1 この機能で扱うエンティティ

| エンティティ | 説明 | 主要属性 |
|-------------|------|---------|
| User | ユーザー | id, email, passwordHash, createdAt |

### 2.2 データ構造

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}
```

## 3. インターフェース

### 3.1 API エンドポイント

**エンドポイント**: `POST /api/auth/register`

**リクエスト**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス（成功時）**:
```json
{
  "status": "success",
  "data": { "userId": "xxx" }
}
```

**レスポンス（エラー時）**:
```json
{
  "status": "error",
  "code": "VAL001",
  "message": "メールアドレスの形式が不正です"
}
```

## 4. 業務ルール・例外

### 4.1 バリデーションルール

| 項目 | ルール | エラーコード |
|------|--------|-------------|
| email | 必須、メール形式 | VAL001 |
| password | 必須、8文字以上 | VAL002 |

### 4.2 例外的なケース

| ケース | 動作 | エラーコード |
|--------|------|-------------|
| メール重複 | 登録拒否 | BIZ001 |

## 5. 受け入れ条件

### AC-1: 正常登録

```gherkin
Given 未登録のメールアドレス
When 有効なパスワードで登録
Then ユーザーが作成され確認メールが送信される
```

### AC-2: 重複メール

```gherkin
Given 登録済みのメールアドレス
When 同じメールで登録試行
Then BIZ001エラーが返される
```
```

---

## ワークフロー

### 新規プロジェクト開始

```bash
/init-ssdd           # ディレクトリ構造初期化
/draft-l1            # L1作成（対話形式）
/review l1_vision.md # レビュー
/promote-status l1_vision.md  # reviewed に昇格
/gen-l2              # L2技術基盤生成
/gen-phases          # フェーズ定義・機能一覧生成
/gen-rules           # 実装ルールのたたき台生成
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
