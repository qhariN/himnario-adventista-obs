<script setup lang="ts">
import { onMounted, Ref, ref, toRaw, watch } from 'vue'
import ObsWebSocket from 'obs-websocket-js'
import sHymn from '../services/HymnService'
import { HymnHistory } from '../models/hymn'
import { defaultValues, store } from '../store'
import Settings from './Settings.vue'
import About from './About.vue'
import AutodriveButton from './AutodriveButton.vue'

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

watch(hymnIndex, async index => {
  if (index > 0) {
    await showVerse(index - 1)
    await setCurrentScene(store.onSearchHymnScene)
  }
})

function connectObs() {
  const url = `ws://${store.obsWebsocketUrl || defaultValues.obsWebsocketUrl}`
  obs.connect(url).then(() => {
    connected.value = true
    getScenes()
    getSceneItems(store.onSearchHymnScene)
  }).catch(error => {
    alert(`Conexión fallida: ${error.error}`)
  })
}

function disconnectObs() {
  obs.disconnect()
  connected.value = false
}

async function getScenes() {
  const { scenes } = await obs.call('GetSceneList')
  store.sceneList = scenes
}

async function getSceneItems(sceneName: string) {
  let { sceneItems } = await obs.call('GetSceneItemList', { sceneName })
  // Get group scene items
  const groupSceneItems = [] as any[]
  for (const item of sceneItems) {
    if (!item.isGroup) continue
    const { sceneItems } = await obs.call('GetGroupSceneItemList', {
      sceneName: item.sourceName as string
    })
    sceneItems.map(i => i.groupName = item.sourceName)
    groupSceneItems.push(...sceneItems)
  }
  sceneItems = sceneItems.filter(item => !item.isGroup)
  sceneItems.push(...groupSceneItems)
  // Set source list
  store.sourceList = sceneItems
}

async function searchHymn() {
  if (!hymnNumber.value) {
    alert('Ingrese un número de himno')
    return
  }
  const hymn = await sHymn.byNumber(+hymnNumber.value)
  hymnData.value = hymn
  hymnIndex.value = 0
  player.value!.load()
  if (connected.value && store.onSearchSwitchToHymnScene && store.onSearchHymnScene) goTitle()
  if (store.autoplayMusic) player.value!.play()
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

async function goTitle() {
  hymnIndex.value = 0
  await showTitle()
  await setCurrentScene(store.onSearchHymnScene)
}

function stopMusic() {
  player.value!.pause()
  if (store.onMusicEndSwitchToScene) setCurrentScene(store.onMusicEndSwitchToScene)
}

async function showTitle() {
  await setSourceVisibility('hymn_number', true)
  await setSourceVisibility('hymn_title', true)
  await setSourceVisibility('verse_number', false)
  await setSourceVisibility('verse_content', false)
  await setSourceText('hymn_number', hymnData.value?.hymn.number.toString())
  await setSourceText('hymn_title', hymnData.value?.hymn.title)
}

async function showVerse(index: number) {
  await setSourceVisibility('hymn_number', false)
  await setSourceVisibility('hymn_title', false)
  await setSourceVisibility('verse_number', true)
  await setSourceVisibility('verse_content', true)
  const verseNumber = hymnData.value?.history[index].verse.number
  await setSourceText('verse_number', verseNumber === 0 ? 'Coro' : String(verseNumber))
  await setSourceText('verse_content', hymnData.value?.history[index].verse.content)
}

async function setCurrentScene(sceneName: string) {
  await obs.call('SetCurrentProgramScene', { sceneName })
}

async function setSourceVisibility(sourceName: string, visible: boolean) {
  const sceneItem = store.sourceList.find(s => s.sourceName === sourceName)
  await obs.call('SetSceneItemEnabled', {
    sceneName: sceneItem.groupName?? store.onSearchHymnScene,
    sceneItemId: sceneItem.sceneItemId,
    sceneItemEnabled: visible
  })
}

async function setSourceText(sourceName: string, text: string = '') {
  await obs.call('SetInputSettings', {
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
    <div class="flex gap-2">
      <button @click="connected? disconnectObs() : connectObs()" :title="connected? 'Desconectar' : 'Conectar'" type="button" class="flex items-center gap-3 px-2 py-1 rounded w-28 h-7 btn">
        <div class="rounded-full w-2 h-2" :class="connected? 'bg-green' : 'bg-red'"></div>
        {{ connected? 'Conectado' : 'Desconectado' }}
      </button>
      <div class="ml-auto flex gap-2">
        <AutodriveButton></AutodriveButton>
        <Settings></Settings>
        <About></About>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <form class="flex gap-2" onsubmit="return false">
        <input v-model="hymnNumber" type="number" min="1" max="613" class="input__text w-16" name="number" id="number">
        <button @click="searchHymn()" title="Buscar" type="submit" class="btn w-8 h-8">
          <img class="dark:invert" src="/svg/search.svg" alt="search">
        </button>
      </form>
      <div class="flex items-center gap-2">
        <span>Verso:</span>
        <button @click="goTitle()" title="Principio" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 1" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/home.svg" alt="home">
        </button>
        <button @click="hymnIndex--" title="Verso anterior" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 2" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/previous.svg" alt="left arrow">
        </button>
        <button @click="hymnIndex++" title="Verso siguiente" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || (hymnData? hymnIndex >= hymnData.history.length : true)" type="button" class="btn w-7 h-7">
          <img class="dark:invert" src="/svg/next.svg" alt="right arrow">
        </button>
        <button @click="stopMusic()" title="Detener" :disabled="!connected" type="button" class="btn w-7 h-7">
          <div class="rounded-full w-3 h-3 bg-black dark:invert"></div>
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <p>
        Reproduciendo: <span class="text-muted">{{ hymnData?.hymn.title }}</span>
      </p>
      <audio ref="player" controls>
        <source :src="hymnData && fileUrl()" type="audio/mpeg">
        Tu navegador no soporta el elemento <code>audio</code>.
      </audio>
    </div>
  </main>
</template>
