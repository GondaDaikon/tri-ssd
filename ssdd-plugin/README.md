# SSDD Plugin for Claude Code

**SSDD (Slices Specification-Driven Development)** - AI/LLMコードエージェントを前提とした仕様駆動開発フレームワーク

## インストール

### 方法1: プロジェクトにコピー

```bash
# プラグインフォルダをプロジェクトルートにコピー
cp -r ssdd-plugin /path/to/your-project/
```

### 方法2: グローバルインストール

```bash
# ホームディレクトリの .claude にコピー
cp -r ssdd-plugin/commands/* ~/.claude/commands/
cp -r ssdd-plugin/skills/* ~/.claude/skills/
```

## クイックスタート

```bash
# 1. ディレクトリ構造を初期化
/init-ssdd

# 2. L1（ビジョン・要求）を対話形式で作成
/draft-l1

# 3. L2（機能設計・技術方針）を生成
/gen-l2

# 4. L3（機能ドキュメント）を生成
/gen-l3

# 5. 整合性チェック
/check
```

## コマンド一覧

| コマンド | 説明 |
|----------|------|
| `/init-ssdd` | ディレクトリ構造を初期化 |
| `/draft-l1` | L1ドキュメントを対話形式で作成 |
| `/convert-l1 <ファイル>` | 既存ドキュメントをL1形式に変換 |
| `/gen-l2` | L1からL2を生成 |
| `/gen-l3 [F-ID]` | L2からL3を生成 |
| `/check` | 整合性チェック |
| `/review <ファイル>` | AIレビュー |
| `/promote-status <ファイル>` | doc_statusを昇格 |
| `/propagate-change <ファイル>` | 変更影響分析 |

### 引数記法の凡例

| 記法 | 意味 | 例 |
|------|------|-----|
| `<引数>` | 必須引数 | `/convert-l1 <ファイル>` |
| `[引数]` | 省略可能な引数 | `/gen-l3 [F-ID]` |
| `--オプション` | オプションフラグ | `/gen-l2 --simple` |
| `...` | 複数指定可能 | `/gen-l3 F-001 F-002 ...` |

## 三層モデル

| 層 | 名称 | 内容 |
|----|------|------|
| L1 | ビジョン・要求 | ビジネス要求・背景・制約 |
| L2 | 機能設計・技術方針 | 機能構成・技術スタック・フェーズ |
| L3 | 機能ドキュメント | ミニ仕様＋タスク＋テスト |

## ディレクトリ構成（生成後）

```
docs/
  l1_vision.md              # L1: ビジョン・要求
  l2_system/
    overview.md             # 用語集・技術方針・NFR
    phases.md               # フェーズ定義・機能一覧
  l3_features/
    F-YYYYMMDD-nnn_xxx.md   # 機能ドキュメント
```

## ID形式

タイムスタンプベースで衝突を防止:

- `REQ-YYYYMMDD-nnn` - 要件
- `F-YYYYMMDD-nnn` - 機能
- `PH-YYYYMMDD-nnn` - フェーズ
- `NF-YYYYMMDD-nnn` - 非機能要求

## バージョン

- v2.3.0

## ライセンス

MIT
