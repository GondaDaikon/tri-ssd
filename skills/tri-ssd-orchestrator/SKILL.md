---
name: tri-ssd-orchestrator
description: >
  Tri-SSD（三層仕様駆動）のワークフローを統括する。
  AI/LLMコードエージェントを前提としたシンプルな仕様駆動開発フレームワーク。
  三層モデル（L1 要件、L2 システム構成、L3 フェーズ）を通じて、
  要件から実装までのトレーサビリティを確保しながらAIと人間の共同作業を効率化する。
  使用タイミング: (1) 新規プロジェクトの仕様・要件定義を作成したい、
  (2) 既存プロジェクトにTri-SSDを導入したい、
  (3) 要件や技術スタックを追加・変更したい、
  (4) L1/L2/L3ドキュメントを生成・更新したい、
  (5) 仕様からコード・テストを生成したい、
  (6) 進捗確認・完了マーキングをしたい、
  (7) L3フェーズを分割・統合したい。
  トリガー: 「仕様」「要件定義」「要件追加」「設計」「技術スタック」「技術選定」
  「L1」「L2」「L3」「フェーズ」「仕様書」「技術基盤」
  「コード生成」「進捗確認」「完了」「Tri-SSD」「導入」「分割」「統合」。
---

# Tri-SSD (Tri-Layer Slice Spec Driven)

AI/LLMコードエージェント向けのシンプルな仕様駆動開発フレームワーク。

## Instructions

When this skill is invoked:
1. Determine user's current stage in Tri-SSD workflow
2. Check existing docs/ directory structure with Glob
3. Recommend the appropriate next command
4. Execute the command if user agrees

Do NOT:
- Skip layers (e.g., generating L3 without L1/L2)
- Generate code without L3
- Load all Tri-SSD documents at once (context cost)

## 三層モデル

| レイヤー | 内容 | ファイル |
|---------|------|---------|
| L0 | アイディア・ラフメモ（任意） | docs/l0_ideas/ |
| L1 | 要件（What） | docs/l1_requirements/vision.md |
| L2 | システム構成（How） | docs/l2_foundation/foundation.md |
| L3 | フェーズ（Detail） | docs/l3_phases/PH-xxx.md |

### L3フェーズ構造

L3ファイルはフェーズごとに独立:

```
docs/l3_phases/
├── PH-xxx-001_mvp.md
├── PH-xxx-002_beta.md
└── PH-xxx-003_release.md
```

各フェーズには機能一覧と受け入れ条件がインラインで記述される。

## 利用可能なコマンド

| コマンド | 用途 |
|---------|------|
| /init-tri-ssd | ディレクトリ構造を初期化 |
| /gen-l1 | L1要件を生成 |
| /gen-l2 | L2システム構成を生成 |
| /gen-l3 | L3フェーズ（機能+受け入れ条件）を生成 |
| /split-l3 `<PH-xxx>` | L3フェーズをフォルダ構造に分割 |
| /merge-l3 `<PH-xxx>` | 分離されたL3フェーズを統合 |
| /gen-code `<PH-xxx\|F-xxx>` | コード・テストを生成 |
| /status | 進捗確認 |
| /done `<ファイル>` | 完了マーキング |

## 推奨フロー

1. /init-tri-ssd → ディレクトリ作成
2. /gen-l1 → 要件定義
3. /gen-l2 → 技術選定
4. /gen-l3 → フェーズ計画（機能+受け入れ条件）
5. /gen-code → 実装
6. /done → 完了マーキング

## フェーズ共通原則

- **シンプルに保つ**: 必要最小限のドキュメント
- **判断理由を残す**: コード例より「なぜそうしたか」を重視
- **過剰設計を避ける**: 今必要なものだけ（YAGNI）

## Examples

**新規プロジェクトで仕様を書きたい:**
→ /init-tri-ssd でディレクトリ作成後、/gen-l1 で要件定義から開始

**既存プロジェクトにTri-SSDを導入したい:**
→ /init-tri-ssd 後、既存コードを分析して /gen-l1 で要件を逆算

**L3フェーズを実装したい:**
→ まず /status で L3 の status を確認。done なら /gen-code、wip なら /done を先に実行

**進捗を確認したい:**
→ /status で全体の進捗と各ドキュメントのステータスを確認

**慎重に進めたいフェーズがある:**
→ /split-l3 PH-xxx でフォルダ構造に分割、機能ごとに管理可能

**分割したフェーズを元に戻したい:**
→ /merge-l3 PH-xxx でインライン形式に統合

## Limitations

- Tri-SSD固有のワークフローのみ対応（汎用的なコード生成は対象外）
- フェーズ単位での実装を前提
- 既存コードの自動分析によるL1/L2生成は不完全（人間のレビュー必須）

## 現在の状態確認

/status で進捗確認が可能。
