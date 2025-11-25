---
id: F-YYYYMMDD-nnn
kind: feature
layer: L3
status: active
doc_status: draft
req_ids:
  - REQ-YYYYMMDD-nnn
nfr_ids:
  - NF-YYYYMMDD-nnn
phase: PH-YYYYMMDD-nnn
---

# [機能名]

> **ドメイン**: CLIツール
> **テンプレートバージョン**: v2.0

## 1. 概要

### 1.1 この機能でできること

[この機能でユーザーが何をできるようになるか、1〜3文で説明]

### 1.2 代表的なユースケース

**ユースケース1**: [シナリオ名]
```bash
$ [command] [subcommand] [options] [arguments]
# [実行結果の説明]
```

**ユースケース2**: [シナリオ名]
```bash
$ [command] [subcommand] [options] [arguments]
# [実行結果の説明]
```

---

## 2. コマンド仕様

### 2.1 コマンド構文

```bash
[command] [subcommand] [options] [arguments]
```

#### 基本構文

```bash
# 基本形式
$ myapp [subcommand] [options] [arguments]

# 例
$ myapp process --input file.txt --output result.txt
$ myapp list --format json
$ myapp config set key value
```

### 2.2 サブコマンド

| サブコマンド | 説明 | エイリアス |
|------------|------|-----------|
| [subcommand1] | [説明] | [alias] |
| [subcommand2] | [説明] | [alias] |
| [subcommand3] | [説明] | [alias] |

### 2.3 オプション

#### グローバルオプション（全サブコマンド共通）

| オプション | 短縮形 | 説明 | デフォルト値 |
|-----------|--------|------|-------------|
| --help | -h | ヘルプを表示 | - |
| --version | -v | バージョンを表示 | - |
| --verbose | -V | 詳細ログを表示 | false |
| --quiet | -q | 最小限の出力 | false |
| --config | -c | 設定ファイルパス | ~/.myapp/config.yaml |
| --no-color | - | カラー出力を無効化 | false |

#### サブコマンド固有オプション

**[subcommand1]**

| オプション | 短縮形 | 説明 | 必須 | デフォルト値 |
|-----------|--------|------|------|-------------|
| --input | -i | 入力ファイル | ○ | - |
| --output | -o | 出力ファイル | × | stdout |
| --format | -f | 出力形式 | × | text |

**[subcommand2]**

| オプション | 短縮形 | 説明 | 必須 | デフォルト値 |
|-----------|--------|------|------|-------------|
| [option1] | [short] | [説明] | ○/× | [default] |

### 2.4 引数

| 引数 | 説明 | 必須 | 複数可 |
|------|------|------|--------|
| [arg1] | [説明] | ○ | ○/× |
| [arg2] | [説明] | ×  | ○/× |

### 2.5 使用例

#### 例1: [ユースケース説明]

```bash
$ myapp process --input data.csv --output result.json --format json
Processing data.csv...
✓ Completed successfully
Output written to result.json
```

#### 例2: パイプライン使用

```bash
$ cat data.txt | myapp filter --pattern "error" | myapp format --style json
```

#### 例3: 複数ファイル処理

```bash
$ myapp process file1.txt file2.txt file3.txt --output-dir ./results/
```

---

## 3. 入出力仕様

### 3.1 標準入力（stdin）

| 形式 | 説明 | 例 |
|------|------|----|
| テキスト | 行ごとに処理 | `echo "text" \| myapp process` |
| JSON | JSON配列として処理 | `cat data.json \| myapp process` |
| CSV | CSV形式として処理 | `cat data.csv \| myapp process` |

**パイプライン対応**:
- [ ] stdin からの入力対応
- [ ] バッファリング戦略（ライン/チャンク）

### 3.2 標準出力（stdout）

| 形式 | 説明 | オプション |
|------|------|-----------|
| テキスト | 人間が読める形式 | デフォルト |
| JSON | JSON形式 | --format json |
| CSV | CSV形式 | --format csv |
| YAML | YAML形式 | --format yaml |

**出力例**:

```bash
# テキスト形式
$ myapp list
Item 1: Description
Item 2: Description
Total: 2 items

# JSON形式
$ myapp list --format json
{
  "items": [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"}
  ],
  "total": 2
}
```

### 3.3 標準エラー出力（stderr）

| 種類 | 出力先 | 形式 |
|------|-------|------|
| エラーメッセージ | stderr | [ERROR] メッセージ |
| 警告メッセージ | stderr | [WARN] メッセージ |
| デバッグログ | stderr (--verbose時) | [DEBUG] メッセージ |

### 3.4 終了コード

| 終了コード | 意味 | 説明 |
|-----------|------|------|
| 0 | 成功 | 正常終了 |
| 1 | 一般エラー | 予期しないエラー |
| 2 | 使用方法エラー | コマンドライン引数エラー |
| 3 | 入力エラー | 入力ファイル/データエラー |
| 4 | 出力エラー | 出力ファイル書き込みエラー |
| 5 | 設定エラー | 設定ファイルエラー |
| 130 | 中断（Ctrl+C） | SIGINT受信 |

### 3.5 ファイル入出力

#### 入力ファイル

| 形式 | 拡張子 | 説明 |
|------|-------|------|
| [format1] | .[ext] | [説明] |
| [format2] | .[ext] | [説明] |

#### 出力ファイル

| 形式 | 拡張子 | 上書き確認 |
|------|-------|-----------|
| [format1] | .[ext] | あり / なし |
| [format2] | .[ext] | あり / なし |

---

## 4. インタラクティブモード

### 4.1 対話型プロンプト

```bash
$ myapp init
? プロジェクト名を入力してください: my-project
? 言語を選択してください:
  > TypeScript
    JavaScript
    Python
? 初期設定を行いますか? (Y/n): Y
✓ プロジェクトを作成しました: my-project
```

### 4.2 確認ダイアログ

| 操作 | 確認メッセージ | デフォルト |
|------|--------------|-----------|
| 削除 | "本当に削除しますか? (y/N)" | N |
| 上書き | "ファイルを上書きしますか? (y/N)" | N |
| 強制実行 | "強制的に実行しますか? (y/N)" | N |

**スキップオプション**:
- `--yes` / `-y`: すべて「はい」
- `--force` / `-f`: 確認をスキップ

### 4.3 進捗表示

#### プログレスバー

```bash
Processing files... [████████████--------] 60% (3/5)
```

**実装**:
- ライブラリ: [progress-bar-library]
- 更新頻度: 100ms

#### スピナー

```bash
⠋ Loading...
⠙ Loading...
⠹ Loading...
```

**使用タイミング**:
- 進捗が不明な長時間処理
- ネットワークリクエスト待機

---

## 5. 設定管理

### 5.1 設定ファイル

#### ファイルパス（優先順位順）

1. `./myapp.config.yaml` （カレントディレクトリ）
2. `~/.myapp/config.yaml` （ホームディレクトリ）
3. `/etc/myapp/config.yaml` （システム全体）

#### 設定ファイル形式

```yaml
# myapp.config.yaml
version: 1.0
defaults:
  format: json
  verbose: false
  output_dir: ./output
api:
  endpoint: https://api.example.com
  timeout: 30
custom:
  key: value
```

### 5.2 環境変数

| 環境変数 | 説明 | デフォルト値 |
|---------|------|-------------|
| MYAPP_CONFIG | 設定ファイルパス | ~/.myapp/config.yaml |
| MYAPP_LOG_LEVEL | ログレベル | info |
| MYAPP_API_KEY | APIキー | - |
| NO_COLOR | カラー出力無効化 | - |

**優先順位**:
1. コマンドラインオプション
2. 環境変数
3. 設定ファイル
4. デフォルト値

### 5.3 設定コマンド

```bash
# 設定の表示
$ myapp config list

# 設定の取得
$ myapp config get defaults.format

# 設定の変更
$ myapp config set defaults.format json

# 設定のリセット
$ myapp config reset
```

---

## 6. エラーハンドリング

### 6.1 エラーメッセージ

#### 形式

```bash
[ERROR] エラーの説明

原因:
  具体的な原因の説明

解決方法:
  1. 対処方法1
  2. 対処方法2

詳細: https://docs.example.com/errors/E001
```

#### エラーコード

| エラーコード | 説明 | 終了コード |
|------------|------|-----------|
| E001 | ファイルが見つからない | 3 |
| E002 | 権限エラー | 1 |
| E003 | 不正な引数 | 2 |
| E004 | ネットワークエラー | 1 |

### 6.2 バリデーション

| 項目 | ルール | エラーメッセージ |
|------|--------|-----------------|
| ファイルパス | 存在チェック | "Error: File not found: [path]" |
| オプション値 | 許可値チェック | "Error: Invalid value for --format: [value]" |
| 引数数 | 必須数チェック | "Error: Missing required argument: [arg]" |

### 6.3 ヘルプ表示

```bash
$ myapp --help
myapp - [短い説明]

Usage:
  myapp [subcommand] [options] [arguments]

Subcommands:
  process    Process input files
  list       List items
  config     Manage configuration

Options:
  -h, --help       Show help
  -v, --version    Show version
  -V, --verbose    Verbose output
  -q, --quiet      Quiet mode

Examples:
  $ myapp process --input data.txt
  $ myapp list --format json
  $ myapp config set key value

For more information, see: https://docs.example.com
```

---

## 7. タスクチェックリスト

### 7.1 実装タスク

#### コマンドライン処理

- [ ] 引数パーサー実装
- [ ] オプション解析
- [ ] バリデーション
- [ ] ヘルプ生成
- [ ] バージョン表示

#### 入出力

- [ ] 標準入力処理
- [ ] 標準出力処理
- [ ] 標準エラー出力
- [ ] ファイル入出力
- [ ] 各種フォーマット対応（JSON/CSV/YAML）

#### インタラクティブ

- [ ] プロンプト実装
- [ ] 確認ダイアログ
- [ ] プログレスバー
- [ ] スピナー
- [ ] カラー出力

#### 設定管理

- [ ] 設定ファイル読み込み
- [ ] 環境変数処理
- [ ] 設定優先順位処理

#### エラーハンドリング

- [ ] エラーメッセージ実装
- [ ] 終了コード管理
- [ ] シグナルハンドリング（SIGINT/SIGTERM）

#### その他

- [ ] ログ出力
- [ ] デバッグモード
- [ ] ドライランモード（--dry-run）

### 7.2 テストタスク

#### ユニットテスト

- [ ] 引数パーサーテスト
- [ ] ビジネスロジックテスト
- [ ] バリデーションテスト
- [ ] フォーマッターテスト

#### 統合テスト

- [ ] コマンド実行テスト
- [ ] ファイル入出力テスト
- [ ] パイプライン処理テスト
- [ ] エラーケーステスト

#### E2Eテスト

- [ ] 実際のCLI実行テスト（shell script）
- [ ] 複数コマンド組み合わせテスト
- [ ] エラーシナリオテスト

---

## 8. 非機能・受け入れ条件

### 8.1 非機能要求の具体化

| NF ID | 要求 | この機能での具体化 |
|-------|------|-------------------|
| NF-YYYYMMDD-nnn | パフォーマンス | 起動時間100ms以内、1GBファイル処理1分以内 |
| NF-YYYYMMDD-nnn | POSIX準拠 | POSIX互換のオプション形式 |
| NF-YYYYMMDD-nnn | パイプライン対応 | stdin/stdout でのデータ処理 |

### 8.2 受け入れ条件

#### AC-1: [条件名]

```gherkin
Given コマンドラインで [条件]
When [コマンド] を実行
Then [期待される出力] が標準出力に表示される
And 終了コードが 0 である
```

#### AC-2: [エラーケース]

```gherkin
Given [エラー条件]
When [コマンド] を実行
Then [エラーメッセージ] が標準エラー出力に表示される
And 終了コードが [code] である
```

### 8.3 パフォーマンス基準

| メトリクス | 目標値 | 測定方法 |
|-----------|--------|---------|
| 起動時間 | 100ms以内 | time コマンド |
| メモリ使用量 | 100MB以内 | /usr/bin/time -v |
| 1GBファイル処理 | 1分以内 | time コマンド |
| CPU使用率 | 80%以内 | top / htop |

---

## 9. 実装メモ・注意点

### 9.1 適用した設計パターン

- **[パターン名1]**: [適用理由・概要]
- **[パターン名2]**: [適用理由・概要]

### 9.2 関連コードへのリンク

| 種別 | パス |
|------|------|
| メインエントリポイント | `src/cli.ts` / `cmd/main.go` / `cli.py` |
| コマンド実装 | `src/commands/` |
| パーサー | `src/parser/` |
| フォーマッター | `src/formatters/` |
| テストコード | `tests/cli/` |

### 9.3 技術的負債・暫定対応

- [ ] [負債1：何が暫定で、どう直すべきか]
- [ ] [負債2]

### 9.4 注意点・申し送り事項

- [注意点1]
- [注意点2]

### 9.5 CLI固有の考慮事項

#### POSIX準拠

- [ ] 短縮オプション形式: `-a -b -c` または `-abc`
- [ ] 長形式オプション: `--option` / `--option=value`
- [ ] `--` によるオプション終了
- [ ] ヘルプオプション: `-h` / `--help`
- [ ] バージョンオプション: `-v` / `--version`

#### シェル統合

```bash
# コマンド補完（bash）
$ myapp <TAB>
config  list  process

# コマンド補完（zsh）
$ myapp process --<TAB>
--input   --output  --format  --help

# 補完スクリプト生成
$ myapp completion bash > /etc/bash_completion.d/myapp
$ myapp completion zsh > /usr/local/share/zsh/site-functions/_myapp
```

#### TTY検出

```bash
# パイプ時: カラー無効、プログレスバー無効
$ myapp process | tee output.txt

# ターミナル: カラー有効、プログレスバー有効
$ myapp process
```

**実装**:
```javascript
const isTTY = process.stdout.isTTY;
const useColor = isTTY && !process.env.NO_COLOR;
```

#### シグナルハンドリング

| シグナル | 処理 |
|---------|------|
| SIGINT (Ctrl+C) | クリーンアップして終了（終了コード130） |
| SIGTERM | グレースフルシャットダウン |
| SIGPIPE | パイプ先が終了時の処理 |

---

## 10. 配布・インストール

### 10.1 インストール方法

#### パッケージマネージャー

```bash
# npm
$ npm install -g myapp

# Homebrew (macOS/Linux)
$ brew install myapp

# apt (Debian/Ubuntu)
$ sudo apt install myapp

# yum (RHEL/CentOS)
$ sudo yum install myapp

# Cargo (Rust)
$ cargo install myapp
```

#### バイナリ配布

```bash
# ダウンロード
$ curl -fsSL https://example.com/install.sh | sh

# 手動インストール
$ wget https://example.com/myapp-v1.0.0-linux-x64.tar.gz
$ tar -xzf myapp-v1.0.0-linux-x64.tar.gz
$ sudo mv myapp /usr/local/bin/
```

### 10.2 プラットフォーム対応

| OS | アーキテクチャ | バイナリ名 |
|----|--------------|-----------|
| Linux | x86_64 | myapp-linux-x64 |
| Linux | ARM64 | myapp-linux-arm64 |
| macOS | x86_64 | myapp-darwin-x64 |
| macOS | ARM64 (M1/M2) | myapp-darwin-arm64 |
| Windows | x86_64 | myapp-windows-x64.exe |

### 10.3 アンインストール

```bash
# npm
$ npm uninstall -g myapp

# Homebrew
$ brew uninstall myapp

# 手動
$ sudo rm /usr/local/bin/myapp
$ rm -rf ~/.myapp/
```

---

## 11. ドキュメント

### 11.1 マニュアルページ（man page）

```bash
$ man myapp
```

**セクション**:
- NAME
- SYNOPSIS
- DESCRIPTION
- OPTIONS
- EXAMPLES
- ENVIRONMENT
- FILES
- SEE ALSO
- BUGS

### 11.2 オンラインドキュメント

- **公式サイト**: https://myapp.example.com
- **ドキュメント**: https://docs.example.com/myapp
- **チュートリアル**: https://docs.example.com/myapp/tutorial
- **API リファレンス**: https://docs.example.com/myapp/api

### 11.3 ヘルプコマンド

```bash
# 全体ヘルプ
$ myapp --help

# サブコマンドヘルプ
$ myapp process --help

# クイックスタート
$ myapp quickstart
```

---

## 12. ログ・デバッグ

### 12.1 ログ出力

| ログレベル | 出力先 | 用途 |
|-----------|-------|------|
| ERROR | stderr | エラー情報 |
| WARN | stderr | 警告情報 |
| INFO | stderr | 一般情報 |
| DEBUG | stderr (--verbose時) | デバッグ情報 |

**ログ形式**:
```
[2025-01-25 10:30:45] [INFO] Processing file: data.txt
[2025-01-25 10:30:46] [DEBUG] Read 1000 lines
[2025-01-25 10:30:47] [ERROR] Failed to write output: Permission denied
```

### 12.2 ログファイル

- **パス**: `~/.myapp/logs/myapp.log`
- **ローテーション**: 日次、最大7ファイル保持
- **サイズ制限**: 10MB/ファイル

### 12.3 デバッグモード

```bash
$ myapp --verbose process --input data.txt
[DEBUG] Loading configuration from ~/.myapp/config.yaml
[DEBUG] Parsing input file: data.txt
[DEBUG] Processing line 1: ...
[INFO] Processing complete
```
