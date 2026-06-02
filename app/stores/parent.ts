import { defineStore } from 'pinia'

// システム全体のネストされたデータ構造の型定義
interface ParentData {
  toggle: boolean
  child: {
    toggle: boolean
    grandchild: {
      text: string
    }
  }
}

export const useParentStore = defineStore('parent', () => {
  // ----------------------------------------------------
  // State（状態）
  // ----------------------------------------------------
  const current = ref<ParentData | null>(null) // サーバーにある確定データ
  const parentDraft = ref<ParentData | null>(null) // 画面全体の変更を保持するルート下書き
  const isLoading = ref(false)

  // ----------------------------------------------------
  // Actions（操作）
  // ----------------------------------------------------

  // 1. 画面初期化時にAPIからデータを取得し、下書きのベースを作る
  async function fetchInitialData() {
    isLoading.value = true
    try {
      // APIコールのダミー（実際は $fetch 等に置き換え）
      const data: ParentData = {
        toggle: false,
        child: {
          toggle: false,
          grandchild: { text: '' },
        },
      }
      current.value = data
      // 参照を切るためにディープコピーして下書きへセット
      parentDraft.value = structuredClone(toRaw(data))
    } catch (error) {
      console.error('データの取得に失敗しました', error)
    } finally {
      isLoading.value = false
    }
  }

  // 2. [送信] ボタン：子や孫からすべてマージされた最終結果をAPIへ一括送信
  async function submitAll() {
    if (!parentDraft.value) return

    isLoading.value = true
    try {
      // サーバーへ送信（子・孫のデータも parentDraft の中にすべて内包されています）
      // await $fetch('/api/settings', { method: 'POST', body: parentDraft.value })

      // 送信成功したら、現在の本番データを更新
      current.value = structuredClone(toRaw(parentDraft.value))
      alert('すべての階層の設定を一括保存しました')
    } catch (error) {
      console.error('一括保存に失敗しました', error)
    } finally {
      isLoading.value = false
    }
  }

  // 3. [親キャンセル] ボタン：すべての編集を破棄して、APIから取得した初期状態に戻す
  function cancelAll() {
    if (current.value) {
      parentDraft.value = structuredClone(toRaw(current.value))
    }
  }

  // ----------------------------------------------------
  // Getters（変更検知）
  // ----------------------------------------------------

  // システム全体（親・子・孫のどこか）に未保存の変更があるかを判定
  const hasAnyChanges = computed(() => {
    if (!current.value || !parentDraft.value) return false
    return JSON.stringify(current.value) !== JSON.stringify(parentDraft.value)
  })

  return {
    current,
    parentDraft,
    isLoading,
    fetchInitialData,
    submitAll,
    cancelAll,
    hasAnyChanges,
  }
})
