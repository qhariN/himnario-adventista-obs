<script setup lang="ts">
import { onMounted, Ref, ref, toRaw, watch } from 'vue'
import ObsWebSocket from 'obs-websocket-js'
import sHymn from '../services/HymnService'
import { HymnHistory } from '../models/hymn'
import { defaultValues, store } from '../store'
import Settings from './Settings.vue'
import About from './About.vue'

const obs = new ObsWebSocket()
const connected: Ref<boolean> = ref(false)
const hymnNumber: Ref<number | string> = ref('')
const hymnData: Ref<HymnHistory | undefined> = ref(void(0))
const hymnIndex: Ref<number> = ref(0)
const player: Ref<HTMLAudioElement | null> = ref(null)

onMounted(() => {
  player.value!.addEventListener('ended', handleMusicEnd)
  player.value!.ontimeupdate = handleMusicTimestamp
})

watch(hymnIndex, index => {
  if (index > 0) {
    showVerse(index - 1)
    setCurrentScene(store.onSearchHymnScene)
  }
})

function connectObs() {
  const url = `ws://${store.obsWebsocketUrl || defaultValues.obsWebsocketUrl}`
  obs.connect(url).then(() => {
    connected.value = true
    obs.call('GetSceneList').then(data => {
      const { scenes } = data
      store.sceneList = scenes
    })
    obs.call('GetSceneItemList', {
      sceneName: store.onSearchHymnScene
    }).then(data => {
      const { sceneItems } = data
      store.sourceList = sceneItems
    }).catch(error => {
      alert('Failed to get scene items')
    })
  }).catch(error => {
    alert(`Connection failed: ${error.error}`)
  })
}

function disconnectObs() {
  obs.disconnect()
  connected.value = false
}

function searchHymn() {
  if (!hymnNumber.value) {
    alert('Please enter a hymn number')
    return
  }
  sHymn.byNumber(+hymnNumber.value).then(hymn => {
    hymnData.value = hymn
    hymnIndex.value = 0
    player.value!.load()
    if (connected.value && store.onSearchSwitchToHymnScene && store.onSearchHymnScene) goTitle()
    if (store.autoplayMusic) player.value!.play()
  }).catch(err => {
    alert(err)
  })
}

function handleMusicTimestamp() {
  if (!connected.value || !store.autodriveVerses) return
  const currentTime = player.value!.currentTime
  const nextVerse = toRaw(
    hymnData.value!.history.filter(v => v.timestamp && (v.timestamp - 0.5) < currentTime).reverse()[0]
  )
  if (nextVerse && nextVerse.position !== hymnIndex.value) {
    hymnIndex.value = nextVerse.position
  }
}

function handleMusicEnd() {
  if (!connected.value) return
  if (store.onMusicEndSwitchToScene) setCurrentScene(store.onMusicEndSwitchToScene)
}

function goTitle() {
  hymnIndex.value = 0
  showTitle()
  setCurrentScene(store.onSearchHymnScene)
}

function showTitle() {
  setSourceVisibility('hymn_number', true)
  setSourceVisibility('hymn_title', true)
  setSourceVisibility('verse_number', false)
  setSourceVisibility('verse_content', false)
  setSourceText('hymn_number', hymnData.value?.hymn.number.toString())
  setSourceText('hymn_title', hymnData.value?.hymn.title)
}

function showVerse(index: number) {
  setSourceVisibility('hymn_number', false)
  setSourceVisibility('hymn_title', false)
  setSourceVisibility('verse_number', true)
  setSourceVisibility('verse_content', true)
  const verseNumber = hymnData.value?.history[index].verse.number
  setSourceText('verse_number', verseNumber === 0 ? 'Coro' : String(verseNumber))
  setSourceText('verse_content', hymnData.value?.history[index].verse.content)
}

function setCurrentScene(sceneName: string) {
  obs
    .call('SetCurrentProgramScene', { sceneName })
    .catch(error => {
      alert(`Failed to set scene: ${error.error}`)
    })
}

function setSourceVisibility(sourceName: string, visible: boolean) {
  obs
    .call('SetSceneItemEnabled', {
      sceneName: store.onSearchHymnScene,
      sceneItemId: store.sourceList.find(s => s.sourceName === sourceName).sceneItemId,
      sceneItemEnabled: visible
    }).catch(error => {
      alert(`Failed to render scene item: ${error.error}`)
    })
}

function setSourceText(sourceName: string, text: string | undefined) {
  obs.call('SetInputSettings', {
    inputName: sourceName,
    inputSettings: {
      text: text
    }
  })
}

function fileUrl() {
  const hymnUrl = store.onlyInstrumental
    ? hymnData.value!.hymn.mp3UrlInstr
    : hymnData.value!.hymn.mp3Url
  const hostUrl = `${store.musicHostUrl}/${store.onlyInstrumental? 'instrumental' : 'cantado'}/${encodeURIComponent(hymnData.value!.hymn.mp3Filename)}`
  return store.musicHostUrl? hostUrl : hymnUrl
}
</script>

<template>
  <main class="flex flex-col gap-2 px-3 py-2 text-xs">
    <div class="flex items-center">
      <button @click="connected? disconnectObs() : connectObs()" type="button" class="group flex items-center gap-3 px-2 py-1 rounded w-28 btn">
        <div class="rounded-full w-2 h-2" :class="connected? 'bg-green' : 'bg-red'"></div>
        <span class="group-hover:hidden">{{ connected? 'Connected' : 'Disconnected' }}</span>
        <span class="hidden group-hover:block">{{ connected? 'Disconnect' : 'Connect' }}</span>
      </button>
      <div class="ml-auto space-x-2">
        <Settings></Settings>
        <About></About>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <form class="flex gap-2" onsubmit="return false">
        <input v-model="hymnNumber" type="number" min="1" max="613" class="input__text w-16" name="number" id="number">
        <button @click="searchHymn()" title="Search" type="submit" class="btn w-8 h-8">
          <img class="dark:invert" src="/svg/search.svg" alt="search">
        </button>
      </form>
      <div class="flex items-center gap-2">
        <span>Verse:</span>
        <button @click="goTitle()" title="Beginning" :disabled="!connected || !store.onSearchHymnScene || hymnIndex < 1" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/home.svg" alt="search">
        </button>
        <button @click="hymnIndex--" title="Previous verse" :disabled="!connected || !store.onSearchHymnScene || hymnIndex < 2" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/previous.svg" alt="search">
        </button>
        <button @click="hymnIndex++" title="Next verse" :disabled="!connected || !store.onSearchHymnScene || (hymnData? hymnIndex >= hymnData.history.length : true)" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/next.svg" alt="search">
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <p>Playing: <span class="text-muted">{{ hymnData?.hymn.title }}</span></p>
      <audio ref="player" controls>
        <source :src="hymnData && fileUrl()" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </div>
  </main>
</template>
