<script setup lang="ts">
import { ref } from 'vue'
import { useObs } from '../composables/obs'
import { defaultValues, store } from '../store'
import BasicDialog from './BasicDialog.vue'
import GearIcon from './icons/GearIcon.vue'

const { connect, disconnect } = useObs()

const dialog = ref<InstanceType<typeof BasicDialog> | null>(null)

async function closeDialog() {
  localStorage.setItem('onlyInstrumental', `${store.onlyInstrumental}`)
  localStorage.setItem('autoplayMusic', `${store.autoplayMusic}`)
  localStorage.setItem('autodriveVerses', `${store.autodriveVerses}`)
  localStorage.setItem(
    'onSearchSwitchToHymnScene',
    `${store.onSearchSwitchToHymnScene}`,
  )
  localStorage.setItem('onSearchHymnScene', `${store.onSearchHymnScene}`)
  localStorage.setItem('onMusicEndSwitchToScene', store.onMusicEndSwitchToScene)
  localStorage.setItem('obsWebsocketUrl', store.obsWebsocketUrl)
  localStorage.setItem('musicHostUrl', store.musicHostUrl)
  localStorage.setItem('hymnalApiUrl', store.hymnalApiUrl)
  await disconnect()
  await connect()
  dialog.value!.close()
}
</script>

<template>
  <button @click="dialog!.open" title="Configuración" type="button" class="btn w-7 h-7 ml-auto">
    <GearIcon />
  </button>
  <BasicDialog ref="dialog" title="Configuración" data-test="settings">
    <div class="text-sm">
      <div class="mb-2">
        <h3 class="font-bold">Al buscar:</h3>
        <div class="flex items-center gap-1">
          <label for="oi">Solo instrumental</label>
          <input v-model="store.onlyInstrumental" type="checkbox" id="oi" class="ml-auto">
        </div>
        <div class="flex items-center gap-1">
          <label for="am">Autoreproducir música</label>
          <input v-model="store.autoplayMusic" type="checkbox" id="am" class="ml-auto">
        </div>
        <div class="flex items-center gap-1">
          <label for="av">Autoconducir versos</label>
          <input v-model="store.autodriveVerses" type="checkbox" id="av" class="ml-auto">
        </div>
        <div class="flex items-center gap-1">
          <label for="sch">Cambiar a escena de himno</label>
          <input v-model="store.onSearchSwitchToHymnScene" type="checkbox" id="sch" class="ml-auto">
        </div>
        <div class="flex flex-col">
          <label for="hs">Escena de himno</label>
          <select v-model="store.onSearchHymnScene" class="input__text" id="hs">
            <option value="">ninguno</option>
            <option class="hidden" :value="store.onSearchHymnScene">{{ store.onSearchHymnScene }}</option>
            <option v-for="(scene, index) in store.sceneList" :key="index" :value="scene.sceneName">{{ scene.sceneName }}</option>
          </select>
        </div>
      </div>
      <div class="mb-2">
        <h3 class="font-bold">Al terminar la música:</h3>
        <div class="flex flex-col">
          <label for="sc">Cambiar a escena</label>
          <select v-model="store.onMusicEndSwitchToScene" class="input__text" id="sc">
            <option value="">ninguno</option>
            <option class="hidden" :value="store.onMusicEndSwitchToScene">{{ store.onMusicEndSwitchToScene }}</option>
            <option v-for="(scene, index) in store.sceneList" :key="index" :value="scene.sceneName">{{ scene.sceneName }}</option>
          </select>
        </div>  
      </div>
      <div class="mb-3">
        <h3 class="font-bold">Red:</h3>
        <div class="flex flex-col">
          <label for="ow">URL de OBS Websocket</label>
          <input v-model="store.obsWebsocketUrl" type="text" class="input__text" id="ow" :placeholder="defaultValues.obsWebsocketUrl">
        </div>
        <div class="flex flex-col">
          <label for="mh">URL de host de música</label>
          <input v-model="store.musicHostUrl" type="text" class="input__text" id="mh" placeholder="default">
        </div>
        <div class="flex flex-col">
          <label for="ha">URL de API de himnario</label>
          <input v-model="store.hymnalApiUrl" type="text" class="input__text" id="ha" :placeholder="defaultValues.hymnalApiUrl">
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <button type="button" class="btn ml-auto" @click="closeDialog">
        Guardar y cerrar
      </button>
    </template>
  </BasicDialog>
</template>
