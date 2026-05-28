<script setup lang="ts">
import { nextTick, ref } from 'vue'

const items = ref([
  {
    id: 1,
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  {
    id: 2,
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
])

const tableRef = useTemplateRef('tableRef')

// スクロール処理を共通化
async function scrollToBottom() {
  await nextTick()
  // const tableWrapper = document.querySelector('#custom-table .v-table__wrapper')
  const tableWrapper = tableRef.value?.$el
    .firstElementChild as HTMLElement | null
  if (tableWrapper) {
    tableWrapper.scrollTo({
      top: tableWrapper.scrollHeight,
      behavior: 'smooth',
    })
  }
}

async function addItem() {
  items.value.push({
    id: Date.now(),
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  })
  // 追加後にスクロール
  await scrollToBottom()
}

async function removeLastItem() {
  items.value.pop()
  // 💡 削除後も同じようにスクロール（最下部へ追従）
  await scrollToBottom()
}
</script>

<template>
  <div class="flex-col">
    <div class="flex h-[50dvh] flex-col justify-start">
      <div class="flex max-h-full min-h-0 flex-col">
        <v-data-table
          id="custom-table"
          ref="tableRef"
          class="custom-scrollbar-table max-h-full min-h-0"
          density="compact"
          :fixed-header="true"
          :headers="[
            { title: 'Name', value: 'name' },
            { title: 'Species', value: 'species' },
            { title: 'Diet', value: 'diet' },
            { title: 'Habitat', value: 'habitat' },
            { title: '', value: 'action', width: '100px' },
          ]"
          :hide-default-footer="true"
          item-value="id"
          :items="items"
          :items-per-page="-1"
        >
          <template #item.action="{ item, index }">
            <button
              v-if="index === items.length - 1"
              class="rounded border-2 border-dashed border-blue-500 bg-white p-2 font-bold text-blue-500 hover:active:bg-blue-200 hover:active:text-gray-600"
              @click="addItem"
            >
              add Item
            </button>
          </template>
        </v-data-table>

        <button
          class="mb-2 rounded border-2 border-dashed border-blue-500 bg-white p-2 font-bold text-blue-500 hover:bg-blue-200 hover:text-gray-600 active:bg-blue-400"
          @click="addItem"
        >
          add Item
        </button>
        <button
          class="rounded bg-red-500 p-2 text-white hover:bg-red-600 hover:text-gray-200"
          @click="removeLastItem"
        >
          remove Item
        </button>
      </div>
    </div>

    <div class="flex flex-col">
      <button>末端</button>
    </div>
  </div>
</template>
<style scoped>
/* 1. テーブルのインナースクロール領域を確実に捕捉してスクロールバーを強制 */
.custom-scrollbar-table :deep(.v-table__wrapper) {
  overflow-y: scroll !important;
  display: block !important;
}

/* 2. 【重要】ブラウザによっては中身（テーブル本体）の高さが足りないとバーが薄くなるのを防ぐ */
.custom-scrollbar-table :deep(.v-table__wrapper table) {
  min-height: calc(100% + 1px) !important;
}

/* 3. （オプション）スクロールバーのデザインを常に表示されるように固定（Mac/Windows両対応） */
.custom-scrollbar-table :deep(.v-table__wrapper)::-webkit-scrollbar {
  width: 8px;
  background: #f1f1f1;
}
.custom-scrollbar-table :deep(.v-table__wrapper)::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
.custom-scrollbar-table
  :deep(.v-table__wrapper)::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
