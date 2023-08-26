<script setup lang="ts">
import { onMounted, type Ref, ref, toRaw, watch } from 'vue'
import { store } from '@/store'
import { useObs } from '@/composables/obs'
import type { HymnSequence } from '@/models/hymn'
import sHymn from '@/services/HymnService'
import SettingsPanel from './SettingsPanel.vue'
import AboutApp from './AboutApp.vue'
import AutodriveButton from './AutodriveButton.vue'
import HomeIcon from './icons/HomeIcon.vue'
import NextIcon from './icons/NextIcon.vue'
import PreviousIcon from './icons/PreviousIcon.vue'
import SearchIcon from './icons/SearchIcon.vue'
import HymnSearcher from './HymnSearcher.vue'

const {
  connected,
  connect,
  disconnect,
  setCurrentScene,
  setSourceVisibility,
  setSourceText
} = useObs()

const hymnNumber: Ref<number | string> = ref('')
const hymnData: Ref<HymnSequence | undefined> = ref(void(0))
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

async function searchHymn(hymnNumber: number | string) {
  if (!hymnNumber) {
    alert('Ingrese un número de himno')
    return
  }
  const hymn = await sHymn.byNumber(+hymnNumber)
  hymnData.value = hymn
  hymnIndex.value = 0
  player.value!.load()
  if (connected.value && store.onSearchSwitchToHymnScene && store.onSearchHymnScene) goTitle()
  if (store.autoplayMusic) player.value!.play()
}

function handleMusicTimestamp() {
  if (!connected.value || !store.autodriveVerses) return
  // const currentTime = player.value!.currentTime
  // const nextVerse = toRaw(
  //   hymnData.value!.history.filter(v => v.timestamp && (v.timestamp - 0.5) < currentTime).reverse()[0]
  // )
  // if (nextVerse && nextVerse.position !== hymnIndex.value) {
  //   hymnIndex.value = nextVerse.position
  // }
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

async function stopMusic() {
  const delay = 2000
  if (store.onMusicEndSwitchToScene) setCurrentScene(store.onMusicEndSwitchToScene)
  await fadeOutVolume(delay)
  player.value!.pause()
  player.value!.volume = 1
}

async function showTitle() {
  await setSourceVisibility('hymn_number', true)
  await setSourceVisibility('hymn_title', true)
  await setSourceVisibility('verse_number', false)
  await setSourceVisibility('verse_content', false)
  await setSourceText('hymn_number', hymnData.value?.number.toString())
  await setSourceText('hymn_title', hymnData.value?.title)
}

async function showVerse(index: number) {
  await setSourceVisibility('hymn_number', false)
  await setSourceVisibility('hymn_title', false)
  await setSourceVisibility('verse_number', true)
  await setSourceVisibility('verse_content', true)
  const sequence = hymnData.value!.sequence[index]
  const verse = hymnData.value?.verses.find(v => v.id === sequence.verseId)
  const content = verse?.contents.find(c => c.id === sequence.verseContentId)
  const verseNumber = verse?.number === 0 ? 'Coro' : String(verse?.number)
  await setSourceText('verse_number', verseNumber)
  await setSourceText('verse_content', content?.content)
}

function fileUrl() {
  const hymnUrl = store.onlyInstrumental
    ? hymnData.value!.mp3UrlInstr
    : hymnData.value!.mp3Url
  const hostUrl = `${store.musicHostUrl}/${store.onlyInstrumental? 'instrumental' : 'cantado'}/${encodeURIComponent(hymnData.value!.mp3Filename)}`
  return store.musicHostUrl? hostUrl : hymnUrl
}

function fadeOutVolume(delay: number) {
  const originalVolume = player.value!.volume
  return new Promise<void>(resolve => {
    const interval = setInterval(() => {
      if (player.value!.volume <= 0.01) {
        player.value!.volume = 0
        clearInterval(interval)
        resolve()
      } else {
        player.value!.volume -= 0.01
      }
    }, delay / (originalVolume / 0.01))
  })
}
</script>
<!-- TODO: cuando cambio de verso usando las flechas, se setea el verso en pantalla siempre -->
<template>
  <main class="flex flex-col gap-4 px-3 py-2 text-xs">
    <div class="flex gap-2">
      <button @click="connected? disconnect() : connect()" :title="connected? 'Desconectar' : 'Conectar'" type="button" class="flex items-center gap-3 px-2 py-1 rounded w-28 h-7 btn">
        <div class="rounded-full w-2 h-2" :class="connected? 'bg-green' : 'bg-red'"></div>
        {{ connected? 'Conectado' : 'Desconectado' }}
      </button>
      <div class="ml-auto flex gap-2">
        <AutodriveButton />
        <SettingsPanel />
        <AboutApp />
      </div>
    </div>
    <form class="flex gap-2" onsubmit="return false">
      <input v-model="hymnNumber" type="number" min="1" max="613" class="input__text w-16" name="number" id="number">
      <button @click="searchHymn(hymnNumber)" title="Buscar" type="submit" class="btn w-8 h-8">
        <SearchIcon />
      </button>
      <HymnSearcher @on-play-hymn="searchHymn($event)" />
      <button @click="goTitle()" title="Principio" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 1" type="button" class="btn w-8 h-8 ms-auto">
        <HomeIcon />
      </button>
      <button @click="hymnIndex--" title="Verso anterior" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 2" type="button" class="btn w-8 h-8">
        <PreviousIcon />
      </button>
      <button @click="hymnIndex++" title="Verso siguiente" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || (hymnData? hymnIndex >= hymnData.sequence.length : true)" type="button" class="btn w-8 h-8">
        <NextIcon />
      </button>
      <button @click="stopMusic()" title="Detener" :disabled="!connected" type="button" class="btn w-8 h-8">
        <div class="rounded-full w-4 h-4 bg-[currentcolor]"></div>
      </button>
    </form>
    <div class="space-y-2">
      <p>
        Reproduciendo: <span class="text-muted">{{ hymnData?.title }}</span>
      </p>
      <audio ref="player" controls>
        <source :src="hymnData && fileUrl()" type="audio/mpeg">
        Tu navegador no soporta el elemento <code>audio</code>.
      </audio>
    </div>
  </main>
</template>
