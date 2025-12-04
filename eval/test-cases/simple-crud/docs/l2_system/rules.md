---
id: RULES-20251129-001
kind: rules
layer: L2
status: active
doc_status: reviewed
---

# SimpleNote 実装ルール

## 1. コード規約

### 1.1 命名規則

- コンポーネント: PascalCase
- 関数・変数: camelCase
- 定数: UPPER_SNAKE_CASE

### 1.2 ファイル構成

```
src/
├── components/   # UIコンポーネント
├── pages/        # ページ
├── api/          # APIクライアント
└── types/        # 型定義
```

---

## 2. API規約

### 2.1 エラーコード体系

| プレフィックス | 意味 |
|---------------|------|
| NOTE_ | メモ関連エラー |
| AUTH_ | 認証関連エラー |
| VALIDATION_ | バリデーションエラー |

---

## 3. テスト規約

- ユニットテスト: Jest
- E2Eテスト: Playwright
