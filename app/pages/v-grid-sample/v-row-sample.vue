<template>
  <v-card class="border border-gray-500" variant="outlined">
    <v-card-title>v-row Density Examples</v-card-title>
    <v-card-text>
      <p>v-rowのdensityプロパティを使用して、行の密度を変更する例です。</p>
      <p>デフォルト、comfortable、compactの3つのオプションがあります。</p>
    </v-card-text>
  </v-card>

  <div class="text-2xl font-bold">default</div>
  <v-row density="default">
    <v-col class="bg-blue-100" cols="1"> 1 </v-col>
    <v-col class="bg-blue-200" cols="1"> 2 </v-col>
    <v-col class="bg-blue-300" cols="1"> 3 </v-col>
    <v-col class="bg-blue-400" cols="1"> 4 </v-col>
    <v-col class="bg-blue-500" cols="1"> 5 </v-col>
    <v-col class="bg-blue-600" cols="1"> 6 </v-col>
    <v-col class="bg-blue-700" cols="1"> 7 </v-col>
    <v-col class="bg-blue-800" cols="1"> 8 </v-col>
    <v-col class="bg-blue-900" cols="1"> 9 </v-col>
    <v-col class="bg-blue-100" cols="1"> 10 </v-col>
    <v-col class="bg-blue-200" cols="1"> 11 </v-col>
    <v-col class="bg-blue-300" cols="1"> 12 </v-col>
  </v-row>

  <div class="text-2xl font-bold">comfortable</div>
  <v-row density="comfortable">
    <v-col class="bg-blue-100" cols="1"> 1 </v-col>
    <v-col class="bg-blue-200" cols="1"> 2 </v-col>
    <v-col class="bg-blue-300" cols="1"> 3 </v-col>
    <v-col class="bg-blue-400" cols="1"> 4 </v-col>
    <v-col class="bg-blue-500" cols="1"> 5 </v-col>
    <v-col class="bg-blue-600" cols="1"> 6 </v-col>
    <v-col class="bg-blue-700" cols="1"> 7 </v-col>
    <v-col class="bg-blue-800" cols="1"> 8 </v-col>
    <v-col class="bg-blue-900" cols="1"> 9 </v-col>
    <v-col class="bg-blue-100" cols="1"> 10 </v-col>
    <v-col class="bg-blue-200" cols="1"> 11 </v-col>
    <v-col class="bg-blue-300" cols="1"> 12 </v-col>
  </v-row>

  <div class="text-2xl font-bold">compact</div>
  <v-row density="compact">
    <v-col class="bg-blue-100" cols="1"> 1 </v-col>
    <v-col class="bg-blue-200" cols="1"> 2 </v-col>
    <v-col class="bg-blue-300" cols="1"> 3 </v-col>
    <v-col class="bg-blue-400" cols="1"> 4 </v-col>
    <v-col class="bg-blue-500" cols="1"> 5 </v-col>
    <v-col class="bg-blue-600" cols="1"> 6 </v-col>
    <v-col class="bg-blue-700" cols="1"> 7 </v-col>
    <v-col class="bg-blue-800" cols="1"> 8 </v-col>
    <v-col class="bg-blue-900" cols="1"> 9 </v-col>
    <v-col class="bg-blue-100" cols="1"> 10 </v-col>
    <v-col class="bg-blue-200" cols="1"> 11 </v-col>
    <v-col class="bg-blue-300" cols="1"> 12 </v-col>
  </v-row>
</template>
