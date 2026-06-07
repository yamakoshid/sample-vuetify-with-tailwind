<template>
  <div class="min-h-screen bg-gray-50 px-4 py-10">
    <div class="mx-auto max-w-5xl">
      <!-- ページヘッダー -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        <p class="mt-1 text-sm text-gray-500">
          登録ユーザーの一覧・編集・追加・削除ができます
        </p>
      </div>

      <!-- トースト通知 -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="toast.visible"
          class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-800 shadow-lg"
        >
          <span class="text-base">{{ toast.icon }}</span>
          {{ toast.msg }}
        </div>
      </Transition>

      <!-- テーブルコンポーネント -->
      <BaseTableEditableTable
        :columns="columns"
        :initial="initialUsers"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// ── 列定義 ─────────────────────────────────────────────────────────────────
/**
 * type:
 *   'readonly' … 既存行は表示のみ・新規行は入力可
 *   'text'     … テキスト入力
 *   'email'    … メール形式バリデーション付きテキスト入力
 *
 * unique:      重複禁止
 * uniqueScope:
 *   'active'   … 削除予定行を除いてユニーク（デフォルト）
 *   'all'      … 削除予定行も含めてユニーク
 *               （サーバー側で add/delete が同IDで来た時の曖昧さ排除）
 *
 * required:    必須バリデーション
 */
const columns = [
  {
    key: 'userId',
    label: 'ユーザーID',
    type: 'readonly',
    required: true,
    unique: true,
    uniqueScope: 'all', // 削除行も含めて重複禁止
    placeholder: '例: U-0005',
  },
  {
    key: 'name',
    label: 'ユーザー名',
    type: 'text',
    required: true,
  },
  {
    key: 'email',
    label: 'メールアドレス',
    type: 'email',
    required: true,
    unique: true, // 削除行は除いてユニーク（デフォルト）
  },
  {
    key: 'address',
    label: '住所',
    type: 'text',
  },
]

// ── 初期データ ──────────────────────────────────────────────────────────────
const initialUsers = [
  {
    _id: 1,
    userId: 'U-0001',
    name: '田中 太郎',
    email: 'tanaka@example.com',
    address: '東京都渋谷区1-2-3',
  },
  {
    _id: 2,
    userId: 'U-0002',
    name: '山田 花子',
    email: 'yamada@example.com',
    address: '大阪府大阪市4-5-6',
  },
  {
    _id: 3,
    userId: 'U-0003',
    name: '鈴木 次郎',
    email: 'suzuki@example.com',
    address: '愛知県名古屋市7-8-9',
  },
  {
    _id: 4,
    userId: 'U-0004',
    name: '佐藤 美咲',
    email: 'sato@example.com',
    address: '福岡県福岡市10-11-12',
  },
]

// ── トースト ────────────────────────────────────────────────────────────────
const toast = reactive({ visible: false, icon: '', msg: '' })
let toastTimer = null

const showToast = (icon, msg) => {
  toast.icon = icon
  toast.msg = msg
  toast.visible = true
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.visible = false
  }, 3000)
}

// ── submit ハンドラ ─────────────────────────────────────────────────────────
const onSubmit = (payload) => {
  console.log('📦 送信ペイロード:', JSON.stringify(payload, null, 2))

  const total =
    payload.add.length + payload.update.length + payload.delete.length
  showToast('✅', `${total} 件の変更を保存しました`)
}
</script>
k
