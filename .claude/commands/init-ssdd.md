---
description: SSDD用のディレクトリ構造を初期化する
argument-hint: なし
allowed-tools: Read, Write, Bash
---

# SSDD 初期化コマンド

## 前提処理

1. `.claude/skills/ssdd.md` を読み込み、SSDD の基本概念を把握する
2. `docs/templates/README.md` を読み込み、フロントマター仕様を確認する

## 実行内容

以下のディレクトリ構造を作成してください：

```
docs/
├── l1_vision/
│   └── .gitkeep
├── l2_system/
│   └── .gitkeep
└── l3_features/
    └── .gitkeep
```

## 手順

1. **既存確認**: `docs/` ディレクトリが既に存在するか確認
2. **ディレクトリ作成**: 存在しない場合のみ作成
3. **完了報告**: 作成したディレクトリ構造を報告

## 出力

作成完了後、以下を報告：

- 作成したディレクトリ一覧
- 次のステップ（`/draft-l1` または `/convert-l1` の案内）

## 注意事項

- 既存のファイルは上書きしない
- `docs/templates/` は別途管理されるため、作成対象外
