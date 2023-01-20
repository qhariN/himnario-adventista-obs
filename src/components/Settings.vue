<script setup lang="ts">
import { Ref, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'
import { store, defaultValues } from '../store'

const isOpen = ref(false)
const onlyInstrumental: Ref<boolean> = ref(store.onlyInstrumental)
const autoplayMusic: Ref<boolean> = ref(store.autoplayMusic)
const autodriveVerses: Ref<boolean> = ref(store.autodriveVerses)
const splitVerses: Ref<boolean> = ref(store.splitVerses)
const onSearchSwitchToHymnScene: Ref<boolean> = ref(store.onSearchSwitchToHymnScene)
const onSearchHymnScene: Ref<string> = ref(store.onSearchHymnScene)
const onMusicEndSwitchToScene: Ref<string> = ref(store.onMusicEndSwitchToScene)
const obsWebsocketUrl: Ref<string> = ref(store.obsWebsocketUrl)
const musicHostUrl: Ref<string> = ref(store.musicHostUrl)
const hymnalApiUrl: Ref<string> = ref(store.hymnalApiUrl)

function openModal() {
  isOpen.value = true
}
function closeModal() {
  localStorage.setItem('onlyInstrumental', `${onlyInstrumental.value}`)
  localStorage.setItem('autoplayMusic', `${autoplayMusic.value}`)
  localStorage.setItem('autodriveVerses', `${autodriveVerses.value}`)
  localStorage.setItem('splitVerses', `${splitVerses.value}`)
  localStorage.setItem('onSearchSwitchToHymnScene', `${onSearchSwitchToHymnScene.value}`)
  localStorage.setItem('onSearchHymnScene', `${onSearchHymnScene.value}`)
  localStorage.setItem('onMusicEndSwitchToScene', onMusicEndSwitchToScene.value)
  localStorage.setItem('obsWebsocketUrl', obsWebsocketUrl.value)
  localStorage.setItem('musicHostUrl', musicHostUrl.value)
  localStorage.setItem('hymnalApiUrl', hymnalApiUrl.value)
  isOpen.value = false
}

function setOnlyInstrumental() {
  store.onlyInstrumental = onlyInstrumental.value
}
function setAutoplayMusic() {
  store.autoplayMusic = autoplayMusic.value
}
function setAutodriveVerses() {
  store.autodriveVerses = autodriveVerses.value
}
function setSplitVerses() {
  store.splitVerses = splitVerses.value
}
function setOnSearchSwitchToHymnScene() {
  store.onSearchSwitchToHymnScene = onSearchSwitchToHymnScene.value
}
function setOnSearchHymnScene() {
  store.onSearchHymnScene = onSearchHymnScene.value
}
function setOnMusicEndSwitchToScene() {
  store.onMusicEndSwitchToScene = onMusicEndSwitchToScene.value
}
function setObsWebsocketUrl() {
  store.obsWebsocketUrl = obsWebsocketUrl.value
}
function setMusicHostUrl() {
  store.musicHostUrl = musicHostUrl.value
}
function setHymnalApiUrl() {
  store.hymnalApiUrl = hymnalApiUrl.value
}
</script>

<template>
  <button @click="openModal" title="Settings" type="button" class="btn w-7 h-7 ml-auto">
    <img class="dark:invert" src="/svg/gear.svg" alt="gear">
  </button>
  <Dialog :open="isOpen" @close="closeModal" class="relative z-10">
    <div class="fixed inset-0 bg-black bg-opacity-50" />
    <div class="fixed inset-0 overflow-y-auto p-4">
      <div class="flex min-h-full items-center justify-center">
        <DialogPanel class="w-full max-w-[240px] overflow-hidden rounded-lg bg-light-background dark:bg-dark-background p-4 align-middle">
          <DialogTitle as="h2" class="font-bold text-center leading-none">
            Settings
          </DialogTitle>
          <DialogDescription class="text-sm my-3">
            <div class="mb-2">
              <h3 class="font-bold">On search:</h3>
              <div class="flex items-center gap-1">
                <label for="ol">Only instrumental</label>
                <input v-model="onlyInstrumental" @change="setOnlyInstrumental()" type="checkbox" id="ol" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="am">Autoplay music</label>
                <input v-model="autoplayMusic" @change="setAutoplayMusic()" type="checkbox" id="am" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="av">Autodrive verses</label>
                <input v-model="autodriveVerses" @change="setAutodriveVerses()" type="checkbox" id="av" class="ml-auto">
              </div>
              <div class="flex items-center gap-1 hidden">
                <label for="sv">Split verses (for long verses)</label>
                <input v-model="splitVerses" @change="setSplitVerses()" type="checkbox" id="sv" class="ml-auto">
              </div>
              <div class="flex items-center gap-1">
                <label for="shs">Switch to hymn scene</label>
                <input v-model="onSearchSwitchToHymnScene" @change="setOnSearchSwitchToHymnScene()" type="checkbox" id="shs" class="ml-auto">
              </div>
              <div class="flex flex-col">
                <label for="hs">Hymn scene</label>
                <select v-model="onSearchHymnScene" @change="setOnSearchHymnScene()" class="input__text !px-1" id="hs">
                  <option value="">none</option>
                  <option class="hidden" :value="onSearchHymnScene">{{ onSearchHymnScene }}</option>
                  <option v-for="scene in store.sceneList" :value="scene.sceneName">{{ scene.sceneName }}</option>
                </select>
              </div>
            </div>
            <div class="mb-2">
              <h3 class="font-bold">On music end:</h3>
              <div class="flex flex-col">
                <label for="mess">Switch to scene</label>
                <select v-model="onMusicEndSwitchToScene" @change="setOnMusicEndSwitchToScene()" class="input__text !px-1" id="mess">
                  <option value="">none</option>
                  <option class="hidden" :value="onMusicEndSwitchToScene">{{ onMusicEndSwitchToScene }}</option>
                  <option v-for="scene in store.sceneList" :value="scene.sceneName">{{ scene.sceneName }}</option>
                </select>
              </div>  
            </div>
            <div class="mb-2">
              <h3 class="font-bold">Network:</h3>
              <div class="flex flex-col">
                <label for="ow">Custom OBS websocket</label>
                <input v-model="obsWebsocketUrl" @change="setObsWebsocketUrl()" type="text" class="input__text" id="ow" :placeholder="defaultValues.obsWebsocketUrl">
              </div>  
              <div class="flex flex-col">
                <label for="mh">Custom music host</label>
                <input v-model="musicHostUrl" @change="setMusicHostUrl()" type="text" class="input__text" id="mh" placeholder="default">
              </div>  
              <div class="flex flex-col">
                <label for="ha">Custom hymnal API</label>
                <input v-model="hymnalApiUrl" @change="setHymnalApiUrl()" type="text" class="input__text" id="ha" :placeholder="defaultValues.hymnalApiUrl">
              </div>  
            </div>
          </DialogDescription>
          <div class="mt-4 flex">
            <button type="button" class="btn ml-auto" @click="closeModal">
              Save and close
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
</template>