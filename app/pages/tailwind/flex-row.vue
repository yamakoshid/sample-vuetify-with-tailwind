<script setup lang="ts">
definePageMeta({
  title: 'flex row',
  // layout: 'raw-layout',
})
</script>
<template>
  <div class="flex size-100 h-full flex-col">
    <div>title</div>
    <div class="items-strech flex h-full grow flex-row gap-4">
      <div
        class="flex h-full min-h-0 flex-col justify-between overflow-scroll border"
      >
        <div class="border border-red-500 p-4">start</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">end</div>
      </div>
      <div class="min-h-0 overflow-y-auto border">
        <div class="border border-red-500 p-4">start</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">end</div>
      </div>
      <div class="min-h-0 border">
        <div class="border border-red-500 p-4">start</div>
        <div class="border border-red-500 p-4">middle</div>
        <div class="border border-red-500 p-4">end</div>
      </div>
    </div>
  </div>
</template>
