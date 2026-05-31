<template>
  <ul
    class="mt-2 space-y-2 border-l border-slate-200 pl-4 dark:border-slate-700"
  >
    <li v-for="node in nodes" :key="node.path" class="list-none">
      <div class="flex items-center space-x-2 text-sm">
        <template v-if="node.isPage">
          <span class="text-slate-400">📄</span>
          <NuxtLink
            class="font-medium text-blue-600 transition-colors hover:underline dark:text-blue-400"
            :to="node.path"
          >
            {{ node.label }}
          </NuxtLink>
        </template>

        <template v-else>
          <span class="text-amber-500">📁</span>
          <span class="font-semibold text-slate-700 dark:text-slate-300">
            {{ node.label }}
          </span>
        </template>
      </div>

      <RouteTree
        v-if="node.children && node.children.length > 0"
        :nodes="node.children"
      />
    </li>
  </ul>
</template>

<script setup>
defineProps({
  nodes: {
    type: Array,
    required: true,
  },
})
</script>
