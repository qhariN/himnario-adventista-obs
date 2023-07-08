<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BasicDialog from './BasicDialog.vue'
import sHymn from '../services/HymnService'
import ListIcon from './icons/ListIcon.vue'
import { HymnList } from '../models/hymn'
import PlayIcon from './icons/PlayIcon.vue'

const emit = defineEmits(['onPlayHymn'])

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)
const hymns = ref<HymnList[]>([])

onMounted(() => {
  list()
})

async function list() {
  hymns.value = await sHymn.all()
}

function searchHymn(hymnNumber: number) {
  emit('onPlayHymn', hymnNumber)
  dialog.value!.close()
}
</script>

<template>
  <button @click="dialog!.open" title="Lista de himnos" type="button" class="btn w-8 h-8">
    <ListIcon />
  </button>
  <BasicDialog ref="dialog" title="Himnario">
    <div class="text-sm my-4 space-y-1">
      <button @click="searchHymn(hymn.number)" v-for="hymn in hymns" :key="hymn.id" type="button" class="bg-light-button-bg dark:bg-dark-button-bg hover:bg-light-button-hover dark:hover:bg-dark-button-hover w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
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
    <template v-slot:footer>
      <button type="button" class="btn ml-auto" @click="dialog!.close">
        Cerrar
      </button>
    </template>
  </BasicDialog>
</template>
