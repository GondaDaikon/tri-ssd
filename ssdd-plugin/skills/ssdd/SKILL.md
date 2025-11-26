# SSDD（Slices Specification-Driven Development）

> LLM/AIコードエージェントを前提とした仕様駆動開発フレームワーク

## 概要

SSDDは、複雑な要件を機能単位に分割し、AIが扱える粒度に統治する「分割統治」アプローチです。

## 三層モデル

| 層 | 名称 | 役割 | 正本 |
|----|------|------|------|
| L1 | ビジョン・要求 | ビジネス要求・背景・制約 | 要件 |
| L2 | 機能設計・技術方針 | 機能構成・技術スタック・フェーズ・NFR | 設計判断 |
| L3 | 機能ドキュメント | ミニ仕様＋タスク＋テスト＋実装メモ | 機能単位の仕様 |

### L3の設計思想

L3は「AIとのフィードバックサイクルを回す作業単位」として機能：

```
L3仕様 → AIがコード生成 → テスト・検証 → L3更新 → 再生成...
```

## ID形式（v2.0）

タイムスタンプベースでID衝突を防止：

| ID | 用途 | 例 |
|----|------|-----|
| VISION-YYYYMMDD-nnn | L1ビジョン | VISION-20250125-001 |
| REQ-YYYYMMDD-nnn | 要件 | REQ-20250125-001 |
| F-YYYYMMDD-nnn | 機能 | F-20250125-001 |
| PH-YYYYMMDD-nnn | フェーズ | PH-20250125-001 |
| NF-YYYYMMDD-nnn | 非機能要求 | NF-20250125-001 |
| SP-YYYYMMDD-nnn | スパイク/PoC | SP-20250125-001 |

## フロントマター仕様

```yaml
---
id: F-YYYYMMDD-nnn
kind: feature          # vision|req|feature|nfr|phase|overview|spike
layer: L3              # L1|L2|L3
status: active         # active|deprecated|removed
doc_status: draft      # draft|reviewed|implemented
req_ids: [REQ-YYYYMMDD-nnn]
phase: PH-YYYYMMDD-nnn
---

# 機能名（本文見出しがタイトル）
```

**注**: v2.0で`title`フィールドは廃止。本文の`# 見出し`がタイトル。

## doc_status 遷移

```
draft → reviewed → implemented
```

| 状態 | 説明 |
|------|------|
| draft | AI生成直後、書きかけ |
| reviewed | レビュー済み、実装可能 |
| implemented | 実装・テスト完了（L3のみ） |

## ディレクトリ構成

```
docs/
  l1_vision.md              # L1: ビジョン・要求
  l2_system/
    overview.md             # 用語集・技術方針・NFRカタログ
    phases.md               # フェーズ定義・機能一覧
  l3_features/
    F-YYYYMMDD-nnn_xxx.md   # 機能ドキュメント
```

## テンプレート

プラグイン内のテンプレートを使用：

**基本テンプレート**:
- L1: `skills/ssdd/templates/l1_vision.md`
- L2概要: `skills/ssdd/templates/l2_overview.md`
- L2フェーズ: `skills/ssdd/templates/l2_phases.md`
- L3機能: `skills/ssdd/templates/l3_feature.md`

**ドメイン特化L3テンプレート**:
- Webアプリ: `skills/ssdd/templates/l3_feature_web.md`
- Desktopアプリ: `skills/ssdd/templates/l3_feature_desktop.md`
- Mobileアプリ: `skills/ssdd/templates/l3_feature_mobile.md`
- CLIツール: `skills/ssdd/templates/l3_feature_cli.md`

## 主要コマンド

| コマンド | 用途 |
|----------|------|
| `/init-ssdd` | ディレクトリ構造初期化 |
| `/draft-l1` | L1ドキュメント作成（対話形式） |
| `/gen-l2 [REQ-ID...]` | L1からL2生成 |
| `/gen-l3 [F-ID...]` | L2からL3生成 |
| `/check [--list-ids \| ファイル]` | 整合性チェック |
| `/review <ファイル>` | AIレビュー（必須） |
| `/promote-status <ファイル>` | doc_status昇格（必須） |
| `/propagate-change <ファイル>` | 変更影響分析（必須） |

## 変更伝播ルール

- **L1変更** → L2・L3 に波及
- **L2変更** → L3 に波及、要件影響時は L1 に戻る
- **L3変更** → 局所的なら L3 のみ、設計影響時は L2 に波及

## 詳細情報

詳細な実例・トラブルシューティングは以下を参照：
- [examples.md](examples.md) - 実例・ワークフロー
- [troubleshooting.md](troubleshooting.md) - トラブルシューティング
