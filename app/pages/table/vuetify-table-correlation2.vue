<template>
  <v-data-table :headers="headers" item-value="id" :items="users">
    <template #item.email="{ item, index }">
      <!-- refを配列としてマウントし、入力時に他行への影響をチェック -->
      <v-text-field
        :ref="
          (el) => {
            if (el) inputRefs[item.id] = el
          }
        "
        v-model="item.email"
        density="compact"
        :rules="[emailRules.required, emailRules.unique(item.id)]"
        validate-on="input"
        variant="underlined"
        @update:model-value="onEmailInput($event, item.id)"
      ></v-text-field>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref } from 'vue'

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

// 各行の v-text-field インスタンスを ID キーで保持するオブジェクト
const inputRefs = {}

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

// 入力があった時に、ピンポイントで影響のある行だけを再検証する
function onEmailInput (newValue, currentId) {
  if (!newValue) return

  const trimmedValue = newValue.trim()

  // 自分以外の行で、同じメールアドレス、または「直前まで同じだった」行を探す
  for (const user of users.value) {
    if (user.id === currentId) continue

    // 重複関係にある（または解消された）行だけを個別に再検証
    if (
      user.email?.trim() === trimmedValue ||
      inputRefs[user.id]?.isValid === false
    ) {
      // 該当行のコンポーネントだけを直接バリデーション
      inputRefs[user.id]?.validate()
    }
  }
}
</script>
