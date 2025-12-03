---
description: 対話形式でL1（ビジョン・要求）ドキュメントを作成する
argument-hint: なし
allowed-tools: Read, Write, Edit
---

# L1 ドラフト作成コマンド

## 対話時の原則

<avoid_over_engineering>
- 必要以上に詳細を聞き出さない（L2で決める技術詳細はL1に書かない）
- ユーザーが「わからない」と答えたら、TODOマークして先に進む
- 機能要求は概要レベルで十分（詳細はL3で定義）
- 非機能要求も「体感的にストレスなく」程度の粒度で十分
</avoid_over_engineering>

## ツール実行方針

<parallel_execution>
前提処理でのファイル読み込み（SKILL.md, templates を同時に読み込む）
</parallel_execution>

## 前提処理

1. `skills/ssdd/SKILL.md` を読み込み、SSDD の基本概念を把握する
2. `skills/ssdd/templates/l1_vision.md` を読み込み、L1 テンプレートを確認する

## 対話フロー

### Step 1: プロダクト概要
1. プロダクト名は何ですか？
2. 解決したい課題は何ですか？
3. 想定ユーザー（ペルソナ）は誰ですか？

### Step 2: 制約条件
1. 動作環境（OS、ブラウザ等）は？
2. 法規制やコンプライアンス要件は？
3. 連携が必要な外部システムは？

### Step 3: 機能要求
1. 主な機能を教えてください
2. 各機能の優先度（高/中/低）は？
3. 参考にしたい類似サービスは？

### Step 4: 非機能要求
1. 性能要求は？（レスポンス時間等）
2. セキュリティ要件は？
3. その他の品質要求は？

## 出力仕様

- **ファイルパス**: `docs/l1_vision.md`
- **フロントマター**: `doc_status: draft`
- **曖昧箇所**: `<!-- TODO: 要確認 -->` でマーク
- **REQ ID**: タイムスタンプベース（REQ-YYYYMMDD-nnn）

## ID採番ロジック

1. 現在日時を取得: YYYYMMDD
2. 既存REQ IDを検索（Grepで docs/**/*.md から）
3. 同日の最大連番 + 1 で新ID生成

## 完了後の案内

- 作成ファイルのパスを報告
- `/draft-l2` で L2 生成できることを案内
