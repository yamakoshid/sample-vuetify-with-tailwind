<!-- pages/special.vue -->
<script setup>
definePageMeta({
  middleware: 'only-internal-access',
  pageGroup: 'service',
})

const store = useMyStore()

function onConfirmed() {
  console.log('Confirmed: resetting the store.')
  store.cancel()
  console.log('Confirmed: Leaving the page')
}

const { showModal, handleConfirm, handleCancel } = useConfirmLeave(onConfirmed)
</script>

<template>
  <div>
    <p class="text-lg font-semibold text-gray-800">2 特別ページの内容...</p>

    <div class="flex flex-col items-start justify-start gap-4">
      <button
        class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        @click="navigateTo('/internal-only/confirm-leave-1')"
      >
        confirm-leave-1
      </button>
      <button
        class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        @click="navigateTo('/internal-only/confirm-leave-2')"
      >
        confirm-leave-2
      </button>
      <button
        class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        @click="navigateTo('/tailwind/element')"
      >
        Tailwind element
      </button>

      <ConfirmLeaveModal
        :model-value="showModal"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      />
    </div>
  </div>
</template>
