---
description: SSDDドキュメントの整合性をチェックする
argument-hint: "[--list-ids | ファイルパス] - オプション"
allowed-tools: Read, Glob, Grep
---

# SSDD 整合性チェックコマンド

## 引数

- `--list-ids`: 存在するID一覧を表示
- `ファイルパス`: 特定ファイルのみチェック
- 引数なし: 全体チェック

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、SSDD の基本概念を把握する

## チェック項目

### フロントマター検証
- [ ] 必須フィールド存在（id, kind, layer, status, doc_status）
- [ ] kind値の妥当性
- [ ] layer値の妥当性
- [ ] status/doc_status値の妥当性

### タイトル検証（v2.0）
- [ ] フロントマター直後に `# 見出し` が存在するか

### 参照整合性
- [ ] req_ids の参照先が存在
- [ ] nfr_ids の参照先が存在
- [ ] phase の参照先が存在
- [ ] depends_on の参照先が存在

### ID重複
- [ ] 同一IDが複数ファイルに存在しないか

### 孤立検出
- [ ] どのフェーズにも属さないF
- [ ] どのREQにも紐付かないF

## 出力形式

```markdown
# SSDD 整合性チェック結果

## サマリ
- チェックファイル数: N
- エラー: N件
- 警告: N件

## エラー
1. [E001] ID重複: F-20250125-001 (file1.md, file2.md)
2. [E002] 参照先不在: REQ-20250125-999 (referenced in file3.md)

## 警告
1. [W001] 孤立機能: F-20250125-002 (phaseに未所属)
```

## --list-ids 出力

```
REQ-20250125-001  docs/l1_vision.md
REQ-20250125-002  docs/l1_vision.md
F-20250125-001    docs/l3_features/F-20250125-001_xxx.md
PH-20250125-001   docs/l2_system/phases.md
```
