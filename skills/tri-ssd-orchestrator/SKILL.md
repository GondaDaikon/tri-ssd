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
| L3 | 機能仕様（Detail） | docs/l3_features/F-*.md |

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
