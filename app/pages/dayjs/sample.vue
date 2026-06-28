<script setup lang="ts">
import dayjs from 'dayjs'
const { $dayjs } = useNuxtApp()
const date = ref()
const dayjsDate = ref()
date.value = $dayjs('2020-05-05').tz().format()
dayjsDate.value = dayjs('2020-05-05').tz().format()
</script>
<template>
  <div>
    <p>
      {{ date }}
    </p>
    <p>
      {{ dayjsDate }}
    </p>
  </div>
</template>
