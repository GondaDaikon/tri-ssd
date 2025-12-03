---
description: SSDDドキュメントの整合性をチェックする
argument-hint: "[--list-ids | ファイルパス] - オプション"
allowed-tools: Read, Glob, Grep
---

# SSDD 整合性チェックコマンド

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

- `--list-ids`: 存在するID一覧を表示
- `ファイルパス`: 特定ファイルのみチェック
- 引数なし: 全体チェック

## チェック項目

### フロントマター検証
- [ ] 必須フィールド存在（id, kind, layer, status, doc_status）
- [ ] kind値の妥当性
- [ ] layer値の妥当性
- [ ] status/doc_status値の妥当性

### タイトル検証
- [ ] フロントマター直後に `# 見出し` が存在するか（titleフィールドは廃止）

### 参照整合性（レイヤー別）

**L3機能ドキュメント**:
- [ ] req_ids の参照先（REQ-xxx）が存在
- [ ] nfr_ids の参照先（NF-xxx）が存在
- [ ] phase の参照先（PH-xxx）が存在

**L2フェーズ定義**:
- [ ] related_nfr_ids の参照先（NF-xxx）が存在

**注**: L1/L2には`req_ids`, `phase`は不要。存在する場合のみ検証。

### ID重複
- [ ] 同一IDが複数ファイルに存在しないか

### 孤立検出（L3対象）
- [ ] どのフェーズ（phase）にも属さないF-xxx
- [ ] どの要件（req_ids）にも紐付かないF-xxx

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
