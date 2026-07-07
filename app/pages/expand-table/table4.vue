<script setup>
import FlexRow from '../tailwind/flex-row.vue'

const headers = [
  { title: '', key: 'data-table-group', width: '48px' },
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
      <template
        #group-header="{
          // index,
          item,
          columns,
          // isExpanded,
          // toggleExpand,
          // isSelected,
          // toggleSelect,
          toggleGroup,
          isGroupOpen,
        }"
      >
        <tr v-ripple @click="toggleGroup(item)">
          <!-- group列 -->
          <td>
            <v-btn
              :icon="isGroupOpen(item) ? '$expand' : '$next'"
              color="medium-emphasis"
              density="comfortable"
              size="small"
              variant="outlined"
            ></v-btn>
          </td>

          <!-- 残り -->
          <!-- <td v-for="item in item.items" :key="item.id"></td> -->
          <td>
            <!-- <pre wrap>{{ item }}</pre> -->
            <!-- <pre wrap>{{ columns }}</pre> -->
            <span>{{ item.value }}</span>
          </td>
          <td></td>
          <td>
            {{
              item.items.reduce((sum, item) => {
                return (sum += item.raw.amount)
              }, 0)
            }}
          </td>
        </tr>
      </template>

      <template #group-summary="{ item, columns }">
        <tr class="font-weight-medium">
          <td></td>
          <td>
            <!-- <pre wrap> {{ item }} </pre> -->
            <!-- <pre wrap> {{ columns }} </pre> -->
          </td>
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
