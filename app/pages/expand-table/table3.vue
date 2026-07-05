<script setup>
import { computed } from 'vue'

const groupBy = [{ key: 'category', order: 'asc' }]

const headers = [
  { title: 'カテゴリ', key: 'category' },
  { title: '商品名', key: 'name' },
  { title: '金額', key: 'amount', align: 'end' },
]

const items = [
  { id: 1, category: '食品', name: 'りんご', amount: 300 },
  { id: 2, category: '食品', name: 'パン', amount: 250 },
  { id: 3, category: '日用品', name: '洗剤', amount: 500 },
  { id: 4, category: '日用品', name: 'ティッシュ', amount: 200 },
]

function subtotalByGroup(category) {
  return items
    .filter((i) => i.category === category)
    .reduce((sum, i) => sum + i.amount, 0)
}

const grandTotal = computed(() => items.reduce((sum, i) => sum + i.amount, 0))

function formatCurrency(value) {
  return `¥${value.toLocaleString()}`
}
</script>
<template>
  <v-table>
    <thead>
      <tr>
        <th>項目</th>
        <th class="text-right">金額</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="group in groupedData" :key="group.category">
        <tr v-for="row in group.rows" :key="row.id">
          <td class="pl-6">{{ row.name }}</td>
          <td class="text-right">{{ formatCurrency(row.amount) }}</td>
        </tr>
        <tr class="bg-grey-lighten-4 font-weight-medium">
          <td>{{ group.category }} 小計</td>
          <td class="text-right">{{ formatCurrency(group.subtotal) }}</td>
        </tr>
      </template>
      <tr class="bg-grey-darken-1 font-weight-bold text-white">
        <td>総計</td>
        <td class="text-right">{{ formatCurrency(grandTotal) }}</td>
      </tr>
    </tbody>
  </v-table>
</template>
