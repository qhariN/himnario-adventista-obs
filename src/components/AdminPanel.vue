<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { store } from '@/store'
import { useObs } from '@/composables/obs'
import { useHymn } from '@/composables/hymn'
import { usePlayer } from '@/composables/player'
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

const {
  hymnIndex,
  hymnNumber,
  hymnData,
  searchHymn,
  fileUrl
} = useHymn()

const {
  onTimeUpdate,
  onEnded,
  player: playerElement,
  ...player
} = usePlayer()

onMounted(() => {
  onTimeUpdate(() => handleMusicTimestamp())
  onEnded(() => toHomeScene())
})

watch(hymnIndex, async index => {
  if (index === 0) return
  await showVerse(index - 1)
  if (!store.onSearchSwitchToHymnScene || !store.onSearchHymnScene) return
  await setCurrentScene(store.onSearchHymnScene)
})

async function search(number: number | string) {
  await searchHymn(number)
  player.load()
  if (connected.value) goTitle()
  if (store.autoplayMusic) player.play()
}

function handleMusicTimestamp() {
  if (!connected.value || !store.autodriveVerses) return
  const nextSequence = hymnData.value!.sequence.filter(v => v.timestamp && (v.timestamp - 0.5) < player.currentTime.value).reverse()[0]
  const position = hymnData.value!.sequence.indexOf(nextSequence) + 1
  if (nextSequence && position !== hymnIndex.value) {
    hymnIndex.value = position
  }
}

async function goTitle() {
  hymnIndex.value = 0
  await showTitle()
  if (!store.onSearchSwitchToHymnScene || !store.onSearchHymnScene) return
  await setCurrentScene(store.onSearchHymnScene)
}

async function toHomeScene(fadeoutMusic = false) {
  if (fadeoutMusic) await player.stop()
  if (!connected.value) return
  if (store.onMusicEndSwitchToScene) await setCurrentScene(store.onMusicEndSwitchToScene)
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
  const sequence = hymnData.value!.sequence[index]
  const verse = hymnData.value?.verses.find(v => v.id === sequence.verseId)
  const content = verse?.contents.find(c => c.id === sequence.verseContentId)
  const verseNumber = verse?.number === 0 ? 'Coro' : String(verse?.number)
  await setSourceVisibility('hymn_number', false)
  await setSourceVisibility('hymn_title', false)
  await setSourceVisibility('verse_number', true)
  await setSourceVisibility('verse_content', true)
  await setSourceText('verse_number', verseNumber)
  await setSourceText('verse_content', content?.content)
}
</script>

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
      <button @click="search(hymnNumber)" title="Buscar" type="submit" class="btn w-8 h-8">
        <SearchIcon />
      </button>
      <HymnSearcher @on-play-hymn="search($event)" />
      <button @click="goTitle()" title="Principio" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 1" type="button" class="btn w-8 h-8 ms-auto">
        <HomeIcon />
      </button>
      <button @click="hymnIndex--" title="Verso anterior" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || hymnIndex < 2" type="button" class="btn w-8 h-8">
        <PreviousIcon />
      </button>
      <button @click="hymnIndex++" title="Verso siguiente" :disabled="!connected || !store.onSearchHymnScene || store.autodriveVerses || (hymnData? hymnIndex >= hymnData.sequence.length : true)" type="button" class="btn w-8 h-8">
        <NextIcon />
      </button>
      <button @click="toHomeScene(true)" title="Detener" :disabled="!connected" type="button" class="btn w-8 h-8">
        <div class="rounded-full w-4 h-4 bg-[currentcolor]"></div>
      </button>
    </form>
    <div class="space-y-2">
      <p data-test="hymn-title">
        Reproduciendo: <span class="text-muted">{{ hymnData?.title }}</span>
      </p>
      <audio ref="playerElement" controls>
        <source :src="hymnData && fileUrl()" type="audio/mpeg">
        Tu navegador no soporta el elemento <code>audio</code>.
      </audio>
    </div>
  </main>
</template>
