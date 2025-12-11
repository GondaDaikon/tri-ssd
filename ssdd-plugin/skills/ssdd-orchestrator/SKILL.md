---
name: ssdd-orchestrator
description: SSDDフレームワークを使った仕様駆動開発を支援。「仕様」「要件定義」「設計」「L1」「L2」「L3」「フェーズ」「ルール」に関するタスクで使用される
---

# SSDD (Slices Specification-Driven Development)

AI/LLMコードエージェント向けの仕様駆動開発フレームワーク。

## 三層モデル

| レイヤー | 内容 | ファイル |
|---------|------|---------|
| L1 | ビジョン・要求（What） | docs/l1_vision.md |
| L2 | 技術基盤・フェーズ・ルール（How） | docs/l2_system/*.md |
| L3 | 機能仕様（Detail） | docs/l3_features/F-*.md |

## 利用可能なコマンド

| コマンド | 用途 |
|---------|------|
| /init-ssdd | ディレクトリ構造を初期化 |
| /draft-l1 | L1ビジョン・要求を作成 |
| /draft-l2 | L2技術基盤を生成 |
| /gen-phases | フェーズ定義・機能一覧を生成 |
| /draft-rules | 実装ルールを生成 |
| /gen-l3 [F-xxx] | L3機能ドキュメントを生成 |
| /gen-code <F-xxx> | コード・テストを生成 |
| /check | 整合性チェック |
| /review <ファイル> | レビュー＆ステータス昇格 |

## 推奨フロー

1. /init-ssdd → ディレクトリ作成
2. /draft-l1 → 要件定義
3. /draft-l2 → 技術選定
4. /gen-phases → フェーズ計画
5. /draft-rules → 実装ルール
6. /gen-l3 → 機能仕様
7. /gen-code → 実装
8. /review → 昇格

## 現在の状態確認

/check で整合性チェックと進捗確認が可能。
