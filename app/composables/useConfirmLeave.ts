import type { RouteLocationNormalized } from 'vue-router'
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

type OnLeaveCallback = () => void | Promise<void>

export function useBlowserLeaveGuard(isDirty: () => boolean = () => true) {
  // ブラウザのリロード・タブ閉じ・外部サイトへの離脱をブロック
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty()) {
      e.preventDefault()

      // returnValue は使わず、戻り値として空文字（または真偽値）を返す
      // これだけでモダンブラウザは警告ダイアログを表示します
      return ''
    }
  }
  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  })
  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
}

function queryModeChanged(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
): boolean {
  if (to.query.mode && from.query.mode) {
    const modeChanged = to.query.mode !== from.query.mode
    return modeChanged
  }
  return false
}

/**
 *
 * @param onLeave
 *
 */
export function useConfirmLeave(
  onLeave: OnLeaveCallback,
  // 変更ありフラグ（入力中のみ警告を出したい場合に使用）
  isDirty: () => boolean = () => true,
  message = 'このページを離れますか？\n入力内容は破棄されます。',
) {
  const showModal = ref(false)
  /**
   * Promise の resolve 関数を保持するための変数
   * resolve関数は、resolve(true) または resolve(false) を呼び出すことで、Promise の結果を決定する
   */
  let resolveLeave: ((value: boolean) => void) | null = null

  function handleConfirm() {
    showModal.value = false
    resolveLeave?.(true)
  }

  function handleCancel() {
    showModal.value = false
    resolveLeave?.(false)
  }

  useBlowserLeaveGuard(isDirty)

  onBeforeRouteLeave(async (to, from) => {
    // そもそも変更がなければスルー
    if (!isDirty()) {
      return true
    }
    if (to.query.mode && from.query.mode) {
      const modeChanged = to.query.mode !== from.query.mode
      // モードが異なっている場合は異常な遷移
      if (modeChanged) {
        await onLeave() // モードが異なる場合は、onLeaveを呼び出してから遷移
        navigateTo('/') // ルートに遷移させる
      }
    }
    // 対象ページ群から離脱するか判定するロジック入れる。metaにするか、リストで持つか
    console.log('to.meta.pageGroup:', to.meta.pageGroup)
    console.log('from.meta.pageGroup:', from.meta.pageGroup)
    if (to.meta.pageGroup && from.meta.pageGroup) {
      console.log('.meta.pageGroupが両方に存在する場合の処理')

      if (to.meta.pageGroup === from.meta.pageGroup) {
        console.log('ページグループが同じ場合の処理')
        // ストアそのままにして、遷移許可
        return true
      }
    }

    showModal.value = true
    const ok = await new Promise<boolean>((resolve) => {
      resolveLeave = resolve
    })
    console.log('ユーザーの選択:', ok)

    if (ok) {
      await onLeave()
      return true
    }
    return false
  })

  return { showModal, handleConfirm, handleCancel, message }
}
