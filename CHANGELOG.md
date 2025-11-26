# Changelog

SSDD (Slices Specification-Driven Development) フレームワークの変更履歴です。

形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠しています。

## [Unreleased]

## [2.4.0] - 2025-11-26

### Changed
- ssdd-plugin を正本化（`.claude/` との二重管理を解消）
- L3 テンプレートを汎用テンプレート1つに統合

### Removed
- ドメイン特化 L3 テンプレート（Web/Desktop/Mobile/CLI）
- `.claude/commands/` と `.claude/skills/` の重複ファイル

## [2.3.0] - 2025-11-26

### Added
- L3 軽量運用ガイドライン（小規模機能向けの簡略化オプション）
- 定量的指標をプロジェクト規模の目安として再定義

### Changed
- スキルファイルをモジュール化（ssdd_core.md, ssdd_examples.md, ssdd_troubleshooting.md）
- 全コマンドの前提処理を統一（ssdd_core.md を参照）
- gen-l2 の技術候補数を「最低3個」に明確化

### Fixed
- L3 の設計思想を明文化（分割統治によるAI活用）
- ID 採番ルールにタイムゾーン・上限規定を追加

## [2.2.0] - 2025-11-25

### Added
- 定量的レビュー基準（L1/L2/L3 各層の数値目安）
- gen-l2 --simple モード（小規模プロジェクト向け1ファイル構成）
- コマンドへの包括的エラーハンドリング

### Changed
- v2.0 フロントマター仕様の完全適用（title フィールド廃止）
- テンプレート群の v2.0 対応

## [2.1.0] - 2025-11-24

### Added
- propagate-change コマンド（変更影響分析）
- promote-status コマンド（doc_status 昇格）
- check --list-ids オプション

### Changed
- gen-l2 技術選定プロセスを対話型に改善

## [2.0.0] - 2025-11-23

### Added
- タイムスタンプベース ID 形式（PREFIX-YYYYMMDD-nnn）
- doc_status フィールド（draft/reviewed/implemented）
- 三層モデルの正式導入（L1/L2/L3）

### Changed
- title フィールドを廃止、本文の # 見出しをタイトルとして使用
- フロントマター必須フィールドの整理

### Removed
- 旧形式の連番 ID（REQ-001 形式）

## [1.0.0] - 2025-11-20

### Added
- 初期リリース
- 基本的なコマンド群（init-ssdd, draft-l1, gen-l2, gen-l3, check, review）
- スキルファイル（ssdd.md）
- テンプレート群
- ガイドドキュメント
