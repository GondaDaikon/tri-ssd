---
id: RULES-20251126-001
kind: rules
layer: L2
status: active
doc_status: reviewed
---

# TaskFlow 実装ルール

> 本ドキュメントはAI/人がコード実装時に守るべきルールを定義する。
> L3実装を通じて継続的に更新する。

---

## 1. コード規約

### 1.1 言語・フレームワーク

- 言語: TypeScript 5.x（strict mode必須）
- フロントエンド: React 18, Next.js 14（App Router）
- バックエンド: Next.js API Routes
- ORM: Prisma
- ランタイム: Node.js 20

### 1.2 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| ファイル名（コンポーネント） | PascalCase | `TaskList.tsx` |
| ファイル名（その他） | kebab-case | `task-service.ts` |
| フォルダ名 | kebab-case | `task-management/` |
| Reactコンポーネント | PascalCase | `TaskListItem` |
| 関数名 | camelCase | `getTaskById` |
| 変数名 | camelCase | `taskList` |
| 定数名 | UPPER_SNAKE_CASE | `MAX_TASKS_PER_PAGE` |
| DBテーブル名 | snake_case（単数形） | `task`, `user` |
| APIエンドポイント | kebab-case | `/api/v1/tasks` |
| 環境変数 | UPPER_SNAKE_CASE | `DATABASE_URL` |

### 1.3 ディレクトリ構成

```
src/
  app/                    # Next.js App Router
    api/                  # API Routes
    (auth)/               # 認証関連ページ
    (main)/               # メインアプリページ
  components/
    ui/                   # 汎用UIコンポーネント
    features/             # 機能別コンポーネント
  lib/
    services/             # ビジネスロジック
    repositories/         # データアクセス
    utils/                # ユーティリティ関数
  types/                  # 型定義
prisma/
  schema.prisma           # DBスキーマ
```

### 1.4 禁止事項

- `any`型の使用禁止（`unknown`を使用し、型ガードで絞り込む）
- `console.log`の本番コード残存禁止（デバッグ用は`// TODO: remove`コメント必須）
- `!`（non-null assertion）の安易な使用禁止（適切なnullチェックを行う）
- `eslint-disable`のコミット禁止（例外は要レビュー）
- インラインスタイルの使用禁止（Tailwind CSSを使用）

---

## 2. アーキテクチャ

### 2.1 レイヤー構成

```
API Route（app/api/）
    ↓ リクエスト検証・認証チェック
Service（lib/services/）
    ↓ ビジネスロジック・トランザクション管理
Repository（lib/repositories/）
    ↓ Prisma経由のデータアクセス
Database（PostgreSQL）
```

### 2.2 依存方向

**許可:**
- API Route → Service → Repository
- Component → Service（Server Components経由）

**禁止:**
- API Route → Repository 直接呼び出し
- Component → Repository 直接呼び出し
- Repository → Service への逆依存
- Service間の循環依存

### 2.3 トランザクション境界

- Service層で`prisma.$transaction()`を使用
- 複数テーブル更新は必ずトランザクション内で実行
- Repository単体ではトランザクション制御しない

### 2.4 状態管理

- サーバー状態: TanStack Query（React Query）で管理
- クライアント状態: Zustandで管理（認証状態、UI状態のみ）
- フォーム状態: React Hook Form + Zod
- グローバルステートは最小限に（props drilling許容）

---

## 3. ドメインルール

> 絶対に壊してはいけないビジネスルール

- **タスク期限**: 過去日時の期限設定は不可（バリデーションで弾く）
- **タスク所有権**: 他ユーザーのタスクは閲覧・編集・削除不可
- **プロジェクト所有権**: プロジェクトオーナーのみがメンバー招待可能
- **削除の原則**: ユーザーデータは論理削除（`deleted_at`）、30日後に物理削除
- **課金処理**: 有料プラン関連は必ず`PaymentService`を経由（直接Stripe APIを叩かない）

**参照元**: L1 `docs/l1_vision.md` セクション3, 6

---

## 4. API・データアクセス

### 4.1 API規約

- RESTful原則に従う
- エンドポイントは複数形名詞: `/api/v1/tasks`, `/api/v1/projects`
- HTTPメソッド: GET（取得）、POST（作成）、PATCH（部分更新）、DELETE（削除）
- ステータスコード: 200（成功）、201（作成）、400（バリデーション）、401（認証）、403（認可）、404（Not Found）、500（サーバーエラー）

**エラーレスポンス共通フォーマット:**
```json
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "指定されたタスクが見つかりません"
  }
}
```

### 4.2 データアクセス

- N+1クエリ禁止（Prismaの`include`/`select`で事前にJOIN）
- 一覧取得は必ずページング（デフォルト20件、最大100件）
- 生SQL禁止（Prisma使用必須、例外は`$queryRaw`でレビュー必須）
- `SELECT *`相当禁止（Prismaの`select`で必要なフィールドのみ）
- インデックスのないカラムでの検索禁止（要インデックス追加）

---

## 5. セキュリティ・ログ

### 5.1 認証・認可

- `user_id`はNextAuth.jsのセッションから取得（リクエストボディを信用しない）
- 認可チェックはService層で実施（「このユーザーがこのリソースにアクセス可能か」）
- API Routeでは認証チェックのみ実施

### 5.2 データ保護

- パスワードはbcrypt（コスト12）でハッシュ化
- 機微情報（メールアドレス、パスワードハッシュ）はログ出力禁止
- 秘密情報は環境変数使用（`.env`はgitignore）
- CSRFトークン検証必須（NextAuth.jsが自動処理）

### 5.3 ログ

- エラー発生時はスタックトレース含めてログ出力（本番はSentryへ）
- ユーザー操作（作成・更新・削除）は監査ログとして記録
- ログレベル: error > warn > info > debug

---

## 6. テスト

### 6.1 テスト種別と責務

| 層 | テスト種別 | 必須/任意 | ツール |
|----|-----------|----------|--------|
| Service | Unit Test | 必須 | Vitest |
| Repository | Integration Test | 必須 | Vitest + TestContainers |
| API | E2E Test | 必須 | Playwright |
| Component | Unit Test | 任意 | Vitest + Testing Library |

### 6.2 テストケース

- 正常系 + 代表的な異常系（バリデーションエラー、認可エラー）は必須
- 境界値テスト（ページング上限、文字数制限）を含める
- モックは最小限（外部API呼び出しのみ）

### 6.3 命名・配置

- ファイル名: `*.test.ts` または `*.spec.ts`
- 配置: テスト対象ファイルと同階層（`task-service.ts` → `task-service.test.ts`）
- テスト名: 「〜の場合、〜する」形式（日本語可）

---

## 7. AI固有の禁止事項

- **変更禁止範囲**: public API仕様・メソッドシグネチャは変更禁止（変更が必要な場合は提案にとどめる）
- **仕様追加禁止**: 仕様にない機能を勝手に追加しない（「ついでに〇〇も追加しました」禁止）
- **ロールバック禁止**: テスト失敗時は原因を修正し、謎のロールバックをしない
- **スコープ厳守**: 指示された範囲外のファイルを変更しない
- **コメント追加禁止**: 既存コードにコメントを追加しない（変更したコードのみ可）

---

## 更新履歴

| 日付 | 変更内容 | 理由 |
|------|---------|------|
| 2025-11-26 | 初版作成 | /draft-rulesで生成 |

---

## ルール追加の判断基準

以下に該当する場合、このドキュメントに追加する：

1. **再発可能性**: 他のL3実装でも同じ問題が起きそう
2. **致命度**: セキュリティ・データ破損・本番障害に関わる
3. **汎用性**: ルールとして一般化できる

該当しない場合は、当該L3に注記するにとどめる。
