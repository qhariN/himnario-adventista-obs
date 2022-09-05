import { reactive } from 'vue'
import { Scene } from 'obs-websocket-js'

export const store = reactive({
  sceneList: [] as Scene[],
  onlyInstrumental: (localStorage.getItem('onlyInstrumental') === 'true') || false,
  autoplayMusic: (localStorage.getItem('autoplayMusic') === 'true') || false,
  autodriveVerses: (localStorage.getItem('autodriveVerses') === 'true') || false,
  splitVerses: (localStorage.getItem('splitVerses') === 'true') || false,
  onSearchSwitchToScene: localStorage.getItem('onSearchSwitchToScene') || 'none',
  onMusicEndSwitchToScene: localStorage.getItem('onMusicEndSwitchToScene') || 'none',
  obsWebsocketUrl: localStorage.getItem('obsWebsocketUrl') || '',
  musicHostUrl: localStorage.getItem('musicHostUrl') || '',
  hymnalApiUrl: localStorage.getItem('hymnalApiUrl') || ''
})

export const defaultValues = {
  obsWebsocketUrl: 'localhost:4444',
  hymnalApiUrl: 'https://hymnal.up.railway.app'
}