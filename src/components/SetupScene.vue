<script setup lang="ts">
import { ref, watch } from 'vue'
import BasicDialog from './BasicDialog.vue'
import { sceneStatus, store } from '@/store'
import { connected, useObs } from '@/composables/obs'

const { createScene, createSource } = useObs()

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)

watch(connected, async connected => {
  if (!connected) return
  if (sceneStatus.scene && Object.values(sceneStatus.source).every(v => v)) return
  dialog.value!.open()
})

async function createSceneAndSources() {
  !sceneStatus.scene && await createScene()
  !sceneStatus.source.verso_contenido && await createSource('verso_contenido')
  !sceneStatus.source.verso_numero && await createSource('verso_numero')
  !sceneStatus.source.himno_titulo && await createSource('himno_titulo')
  !sceneStatus.source.himno_numero && await createSource('himno_numero')
}
</script>

<template>
  <BasicDialog ref="dialog" title="" data-test="settings">
    <template v-slot:header>
      <div class="flex items-center gap-2">
        <div class="rounded-full w-2 h-2" :class="sceneStatus.scene? 'bg-green' : 'bg-red'"></div>
        {{ store.onSearchHymnScene }}
      </div>
    </template>
    <div class="space-y-1">
      <div class="bg-light-button-bg dark:bg-dark-button-bg w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.himno_numero? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow text-start">
          himno_numero
        </div>
      </div>
      <div class="bg-light-button-bg dark:bg-dark-button-bg w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.himno_titulo? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow text-start">
          himno_titulo
        </div>
      </div>
      <div class="bg-light-button-bg dark:bg-dark-button-bg w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.verso_numero? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow text-start">
          verso_numero
        </div>
      </div>
      <div class="bg-light-button-bg dark:bg-dark-button-bg w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.verso_contenido? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow text-start">
          verso_contenido
        </div>
      </div>
      <p v-if="!sceneStatus.scene || Object.values(sceneStatus.source).some(v => !v)" class="pt-1 pb-2">⚠️ Se encontraron recursos faltantes</p>
      <p v-else class="pt-1">✅ Todos los recursos están listos</p>
    </div>
    <template v-slot:footer>
      <button v-if="!sceneStatus.scene || Object.values(sceneStatus.source).some(v => !v)" type="button" class="btn ml-auto" @click="createSceneAndSources()">
        Crear recursos
      </button>
    </template>
  </BasicDialog>
</template>
