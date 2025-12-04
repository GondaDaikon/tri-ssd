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
```

## クイックスタート

```bash
# 1. ディレクトリ構造を初期化
/init-ssdd

# 2. L1（ビジョン・要求）を対話形式で作成
/draft-l1

# 3. L2 技術基盤（foundation.md）を生成
/draft-l2

# 4. L2 フェーズ定義・機能一覧（phases.md）を生成
/gen-phases

# 5. 実装ルールのたたき台を生成
/draft-rules

# 6. L3（機能ドキュメント）を生成
/gen-l3

# 7. L3をレビュー → reviewed に昇格
/review F-20250125-001

# 8. L3からコード生成
/gen-code F-20250125-001

# 9. 最終レビュー → implemented に昇格
/review F-20250125-001
```

## コマンド一覧

| コマンド | 説明 |
|----------|------|
| `/init-ssdd` | ディレクトリ構造を初期化 |
| `/draft-l1 [ファイルパス]` | L1ドキュメントを作成（引数なし: 対話モード、引数あり: 変換モード） |
| `/draft-l2 [REQ-xxxx ...]` | L1からL2技術基盤（foundation.md）を生成 |
| `/gen-phases` | 技術基盤からフェーズ定義・機能一覧を生成 |
| `/draft-rules [--minimal]` | 実装ルールのたたき台を生成 |
| `/gen-l3 [F-xxxx ...]` | L2からL3を生成（複数ID指定可） |
| `/gen-code <F-ID>` | L3からコード・テストを生成 |
| `/check [--list-ids]` | 整合性チェック（--list-ids: ID一覧出力） |
| `/review <ファイル>` | AIレビュー + ステータス昇格 |

### 引数記法の凡例

| 記法 | 意味 | 例 |
|------|------|-----|
| `<引数>` | 必須引数 | `/gen-code <F-ID>` |
| `[引数]` | 省略可能な引数 | `/gen-l3 [F-ID]` |
| `--オプション` | オプションフラグ | `/draft-rules --minimal` |
| `...` | 複数指定可能 | `/gen-l3 F-001 F-002 ...` |

## 三層モデル

| 層 | 名称 | 内容 |
|----|------|------|
| L1 | ビジョン・要求 | ビジネス要求・背景・制約 |
| L2 | 機能設計・技術方針 | 技術基盤・フェーズ・機能一覧・実装ルール |
| L3 | 機能ドキュメント | ミニ仕様＋タスク＋テスト |

## ディレクトリ構成（生成後）

```
docs/
  l1_vision.md              # L1: ビジョン・要求
  l2_system/
    foundation.md           # 技術基盤（用語集・技術方針・アーキテクチャ・NFR）
    phases.md               # フェーズ定義・機能一覧
    rules.md                # 実装ルール（コード生成制約）
  l3_features/
    F-YYYYMMDD-nnn_xxx.md   # 機能ドキュメント
```

## ID形式

タイムスタンプベースで衝突を防止:

- `VISION-YYYYMMDD-nnn` - L1ビジョンドキュメント
- `REQ-YYYYMMDD-nnn` - 要件
- `F-YYYYMMDD-nnn` - 機能
- `PH-YYYYMMDD-nnn` - フェーズ
- `NF-YYYYMMDD-nnn` - 非機能要求
- `RULES-YYYYMMDD-nnn` - 実装ルール
- `SP-YYYYMMDD-nnn` - スパイク/PoC

## 変更履歴

[CHANGELOG.md](../CHANGELOG.md) を参照してください。

## ライセンス

MIT
