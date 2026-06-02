<template>
  <!-- テーブル全体を v-form で囲み、ref を設定 -->
  <v-form ref="tableForm">
    <v-data-table :headers="headers" :items="users" item-value="id">
      <template #item.email="{ item }">
        <v-text-field
          v-model="item.email"
          :rules="[emailRules.required, emailRules.unique(item.id)]"
          density="compact"
          variant="underlined"
          validate-on="lazy"
        ></v-text-field>
      </template>
    </v-data-table>
  </v-form>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const headers = [
  { title: 'ID', key: 'id' },
  { title: '名前', key: 'name' },
  { title: 'メールアドレス', key: 'email' },
]

const users = ref([
  { id: 1, name: '田中 太郎', email: 'tanaka@example.com' },
  { id: 2, name: '鈴木 一郎', email: 'suzuki@example.com' },
  { id: 3, name: '佐藤 花子', email: 'sato@example.com' },
])

// フォームのリファレンス
const tableForm = ref(null)

// バリデーションルール
const emailRules = {
  required: (v) => !!v || 'メールアドレスは必須です',
  unique: (currentId) => {
    return (value) => {
      if (!value) return true
      const isDuplicate = users.value.some(
        (user) => user.id !== currentId && user.email?.trim() === value.trim(),
      )
      return !isDuplicate || '重複しています'
    }
  },
}

// データの変更をディープに監視し、他行のエラーもリアルタイムに更新する
watch(
  users,
  async () => {
    // DOMの更新を待ってからバリデーションを実行
    await nextTick()
    if (tableForm.value) {
      tableForm.value.validate()
    }
  },
  { deep: true },
)
</script>
