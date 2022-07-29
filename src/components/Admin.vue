<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import ObsWebSocket from 'obs-websocket-js'
import sHymn from '../services/HymnService'
import { HymnHistory } from '../models/hymn'
import { store } from '../store'

const obs = new ObsWebSocket()
const connected: Ref<boolean> = ref(false)
const local: Ref<boolean> = ref(false)
const hymnNumber: Ref<number | string> = ref('')
const hymnData: Ref<HymnHistory | undefined> = ref(void(0))
const hymnIndex: Ref<number> = ref(0)
const player: Ref<HTMLAudioElement | null> = ref(null)

function connectObs() {
  obs.connect({
    address: 'localhost:4444'
  }).then(() => {
    connected.value = true
    alert('Connected to OBS')
  }).catch(error => {
    alert(`Connection failed: ${error.error}`)
  })
  obs.on('error', (err) => {
    alert(`OBS error: ${err}`)
  })
}

function disconnectObs() {
  obs.disconnect()
  connected.value = false
  alert('Disconnected from OBS')
}

function setLocal() {
  store.local = local.value
}

function searchHymn() {
  if(hymnNumber.value) {
    sHymn.byNumber(+hymnNumber.value).then(hymn => {
      hymnData.value = hymn
      player.value?.load()
      player.value?.play()
      goHome()
    })
  } else {
    alert('Please enter a hymn number')
  }
}

watch(hymnIndex, index => {
  if(index > 0) {
    showVerse(index - 1)
    setCurrentScene('Hymn')
  }
})

function goHome() {
  hymnIndex.value = 0
  showTitle()
  setCurrentScene('Hymn')
}

function showTitle() {
  setSceneItemRender('hymn_number', true)
  setSceneItemRender('hymn_title', true)
  setSceneItemRender('verse_number', false)
  setSceneItemRender('verse_content', false)
  setSourceText('hymn_number', hymnData.value?.hymn.number.toString())
  setSourceText('hymn_title', hymnData.value?.hymn.title)
}

function showVerse(index: number) {
  setSceneItemRender('hymn_number', false)
  setSceneItemRender('hymn_title', false)
  setSceneItemRender('verse_number', true)
  setSceneItemRender('verse_content', true)
  const verseNumber = hymnData.value?.history[index].verse.number
  setSourceText('verse_number', verseNumber === 0 ? 'Coro' : String(verseNumber))
  setSourceText('verse_content', hymnData.value?.history[index].verse.content)
}

function setCurrentScene(sceneName: string) {
  obs.send('SetCurrentScene', {
    "scene-name": sceneName
  }).catch(error => {
    alert(`Failed to set scene: ${error.error}`)
  })
}

function setSceneItemRender(sourceName: string, render: boolean) {
  obs.send('SetSceneItemRender', {
    'scene-name': 'Hymn',
    source: sourceName,
    render: render
  })
}

function setSourceText(sourceName: string, text: string | undefined) {
  obs.send('SetSourceSettings', {
    sourceName: sourceName,
    sourceSettings: {
      text: text
    }
  })
}

function FileUrl(fileName: string) {
  const musicUrl = store.localMusicUrl
  return `${musicUrl}/${encodeURIComponent(fileName)}`
}
</script>

<template>
  <main class="flex flex-col gap-2 px-3 py-2 dark:text-white text-xs">
    <div class="flex items-center">
      <button @click="connected? disconnectObs() : connectObs()" type="button" class="group flex items-center gap-3 px-2 py-1 rounded w-28 hover:bg-neutral-700">
        <div class="rounded-full w-2 h-2" :class="connected? 'bg-green-600' : 'bg-red-600'"></div>
        <span class="group-hover:hidden">{{ connected? 'Connected' : 'Disconnected' }}</span>
        <span class="hidden group-hover:block">{{ connected? 'Disconnect' : 'Connect' }}</span>
      </button>
      <div class="ml-auto flex items-center gap-1">
        <input v-model="local" @change="setLocal()" type="checkbox" id="local">
        <label for="local">local</label>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div class="flex gap-3">
        <input v-model="hymnNumber" type="number" min="1" max="613" class="text-sm w-16 border border-neutral-700 dark:text-black rounded px-2 py-1" name="number" id="number">
        <button @click="searchHymn()" type="button" class="btn w-8 h-8">
          <img class="dark:invert" src="/svg/search.svg" alt="search">
        </button>
      </div>
      <div class="flex items-center gap-3">
        <span>Letra:</span>
        <button @click="goHome()" :disabled="hymnIndex < 1" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/home.svg" alt="search">
        </button>
        <button @click="hymnIndex--" :disabled="hymnIndex < 1" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/previous.svg" alt="search">
        </button>
        <button @click="hymnIndex++" :disabled="hymnData? hymnIndex >= hymnData.history.length : true" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/next.svg" alt="search">
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <p>Música: <span class="text-neutral-400">{{ hymnData?.hymn.title }}</span></p>
      <audio ref="player" controls>
        <source :src="hymnData && store.local? FileUrl(hymnData.hymn.mp3Filename) : hymnData?.hymn.mp3Url" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </div>
  </main>
</template>

<style scoped>
.btn {
  @apply border border-neutral-700 dark:bg-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-600 active:bg-gray-200 dark:active:bg-neutral-500 rounded px-2 py-1 disabled:opacity-50 disabled:pointer-events-none
}
</style>
