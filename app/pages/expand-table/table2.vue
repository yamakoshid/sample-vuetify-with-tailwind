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
  <v-container>
    <v-data-table
      density="confortable"
      :headers="headers"
      :items="items"
      :group-by="groupBy"
      item-value="id"
      class="elevation-1"
    >
      <!-- グループヘッダー行（小計） -->
      <template
        v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }"
      >
        <tr>
          <td :colspan="columns.length">
            <v-btn
              :icon="isGroupOpen(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              size="small"
              variant="text"
              @click="toggleGroup(item)"
            ></v-btn>
            <strong>{{ item.value }}</strong>
            <span class="ml-4">
              小計: {{ formatCurrency(subtotalByGroup(item.value)) }}
            </span>
          </td>
        </tr>
      </template>

      <!-- 明細行 -->
      <template v-slot:item.amount="{ item }">
        {{ formatCurrency(item.amount) }}
      </template>

      <!-- 総計行（フッター） -->
      <template v-slot:body.append>
        <tr class="font-weight-bold bg-grey-lighten-3">
          <td>総計</td>
          <td></td>
          <td class="text-right">{{ formatCurrency(grandTotal) }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>
