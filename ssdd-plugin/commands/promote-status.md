---
description: ドキュメントのdoc_statusを次の段階に昇格する
argument-hint: <ファイルパス|ID> - 昇格対象（必須）
allowed-tools: Read, Edit, Glob, Grep
---

# doc_status 昇格コマンド

<ssdd_context>
SSDD（Slices Specification-Driven Development）はAI/LLMコードエージェントを前提とした仕様駆動開発。

レイヤー構造:
- L1: ビジョン・要求（docs/l1_vision.md）
- L2: 技術基盤（docs/l2_system/）- foundation.md, phases.md, rules.md
- L3: 機能仕様（docs/l3_features/F-xxx.md）

ID形式: PREFIX-YYYYMMDD-nnn（REQ, PH, F, NF）
ステータス: draft → reviewed → implemented（L3のみ）
</ssdd_context>

## 引数

- `$1`: 昇格対象（必須）
  - ファイルパス: 直接指定
  - ID: REQ-xxx, F-xxx 等で指定

## 前提処理

1. `$1` で指定された対象ファイルを特定・読み込む

## 状態遷移

```
draft → reviewed → implemented
```

> **注意**: L1/L2 と L3 では遷移ルールが異なります。
> - L1/L2: `draft → reviewed`（最終状態）
> - L3: `draft → reviewed → implemented`

| 現在 | 昇格後 | 条件 |
|------|--------|------|
| draft | reviewed | レビュー完了、TODO解消 |
| reviewed | implemented | 実装・テスト完了（L3のみ） |

## 昇格条件チェック

### draft → reviewed

#### 必須条件
- [ ] フロントマター必須フィールドが存在
- [ ] タイトル見出しが存在
- [ ] L3の場合、phase と req_ids が存在
- [ ] 参照整合性が保たれている

#### 推奨条件
- [ ] TODOコメントが残存していない
- [ ] プレースホルダーが残存していない

### reviewed → implemented

#### 必須条件
- [ ] kind が feature（L3のみ）
- [ ] タスクチェックリストが完了
- [ ] 実装メモにコードパスが記載

## 出力形式

```markdown
# doc_status 昇格チェック結果

**ファイル**: docs/l3_features/F-20250125-001_xxx.md
**現在**: draft → **昇格後**: reviewed

## 必須条件
✓ フロントマター: OK
✓ 参照整合性: OK

## 推奨条件
✗ TODO残存: 2箇所

## 判定
昇格可能（推奨条件に警告あり）
```

## 注意事項

- L1, L2 は implemented にはならない（draft → reviewed のみ）
- L3 のみ implemented に昇格可能
