# SSDD（Slices Specification-Driven Development）

> LLM/AIコードエージェントを前提とした仕様駆動開発フレームワーク

## 概要

SSDDは、複雑な要件を機能単位に分割し、AIが扱える粒度に統治する「分割統治」アプローチです。

## 基本原則

<core_principles>
- **シンプルさを優先**: 複雑な構造より、必要最小限の構成を選ぶ
- **機能の複雑さに応じた詳細度**: 単純な機能には単純なドキュメント
- **層をまたがない**: L1に技術詳細を書かない、L3にビジネス要求を書かない
- **過剰設計を避ける**: 「将来必要になるかも」で追加しない
</core_principles>

## 三層モデル

### なぜ三層か？

1. **AIのコンテキスト制限への対応**: 全情報を一度に渡すのではなく、必要な情報を層ごとに参照
2. **関心の分離**: ビジネス要求（L1）、設計判断（L2）、実装詳細（L3）を分離することで変更影響を局所化
3. **段階的詳細化**: 抽象から具体へ、必要に応じて詳細化

| 層 | 名称 | 役割 | 正本 |
|----|------|------|------|
| L1 | ビジョン・要求 | ビジネス要求・背景・制約 | 要件 |
| L2 | 機能設計・技術方針 | 機能構成・技術スタック・フェーズ・NFR | 設計判断 |
| L3 | 機能ドキュメント | ミニ仕様＋タスク＋テスト＋実装メモ | 機能単位の仕様 |

### L1の設計思想

L1は「AIに目的とコンテキストを与える」ためのドキュメント：

- **非技術者も読める言語**で「何を・なぜ・誰のために」を記述
- 技術詳細はL2に委ね、ビジネス要求に集中
- 要求IDにより、L2/L3への**トレーサビリティの起点**となる
- AIがコード生成時に「そもそも何を解決するのか」を参照できる

### L2の設計思想

L2は「AIに制約と方針を伝え、L3生成の指針を与える」ためのドキュメント：

- L1の「何を」を「どう実現するか」の**設計判断を記録**
- 技術スタック・アーキテクチャ・NFRを具体化
- フェーズ定義により**実装順序と依存関係**を明確化
- **実装ルール**（rules.md）でコード生成時の制約を定義
- AIがL3生成時に「どの技術で・どの順序で・何に注意して」を参照できる

### L3の設計思想

L3は「AIとのフィードバックサイクルを回す作業単位」として機能：

```
L3仕様 → AIがコード生成 → テスト・検証 → L3更新 → 再生成...
```

L3実装で発見した問題は、汎用的・致命的であればL2 rules.mdに追記し、次のL3で活用する。

## ID形式

タイムスタンプベースでID衝突を防止（v0.1で導入、現行も同一仕様）：

### コンテンツID

| ID | 用途 | 例 |
|----|------|-----|
| VISION-YYYYMMDD-nnn | L1ビジョン | VISION-20250125-001 |
| REQ-YYYYMMDD-nnn | 要件 | REQ-20250125-001 |
| F-YYYYMMDD-nnn | 機能 | F-20250125-001 |
| PH-YYYYMMDD-nnn | フェーズ | PH-20250125-001 |
| NF-YYYYMMDD-nnn | 非機能要求 | NF-20250125-001 |
| SP-YYYYMMDD-nnn | スパイク/PoC | SP-20250125-001 |

### L2ドキュメントID（任意）

L2ドキュメント（foundation.md, phases.md）は通常プロジェクトに1つのため、以下の形式を使用：

| ID | 用途 | 例 |
|----|------|-----|
| L2-YYYYMMDD-nnn | L2技術基盤（kind: foundation） | L2-20250125-001 |
| PH-YYYYMMDD-nnn | L2フェーズ定義（kind: phase） | PH-20250125-001 |

**注**: L2技術基盤のIDは省略可能。フェーズはPH-形式で個別に管理。

## フロントマター仕様

```yaml
---
id: F-YYYYMMDD-nnn
kind: feature          # vision|feature|phase|foundation
layer: L3              # L1|L2|L3
status: active         # active|deprecated|removed
doc_status: draft      # draft|reviewed|implemented
req_ids: [REQ-YYYYMMDD-nnn]
nfr_ids: [NF-YYYYMMDD-nnn]     # L3: 実装すべきNFR
phase: PH-YYYYMMDD-nnn
---

# 機能名（本文見出しがタイトル）
```

### フィールド詳細

| フィールド | 必須 | 対象 | 説明 |
|-----------|------|------|------|
| id | ○ | 全て | 一意なID |
| kind | ○ | 全て | ドキュメント種別 |
| layer | ○ | 全て | 所属レイヤ（L1/L2/L3） |
| status | ○ | 全て | active/deprecated/removed |
| doc_status | ○ | 全て | draft/reviewed/implemented |
| req_ids | - | L3 | 対応する要件IDリスト |
| nfr_ids | - | L3 | この機能が実装すべきNFR IDリスト |
| phase | - | L3 | 所属フェーズID |
| related_nfr_ids | - | L2フェーズ | フェーズに適用されるNFR IDリスト |

**注意**:
- `nfr_ids`はL3機能ドキュメントで使用（機能が実装すべきNFR）
- `related_nfr_ids`はL2フェーズ定義で使用（フェーズ全体に適用されるNFR）

**v0.1変更**: `title`フィールドは廃止。本文の`# 見出し`がタイトル。

## doc_status 遷移

```
L1/L2: draft → reviewed（最終状態）
L3:    draft → reviewed → implemented
```

| 状態 | 説明 | 対象レイヤ |
|------|------|-----------|
| draft | AI生成直後、書きかけ | L1, L2, L3 |
| reviewed | レビュー済み、実装/運用可能 | L1, L2, L3 |
| implemented | 実装・テスト完了、ドキュメント追従済み | **L3のみ** |

**注意**: L1/L2は`reviewed`が最終状態。`implemented`への昇格はL3機能ドキュメントのみ可能。

## ディレクトリ構成

```
docs/
  l1_vision.md              # L1: ビジョン・要求
  l2_system/
    foundation.md           # 用語集・技術方針・NFRカタログ
    phases.md               # フェーズ定義・機能一覧
    rules.md                # 実装ルール（コード生成制約）
  l3_features/
    F-YYYYMMDD-nnn_xxx.md   # 機能ドキュメント
```

## テンプレート

プラグイン内のテンプレートを使用：

**基本テンプレート**:
- L1: `skills/ssdd/templates/l1_vision.md`
- L2技術基盤: `skills/ssdd/templates/l2_foundation.md`
- L2フェーズ: `skills/ssdd/templates/l2_phases.md`
- L2実装ルール: `skills/ssdd/templates/l2_rules.md`
- L3機能: `skills/ssdd/templates/l3_feature.md`

## 主要コマンド

| コマンド | 用途 |
|----------|------|
| `/init-ssdd` | ディレクトリ構造初期化 |
| `/draft-l1` | L1ドキュメント作成（対話形式） |
| `/gen-l2 [REQ-ID...]` | L1からL2技術基盤生成 |
| `/gen-phases` | 技術基盤からフェーズ定義・機能一覧生成 |
| `/gen-rules` | L2実装ルールのたたき台生成 |
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
