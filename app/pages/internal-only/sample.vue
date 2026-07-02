<script setup lang="ts">
definePageMeta({
  middleware: ['only-internal-access'],
})
</script>
<template>
  <div>
    <h1>Internal Only Page</h1>
    <p>This page is only accessible internally.</p>
  </div>
</template>
