import { defineStore } from 'pinia'
import { useChildStore } from './child' // 子ストアをインポート

export const useGrandchildStore = defineStore('grandchild', () => {
  const childStore = useChildStore() // 子ストアのインスタンス化
  const grandchildDraft = ref<{ text: string } | null>(null)

  // 1. 孫画面を開く：子ストアが今持っている孫データをコピー
  function open() {
    if (childStore.childDraft) {
      grandchildDraft.value = structuredClone(
        toRaw(childStore.childDraft.grandchild),
      )
    }
  }

  // 2. 確定ボタン：子ストアの該当箇所に自分自身のデータを上書きマージ
  function commit() {
    if (childStore.childDraft && grandchildDraft.value) {
      childStore.childDraft.grandchild = structuredClone(
        toRaw(grandchildDraft.value),
      )
      grandchildDraft.value = null // 自身のバッファはクリア
    }
  }

  function cancel() {
    grandchildDraft.value = null
  }

  return { grandchildDraft, open, commit, cancel }
})
