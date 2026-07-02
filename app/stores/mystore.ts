import { defineStore } from 'pinia'
import { useParentStore } from './parent' // 親ストアをインポート

export const useMyStore = defineStore('myStore', () => {
  const parentStore = useParentStore()
  const childDraft = ref<{ toggle: boolean; grandchild: any } | null>(null)

  function open() {
    if (parentStore.parentDraft) {
      childDraft.value = structuredClone(toRaw(parentStore.parentDraft.child))
    }
  }

  function commit() {
    if (parentStore.parentDraft && childDraft.value) {
      parentStore.parentDraft.child = structuredClone(toRaw(childDraft.value))
      childDraft.value = null
    }
  }

  function cancel() {
    childDraft.value = null
  }

  return { childDraft, open, commit, cancel }
})
