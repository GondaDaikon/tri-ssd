---
description: SSDD用のディレクトリ構造を初期化する
argument-hint: なし
allowed-tools: Read, Write, Bash
---

# SSDD 初期化コマンド

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、SSDD の基本概念を把握する

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
- 次のステップ（`/draft-l1` または `/convert-l1` の案内）

## 注意事項

- 既存ファイルは上書きしない
