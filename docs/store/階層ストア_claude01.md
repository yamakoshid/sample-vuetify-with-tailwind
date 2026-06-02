# Piniaストア設計

階層構造と「キャンセル時に戻せる」要件がポイントですね。**「確定済みデータ」と「編集中データ」を分けて管理する**のが鍵です。

---

## ストア設計方針

```
stores/
├── parentStore.ts       # 親ページのデータ
├── childrenStore.ts     # 子ページのデータ（複数）
└── grandchildrenStore.ts # 孫ページのデータ（複数）
```

各ストアに **`committed`（確定済み）** と **`draft`（編集中）** の2層を持たせます。

---

## 実装例

### `stores/grandchildrenStore.ts`

```ts
export const useGrandchildrenStore = defineStore('grandchildren', () => {
  // 確定済みデータ（子の「設定ボタン」押下時に保存）
  const committed = ref<Record<string, GrandchildData>>({})

  // 編集中データ（孫ページで操作中）
  const draft = ref<Record<string, GrandchildData>>({})

  // 孫ページを開いたとき: committedをdraftにコピー
  function beginEdit(grandchildId: string) {
    draft.value[grandchildId] = structuredClone(committed.value[grandchildId] ?? defaultData())
  }

  // 孫の「設定ボタン」: draftをcommittedに昇格
  function commit(grandchildId: string) {
    committed.value[grandchildId] = structuredClone(draft.value[grandchildId])
  }

  // 孫の「キャンセルボタン」: draftを破棄
  function cancelEdit(grandchildId: string) {
    draft.value[grandchildId] = structuredClone(committed.value[grandchildId] ?? defaultData())
  }

  // 子のトグルOff時: 指定孫IDのcommitted/draftを初期化
  function resetByChild(childId: string, grandchildIds: string[]) {
    for (const id of grandchildIds) {
      committed.value[id] = defaultData()
      draft.value[id] = defaultData()
    }
  }

  return { committed, draft, beginEdit, commit, cancelEdit, resetByChild }
})
```

---

### `stores/childrenStore.ts`

```ts
export const useChildrenStore = defineStore('children', () => {
  const grandchildrenStore = useGrandchildrenStore()

  // 確定済みデータ（親の「送信ボタン」or 子の「設定ボタン」押下時）
  const committed = ref<Record<string, ChildData>>({})

  // 編集中データ（子ページで操作中）
  const draft = ref<Record<string, ChildData>>({})

  // 子ページを開いたとき: committedをdraftにコピー
  function beginEdit(childId: string) {
    draft.value[childId] = structuredClone(committed.value[childId] ?? defaultData())
    // 孫のcommittedもdraftにコピー（子キャンセル時の復元基準を作る）
    const grandchildIds = getGrandchildIds(childId)
    for (const gid of grandchildIds) {
      grandchildrenStore.beginEdit(gid)
    }
  }

  // 子の「設定ボタン」: draftをcommittedに昇格
  // 孫のdraftもこのタイミングでcommitされる
  function commit(childId: string) {
    committed.value[childId] = structuredClone(draft.value[childId])
    const grandchildIds = getGrandchildIds(childId)
    for (const gid of grandchildIds) {
      grandchildrenStore.commit(gid)
    }
  }

  // 子の「キャンセルボタン」: draftを破棄、孫も巻き戻す
  function cancelEdit(childId: string) {
    draft.value[childId] = structuredClone(committed.value[childId] ?? defaultData())
    // 孫も子beginEdit時点のcommittedに戻す
    const grandchildIds = getGrandchildIds(childId)
    for (const gid of grandchildIds) {
      grandchildrenStore.cancelEdit(gid)
    }
  }

  // 親のトグルOff時: 子と孫のデータを初期化
  function resetByParent(childId: string) {
    committed.value[childId] = defaultData()
    draft.value[childId] = defaultData()
    grandchildrenStore.resetByChild(childId, getGrandchildIds(childId))
  }

  return { committed, draft, beginEdit, commit, cancelEdit, resetByParent }
})
```

---

## データフロー図

```
親ページ
│
├─ 送信ボタン → children.committed + grandchildren.committed をAPIへ
├─ キャンセルボタン → ページ離脱（storeはそのまま or リセット）
│
└─ [子ページへ遷移] → children.beginEdit(childId)
      │
      ├─ 設定ボタン → children.commit(childId)  ※孫も一緒にcommit
      ├─ キャンセルボタン → children.cancelEdit(childId) ※孫も巻き戻し
      │
      └─ [孫ページへ遷移] → grandchildren.beginEdit(grandchildId)
            │
            ├─ 設定ボタン → grandchildren.commit(grandchildId)
            └─ キャンセルボタン → grandchildren.cancelEdit(grandchildId)
```

---

## 要件との対応まとめ

| 要件                                                 | 実装                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| 子トグルOff → 子データ初期化                         | `children.resetByParent(childId)`                                 |
| 孫トグルOff → 孫データ初期化（子キャンセルで戻せる） | `grandchildren.resetByChild()`はdraftのみ操作。子キャンセルで復元 |
| 子キャンセル → 孫データも`beginEdit`時点に戻す       | `cancelEdit`内で孫の`cancelEdit`も呼ぶ                            |
| 孫キャンセル → 孫のdraftを破棄                       | `grandchildren.cancelEdit()`                                      |

---
