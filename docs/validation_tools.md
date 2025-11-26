# SSDD バリデーションツールガイド

> **バージョン**: v2.3
> **目的**: ドキュメント品質とトレーサビリティを自動検証

## 概要

SSDD では、以下の2つのバリデーションツールを提供します：

| ツール | 目的 | 実行タイミング | 対象 |
|--------|------|--------------|------|
| **`/check`** | 構造・参照整合性チェック | 定期的／変更後 | すべてのドキュメント |
| **`/review`** | 内容品質レビュー | ドキュメント作成時 | 個別ドキュメント |

---

## `/check` コマンド

### 概要

すべてのドキュメントの構造・参照整合性を自動チェックします。

### 使用方法

```bash
# 全体チェック
/check

# ID一覧表示
/check --list-ids

# 特定ファイルのみチェック
/check docs/l1_vision.md
```

### チェック項目

#### 1. フロントマター検証（v2.0）

**必須フィールド**:
- `id`: 一意なID（重複チェック）
- `kind`: ドキュメント種別（有効値チェック）
- `layer`: 所属レイヤ（L1/L2/L3/meta）
- `status`: ライフサイクル状態（active/deprecated/removed）
- `doc_status`: 文書・開発状態（draft/reviewed/implemented）

**v2.0特有の検証**:
- `title`フィールドが残存していないか（廃止されたフィールド）
- フロントマター直後に`# 見出し`が存在するか

```yaml
# ✓ 正しい（v2.0）
---
id: F-20250125-001
kind: feature
layer: L3
status: active
doc_status: draft
---

# ユーザー登録機能

# ✗ エラー（titleフィールド使用）
---
id: F-20250125-001
title: ユーザー登録機能  # ← v2.0で廃止
kind: feature
---

# ✗ エラー（見出し欠落）
---
id: F-20250125-001
kind: feature
---

## 概要  # ← 1階層目の見出しが必要
```

#### 2. ID形式検証

**v2.0形式（推奨）**:
- `REQ-YYYYMMDD-nnn`: 要件
- `F-YYYYMMDD-nnn`: 機能
- `NF-YYYYMMDD-nnn`: 非機能要求
- `PH-YYYYMMDD-nnn`: フェーズ
- `SP-YYYYMMDD-nnn`: スパイク

**v1.x形式（混在OK）**:
- `REQ-0001`, `F-0001` 等の連番形式も許容

```bash
# ID重複チェック
/check --list-ids | sort | uniq -d
```

#### 3. 参照整合性検証

**フロントマターの参照フィールド**:
```yaml
req_ids:
  - REQ-20250125-001  # ← 存在チェック
  - REQ-20250125-002
nfr_ids:
  - NF-20250125-001   # ← 存在チェック
phase: PH-20250125-001  # ← 存在チェック
depends_on:
  - F-20250125-002    # ← 存在チェック
replaced_by: F-20250125-999  # ← 存在チェック（deprecated時）
```

**チェック内容**:
- 参照先IDが実際に存在するか
- 循環依存がないか（`depends_on`）
- `deprecated`状態のIDへの参照（警告）

#### 4. 孤立ID検出

**孤立するパターン**:
- どのフェーズにも属さない機能ID
- どの要件にも紐付かない機能ID
- どのドキュメントからも参照されないID

```bash
# 孤立ID検出例
✗ エラー: F-20250125-001 はどのフェーズにも属していません
  → phase フィールドが未設定

✗ エラー: F-20250125-002 はどの要件にも紐付いていません
  → req_ids フィールドが空

⚠ 警告: REQ-20250125-003 はどの機能からも参照されていません
  → 実装漏れの可能性
```

#### 5. TODO残存チェック

```markdown
<!-- TODO: 要確認 -->  # ← 検出される
```

- `draft`状態では許容（警告のみ）
- `reviewed`状態では警告レベルを上げる
- `implemented`状態ではエラー

#### 6. status: removed ファイルの検出

```bash
✗ エラー: docs/l3_features/F-old-001.md は status: removed です
  → Git履歴があるため、物理削除を推奨
  → または archive/ ディレクトリに移動
```

### 出力例

```
## 整合性チェック結果

### サマリ
- 検証ファイル数: 24
- エラー: 2件
- 警告: 5件

### エラー（修正必須）

#### E301: フロントマター必須フィールド欠落
- ファイル: docs/l3_features/F-20250125-001_register.md
- 欠落フィールド: phase
- 解決: フロントマターに phase: PH-20250125-001 を追加

#### E401: 参照先が存在しない
- ファイル: docs/l3_features/F-20250125-002_login.md
- 参照フィールド: req_ids
- 参照ID: REQ-20250125-999 （存在しません）
- 解決: 正しいIDに修正するか、参照先を作成

### 警告（確認推奨）

#### W002: TODO残存
- ファイル: docs/l2_system/phases.md (行42)
- TODO数: 3箇所
- 推奨: draft → reviewed 昇格前に解消

#### W003: deprecated への参照
- ファイル: docs/l3_features/F-20250125-003_reset.md
- 参照ID: F-20250125-old-001 (status: deprecated)
- 後継ID: F-20250125-004
- 推奨: 後継IDへ更新

### 正常（問題なし）

- フロントマター必須フィールド: すべて存在
- ID形式: すべて有効
- 参照整合性: すべて解決済み
```

---

## `/review` コマンド

### 概要

個別ドキュメントの内容品質をAIがレビューします。

### 使用方法

```bash
# ファイルパスで指定
/review docs/l1_vision.md

# IDで指定
/review REQ-20250125-001
/review F-20250125-001
```

### レビュー観点

#### 1. フロントマター検証

`/check`と同様の検証に加えて：
- フィールド値の妥当性（意味的な正しさ）
- 参照IDの適切性（レイヤ間の整合性）

#### 2. 構造レビュー

**テンプレート準拠チェック**:
- 必須セクションが存在するか
- セクションの順序が適切か
- 各セクションの内容が充実しているか

#### 3. 内容レビュー（レイヤ別）

**L1 レビュー観点**:
- [ ] 技術詳細が混入していないか（L2相当の内容）
- [ ] 要件がREQ-YYYYMMDD-nnn形式で管理されているか
- [ ] ペルソナ・ユースケースが具体的か
- [ ] 非機能要求が高レベルで記載されているか

**L2 レビュー観点**:
- [ ] L1のREQが漏れなくカバーされているか
- [ ] 機能分解の粒度が適切か
- [ ] フェーズ設計が「結合して意味がある」単位か
- [ ] 技術選定の理由が明記されているか
- [ ] 依存関係が明確か

**L3 レビュー観点**:
- [ ] L2の機能定義と整合しているか
- [ ] 受け入れ条件が具体的か（Given-When-Then）
- [ ] タスクチェックリストが実装可能な粒度か
- [ ] 非機能要求の具体化が十分か

#### 4. 定量的レビュー基準（v2.2）

**L1 ビジョン・要求**:
| 項目 | 基準 | 判定 |
|------|------|------|
| REQ数 | 5-50個 | 5個未満: 粒度が粗い / 50個超: L2に寄せすぎ |
| REQ記述量 | 1REQ = 50-300文字 | 50文字未満: 不明瞭 / 300文字超: 詳細すぎ |
| 技術用語 | 5%以下 | 技術詳細（API名等）はL2へ |

**L2 機能設計・技術方針**:
| 項目 | 基準 | 判定 |
|------|------|------|
| フェーズ数 | 2-8個 | 1個: 分割不足 / 8個超: 過度な分割 |
| 機能数（F） | 10-100個 | 10個未満: 粒度が粗い / 100個超: 細かすぎ |
| REQカバレッジ | 100% | すべてのREQがF/NFに紐付いているか |
| 循環依存 | 0個 | F間の依存関係に循環がないか |

**L3 機能ドキュメント**:
| 項目 | 基準 | 判定 |
|------|------|------|
| 受け入れ条件数 | 2-10個 | 2個未満: 不足 / 10個超: 詳細すぎ |
| タスク数 | 3-20個 | 3個未満: 粒度が粗い / 20個超: 細かすぎ |
| TODO残存 | 0個（reviewed時） | draft時は許容、reviewed時は0 |

### 出力例

```
## レビュー結果: F-20250125-001_register.md

### サマリ
- レイヤ: L3
- ID: F-20250125-001
- doc_status: draft

### 指摘事項

#### 重要（修正推奨）

1. 受け入れ条件が1個のみ
   - 該当箇所: セクション「受け入れ条件」
   - 推奨: 最低2個の受け入れ条件を記載
   - 提案: エラーケース（メール重複、パスワード不正等）を追加

2. 非機能要求の具体化不足
   - 該当箇所: セクション「非機能要求」
   - 問題: NF-20250125-001（レスポンス性能）の具体的な目標値が未記載
   - 提案: "登録処理は2秒以内に完了する" 等の具体値を追加

#### 軽微（検討推奨）

1. タスクチェックリストが粗い
   - 該当箇所: セクション「タスクチェックリスト」
   - 提案: "バリデーション実装" を以下に分割
     - [ ] メールアドレス形式検証
     - [ ] パスワード強度検証
     - [ ] パスワード一致検証

### TODO 残存

- 行42: <!-- TODO: SendGridのAPI仕様確認 -->
- 行58: <!-- TODO: エラーメッセージ文言確定 -->

### 良い点

- フロントマターが完全に記載されている
- req_ids でトレーサビリティが確保されている
- 入出力が明確に定義されている

### 総評

基本的な構成は良好ですが、受け入れ条件と非機能要求の具体化が不足しています。
TODOを解消し、指摘事項を修正後、`reviewed` への昇格を推奨します。

次のステップ:
1. 受け入れ条件を2個以上に拡充
2. NF-20250125-001 の具体的な目標値を記載
3. TODO 2箇所を解消
4. `/promote-status` で reviewed へ昇格
```

---

## ツール選択ガイド

### `/check` を使うべきケース

| ケース | 理由 |
|--------|------|
| リリース前 | 全体の整合性を保証 |
| 大規模変更後 | 影響範囲を確認 |
| 週次定期チェック | 問題の早期発見 |
| `/propagate-change` 実行後 | 変更伝播の検証 |
| 新規メンバー参加時 | 既存ドキュメントの健全性確認 |

### `/review` を使うべきケース

| ケース | 理由 |
|--------|------|
| L1/L2/L3 作成直後 | AIドラフトの品質確認 |
| `draft` → `reviewed` 昇格前 | 昇格条件の事前確認 |
| 大幅な内容変更後 | 内容の妥当性確認 |
| 他人が書いたドキュメントの確認 | 第三者視点のレビュー |

### 決定フローチャート

```
ドキュメント変更を実施
  ↓
変更は1ファイルのみ？
  ↓ Yes               ↓ No
/review [ファイル]    /check（全体チェック）
  ↓                     ↓
問題なし？            問題なし？
  ↓ Yes                 ↓ Yes
完了                  /review（個別詳細確認）
```

---

## CI/CD 統合

### GitHub Actions 例

```yaml
# .github/workflows/ssdd-validation.yml
name: SSDD Validation

on:
  pull_request:
    paths:
      - 'docs/**/*.md'
  push:
    branches:
      - main

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run SSDD Check
        run: |
          # /check コマンドを実行（CI環境用スクリプト）
          ./scripts/ci-check.sh

      - name: Report Results
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '❌ SSDD整合性チェックに失敗しました。詳細はログを確認してください。'
            })
```

### Pre-commit Hook 例

```bash
# .git/hooks/pre-commit
#!/bin/bash

# docs/ 配下のファイルが変更されている場合のみチェック
if git diff --cached --name-only | grep -q "^docs/"; then
  echo "Running SSDD validation..."

  # /check コマンドを実行
  if ! ./scripts/local-check.sh; then
    echo "❌ SSDD整合性チェックに失敗しました"
    echo "修正後、再度 git commit を実行してください"
    exit 1
  fi

  echo "✓ SSDD整合性チェック完了"
fi

exit 0
```

### スクリプト例

```bash
#!/bin/bash
# scripts/local-check.sh

# カラー出力
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== SSDD整合性チェック開始 ==="

# 1. フロントマター検証
echo "1. フロントマター検証..."
if ! python scripts/validate_frontmatter.py; then
  echo -e "${RED}✗ フロントマター検証失敗${NC}"
  exit 1
fi
echo -e "${GREEN}✓ フロントマター検証完了${NC}"

# 2. ID重複チェック
echo "2. ID重複チェック..."
DUPLICATES=$(grep -rh "^id:" docs/ | sort | uniq -d)
if [ -n "$DUPLICATES" ]; then
  echo -e "${RED}✗ ID重複を検出:${NC}"
  echo "$DUPLICATES"
  exit 1
fi
echo -e "${GREEN}✓ ID重複なし${NC}"

# 3. 参照整合性チェック
echo "3. 参照整合性チェック..."
if ! python scripts/validate_references.py; then
  echo -e "${RED}✗ 参照整合性チェック失敗${NC}"
  exit 1
fi
echo -e "${GREEN}✓ 参照整合性チェック完了${NC}"

# 4. TODO残存チェック（警告のみ）
echo "4. TODO残存チェック..."
TODOS=$(grep -rn "<!-- TODO:" docs/)
if [ -n "$TODOS" ]; then
  echo -e "${YELLOW}⚠ TODO残存:${NC}"
  echo "$TODOS"
fi

echo -e "${GREEN}=== SSDD整合性チェック完了 ===${NC}"
exit 0
```

---

## 定期運用パターン

### 個人開発

**週次チェック（金曜日夕方）**:
```bash
# 週の終わりに全体チェック
/check

# 問題があれば週末に修正
```

**リリース前**:
```bash
# 全体チェック
/check

# 主要ドキュメントをレビュー
/review docs/l1_vision.md
/review docs/l2_system/overview.md
```

### 小〜中規模チーム

**プルリクエスト作成時**:
```bash
# 変更ファイルをレビュー
/review docs/l3_features/F-20250125-001_register.md

# 全体チェック（CI/CDで自動化）
/check
```

**スプリント終了時**:
```bash
# 全体チェック
/check

# 新規作成ドキュメントをレビュー
find docs/ -name "*.md" -mtime -14 -exec /review {} \;
```

### 大規模チーム

**コミット前**:
- Pre-commit hookで自動チェック
- 失敗時はコミット拒否

**プルリクエスト時**:
- CI/CDで自動チェック
- 失敗時はマージブロック

**日次**:
- Scheduled workflowで全体チェック
- 問題検出時はSlack通知

---

## トラブルシューティング

### 問題1: `/check` が遅い

**原因**: ドキュメント数が多い（100ファイル以上）

**解決方法**:
```bash
# 特定ディレクトリのみチェック
/check docs/l3_features/

# 並列実行（スクリプト化）
find docs/l3_features/ -name "*.md" | xargs -P 4 -I {} /check {}
```

### 問題2: 誤検知が多い

**原因**: チェックロジックが厳しすぎる

**解決方法**:
- 警告レベルの調整（チェックコマンドの設定を編集）
- 例外ルールの追加（特定パターンを無視）

### 問題3: `/review` の指摘が的外れ

**原因**: AIの理解不足、テンプレートとの不一致

**解決方法**:
```bash
# ドメイン特化テンプレートを参照してレビュー
# → templates/l3_feature_web.md のテンプレートを参考に指摘内容を調整

# レビュー基準を確認
# → 本書の「定量的レビュー基準」セクションを参照
```

---

## ベストプラクティス

### 1. チェックを習慣化

```bash
# .bashrc / .zshrc に追加
alias ssdd-check='/check'
alias ssdd-review='/review'

# プロンプトに統合（変更があれば自動チェック）
function precmd() {
  if git diff --quiet docs/; then
    return
  fi
  echo "⚠ docs/ に変更があります。/check を推奨"
}
```

### 2. CI/CDでゲート化

- 整合性チェック失敗 → マージブロック
- 警告のみ → マージ可（レビュアーが判断）

### 3. レビュー結果を記録

```bash
# レビュー結果をファイルに保存
/review docs/l1_vision.md > review_results/l1_vision_$(date +%Y%m%d).md

# 定期的に過去の指摘事項を確認
diff review_results/l1_vision_20250120.md review_results/l1_vision_20250127.md
```

### 4. 段階的な導入

**Phase 1**: `/check` を手動実行（週次）
**Phase 2**: `/review` を導入（ドキュメント作成時）
**Phase 3**: CI/CDに統合（プルリクエスト時）
**Phase 4**: Pre-commit hookを追加（コミット前）

---

## まとめ

### バリデーションツールの使い分け

| 目的 | ツール | 実行タイミング | 自動化 |
|------|-------|--------------|--------|
| 構造・参照整合性 | `/check` | 定期的／変更後 | ○（CI/CD） |
| 内容品質レビュー | `/review` | ドキュメント作成時 | △（補助的） |

### 重要原則

1. **Prevention is better than cure**: 早期にチェック、早期に修正
2. **Automate repetitive tasks**: 構造チェックは自動化、内容レビューは補助
3. **Continuous validation**: 定期的なチェックで問題を蓄積させない

### 次のステップ

- [ ] `/check` を手動実行して現状を把握
- [ ] 問題があれば優先度を付けて修正
- [ ] CI/CD統合を検討（`.github/workflows/`）
- [ ] チーム内でバリデーション頻度を合意

---

**更新日**: 2025-01-26
**対象バージョン**: SSDD v2.3以降
**関連ドキュメント**:
- エラーメッセージ: [error_messages.md](error_messages.md)
- チェックリスト: [checklists.md](checklists.md)
