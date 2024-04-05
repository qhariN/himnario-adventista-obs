<script setup lang="ts">
import type { OBSEventTypes } from 'obs-websocket-js'
import { ref, watch } from 'vue'
import { useObs } from '../composables/obs'
import { sceneStatus, store } from '../store'
import BasicDialog from './BasicDialog.vue'

const { on, connected, getSceneItems, createScene, createSource } = useObs()

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)

watch(connected, async (connected) => {
  if (!connected) { return }
  if (sceneStatus.scene && Object.values(sceneStatus.source).every((v) => v)) { return }
  dialog.value?.open()
})

on('SceneListChanged', checkScene)
on('SceneItemCreated', checkSource)
on('SceneItemRemoved', checkSource)

function checkScene({ scenes }: OBSEventTypes['SceneListChanged']) {
  sceneStatus.scene = scenes.some(
    (scene) => scene.sceneName === store.onSearchHymnScene,
  )
}

async function checkSource({
  sceneName,
  sourceName,
}: OBSEventTypes['SceneItemCreated' | 'SceneItemRemoved']) {
  if (sceneName !== store.onSearchHymnScene) { return }
  let source: keyof typeof sceneStatus.source
  if (sourceName === 'verso_contenido') { source = 'versoContenido' }
  else if (sourceName === 'verso_numero') { source = 'versoNumero' }
  else if (sourceName === 'himno_titulo') { source = 'himnoTitulo' }
  else if (sourceName === 'himno_numero') { source = 'himnoNumero' }
  else { return }
  await getSceneItems(store.onSearchHymnScene)
  const sceneItem = store.sourceList.find(
    (source) => source.sourceName === sourceName,
  )
  sceneStatus.source[source] = Boolean(
    sceneItem && sceneItem.inputKind === 'text_gdiplus_v2',
  )
}

async function createSceneAndSources() {
  !sceneStatus.scene && (await createScene())
  !sceneStatus.source.versoContenido && (await createSource('verso_contenido'))
  !sceneStatus.source.versoNumero && (await createSource('verso_numero'))
  !sceneStatus.source.himnoTitulo && (await createSource('himno_titulo'))
  !sceneStatus.source.himnoNumero && (await createSource('himno_numero'))
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
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.himnoNumero? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          himno_numero
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
        </div>
      </div>
      <div class="bg-light-button-bg dark:bg-dark-button-bg w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.himnoTitulo? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          himno_titulo
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
        </div>
      </div>
      <div class="bg-light-button-bg dark:bg-dark-button-bg w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.versoNumero? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          verso_numero
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
        </div>
      </div>
      <div class="bg-light-button-bg dark:bg-dark-button-bg w-full flex items-stretch rounded divide-x divide-light-background dark:divide-dark-background">
        <div class="px-2 py-1 flex items-center">
          <div class="rounded-full w-2 h-2" :class="sceneStatus.source.versoContenido? 'bg-green' : 'bg-red'"></div>
        </div>
        <div class="px-2 py-1 grow flex">
          verso_contenido
          <span class="ms-auto opacity-60">Texto (GDI+)</span>
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
