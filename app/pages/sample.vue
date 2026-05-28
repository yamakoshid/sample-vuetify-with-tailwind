<script setup lang="ts">
import { nextTick, ref } from 'vue'

// 1. 各データに識別用の id を持たせる
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

async function addItem() {
  items.value.push({
    id: Date.now(), // 簡易的なユニークID
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  })

  await nextTick()

  const tableWrapper = document.querySelector('#custom-table .v-table__wrapper')
  if (tableWrapper) {
    tableWrapper.scrollTo({
      top: tableWrapper.scrollHeight,
      behavior: 'smooth',
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
          item-value="id"
          :items="items"
          :items-per-page="-1"
        >
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
