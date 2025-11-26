# 変更ログ管理ガイド

> **バージョン**: v2.4
> **目的**: SSDDにおける変更履歴の記録方針を明確化

## 概要

SSDD では、変更履歴を**Git + CHANGELOG.md**の二層で管理します。

| 管理対象 | ツール | 粒度 | 対象読者 |
|---------|-------|------|---------|
| **コミット単位の変更** | Git commit messages | 細かい | 開発者 |
| **リリース単位の変更** | CHANGELOG.md | 粗い | すべてのステークホルダー |

---

## 基本方針

### 1. Git commit messages を第一の記録源とする

- すべての変更は Git commit message に記録
- コミットメッセージは詳細かつ構造化
- ドキュメント変更もコミットメッセージで追跡

### 2. CHANGELOG.md はリリースサマリ

- リリースごとに主要な変更をまとめる
- ユーザー視点での影響を記述
- 技術詳細は Git ログを参照

### 3. ドキュメント更新は選択的

- 構造・仕様変更は L1/L2/L3 に反映
- 実装詳細は Git + コード内コメントで十分
- 過度なドキュメント更新は避ける

---

## Git Commit Message ガイドライン

### フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type（変更種別）

| Type | 説明 | 例 |
|------|------|-----|
| **feat** | 新機能追加 | `feat(auth): add password reset feature` |
| **fix** | バグ修正 | `fix(login): handle empty email validation` |
| **docs** | ドキュメント変更のみ | `docs(l2): update phase definition for PH-20250125-001` |
| **refactor** | リファクタリング | `refactor(auth): extract validation logic` |
| **test** | テスト追加・修正 | `test(auth): add unit tests for password validation` |
| **chore** | ビルド・ツール変更 | `chore: update dependencies` |
| **style** | コードスタイル変更 | `style: apply prettier formatting` |
| **perf** | パフォーマンス改善 | `perf(db): optimize query for user lookup` |

### Scope（影響範囲）

- 機能名: `auth`, `user`, `api`
- レイヤ: `l1`, `l2`, `l3`
- ドキュメント: `docs`, `templates`, `commands`

### Subject（要約）

- 50文字以内
- 動詞は命令形（add, fix, update）
- 末尾にピリオドなし

### Body（本文）- 任意

- 72文字で折り返し
- **Why**（なぜ）と**What**（何を）を記述
- **How**（どうやって）は必要に応じて

### Footer（フッター）- 任意

- Breaking Changes: `BREAKING CHANGE: API endpoint changed`
- Issue参照: `Closes #123`, `Refs #456`

### 例

```
feat(l3): add CLI feature template

Add domain-specific template for CLI applications.
Includes command specification, I/O handling, and exit codes.

Refs: ssdd-plugin/skills/ssdd/templates/l3_feature.md
```

---

## CHANGELOG.md 運用

### ファイル構成

```markdown
# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 開発中の機能

### Changed
- 変更予定の機能

## [2.3.0] - 2025-11-26

### Added
- ライト版廃止と段階的導入ガイド

### Changed
- `docs/checklists.md`: ライト版運用をv2.3変更点に置換
- `docs/guide.md`: 個人開発運用イメージを更新

### Deprecated
- ライト版運用の概念（v2.3で完全廃止）

## [2.2.0] - 2025-11-25

### Added
- 定量的レビュー基準（REQ数: 5-50, 機能数: 10-100等）
- フェーズ vs イテレーションの明確化
- エラーメッセージ標準化ガイド（E###/W###/I### コード体系）

### Changed
- `.claude/commands/review.md`: 定量的基準追加
- `docs/guide.md`: フェーズとイテレーションの関係を追加

## [2.1.0] - 2025-11-24

### Added
- `/promote-status` コマンド（doc_status状態遷移管理）
- `/propagate-change` コマンド（変更影響分析）
- ドメイン特化テンプレート（Web/Desktop/Mobile/CLI）

### Changed
- `ssdd-plugin/skills/ssdd/templates/`: テンプレート更新

## [2.0.0] - 2025-11-23

### Added
- タイムスタンプベースID管理（REQ-YYYYMMDD-nnn）
- 対話的技術選定（AskUserQuestion使用）

### Changed
- フロントマター仕様: `title`フィールド廃止、`# 見出し`を使用
- L2デフォルト構成: 4ファイル→2ファイル（overview.md + phases.md）

### Removed
- `title`フィールド（v2.0で廃止）

### BREAKING CHANGES
- ID形式変更: 既存プロジェクトは`docs/migration_v2.md`を参照
- フロントマター仕様変更: `title`フィールドを使用しているファイルは修正が必要
```

### 更新タイミング

| タイミング | 対象 | 担当 |
|-----------|------|------|
| **開発中** | `[Unreleased]` セクション | 開発者 |
| **リリース前** | バージョンセクション作成 | リリース担当 |
| **リリース後** | `[Unreleased]` をクリア | リリース担当 |

### カテゴリ

- **Added**: 新機能
- **Changed**: 既存機能の変更
- **Deprecated**: 将来削除予定の機能
- **Removed**: 削除された機能
- **Fixed**: バグ修正
- **Security**: セキュリティ修正

---

## ドキュメント更新判断基準

### 必ず更新すべきケース

| 変更内容 | 更新対象 | 理由 |
|---------|---------|------|
| 要件追加・変更 | L1 | 要件の正本 |
| 機能構成変更 | L2 | 設計判断の正本 |
| フェーズ定義変更 | L2 phases.md | フェーズ管理の正本 |
| 機能仕様変更 | L3 | 実装前の仕様書 |
| API変更 | L3 + コード内コメント | 外部インターフェース |

### 更新不要なケース

| 変更内容 | 記録方法 | 理由 |
|---------|---------|------|
| リファクタリング | Git commit | 挙動変更なし |
| 内部実装変更 | Git commit + コード内コメント | 外部から見えない |
| パフォーマンス改善 | Git commit | 機能仕様に影響なし |
| テスト追加 | Git commit | ドキュメントは仕様を記述 |
| 依存関係更新 | Git commit | 技術詳細 |

### 判断に迷う場合

**質問1**: ユーザー視点で見える変化があるか？
- Yes → L1/L2/L3を更新
- No → Git commitのみ

**質問2**: 他の開発者が仕様を理解する必要があるか？
- Yes → L3 + コード内コメント
- No → Git commit + コード内コメント

**質問3**: 将来の意思決定に影響するか？
- Yes → L2を更新（設計判断の記録）
- No → Git commitのみ

---

## SSDD ワークフローとの統合

### ケースA: 新機能追加

```bash
# 1. L3機能ドキュメント作成
/gen-l3 F-20250125-001

# 2. 実装
git add src/auth/register.ts
git commit -m "feat(auth): implement user registration

- Add email validation
- Add password hashing with bcrypt
- Add confirmation email sending

Implements: F-20250125-001"

# 3. L3を implemented に昇格
/promote-status docs/l3_features/F-20250125-001_register.md

# 4. CHANGELOG.md 更新（リリース前）
# [Unreleased] セクションに追加:
# - User registration feature (F-20250125-001)
```

### ケースB: バグ修正

```bash
# 1. バグ修正
git add src/auth/login.ts
git commit -m "fix(auth): handle empty email validation

Empty email address was causing server crash.
Added validation to return 400 Bad Request.

Fixes: #123"

# 2. L3の実装メモ更新（必要に応じて）
# → "注意: 空メールアドレスのバリデーション追加" 等

# 3. CHANGELOG.md 更新（リリース前）
# [Unreleased] - Fixed セクションに追加:
# - Fix server crash on empty email address
```

### ケースC: L1要件変更

```bash
# 1. L1変更
git add docs/l1_vision.md
git commit -m "docs(l1): add password complexity requirement

Add REQ-20250125-003 for password complexity:
- Minimum 12 characters (increased from 8)
- Must include uppercase, lowercase, number, symbol

Requested by: Security team review"

# 2. 影響分析
/propagate-change docs/l1_vision.md

# 3. L2/L3更新
# → F-20250125-001_register.md の受け入れ条件更新
git add docs/l3_features/F-20250125-001_register.md
git commit -m "docs(l3): update password validation for F-20250125-001

Reflect REQ-20250125-003 change:
- Password length: 8 → 12 characters
- Add complexity requirements"

# 4. CHANGELOG.md 更新（リリース前）
# [Unreleased] - Changed セクションに追加:
# - Password complexity requirements increased
```

---

## ベストプラクティス

### 1. 原子的コミット（Atomic Commits）

**推奨**:
```bash
git commit -m "feat(auth): add email validation"
git commit -m "test(auth): add email validation tests"
git commit -m "docs(l3): update F-20250125-001 with validation"
```

**非推奨**:
```bash
git commit -m "add feature, tests, and docs"
```

### 2. 明確なコミットメッセージ

**推奨**:
```bash
git commit -m "fix(auth): prevent SQL injection in login query

Use parameterized queries instead of string concatenation.
This addresses OWASP A03:2021 Injection vulnerability."
```

**非推奨**:
```bash
git commit -m "fix bug"
```

### 3. ドキュメント同期

```bash
# コード変更後、すぐにドキュメント更新をコミット
git add src/auth/register.ts
git commit -m "feat(auth): add password strength meter"

git add docs/l3_features/F-20250125-001_register.md
git commit -m "docs(l3): document password strength meter

Update F-20250125-001 to include new UI component
for real-time password strength feedback."
```

### 4. Breaking Changes の明示

```bash
git commit -m "feat(api): change authentication endpoint

BREAKING CHANGE: POST /api/auth/login moved to /api/v2/auth/login.
Old endpoint will be deprecated in v3.0.0 and removed in v4.0.0.

Migration guide: docs/migration_v3.md"
```

### 5. リリース前の CHANGELOG.md レビュー

```bash
# リリース前チェックリスト
- [ ] [Unreleased] の内容を確認
- [ ] ユーザー影響のある変更がすべて記載されているか
- [ ] Breaking Changes が明示されているか
- [ ] Migration guide へのリンクがあるか（必要な場合）
- [ ] バージョン番号とリリース日を記載
```

---

## 規模別運用ガイド

### 個人開発

- **Git commit**: すべての変更を記録
- **CHANGELOG.md**: メジャーリリース時のみ更新
- **ドキュメント**: L1/L2は変更時のみ、L3は実装完了時に更新

### 小〜中規模チーム

- **Git commit**: すべての変更を記録、プルリクエストで確認
- **CHANGELOG.md**: スプリント/イテレーション終了時に更新
- **ドキュメント**: 変更影響分析（`/propagate-change`）を活用

### 大規模チーム

- **Git commit**: すべての変更を記録、CI/CDで自動チェック
- **CHANGELOG.md**: 自動生成（git-cliff, conventional-changelog等）
- **ドキュメント**: 専任ドキュメンテーションチームが管理

---

## ツール推奨

### Git Commit Message 支援

- **commitizen**: 対話形式でコミットメッセージ作成
- **commitlint**: コミットメッセージの規約チェック
- **husky**: Git hooks でコミット前チェック

### CHANGELOG.md 自動生成

- **git-cliff**: Rust製、高速で設定柔軟
- **conventional-changelog**: Node.js製、広く使われている
- **standard-version**: バージョン管理 + CHANGELOG生成

### 推奨設定例（commitlint）

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat', 'fix', 'docs', 'refactor',
      'test', 'chore', 'style', 'perf'
    ]],
    'scope-enum': [2, 'always', [
      'auth', 'user', 'api', 'l1', 'l2', 'l3',
      'docs', 'templates', 'commands'
    ]],
    'subject-max-length': [2, 'always', 50]
  }
};
```

---

## まとめ

### 変更記録の3つのレベル

1. **Git commit messages**: すべての変更を詳細に記録
2. **CHANGELOG.md**: リリース単位でユーザー視点の変更を要約
3. **L1/L2/L3ドキュメント**: 仕様・設計判断の正本として更新

### 判断フローチャート

```
変更を実施
  ↓
Git commit （必須）
  ↓
ユーザー視点で見える変化？
  ↓ Yes               ↓ No
CHANGELOG.md更新    Git commitのみ
  ↓
仕様変更？
  ↓ Yes               ↓ No
L1/L2/L3更新         実装メモのみ
```

### 重要原則

- **DRY（Don't Repeat Yourself）**: 同じ情報を複数箇所に書かない
- **Single Source of Truth**: 各情報には1つの正本がある
- **Selective Documentation**: すべてをドキュメント化しない

---

**更新日**: 2025-11-26
**対象バージョン**: SSDD v2.4以降
