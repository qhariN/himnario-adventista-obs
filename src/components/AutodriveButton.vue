<script setup lang="ts">
import { Ref, ref } from 'vue'
import { store } from '../store'

function setAutodriveVerses(on: boolean) {
  store.autodriveVerses = on
}
</script>

<template>
  <button @click="setAutodriveVerses(!store.autodriveVerses)" :title="store.autodriveVerses? 'Desactivar' : 'Activar'" type="button" class="flex items-center gap-3 px-2 py-1 rounded w-28 btn">
    <div class="rounded-full w-2 h-2" :class="store.autodriveVerses? 'bg-green' : 'bg-red'"></div>
    Autoconducir
  </button>
</template>