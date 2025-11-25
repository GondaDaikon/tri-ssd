# SSDD（Slices Specification-Driven Development）スキル

## 概要

SSDD は、LLM／AIコードエージェントを前提とした仕様駆動開発のフレームワークです。

## v2.0 主要変更点（2025-01）

### ID管理方式の変更
- **旧**: 連番方式（REQ-0001, F-0001）
- **新**: タイムスタンプベース（REQ-20250125-001, F-20250125-001）
- **理由**: 並行開発時のID衝突を根本的に防止

### フロントマター仕様の変更
- **廃止**: `title`フィールド（フロントマターと本文の同期問題を解決）
- **新方式**: 本文の最初の`# 見出し`がタイトルとして扱われる

### L2構成の変更
- **旧**: 4ファイル（overview.md, phases.md, nfr.md, features_index.md）
- **新**: 2ファイル（overview.md, phases.md）- NFRと機能一覧は統合
- **理由**: 小規模プロジェクトでのシンプル化

### 技術選定の変更
- **旧**: AIが自動的にWebSearchで選定
- **新**: AIが候補を提示 → 人間が選択（AskUserQuestion使用）
- **理由**: 重要な技術判断は人間が行うべき

## 三層モデル

| 層 | 名称 | 役割 | 正本の対象 |
|----|------|------|-----------|
| L1 | ビジョン・要求 | ビジネス要求・背景・制約・願望 | 要件 |
| L2 | 機能設計・技術方針 | 機能構成・技術スタック・フェーズ・NFR | 設計判断 |
| L3 | 機能ドキュメント | ミニ仕様＋タスク＋テスト＋実装メモ | **実装前の仕様書**（実装後はコードが正） |

## ID 種類

| ID形式 | 用途 |
|--------|------|
| REQ-YYYYMMDD-nnn | 要件 |
| PH-YYYYMMDD-nnn | フェーズ |
| PH-POC-YYYYMMDD-nnn | 検証フェーズ |
| NF-YYYYMMDD-nnn | 非機能要求 |
| F-YYYYMMDD-nnn | 機能（Feature） |
| SP-YYYYMMDD-nnn | スパイク／PoC |

**Note**: タイムスタンプベースのID形式により、並行開発時のID衝突を防止します。

## フロントマター仕様

### 共通フィールド（必須）

**v2.0変更**: `title`フィールドは廃止。本文の最初の`# 見出し`がタイトルとして扱われます。

```yaml
---
id: [ID]
kind: [vision|req|feature|nfr|phase|spike|overview]
layer: [L1|L2|L3|meta]
status: [active|deprecated|removed]
doc_status: [draft|reviewed|implemented]
---

# 機能名またはタイトル
```

### 参照フィールド（トレーサビリティ用）

```yaml
req_ids: [REQ-20250125-001]  # 対応する要件ID
nfr_ids: [NF-20250125-001]   # 適用される非機能要求ID
phase: PH-20250125-001       # 所属フェーズ
replaced_by: [ID]            # 後継ID（deprecated時）
```

## 判断基準

### doc_status の遷移

1. **draft**: AI生成直後、または書きかけ
2. **reviewed**: 人間がレビュー済み、実装可能
3. **implemented**: 実装・テスト完了、ドキュメント追従済み

### 変更伝播の原則

- **L1変更** → L2・L3 に波及
- **L2変更** → L3 に波及、要件影響時は L1 に戻る
- **L3変更** → 局所的なら L3 のみ、設計影響時は L2 に波及

### 曖昧箇所のマーク

判断に迷う箇所、要確認事項は以下のコメントでマーク：

```markdown
<!-- TODO: 要確認 -->
```

## ID管理ポリシー

- **フロントマターが正本**（Single Source of Truth）
- catalog.yaml による二重管理は行わない
- ID一覧は `/check --list-ids` で動的生成

## ディレクトリ構成

```
docs/
  l1_vision.md          # L1: ビジョン・要求（フラット配置）
  l2_system/            # L2: 機能設計・技術方針（v2.0: 2ファイル構成）
    overview.md         # 用語集・技術方針・全体構成・NFRカタログ
    phases.md           # フェーズ定義・機能一覧
  l3_features/          # L3: 機能ドキュメント
    F-20250125-001_xxx.md
    F-20250125-002_xxx.md
```

## テンプレート参照先

### 基本テンプレート

- L1: `docs/templates/l1_vision.md`
- L2 概要: `docs/templates/l2_overview.md`
- L2 フェーズ: `docs/templates/l2_phases.md`
- L3 機能（汎用）: `docs/templates/l3_feature.md`
- フロントマター仕様: `docs/templates/README.md`

### ドメイン特化テンプレート（v2.1）

| ドメイン | テンプレート | 特徴 |
|---------|-------------|------|
| Webアプリ | `l3_feature_web.md` | 画面設計、API、レスポンシブ、セキュリティ |
| Desktopアプリ | `l3_feature_desktop.md` | ウィンドウ、メニュー、OS統合 |
| Mobileアプリ | `l3_feature_mobile.md` | 画面遷移、デバイス機能、オフライン |
| CLIツール | `l3_feature_cli.md` | コマンド仕様、入出力、POSIX準拠 |

---

## v2.1-v2.3 追加機能

### v2.1 (High priority)

- **doc_status管理**: `/promote-status` コマンドで状態遷移を管理
- **変更伝播**: `/propagate-change` コマンドで影響分析
- **ドメイン特化テンプレート**: Web/Desktop/Mobile/CLI用L3テンプレート

### v2.2 (Medium priority)

- **定量的レビュー基準**: 数値ベースの品質チェック（REQ数: 5-50、機能数: 10-100等）
- **フェーズ vs イテレーション**: 機能的マイルストーン vs 時間的マイルストーン
- **エラーメッセージ標準化**: E###/W###/I### コード体系

### v2.3 (Operations)

- **ライト版廃止**: 標準SSDDを段階的導入することを推奨
- **詳細**: `docs/checklists.md`の「v2.3変更点: ライト版の廃止」参照

---

## 実例集

### L1 例: 要件ドキュメント

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

### L2 例: フェーズ定義（phases.md）

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

### L3 例: 機能ドキュメント

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

---

## トラブルシューティング

### 問題1: ID衝突が発生した

**症状**: `/check` で "ID重複エラー" が表示される

**原因**: 手動でIDを付与した際に既存IDと重複

**解決方法**:
```bash
# 1. 既存ID一覧を確認
/check --list-ids

# 2. 重複IDを別のIDに変更
# → ファイルのフロントマター `id` フィールドを修正

# 3. 参照も更新
# → 他のファイルの req_ids, nfr_ids, phase 等も修正

# 4. 再チェック
/check
```

### 問題2: 参照整合性エラー

**症状**: `/check` で "参照先が存在しません: REQ-20250125-001"

**原因**: フロントマターの `req_ids` に存在しないIDを指定

**解決方法**:
```bash
# 1. 存在するIDを確認
/check --list-ids

# 2. 参照元ファイルを修正
# → req_ids, nfr_ids, phase フィールドを正しいIDに修正

# 3. 参照先が本当に必要な場合は作成
/draft-l1  # 新しいREQを追加

# 4. 再チェック
/check
```

### 問題3: タイトル見出しが欠落（v2.0）

**症状**: `/check` で "タイトル見出しが欠落しています"

**原因**: フロントマター直後に `# 見出し` が存在しない

**解決方法**:
```markdown
# 修正前
---
id: F-20250125-001
kind: feature
layer: L3
---

## 概要  # ← 2階層目の見出しから始まっている

# 修正後
---
id: F-20250125-001
kind: feature
layer: L3
---

# ユーザー登録機能  # ← 1階層目の見出しを追加

## 概要
```

### 問題4: フェーズとイテレーションの混同（v2.2）

**症状**: フェーズが1週間単位で細かく分割されている

**原因**: フェーズ（機能的マイルストーン）とイテレーション（時間的マイルストーン）を混同

**解決方法**:
- **フェーズ**: 「意味のある機能群」で定義（例: "基盤構築", "コア機能"）
- **イテレーション**: 別管理（Jira/GitHub Projects等）
- 1フェーズが複数イテレーションにまたがることを許容
- 詳細: `docs/guide.md` の「フェーズとイテレーションの関係（v2.2明確化）」参照

### 問題5: doc_status 昇格条件を満たさない

**症状**: `/promote-status` で "昇格条件を満たしていません"

**原因**: draft → reviewed の遷移時に必須条件未達成

**解決方法**:
```bash
# 1. エラー内容を確認
/promote-status docs/l3_features/F-20250125-001_xxx.md
# → "TODO が 3箇所残存しています"
# → "参照整合性エラーが 1件あります"

# 2. 指摘事項を修正
# → TODO コメントを削除または解決
# → 参照IDを修正

# 3. 再試行
/promote-status docs/l3_features/F-20250125-001_xxx.md
```

### 問題6: ライト版から標準版への移行

**症状**: 既存プロジェクトがライト版運用で、標準版に移行したい

**解決方法**:
- v2.3以降、ライト版は廃止されました
- 詳細: `docs/checklists.md` の「v2.3変更点: ライト版の廃止」
- 移行ガイド: `docs/checklists.md` の「3.4 移行ガイド（既存ライト版運用からの移行）」参照

```bash
# 段階的移行の基本フロー
# 1. 現状把握
/check --list-ids

# 2. 構造整備
/init-ssdd  # 標準ディレクトリ構造を作成
# → 既存ファイルを標準構造に移動

# 3. フロントマター追加
# → 既存ドキュメントにフロントマターを追加

# 4. ID統一
# → 新規IDはv2.0形式（REQ-YYYYMMDD-nnn）を使用

# 5. 整合性チェック
/check
```

---

## ベストプラクティス

### 1. 定期的な整合性チェック

```bash
# リリース前
/check

# 大きな変更後
/check

# 週次
/check --list-ids  # ID一覧を確認
```

### 2. doc_status 管理の徹底

- **draft**: AI生成直後、必ず人間がレビュー
- **reviewed**: 実装可能なレベル、TODOは解消
- **implemented**: コードと同期、プレースホルダー残存なし

```bash
# 昇格前に必ずレビュー
/review docs/l3_features/F-20250125-001_xxx.md
/promote-status docs/l3_features/F-20250125-001_xxx.md
```

### 3. 変更伝播の明確化

```bash
# L1変更時
/propagate-change docs/l1_vision.md

# 影響範囲を確認してから更新
# → L2, L3 の該当箇所を修正
```

### 4. フェーズ設計のポイント

- **粒度**: 2-8個のフェーズが目安
- **完了条件**: Exit Criteria を明確に定義
- **依存関係**: フェーズ間の依存を最小化
- **テスト**: フェーズ境界で結合テスト実施

### 5. ドメイン特化テンプレートの活用（v2.1）

```bash
# Webアプリの場合
/gen-l3 F-20250125-001 --template web

# CLIツールの場合
/gen-l3 F-20250125-001 --template cli
```

---

## 詳細ドキュメント参照

- **概念ガイド**: `docs/guide.md`
- **開発フロー**: `docs/checklists.md`
- **テンプレート**: `docs/templates/README.md`
- **エラーメッセージ**: `docs/error_messages.md`
- **v2.0移行**: `docs/migration_v2.md`
- **レビュー基準**: `.claude/commands/review.md`
