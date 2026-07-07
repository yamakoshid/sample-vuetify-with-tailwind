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
  { id: 5, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 6, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 7, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 8, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 9, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 10, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 11, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 12, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 13, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 14, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 15, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 16, category: '日用品', name: 'ティッシュ', amount: 200 },
  { id: 17, category: '日用品', name: 'ティッシュ', amount: 200 },
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
      :items-per-page="-1"
      show-group-by
      hide-default-footer
    >
      <template #group-header="{ item, columns, toggleGroup, isGroupOpen }">
        <tr>
          <td
            v-ripple
            :colspan="columns.length"
            class="cursor-pointer"
            @click="toggleGroup(item)"
          >
            <div class="d-flex align-center">
              <v-btn
                :icon="isGroupOpen(item) ? '$expand' : '$next'"
                color="medium-emphasis"
                density="comfortable"
                size="small"
                variant="outlined"
              ></v-btn>

              <span class="ms-4">Tool Type: {{ item.value }}</span>
            </div>
          </td>
        </tr>
      </template>

      <template #group-summary="{ item, columns }">
        <tr class="font-weight-medium">
          <td>
            <!-- <pre wrap>{{ columns }}</pre> -->
            <!-- <pre wrap>{{ item }}</pre> -->
          </td>
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
