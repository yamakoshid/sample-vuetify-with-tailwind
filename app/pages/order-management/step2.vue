<script setup>
/**
 * Step2UserSelect の呼び出し側サンプル
 *
 * 実プロジェクトでは users は API から取得する。
 * サーバー側で「ログイン中の管理者が管理権限を持つサービスのみ」を
 * services に含めてフィルタ済みで返す設計にすること。
 */
// import { fetchOrder, fetchOrderUsers } from '@/api/orders'

const order = ref({
  id: 'ORDER-00231',
  name: 'プランX・月額',
  endDate: '2026-07-31',
})

const users = ref([
  {
    id: 'u1',
    name: '山田 太郎',
    code: 'user_00981',
    ownerService: 'サービスA',
    editable: true,
    services: [
      { name: 'サービスA', role: 'オーナー（本オーダー保有）', owner: true },
      { name: 'サービスB', role: '利用のみ', owner: false },
      // サービスCは管理権限がないため含まれない
    ],
  },
  {
    id: 'u2',
    name: '鈴木 花子',
    code: 'user_01042',
    ownerService: 'サービスC',
    editable: false,
    services: [
      { name: 'サービスA', role: '利用のみ', owner: false },
      // オーナーであるサービスCは管理権限がないため含まれない
    ],
  },
])

onMounted(async () => {
  // order.value = await fetchOrder(orderId)
  // users.value = await fetchOrderUsers(orderId)
})

function handleNext(selectedUserIds) {
  console.log('選択されたユーザーID:', selectedUserIds)
  // router.push({ name: 'Step3', query: { orderId: order.value.id, userIds: selectedUserIds } })
}

function handleCancel() {
  // router.back()
}
</script>

<template>
  <Step2UserSelect
    :order="order"
    :users="users"
    @next="handleNext"
    @cancel="handleCancel"
  />
</template>
