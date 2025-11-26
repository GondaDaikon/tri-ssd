# SSDD（Slices Specification-Driven Development）スキル

> SSDDはLLM／AIコードエージェントを前提とした仕様駆動開発フレームワークです。

## スキル構成

用途に応じて必要なスキルモジュールを読み込んでください：

| スキル | 用途 | 読み込みタイミング |
|--------|------|-------------------|
| **ssdd_core.md** | 基本概念・ID・フロントマター仕様 | 常に読み込む |
| **ssdd_examples.md** | 実例・ワークフロー | ドラフト生成時 |
| **ssdd_troubleshooting.md** | トラブルシューティング・ベストプラクティス | エラー発生時・運用改善時 |

## クイックリファレンス

### 三層モデル

| 層 | 名称 | 正本の対象 |
|----|------|-----------|
| L1 | ビジョン・要求 | 要件 |
| L2 | 機能設計・技術方針 | 設計判断 |
| L3 | 機能ドキュメント | 機能単位の仕様・設計意図 |

### L3の設計思想

**分割統治によるAI活用**: 複雑な要件を機能単位に分割し、AIが扱える粒度に統治する。
L3は「AIとのフィードバックサイクルを回す作業単位」として機能。

### ID形式（v2.0）

```
REQ-YYYYMMDD-nnn  # 要件
F-YYYYMMDD-nnn    # 機能
PH-YYYYMMDD-nnn   # フェーズ
NF-YYYYMMDD-nnn   # 非機能要求
```

### フロントマター（必須フィールド）

```yaml
---
id: [ID]
kind: [vision|req|feature|nfr|phase|spike|overview]
layer: [L1|L2|L3|meta]
status: [active|deprecated|removed]
doc_status: [draft|reviewed|implemented]
---

# タイトル（本文の見出し）
```

### 主要コマンド

| コマンド | 用途 |
|----------|------|
| `/init-ssdd` | ディレクトリ構造初期化 |
| `/draft-l1` | L1ドキュメント作成 |
| `/gen-l2` | L1からL2生成 |
| `/gen-l3 [F-ID]` | L2からL3生成 |
| `/check` | 整合性チェック |
| `/review [ファイル]` | AIレビュー |
| `/promote-status [ファイル]` | doc_status昇格 |
| `/propagate-change [ファイル]` | 変更影響分析 |

## 詳細ドキュメント

- **概念ガイド**: `docs/guide.md`
- **用語集**: `docs/glossary.md`
- **開発フロー**: `docs/checklists.md`
- **テンプレート**: `docs/templates/README.md`
- **エラーメッセージ**: `docs/error_messages.md`
