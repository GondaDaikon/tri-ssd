---
description: Tri-SSD用のディレクトリ構造を初期化する
argument-hint: なし
allowed-tools: Read, Write, Bash
---

# Tri-SSD 初期化コマンド

<tri_ssd_context>
Tri-SSD（Tri-Layer Slice Spec Driven）はAI/LLMコードエージェントを前提とした仕様駆動開発。

レイヤー構造:
- L1: ビジョン・要求（docs/l1_vision.md）
- L2: 技術基盤（docs/l2_system/）- foundation.md, phases.md, rules.md
- L3: 機能仕様（docs/l3_features/F-xxx.md）

ID形式: PREFIX-YYYYMMDD-nnn（REQ, PH, F, NF）
ステータス: draft → reviewed → implemented（L3のみ）
</tri_ssd_context>

## 実行内容

以下のディレクトリ構造を作成：

```
docs/
├── l2_system/
│   └── .gitkeep
└── l3_features/
    └── .gitkeep
```

**注:** L1 は `docs/l1_vision.md` としてフラット配置。

## ID形式

タイムスタンプベース: `PREFIX-YYYYMMDD-nnn`

| ID種別 | 例 |
|--------|-----|
| 要件 | REQ-20250125-001 |
| フェーズ | PH-20250125-001 |
| 機能 | F-20250125-001 |
| 非機能 | NF-20250125-001 |

## 手順

1. **既存確認**: `docs/` が存在するか確認
2. **ディレクトリ作成**: 存在しない場合のみ作成
3. **完了報告**: 作成したディレクトリ構造を報告

## 出力

- 作成したディレクトリ一覧
- 次のステップの案内:
  1. `/draft-l1` でL1を作成
  2. `/draft-l2` でL2を生成
  3. `/gen-phases` でフェーズ定義を生成
  4. `/draft-rules` で実装ルールを生成
  5. `/gen-l3` でL3を生成

## 注意事項

- 既存ファイルは上書きしない
