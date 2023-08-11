<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BasicDialog from './BasicDialog.vue'
import sHymn from '../services/HymnService'
import ListIcon from './icons/ListIcon.vue'
import type { HymnList } from '../models/hymn'
import PlayIcon from './icons/PlayIcon.vue'

const emit = defineEmits(['onPlayHymn'])

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)
const hymns = ref<HymnList[]>([])
const filteredHymns = ref<HymnList[]>([])
const search = ref('')

onMounted(() => {
  list()
})

async function list() {
  const data = await sHymn.all()
  hymns.value = filteredHymns.value = data
}

function searchHymn(hymnNumber: number) {
  emit('onPlayHymn', hymnNumber)
  dialog.value!.close()
}

function filterHymns() {
  if (search.value.length > 0) {
    filteredHymns.value = hymns.value.filter(hymn => (
      hymn.number.toString().includes(search.value) ||
      hymn.title.toLowerCase().includes(search.value.toLowerCase())
    ))
  } else {
    filteredHymns.value = hymns.value
  }
}
</script>

<template>
  <button @click="dialog!.open" title="Lista de himnos" type="button" class="btn w-8 h-8">
    <ListIcon />
  </button>
  <BasicDialog ref="dialog" title="Himnario" class="h-full">
    <div class="space-y-1">
      <div class="flex flex-col mb-3">
        <label for="search">Buscar himno</label>
        <input v-model="search" @input="filterHymns" type="search" class="input__text" id="search">
      </div>
      <button @click="searchHymn(hymn.number)" v-for="hymn in filteredHymns" :key="hymn.id" type="button" class="bg-light-button-bg dark:bg-dark-button-bg hover:bg-light-button-hover dark:hover:bg-dark-button-hover w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1">
          {{ String(hymn.number).padStart(3, '0') }}
        </div>
        <div class="px-2 py-1 grow text-start">
          {{ hymn.title }}
        </div>
        <div class="px-2 w-7 self-stretch flex-shrink-0 flex items-center">
          <PlayIcon />
        </div>
      </button>
    </div>
  </BasicDialog>
</template>
