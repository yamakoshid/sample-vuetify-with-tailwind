<script setup lang="ts">
const items = ref([
  {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  // ... more items
])
async function addItem() {
  items.value.push({
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  })
  // 2. Vueが画面を更新（データ反映）するのを待つ
  await nextTick()

  // 3. Vuetifyのスクロール領域（.v-table__wrapper）を取得して一番下までスクロール
  const tableWrapper = document.querySelector('#custom-table .v-table__wrapper')
  console.log('tableWrapper', tableWrapper)
  if (tableWrapper) {
    tableWrapper.scrollTo({
      top: tableWrapper.scrollHeight,
      behavior: 'smooth', // スムーズスクロールを指定
    })
  }
}

function removeLastItem() {
  items.value.pop()
}
</script>
<template>
  <div class="flex-col">
    <div class="flex h-[50dvh] flex-col justify-start">
      <div class="flex max-h-full min-h-0 flex-col">
        <v-data-table
          id="custom-table"
          class="max-h-full min-h-0"
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
          :items="items"
          :items-per-page="-1"
        >
          <template #item.action="{ item }">
            <!-- 最終行だけ追加ボタンを表示する -->
            <button
              v-if="item === items[items.length - 1]"
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
<!-- <style scoped>
/* 1. テーブル全体の高さを「中身に合わせる（auto）」にしつつ、最大値を制限する */
.custom-table {
  height: auto !important;
  max-height: 100% !important; /* 親要素の高さ（50dvhなど）を超えないようにする */
  display: flex;
  flex-direction: column;
}

/* 2. 内部のラッパーも連動して縮むようにする */
.custom-table :deep(.v-table__wrapper) {
  height: auto !important;
  max-height: 100% !important;
  flex-grow: 0 !important; /* 勝手に広がろうとするのを阻止 */
}
</style> -->
