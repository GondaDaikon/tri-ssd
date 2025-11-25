# SSDD（Slices Specification-Driven Development）スキル

## 概要

SSDD は、LLM／AIコードエージェントを前提とした仕様駆動開発のフレームワークです。

## 三層モデル

| 層 | 名称 | 役割 | 正本の対象 |
|----|------|------|-----------|
| L1 | ビジョン・要求 | ビジネス要求・背景・制約・願望 | 要件 |
| L2 | 機能設計・技術方針 | 機能構成・技術スタック・フェーズ・NFR | 設計判断 |
| L3 | 機能ドキュメント | ミニ仕様＋タスク＋テスト＋実装メモ | **実装前の仕様書**（実装後はコードが正） |

## ID 種類

| ID形式 | 用途 |
|--------|------|
| REQ-xxxx | 要件 |
| PH-xxxx | フェーズ |
| PH-POC-xxxx | 検証フェーズ |
| NF-xxxx | 非機能要求 |
| F-xxxx | 機能（Feature） |
| SP-xxxx | スパイク／PoC |

## フロントマター仕様

### 共通フィールド（必須）

```yaml
---
id: [ID]
kind: [vision|req|feature|nfr|phase|spike|overview]
layer: [L1|L2|L3|meta]
title: [タイトル]
status: [active|deprecated|removed]
doc_status: [draft|reviewed|implemented]
---
```

### 参照フィールド（トレーサビリティ用）

```yaml
req_ids: [REQ-xxxx]      # 対応する要件ID
nfr_ids: [NF-xxxx]       # 適用される非機能要求ID
phase: PH-xxxx           # 所属フェーズ
replaced_by: [ID]        # 後継ID（deprecated時）
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
  l2_overview.md        # L2: 概要（--simple モード時の単一ファイル）
  l2_system/            # L2: 通常モード時のディレクトリ
    overview.md
    phases.md
    nfr.md
    features_index.md
  l3_features/          # L3: 機能ドキュメント
    F-0001_xxx.md
    F-0002_xxx.md
```

## テンプレート参照先

- L1: `docs/templates/l1_vision.md`
- L2 概要: `docs/templates/l2_overview.md`
- L2 フェーズ: `docs/templates/l2_phases.md`
- L3 機能: `docs/templates/l3_feature.md`
- フロントマター仕様: `docs/templates/README.md`
