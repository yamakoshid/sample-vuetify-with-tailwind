<script setup lang="ts">
// --- 型定義 ---
interface Service {
  id: string
  name: string
  isManagedService: boolean // 管理サービスかどうか
}

interface User {
  userId: string
  name: string
  email: string
  orderId: string | null // 紐づくオーダーID
  isActive: boolean
  services: Service[]
  canChangeOrder: boolean // オーダー変更可能か
}

interface Order {
  id: string
  startDate: Date
  endDate: Date
  // その他のオーダー情報...
}

// --- 状態管理 ---

// ダミーデータ（実際のAPI呼び出しをシミュレート）
const mockServices: Service[] = [
  { id: 'svc-1', name: 'プレミアムサポート', isManagedService: true },
  { id: 'svc-2', name: 'ベーシックプラン', isManagedService: false },
]

// 選択されたオーダーを保持するリアクティブ変数
const selectedOrderId = ref<string | null>(null)
const availableOrders = ref<Order[]>([
  {
    id: 'order-1001',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-08-31'),
  },
  {
    id: 'order-1002',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-07-31'),
  },
])

// 選択されたオーダーに基づいてユーザーリストをフィルタリングする関数
const users = ref<User[]>([])

/**
 * オーダーIDが変更されたときに、関連するユーザーデータをロードし直すシミュレーション。
 */
const loadUsersForOrder = (orderId: string) => {
  // 実際のアプリケーションではAPIコールを行う
  console.log(`Loading users for Order ID: ${orderId}`)

  orderId === 'order-1002'
    ? (users.value = [
        {
          userId: 'user-a',
          name: '山田 太郎',
          email: 'taro@example.com',
          orderId: 'order-1002',
          isActive: true,
          services: [
            { id: 'svc-1', name: 'プレミアムサポート', isManagedService: true },
            { id: 'svc-2', name: 'ベーシックプラン', isManagedService: false },
          ],
          canChangeOrder: true, // 変更可能
        },
        {
          userId: 'user-b',
          name: '佐藤 花子',
          email: 'hanako@example.com',
          orderId: null, // このオーダーには紐づいていないが、管理対象として表示されるケースを想定
          isActive: true,
          services: [
            { id: 'svc-1', name: 'プレミアムサポート', isManagedService: true },
          ],
          canChangeOrder: false, // 変更不可（権限不足など）
        },
      ])
    : (users.value = [])
}

// オーダー選択ハンドラ
const selectOrder = (orderId: string) => {
  selectedOrderId.value = orderId
  loadUsersForOrder(orderId)
}

// フォーム送信時のオーダー変更処理シミュレーション
const handleOrderChange = async (userId: string, newOrderId: string) => {
  if (!confirm('本当にこのユーザーのオーダーを新しいオーダーに更新しますか？'))
    return

  try {
    // APIコールシミュレーション
    await new Promise((resolve) => setTimeout(resolve, 500)) // ローディング表示のため待機

    $toast.add({
      title: '成功',
      success: true,
      message: `ユーザー \{userId} のオーダーを正常に ${newOrderId} に変更しました。`,
      duration: 3000,
    })
  } catch (error) {
    $toast.add({
      title: 'エラー',
      success: false,
      message:
        'オーダーの更新中にエラーが発生しました。権限を確認してください。',
      duration: 3000,
    })
  }
}

// --- 計算プロパティ ---
const selectedOrder = computed(() => {
  if (!selectedOrderId.value) return null
  return availableOrders.value.find((o) => o.id === selectedOrderId.value)
})

/**
 * ユーザーのサービスリストを折り畳み可能な形式で表示するための計算プロパティ。
 */
const userServices = computed(() => {
  if (users.value.length === 0) return []
  return users.value.map((user) => ({
    ...user,
    // サービスの配列はそのまま利用可能だが、UIでの扱いを考慮して構造化する
  }))
})
</script>

<template>
  <v-container>
    <!-- タイトルと概要 -->
    <v-card class="pa-5 mb-6">
      <v-card-title class="text-h4 mb-2">オーダー管理詳細</v-card-title>
      <v-card-subtitle
        >選択されたオーダーに基づき、ユーザーのオーダー変更を行います。</v-card-subtitle
      >

      <!-- オーダー選択セクション -->
      <v-divider class="my-4"></v-divider>
      <div class="mb-6">
        <h3 class="text-h6 mb-3">1. オーダーの選択</h3>
        <v-select
          v-model="selectedOrderId"
          :items="
            availableOrders.map((o) => ({
              title: `${o.id} (${new Date(o.endDate).toLocaleDateString('ja-JP')})`,
              value: o.id,
            }))
          "
          label="オーダーを選択してください"
          prepend-inner-icon="mdi-calendar"
          variant="outlined"
        ></v-select>
      </div>

      <!-- ユーザー一覧表示セクション -->
      <div v-if="selectedOrder" class="mt-8">
        <h3 class="text-h6 mb-4">
          2. 利用ユーザーの一覧 (合計: {{ users.length }}名)
        </h3>

        <!-- データテーブルの代わりに、より詳細なカード形式で表示 -->
        <v-card
          v-for="(user, index) in users"
          :key="index"
          class="pa-5 border-left-4 mb-6"
          :class="{ 'border-primary': user.canChangeOrder }"
        >
          <div class="d-flex justify-space-between align-center mb-3">
            <h4 class="text-h5">{{ user.name }}</h4>
            <v-chip small color="grey lighten-2">{{ user.email }}</v-chip>
          </div>

          <!-- オーダー情報と変更可否 -->
          <div
            class="d-flex justify-space-between align-items-center mb-4 rounded bg-yellow-50 p-3"
          >
            <div>
              <p class="text-caption text-medium-emphasis">現在のオーダー:</p>
              <p class="font-weight-bold">{{ selectedOrder.id }}</p>
            </div>
            <div v-if="user.canChangeOrder" class="text-right">
              <v-btn
                color="success"
                size="small"
                @click="handleOrderChange(user.userId, 'new-order-id')"
              >
                オーダー変更 (実行)
              </v-btn>
            </div>
            <div v-else class="text-right">
              <v-chip small color="error" variant="outlined">
                権限不足 / 変更不可
              </v-chip>
            </div>
          </div>

          <!-- 利用サービス (折り畳み表示) -->
          <h5 class="mt-4 mb-2">利用サービス</h5>
          <v-expansion-panels variant="accordion" multiple>
            <v-expansion-panel
              v-for="service in user.services"
              :key="service.id"
            >
              <v-card>
                <v-card-title class="d-flex align-center">
                  {{ service.name }}
                  <!-- 管理サービスかどうかをアイコンで表示 -->
                  <v-icon
                    v-if="service.isManagedService"
                    color="primary"
                    class="ml-2"
                    >mdi-check-circle</v-icon
                  >
                </v-card-title>
                <v-card-text>
                  <!-- サービス詳細情報などが入る -->
                  このサービスは、{{
                    service.isManagedService ? '管理サービス' : '利用サービス'
                  }}として紐づいています。
                </v-card-text>
              </v-card>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </div>
    </v-card>
  </v-container>
</template>

<style scoped>
/* スタイル調整 */
.border-left-4 {
  border-left: 4px solid;
}
.border-primary {
  border-color: var(--v-primary-base);
}
</style>
