<template>
  <!-- テーブル全体を v-form で囲み、ref を設定 -->
  <v-form ref="tableForm">
    <v-data-table :headers="headers" item-value="id" :items="users">
      <template #item.email="{ item }">
        <v-text-field
          v-model="item.email"
          density="compact"
          :rules="[emailRules.required, emailRules.unique(item.id)]"
          validate-on="lazy"
          variant="underlined"
        ></v-text-field>
      </template>
    </v-data-table>
  </v-form>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'

const headers = [
  { title: 'ID', key: 'id' },
  { title: '名前', key: 'name' },
  { title: 'メールアドレス', key: 'email' },
]

const array = []
for (let i = 0; i < 1000; i++) {
  array.push({
    id: i + 1,
    name: `佐藤 花子${i + 1}`,
    email: `sato${i + 1}@example.com`,
  })
}

const users = ref(array)

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
