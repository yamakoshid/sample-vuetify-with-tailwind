<template>
  <v-app>
    <v-container>
      <v-data-table density="compact" :items="items"></v-data-table>
    </v-container>
  </v-app>
</template>
<script setup>
const items = [
  {
    name: 'African Elephant',
    species: 'Loxodonta africana',
    diet: 'Herbivore',
    habitat: 'Savanna, Forests',
  },
  // ... more items
]
</script>
