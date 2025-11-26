---
id: F-20251126-002
kind: feature
layer: L3
status: active
doc_status: implemented
req_ids:
  - REQ-20251126-001
nfr_ids:
  - NF-20251126-001
  - NF-20251126-003
phase: PH-20251126-001
depends_on:
  - F-20251126-001
---

# タスク登録機能

## 1. 機能概要

### 1.1 目的

ユーザーが新しいタスクを作成し、やるべきことを記録できるようにする。

### 1.2 対応する要件

- REQ-20251126-001: タイトル・期限・優先度を指定してタスクを作成

### 1.3 適用される非機能要求

- NF-20251126-001: API応答500ms以内
- NF-20251126-003: 通信はTLS 1.3、保存時AES-256

---

## 2. ユーザーストーリー

```
As a ログイン済みユーザー
I want to 新しいタスクを登録したい
So that やるべきことを忘れずに管理できる
```

---

## 3. 受け入れ条件（Acceptance Criteria）

### AC-001: 必須項目でタスク作成

- **Given**: ユーザーがログインしている
- **When**: タイトルを入力して「作成」ボタンを押す
- **Then**: 新しいタスクが作成され、タスク一覧に表示される

### AC-002: オプション項目の設定

- **Given**: タスク作成フォームを開いている
- **When**: 期限と優先度を設定してタスクを作成する
- **Then**: 設定した期限と優先度がタスクに反映される

### AC-003: バリデーションエラー

- **Given**: タスク作成フォームを開いている
- **When**: タイトルを空のまま「作成」ボタンを押す
- **Then**: 「タイトルは必須です」というエラーが表示される

### AC-004: タイトル文字数制限

- **Given**: タスク作成フォームを開いている
- **When**: 101文字以上のタイトルを入力する
- **Then**: 「タイトルは100文字以内で入力してください」というエラーが表示される

### AC-005: 連続作成

- **Given**: タスクを作成した直後
- **When**: フォームがリセットされている
- **Then**: 続けて別のタスクを作成できる

---

## 4. 画面設計

### 4.1 タスク作成フォーム

```
┌─────────────────────────────────────────────────┐
│  タスクを追加                              [×]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  タイトル *                                      │
│  ┌───────────────────────────────────────────┐ │
│  │ 提案書を作成する                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  説明（任意）                                    │
│  ┌───────────────────────────────────────────┐ │
│  │ A社向けの新規提案書を作成                   │ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  期限（任意）           優先度                   │
│  ┌─────────────┐       ┌─────────────┐        │
│  │ 2025/11/30  │       │ 高 ▼       │        │
│  └─────────────┘       └─────────────┘        │
│                                                 │
│         [キャンセル]  [タスクを作成]             │
└─────────────────────────────────────────────────┘
```

### 4.2 入力項目

| 項目 | 必須 | 型 | 制約 | デフォルト値 |
|------|-----|-----|------|-------------|
| タイトル | ○ | string | 1〜100文字 | - |
| 説明 | - | string | 0〜1000文字 | 空文字 |
| 期限 | - | date | 今日以降の日付 | null |
| 優先度 | - | enum | 高/中/低 | 中 |

---

## 5. API設計

### 5.1 エンドポイント

```
POST /api/v1/tasks
```

### 5.2 リクエスト

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "提案書を作成する",
  "description": "A社向けの新規提案書を作成",
  "dueDate": "2025-11-30",
  "priority": "high"
}
```

### 5.3 レスポンス

**成功時 (201 Created):**
```json
{
  "id": "task_abc123",
  "title": "提案書を作成する",
  "description": "A社向けの新規提案書を作成",
  "dueDate": "2025-11-30",
  "priority": "high",
  "completed": false,
  "createdAt": "2025-11-26T10:30:00Z",
  "updatedAt": "2025-11-26T10:30:00Z"
}
```

**バリデーションエラー (400 Bad Request):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力内容に問題があります",
    "details": [
      {
        "field": "title",
        "message": "タイトルは必須です"
      }
    ]
  }
}
```

**認証エラー (401 Unauthorized):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "認証が必要です"
  }
}
```

---

## 6. データモデル

### 6.1 Taskテーブル

```sql
CREATE TABLE tasks (
  id VARCHAR(26) PRIMARY KEY,        -- ULID
  user_id VARCHAR(26) NOT NULL,      -- FK to users
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE,
  priority VARCHAR(10) DEFAULT 'medium',
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT chk_priority CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(user_id, due_date);
```

### 6.2 Prismaスキーマ

```prisma
model Task {
  id          String    @id @default(cuid())
  userId      String    @map("user_id")
  title       String    @db.VarChar(100)
  description String?   @db.Text
  dueDate     DateTime? @map("due_date") @db.Date
  priority    Priority  @default(medium)
  completed   Boolean   @default(false)
  completedAt DateTime? @map("completed_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([userId, dueDate])
  @@map("tasks")
}

enum Priority {
  high
  medium
  low
}
```

---

## 7. 実装タスク

### 7.1 バックエンド

- [x] Task Prismaモデル定義
- [x] CreateTaskDTO（Zodスキーマ）
- [x] TaskRepository.create()
- [x] TaskService.createTask()
- [x] POST /api/v1/tasks エンドポイント
- [x] ユニットテスト
- [x] 統合テスト

### 7.2 フロントエンド

- [x] TaskFormコンポーネント
- [x] useCreateTask フック（React Query）
- [x] バリデーション（React Hook Form + Zod）
- [x] エラーハンドリング
- [x] ローディング状態
- [x] Storybookストーリー
- [x] E2Eテスト（Playwright）

---

## 8. テスト計画

### 8.1 ユニットテスト

| テストケース | 期待結果 |
|-------------|---------|
| 有効なデータでタスク作成 | タスクが保存され、IDが返却される |
| タイトル空でタスク作成 | ValidationError |
| タイトル101文字でタスク作成 | ValidationError |
| 過去の日付を期限に設定 | ValidationError |
| 無効な優先度を設定 | ValidationError |

### 8.2 統合テスト

| テストケース | 期待結果 |
|-------------|---------|
| POST /api/v1/tasks（認証あり、有効データ） | 201 Created |
| POST /api/v1/tasks（認証なし） | 401 Unauthorized |
| POST /api/v1/tasks（認証あり、無効データ） | 400 Bad Request |

### 8.3 E2Eテスト

| テストケース | 期待結果 |
|-------------|---------|
| タスク作成フォームを開いてタスクを作成 | 一覧に新しいタスクが表示される |
| 必須項目未入力で送信 | エラーメッセージが表示される |
| 連続でタスクを作成 | 両方のタスクが一覧に表示される |

---

## 9. 実装メモ

### 9.1 技術的考慮事項

- IDはULIDを使用（時系列ソート可能、URL-safe）
- 楽観的更新でUX向上（作成後即座に一覧に反映）
- デバウンス不要（送信ボタン押下時のみAPI呼び出し）

### 9.2 パフォーマンス

- タスク作成APIの目標レスポンスタイム: 200ms以内
- 実測値: 平均120ms（2025-11-26計測）

### 9.3 セキュリティ

- XSS対策: Reactの自動エスケープ + DOMPurify（説明フィールド）
- CSRF対策: JWT認証のため不要（Cookie未使用）

---

## 10. 関連ドキュメント

- L1: [REQ-20251126-001 タスク登録要件](../samples/l1_vision_taskflow.md#51-機能要求一覧)
- L2: [TaskFlow システム概要](../samples/l2_overview_taskflow.md)
- L2: [Phase 1: MVP](../samples/l2_phases_taskflow.md#2-phase-1-mvpminimum-viable-product)

---

## 11. 更新履歴

| 日付 | 版 | 変更内容 | 変更者 |
|------|---|---------|-------|
| 2025-11-26 | 1.0 | 初版作成 | 開発チーム |
| 2025-11-26 | 1.1 | 実装完了、doc_status を implemented に更新 | 開発チーム |
