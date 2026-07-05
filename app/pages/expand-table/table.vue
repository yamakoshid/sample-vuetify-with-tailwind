<script setup>
import { ref } from 'vue'

const opened = ref([])
const openAll = ref(false)

const sortBy = ref([{ key: 'name', order: 'asc' }])
const groupBy = ref([
  { key: 'category', order: 'asc' },
  { key: 'status', order: 'asc' },
])

const groupKey = ({ key, value, parentKey }) =>
  `${parentKey ?? 'root'}/${key}:${value}`

const headers = [
  { key: 'data-table-group', title: 'Category' },
  {
    title: 'Dessert (100g serving)',
    align: 'start',
    key: 'name',
    groupable: false,
  },
  { title: 'Dairy', key: 'dairy', align: 'end' },
]
const desserts = [
  {
    name: 'Frozen Yogurt',
    category: 'Ice cream',
    status: 'Available',
    dairy: 'Yes',
  },
  {
    name: 'Ice cream sandwich',
    category: 'Ice cream',
    status: 'Available',
    dairy: 'Yes',
  },
  {
    name: 'Eclair',
    category: 'Cookie',
    status: 'Out of stock',
    dairy: 'Yes',
  },
  {
    name: 'Cupcake',
    category: 'Pastry',
    status: 'Out of stock',
    dairy: 'Yes',
  },
  {
    name: 'Gingerbread',
    category: 'Cookie',
    status: 'Available',
    dairy: 'No',
  },
  {
    name: 'Jelly bean',
    category: 'Candy',
    status: 'Available',
    dairy: 'No',
  },
  {
    name: 'Lollipop',
    category: 'Candy',
    status: 'Out of stock',
    dairy: 'No',
  },
  {
    name: 'Honeycomb',
    category: 'Toffee',
    status: 'Out of stock',
    dairy: 'No',
  },
  {
    name: 'Donut',
    category: 'Pastry',
    dairy: 'Yes',
    status: 'Available',
  },
  {
    name: 'KitKat',
    category: 'Candy',
    dairy: 'Yes',
    status: 'Available',
  },
]
</script>
<template>
  <div>
    <div class="d-flex ga-4 align-center mb-4 flex-wrap">
      <v-switch
        v-model="openAll"
        label="Open all groups"
        hide-details
      ></v-switch>
      <v-btn
        :disabled="openAll"
        size="small"
        variant="tonal"
        @click="opened = []"
        >Close all</v-btn
      >
    </div>

    <pre class="pa-2 bg-surface-variant text-body-2 mb-4 rounded">
opened: {{ opened }}</pre
    >

    <v-data-table
      v-model:opened="opened"
      :group-by="groupBy"
      :group-key="groupKey"
      :headers="headers"
      :items="desserts"
      :open-all="openAll"
      :sort-by="sortBy"
      item-value="name"
    ></v-data-table>
  </div>
</template>
