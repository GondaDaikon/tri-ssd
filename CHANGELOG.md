# Changelog

Tri-SSD (Tri-Layer Slice Spec Driven) フレームワークの変更履歴です。

形式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠しています。

## [2.1.0] - 2026-01-19

### Changed

- **出力フォーマットをコマンドに直接埋め込み**
  - 各コマンド（draft-l1, draft-l2, gen-phases, draft-rules, gen-l3）にYAMLフロントマター形式と必須セクション構造を埋め込み
  - テンプレートファイル参照のバグを根本解決
  - コマンド単体で完結して動作するように改善

- **L3フォルダ構造をフェーズ別に変更**
  - 変更前: `docs/l3_features/F-xxx_feature.md`（フラット）
  - 変更後: `docs/l3_features/PH-xxx_phase-name/F-xxx_feature.md`（フェーズごと）
  - フェーズが複数機能を持つ場合の視認性向上

### Removed

- `templates/` フォルダを削除
  - 出力フォーマットがコマンドに埋め込まれたため不要に
  - 約1,400行の削減

### Added

- check.md にフェーズフォルダ整合性チェック項目を追加
- SKILL.md にL3フォルダ構造の説明を追加

## [2.0.0] - 2026-01-16

### Changed

- **フレームワーク名を SSDD から Tri-SSD に変更**
  - SSDD (Slices Specification-Driven Development) → Tri-SSD (Tri-Layer Slice Spec Driven)
  - 三層構造を名前で明示
- リポジトリ構造を整理
  - `ssdd-plugin/` の内容をルートに移動
  - `eval/`, `archive/` を削除
- コマンド名を変更
  - `/init-ssdd` → `/init-tri-ssd`
- スキル名を変更
  - `ssdd-orchestrator` → `tri-ssd-orchestrator`
- プラグイン名を変更
  - `ssdd` → `tri-ssd`

## [1.0.0] - 2025-12-30

### Added

- GitHub マーケットプレイス対応
  - marketplace.json を GitHub 配布形式に更新
  - LICENSE ファイル (MIT) を追加
  - plugin.json に repository/license メタデータを追加
  - パブリックリリース準備完了

## [0.8.0] - 2025-12-11

### Added

- ssdd-orchestrator スキル（ClaudeCode Skills 対応）
  - Tri-SSD ワークフローのオーケストレーション
  - 「仕様」「L1」「L2」「L3」等のキーワードで自動起動
  - Instructions / Examples / Limitations セクション完備

## [0.7.1] - 2025-12-05

### Changed

- validation_tools.md を checklists.md に統合（セクション 4: バリデーションコマンド）
- changelog_management.md の SSDD 固有部分を guide.md に統合（セクション 6.5: ドキュメント更新の判断基準）

### Removed

- error_messages.md（未実装のエラーコードシステム）
- validation_tools.md（checklists.md に統合）
- changelog_management.md（guide.md に統合）

## [0.7.0] - 2025-12-04

### Added

- GitHub Actions による Markdown リンティング

### Changed

- draft-l1 と convert-l1 を統合（引数なし: 対話モード、引数あり: 変換モード）
- テンプレートを ssdd-plugin/templates/ に移動

### Removed

- convert-l1 コマンド（draft-l1 に統合）
- skills フォルダ（コマンドに SSDD コンテキストを埋め込み）
- ドキュメントからの v0.x バージョン参照

### Improved

- 全コマンドのプロンプト品質を改善
  - 不要な ASCII 図・サンプルを削除
  - 重複した検証コマンドを統合
  - 出力例をシンプル化

## [0.6.0] - 2025-12-03

### Added

- gen-code コマンド（L3 機能ドキュメントからコード・テストを生成）
- marketplace.json（ローカルプラグインテスト用）
- SSDD プロンプト品質評価システム（eval/）

### Changed

- gen-l2 → draft-l2、gen-rules → draft-rules にリネーム
- gen-code の技術スタック検出を foundation.md からプロジェクト設定ファイル（package.json, pyproject.toml 等）の自動検出に変更
- promote-status と propagate-change を既存コマンドに統合

### Removed

- SKILL.md（各コマンドに SSDD コンテキストを埋め込み）

## [0.5.0] - 2025-11-27

### Added

- rules.md サポート（L2 実装ルール）
- gen-phases コマンド（フェーズ定義・機能一覧を生成）
- 全 gen コマンドに再生成サポート
- Claude 4 ベストプラクティスの適用

### Changed

- L2 技術基盤ファイル名を overview.md → foundation.md に変更
- draft-l2 を foundation.md 生成に限定（フェーズ生成は gen-phases に分離）
- kind 値を変更（overview → foundation）
- L2/L3 テンプレートを包括的セクションで強化

## [0.4.0] - 2025-11-26

### Changed

- ssdd-plugin を正本化（`.claude/` との二重管理を解消）
- L3 テンプレートを汎用テンプレート 1 つに統合
- kind 値を整理（vision, foundation, phase, feature の 4 種類に）

### Removed

- ドメイン特化 L3 テンプレート（Web/Desktop/Mobile/CLI）
- `.claude/commands/` と `.claude/skills/` の重複ファイル
- depends_on フィールド（廃止）
- 未使用の kind 値（req, nfr, spike）

## [0.3.0] - 2025-11-26

### Added

- L3 軽量運用ガイドライン（小規模機能向けの簡略化オプション）
- 定量的指標をプロジェクト規模の目安として再定義

### Changed

- スキルファイルをモジュール化（SKILL.md, examples.md, troubleshooting.md）
- 全コマンドの前提処理を統一（SKILL.md を参照）
- gen-l2 の技術候補数を「最低 3 個」に明確化

### Fixed

- L3 の設計思想を明文化（分割統治による AI 活用）
- ID 採番ルールにタイムゾーン・上限規定を追加

## [0.2.0] - 2025-11-26

### Added

- check --list-ids オプション
- review コマンドにステータス昇格機能を統合
- 定量的レビュー基準（L1/L2/L3 各層の数値目安）
- gen-l2 --simple モード（小規模プロジェクト向け 1 ファイル構成）
- コマンドへの包括的エラーハンドリング

### Changed

- gen-l2 技術選定プロセスを対話型に改善
- フロントマター仕様の完全適用（title フィールド廃止）

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

## [0.0.1] - 2025-11-25

### Added

- 初期リリース
- 基本的なコマンド群（init-tri-ssd, draft-l1, gen-l2, gen-l3, check, review）
- スキルファイル（SKILL.md）
- テンプレート群
- ガイドドキュメント
