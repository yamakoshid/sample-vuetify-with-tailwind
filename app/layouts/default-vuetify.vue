<template>
  <v-app>
    <v-app-bar absolute app color="primary" flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      My Vuetify Layout
      <v-btn icon="mdi-theme-light-dark" @click="$vuetify.theme.cycle()" />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :temporary="true">
      <v-list nav>
        <v-list-item link prepend-icon="mdi-home-outline">
          Home
        </v-list-item>

        <v-list-item link prepend-icon="mdi-file-document-outline">
          Reports
        </v-list-item>

        <v-list-item link prepend-icon="mdi-cog-outline">
          Settings
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <p>V-Main</p>
      <p>V-Main</p>
      <p>V-Main</p>
      <p>V-Main</p>

    </v-main>

    <v-footer app temporal>
      © 2026 Vuetify Project. All rights reserved.
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const drawer = ref(false)
</script>
