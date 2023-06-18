<script setup lang="ts">
import { Ref, ref } from 'vue'
import { store } from '../store'

function setAutodriveVerses(on: boolean) {
  store.autodriveVerses = on
}
</script>

<template>
  <button @click="setAutodriveVerses(!store.autodriveVerses)" type="button" class="group flex items-center gap-3 px-2 py-1 rounded w-28 btn">
    <div class="rounded-full w-2 h-2" :class="store.autodriveVerses? 'bg-green' : 'bg-red'"></div>
    <span class="group-hover:hidden">Autoconducir</span>
    <span class="hidden group-hover:block">{{ store.autodriveVerses? 'Desactivar' : 'Activar' }}</span>
  </button>
</template>