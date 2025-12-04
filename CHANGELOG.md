# Changelog

SSDD (Slices Specification-Driven Development) フレームワークの変更履歴です。

形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠しています。

> **注**: v0.0.1〜v0.5.0 は初期設計フェーズで策定された仕様バージョンです。
> 同一日付は設計ドキュメントの論理的なバージョン区分を表しており、
> 実運用開始後は実際のリリース日が記録されます。

## [Unreleased]

### Changed
- draft-l1 と convert-l1 を統合（引数なし: 対話モード、引数あり: 変換モード）
- gen-code の技術スタック検出を foundation.md からプロジェクト設定ファイル（package.json, pyproject.toml 等）の自動検出に変更

### Removed
- convert-l1 コマンド（draft-l1 に統合）

### Improved
- 各コマンドのプロンプト品質を改善（gen-code, gen-phases, draft-rules, gen-l3）
  - 不要なASCII図・サンプルを削除
  - 重複した検証コマンドを統合
  - 出力例をシンプル化

## [0.5.0] - 2025-11-26

### Changed
- ssdd-plugin を正本化（`.claude/` との二重管理を解消）
- L3 テンプレートを汎用テンプレート1つに統合
- kind値を整理（vision, overview, phase, featureの4種類に）

### Removed
- ドメイン特化 L3 テンプレート（Web/Desktop/Mobile/CLI）
- `.claude/commands/` と `.claude/skills/` の重複ファイル
- depends_on フィールド（廃止）
- 未使用のkind値（req, nfr, spike）

## [0.4.0] - 2025-11-26

### Added
- L3 軽量運用ガイドライン（小規模機能向けの簡略化オプション）
- 定量的指標をプロジェクト規模の目安として再定義

### Changed
- スキルファイルをモジュール化（SKILL.md, examples.md, troubleshooting.md）
- 全コマンドの前提処理を統一（SKILL.md を参照）
- gen-l2 の技術候補数を「最低3個」に明確化

### Fixed
- L3 の設計思想を明文化（分割統治によるAI活用）
- ID 採番ルールにタイムゾーン・上限規定を追加

## [0.3.0] - 2025-11-26

### Added
- 定量的レビュー基準（L1/L2/L3 各層の数値目安）
- gen-l2 --simple モード（小規模プロジェクト向け1ファイル構成）
- コマンドへの包括的エラーハンドリング

### Changed
- フロントマター仕様の完全適用（title フィールド廃止）
- テンプレート群の対応

## [0.2.0] - 2025-11-26

### Added
- check --list-ids オプション
- review コマンドにステータス昇格機能を統合

### Changed
- gen-l2 技術選定プロセスを対話型に改善

## [0.1.0] - 2025-11-26

### Added
- タイムスタンプベース ID 形式（PREFIX-YYYYMMDD-nnn）
- doc_status フィールド（draft/reviewed/implemented）
- 三層モデルの正式導入（L1/L2/L3）

### Changed
- title フィールドを廃止、本文の # 見出しをタイトルとして使用
- フロントマター必須フィールドの整理

### Removed
- 旧形式の連番 ID（REQ-001 形式）

## [0.0.1] - 2025-11-26

### Added
- 初期リリース
- 基本的なコマンド群（init-ssdd, draft-l1, gen-l2, gen-l3, check, review）
- スキルファイル（SKILL.md）
- テンプレート群
- ガイドドキュメント
