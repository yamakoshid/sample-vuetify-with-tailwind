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
    <div class="flex h-[33dvh] flex-col justify-start">
      <v-data-table
        id="custom-table"
        ref="tableRef"
        density="compact"
        :fixed-header="true"
        :headers="[
          { title: 'Name', value: 'name' },
          { title: 'Species', value: 'species' },
          { title: 'Diet', value: 'diet' },
          { title: 'Habitat', value: 'habitat' },
          { title: '', value: 'action', width: '100px' },
        ]"
        :height="'300px'"
        :hide-default-footer="true"
        item-value="id"
        :items="items"
        :items-per-page="-1"
      >
      </v-data-table>

      <button
        class="rounded border-2 border-dashed border-blue-500 bg-white p-2 font-bold text-blue-500 hover:bg-blue-200 hover:text-blue-950 active:bg-blue-400"
        @click="addItem"
      >
        add Item
      </button>
      <button
        class="align-self-end rounded border-2 border-solid border-black bg-red-500 p-2 text-white hover:bg-red-600 hover:text-gray-200"
        @click="removeLastItem"
      >
        remove Item
      </button>
    </div>
    <div class="flex flex-col">
      <button>末端</button>
    </div>

    <div></div>
  </div>
</template>
