<!-- components/ConfirmLeaveModal.vue -->
<script setup>
defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="overlay">
      <div class="modal">
        <p class="modal-text">
          このページを離れますか？<br />入力内容は破棄されます。
        </p>
        <div class="modal-actions">
          <button class="btn btn-cancel" @click="emit('cancel')">
            キャンセル
          </button>
          <button class="btn btn-confirm" @click="emit('confirm')">
            離れる
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 320px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.modal-text {
  margin: 0 0 20px;
  line-height: 1.6;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.btn-cancel {
  background: #eee;
}
.btn-confirm {
  background: #e53935;
  color: #fff;
}
</style>
