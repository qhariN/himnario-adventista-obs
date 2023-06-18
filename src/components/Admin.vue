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

function getScenes() {
  obs
    .call('GetSceneList')
    .then(({ scenes }) => {
      store.sceneList = scenes
    })
}

function getSceneItems(sceneName: string) {
  obs
    .call('GetSceneItemList', { sceneName })
    .then(async ({ sceneItems }) => {
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
    }).catch(error => {
      alert('Error al obtener la lista de escenas')
    })
}

function searchHymn() {
  if (!hymnNumber.value) {
    alert('Ingrese un número de himno')
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
      alert(`Error al cambiar de escena: ${error.error}`)
    })
}

function setSourceVisibility(sourceName: string, visible: boolean) {
  const sceneItem = store.sourceList.find(s => s.sourceName === sourceName)
  obs
    .call('SetSceneItemEnabled', {
      sceneName: sceneItem.groupName?? store.onSearchHymnScene,
      sceneItemId: sceneItem.sceneItemId,
      sceneItemEnabled: visible
    })
    .catch(error => {
      alert(`Error al cambiar la visibilidad de la fuente: ${error.error}`)
    })
}

function setSourceText(sourceName: string, text: string | undefined) {
  obs
    .call('SetInputSettings', {
      inputName: sourceName,
      inputSettings: {
        text: text
      }
    })
    .catch(error => {
      alert(`Error al cambiar el texto de la fuente: ${error.error}`)
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
      <button @click="connected? disconnectObs() : connectObs()" type="button" class="group flex items-center gap-3 px-2 py-1 rounded w-28 h-7 btn">
        <div class="rounded-full w-2 h-2" :class="connected? 'bg-green' : 'bg-red'"></div>
        <span class="group-hover:hidden">{{ connected? 'Conectado' : 'Desconectado' }}</span>
        <span class="hidden group-hover:block">{{ connected? 'Desconectar' : 'Conectar' }}</span>
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
