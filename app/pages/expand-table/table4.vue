<script setup>
const headers = [
  { title: 'カテゴリ', key: 'category' },
  { title: '商品名', key: 'name' },
  { title: '金額', key: 'amount' },
]

const items = [
  { id: 1, category: '食品', name: 'りんご', amount: 300 },
  { id: 2, category: '食品', name: 'パン', amount: 250 },
  { id: 3, category: '日用品', name: '洗剤', amount: 500 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
]
const formatCurrency = (value) => `¥${value.toLocaleString()}`
const category = [{ key: 'category', order: 'asc' }]
</script>
<template>
  <div>
    <v-data-table
      density="compact"
      :headers="headers"
      :items="items"
      :group-by="category"
      show-group-by
      :items-per-page="-1"
      hide-default-footer
    >
      <template #group-summary="{ item, columns }">
        <tr class="font-weight-medium">
          <td></td>
          <td></td>
          <td></td>
          <td>
            {{
              formatCurrency(
                item.items.reduce((sum, i) => sum + i.columns.amount, 0),
              )
            }}
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
