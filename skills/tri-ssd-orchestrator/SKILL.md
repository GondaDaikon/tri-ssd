---
name: tri-ssd-orchestrator
description: Guides Tri-SSD (Tri-Layer Slice Spec Driven) workflow. Explains the three-layer model (L1/L2/L3) and recommends commands. Triggered by "仕様", "要件定義", "設計", "L1", "L2", "L3", "フェーズ", "ルール", or project specification requests.
---

# Tri-SSD (Tri-Layer Slice Spec Driven)

AI/LLMコードエージェント向けの仕様駆動開発フレームワーク。

## Instructions

When this skill is invoked:
1. Determine user's current stage in Tri-SSD workflow
2. Check existing docs/ directory structure with Glob
3. Recommend the appropriate next command
4. Execute the command if user agrees

Do NOT:
- Skip layers (e.g., generating L3 without L1/L2)
- Generate code without reviewed L3
- Load all Tri-SSD documents at once (context cost)

## 三層モデル

| レイヤー | 内容 | ファイル |
|---------|------|---------|
| L1 | ビジョン・要求（What） | docs/l1_vision.md |
| L2 | 技術基盤・フェーズ・ルール（How） | docs/l2_system/*.md |
| L3 | 機能仕様（Detail） | docs/l3_features/PH-xxx_name/F-*.md |

### L3フォルダ構造

L3ファイルはフェーズごとのサブフォルダに配置:

```
docs/l3_features/
├── PH-xxx-001_phase-name/
│   ├── F-xxx-001_feature.md
│   └── F-xxx-002_feature.md
└── PH-xxx-002_phase-name/
    └── F-xxx-003_feature.md
```

## 利用可能なコマンド

| コマンド | 用途 |
|---------|------|
| /init-tri-ssd | ディレクトリ構造を初期化 |
| /draft-l1 | L1ビジョン・要求を作成 |
| /draft-l2 | L2技術基盤を生成 |
| /gen-phases | フェーズ定義・機能一覧を生成 |
| /draft-rules | 実装ルールを生成 |
| /gen-l3 [F-xxx] | L3機能ドキュメントを生成 |
| /gen-code `<F-xxx>` | コード・テストを生成 |
| /check | 整合性チェック |
| /review <ファイル> | レビュー＆ステータス昇格 |

## 推奨フロー

1. /init-tri-ssd → ディレクトリ作成
2. /draft-l1 → 要件定義
3. /draft-l2 → 技術選定
4. /gen-phases → フェーズ計画
5. /draft-rules → 実装ルール
6. /gen-l3 → 機能仕様
7. /gen-code → 実装
8. /review → 昇格

## フェーズ共通原則

- **判断理由を残す**: コード例より「なぜそうしたか」を重視
- **気づきを反映**: 作業中に得た知見は昇格時に適切なドキュメントへ反映提案
- **過剰設計を避ける**: 今必要なものだけ（YAGNI）

### 気づきの反映先

- 要件の曖昧さ・制約・ビジネスルール → L1
- 技術選定理由・アーキテクチャ制約 → L2
- 機能固有の設計判断 → L3 実装メモ

## フェーズ別ガイド

### L1: ビジョン・要求
**目的**: 「何を作るか」を明確にする

- ユーザーの曖昧な要望を具体化する質問を投げる
- 矛盾する要件は早期に指摘して解決
- 技術的実現性は L2 で検討（ここでは制約しない）

### L2: 技術基盤
**目的**: 「どう作るか」の土台を固める

- L1 の要件を満たす技術選定を行い、選定理由を foundation.md に残す
- rules.md は最小限から始める（実装で育てる）
- 「なぜこの技術か」「なぜこの構成か」を説明できる状態にする

### L3: 機能仕様
**目的**: 実装可能な粒度まで詳細化する

- 1機能 = 1ファイルの原則を守る
- 受け入れ条件はテスト可能な形で書く
- 設計判断の理由を残す

### 実装
**目的**: L3 に沿ってコードを生成する

- L3 から逸脱しない（勝手な機能追加禁止）
- 問題発生時は原因と対処の判断理由を記憶しておく
- テストが通るまで完了としない

### 昇格（/review）
**目的**: 品質確認とドキュメント反映

- セッション中の気づきを整理し、適切なドキュメントへの反映を提案
- 「なぜこのルールが必要か」を含めて提案
- 反映不要なもの（一時的な回避策等）は除外

## Examples

**新規プロジェクトで仕様を書きたい:**
→ /init-tri-ssd でディレクトリ作成後、/draft-l1 で要件定義から開始

**既存プロジェクトにTri-SSDを導入したい:**
→ /init-tri-ssd 後、既存コードを分析して /draft-l1 で要件を逆算

**L3機能を実装したい:**
→ まず /check で L3 の doc_status を確認。reviewed なら /gen-code、draft なら /review を先に実行

**進捗を確認したい:**
→ /check で全体の整合性と各ドキュメントのステータスを確認

## Limitations

- Tri-SSD固有のワークフローのみ対応（汎用的なコード生成は対象外）
- L3単位での実装を前提（複数L3の同時実装は非推奨）
- 既存コードの自動分析によるL1/L2生成は不完全（人間のレビュー必須）

## 現在の状態確認

/check で整合性チェックと進捗確認が可能。
