# IF設計(ストア)

<iframe src="./pinia_store_interface_design.html" width="100%" height="100%" frameborder="0"></iframe>

- [store_design](./pinia_store_interface_design.html)

## ポイント

- **`structuredClone`** でネストしたオブジェクトのディープコピーを確実に行う
- `committed` = 「最後に設定ボタンを押した状態」、`draft` = 「いま編集中の状態」と役割を明確に分ける
- 孫のトグルOff時は **`draft`のみ初期化**することで、子キャンセル時に`committed`から復元できる

---

各ストアの設計のポイントを補足します。

**キー設計について**

`committed` / `draft` のキー（`Record<string, T>` の `string` 部分）は、ルーターのパラメータと合わせると自然です。

```ts
// 子ページ: /child/:childId
const childId = route.params.childId as string

// 孫ページ: /child/:childId/grand/:grandId
const grandId = route.params.grandId as string
```

**`resetByChild` と `resetByParent` の違い**

| action                        | committed  | draft  | 復元可否             |
| ----------------------------- | ---------- | ------ | -------------------- |
| `resetByChild` (子トグルOff)  | 変更しない | 初期化 | 子キャンセルで復元可 |
| `resetByParent` (親トグルOff) | 初期化     | 初期化 | 復元不可             |

子トグルOff時に `committed` を残しておくことで、子ページで「キャンセル」したときに `committed → draft` のコピーが走り、トグルをOff→Onし直しても元のデータに戻せます。

**`beginEdit` を呼ぶタイミング**

```ts
// 子ページの onMounted
onMounted(() => {
  childrenStore.beginEdit(childId)
  // 孫のbeginEditはchildrenStore内部で連鎖して呼ぶ
})
```

ページ遷移のたびに `beginEdit` で `committed` のスナップショットを取ることが、キャンセル機能の根幹です。
