<template>
  <div class="flex flex-col items-center">
    <v-data-table
      id="custom-table"
      class="mt-2 w-3/4 border"
      density="compact"
      :headers="headers"
      item-value="id"
      :items="users"
    >
      <!-- email列のカスタマイズ -->
      <template #item.email="{ item }">
        <v-text-field
          v-model="item.email"
          class="rounded-md border border-blue-500 focus:border-2 focus:border-blue-700"
          density="compact"
          :rules="[emailRules.required, emailRules.unique(item.id)]"
          validate-on="input"
          variant="underlined"
        ></v-text-field>
      </template>
    </v-data-table>
    <div class="border border-2">div</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'ID', key: 'id', width: '5%' },
  { title: '名前', key: 'name', width: '20%' },
  { title: 'メールアドレス', key: 'email' },
]

const users = ref([
  { id: 1, name: '田中 太郎', email: 'tanaka@example.com' },
  { id: 2, name: '鈴木 一郎', email: 'suzuki@example.com' },
  { id: 3, name: '佐藤 花子', email: 'sato@example.com' },
])

// バリデーションルール
const emailRules = {
  // 必須チェック
  required: (v) => !!v || 'メールアドレスは必須です',

  // 重複チェック（高階関数を使って対象行のIDを渡す）
  unique: (currentId) => {
    return (value) => {
      if (!value) return true

      // 自分以外の行に、同じメールアドレスが存在するかチェック
      const isDuplicate = users.value.some(
        (user) => user.id !== currentId && user.email === value.trim(),
      )

      return !isDuplicate || 'このメールアドレスは既に登録されています'
    }
  },
}
</script>
