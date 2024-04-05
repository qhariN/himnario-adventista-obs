import { reactive } from 'vue'
import packageJson from '../package.json'

export const store = reactive({
  sceneList: [] as any[],
  sourceList: [] as any[],
  isFirstTimeInVersion: localStorage.getItem('version') !== packageJson.version,
  onlyInstrumental: localStorage.getItem('onlyInstrumental') === 'true',
  autoplayMusic: localStorage.getItem('autoplayMusic') === 'true',
  autodriveVerses: localStorage.getItem('autodriveVerses') === 'true',
  onSearchSwitchToHymnScene:
    localStorage.getItem('onSearchSwitchToHymnScene') === 'true',
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
    himnoNumero: false,
    himnoTitulo: false,
    versoNumero: false,
    versoContenido: false,
  },
})

export const defaultValues = {
  obsWebsocketUrl: 'localhost:4455',
  hymnalApiUrl: 'https://sdah.my.to',
}
