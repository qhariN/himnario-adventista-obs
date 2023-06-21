<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'
import { store, defaultValues } from '../store'

const isOpen = ref(false)

function openModal() {
  isOpen.value = true
}

function closeModal() {
  localStorage.setItem('onlyInstrumental', `${store.onlyInstrumental}`)
  localStorage.setItem('autoplayMusic', `${store.autoplayMusic}`)
  localStorage.setItem('autodriveVerses', `${store.autodriveVerses}`)
  localStorage.setItem('splitVerses', `${store.splitVerses}`)
  localStorage.setItem('onSearchSwitchToHymnScene', `${store.onSearchSwitchToHymnScene}`)
  localStorage.setItem('onSearchHymnScene', `${store.onSearchHymnScene}`)
  localStorage.setItem('onMusicEndSwitchToScene', store.onMusicEndSwitchToScene)
  localStorage.setItem('obsWebsocketUrl', store.obsWebsocketUrl)
  localStorage.setItem('musicHostUrl', store.musicHostUrl)
  localStorage.setItem('hymnalApiUrl', store.hymnalApiUrl)
  isOpen.value = false
}
</script>

<template>
  <button @click="openModal" title="Configuración" type="button" class="btn w-7 h-7 ml-auto">
    <img class="dark:invert" src="/svg/gear.svg" alt="gear">
  </button>
  <Dialog :open="isOpen" @close="closeModal" class="relative z-10">
    <div class="fixed inset-0 bg-black bg-opacity-50"></div>
    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center">
        <DialogPanel class="w-full max-w-[270px] overflow-hidden rounded-lg bg-light-background dark:bg-dark-background p-4 align-middle">
          <DialogTitle as="h2" class="font-bold text-center leading-none">
            Configuración
          </DialogTitle>
          <DialogDescription class="text-sm my-3">
            <div class="mb-2">
              <h3 class="font-bold">Al buscar:</h3>
              <div class="flex items-center gap-1">
                <label for="oi">Solo instrumental</label>
                <input v-model="store.onlyInstrumental" type="checkbox" id="oi" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="am">Autorreproducir música</label>
                <input v-model="store.autoplayMusic" type="checkbox" id="am" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="av">Autoconducir versos</label>
                <input v-model="store.autodriveVerses" type="checkbox" id="av" class="ml-auto">
              </div>
              <!-- <div class="flex items-center gap-1">
                <label for="sv">Split verses (for long verses)</label>
                <input v-model="store.splitVerses" type="checkbox" id="sv" class="ml-auto">
              </div> -->
              <div class="flex items-center gap-1">
                <label for="sch">Cambiar a escena de himno</label>
                <input v-model="store.onSearchSwitchToHymnScene" type="checkbox" id="sch" class="ml-auto">
              </div>
              <div class="flex flex-col">
                <label for="hs">Escena de himno</label>
                <select v-model="store.onSearchHymnScene" class="input__text !px-1" id="hs">
                  <option value="">ninguno</option>
                  <option class="hidden" :value="store.onSearchHymnScene">{{ store.onSearchHymnScene }}</option>
                  <option v-for="scene in store.sceneList" :value="scene.sceneName">{{ scene.sceneName }}</option>
                </select>
              </div>
            </div>
            <div class="mb-2">
              <h3 class="font-bold">Al terminar la música:</h3>
              <div class="flex flex-col">
                <label for="sc">Cambiar a escena</label>
                <select v-model="store.onMusicEndSwitchToScene" class="input__text !px-1" id="sc">
                  <option value="">ninguno</option>
                  <option class="hidden" :value="store.onMusicEndSwitchToScene">{{ store.onMusicEndSwitchToScene }}</option>
                  <option v-for="scene in store.sceneList" :value="scene.sceneName">{{ scene.sceneName }}</option>
                </select>
              </div>  
            </div>
            <div class="mb-2">
              <h3 class="font-bold">Red:</h3>
              <div class="flex flex-col">
                <label for="ow">Personalizar URL de OBS Websocket</label>
                <input v-model="store.obsWebsocketUrl" type="text" class="input__text" id="ow" :placeholder="defaultValues.obsWebsocketUrl">
              </div>  
              <div class="flex flex-col">
                <label for="mh">Personalizar URL de host de música</label>
                <input v-model="store.musicHostUrl" type="text" class="input__text" id="mh" placeholder="default">
              </div>  
              <div class="flex flex-col">
                <label for="ha">Personalizar URL de API de himnario</label>
                <input v-model="store.hymnalApiUrl" type="text" class="input__text" id="ha" :placeholder="defaultValues.hymnalApiUrl">
              </div>  
            </div>
          </DialogDescription>
          <div class="mt-4 flex">
            <button type="button" class="btn ml-auto" @click="closeModal">
              Guardar y cerrar
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>