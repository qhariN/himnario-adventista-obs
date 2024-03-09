import { reactive } from 'vue'
import packageJson from '../package.json'

export const store = reactive({
  sceneList: [] as any[],
  sourceList: [] as any[],
  isFirstTimeInVersion: localStorage.getItem('version') !== packageJson.version,
  onlyInstrumental:
    localStorage.getItem('onlyInstrumental') === 'true' || false,
  autoplayMusic: localStorage.getItem('autoplayMusic') === 'true' || false,
  autodriveVerses: localStorage.getItem('autodriveVerses') === 'true' || false,
  onSearchSwitchToHymnScene:
    localStorage.getItem('onSearchSwitchToHymnScene') === 'true' || false,
  onSearchHymnScene: localStorage.getItem('onSearchHymnScene') || 'Himnario',
  onMusicEndSwitchToScene:
    localStorage.getItem('onMusicEndSwitchToScene') || '',
  obsWebsocketUrl: localStorage.getItem('obsWebsocketUrl') || '',
  musicHostUrl: localStorage.getItem('musicHostUrl') || '',
  hymnalApiUrl: localStorage.getItem('hymnalApiUrl') || '',
})

export const sceneStatus = reactive({
  scene: false,
  source: {
    himno_numero: false,
    himno_titulo: false,
    verso_numero: false,
    verso_contenido: false,
  },
})

export const defaultValues = {
  obsWebsocketUrl: 'localhost:4455',
  hymnalApiUrl: 'https://sdah.my.to',
}
