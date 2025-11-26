# SSDD トラブルシューティング

## ID衝突エラー

**症状**: `/check` で "ID重複エラー"

**解決**:
```bash
/check --list-ids  # 既存ID確認
# フロントマターのidを修正
# 参照（req_ids等）も更新
/check             # 再チェック
```

## 参照整合性エラー

**症状**: "参照先が存在しません: REQ-xxx"

**解決**:
```bash
/check --list-ids  # 存在するID確認
# 参照元のreq_ids/nfr_ids/phaseを修正
/check
```

## タイトル見出し欠落

**症状**: "タイトル見出しが欠落"

**解決**: フロントマター直後に `# 見出し` を追加
```markdown
---
id: F-20250125-001
...
---

# 機能名  ← これを追加
```

## doc_status 昇格失敗

**症状**: "昇格条件を満たしていません"

**確認事項**:
- TODOコメント（`<!-- TODO -->`）が残存していないか
- 必須フィールド（id, kind, layer, status, doc_status）があるか
- L3の場合、req_ids と phase があるか

---

## ベストプラクティス

### 定期チェック
```bash
/check              # リリース前・大きな変更後
/check --list-ids   # 週次でID確認
```

### doc_status管理
- **draft**: AI生成直後、必ずレビュー
- **reviewed**: TODO解消、実装可能レベル
- **implemented**: コード同期済み

### フェーズ設計
- 粒度: 2-8個が目安
- Exit Criteria を明確に
- フェーズ境界で結合テスト
