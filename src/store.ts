import { reactive } from 'vue'

export const store = reactive({
  obsWebsocketUrl: localStorage.getItem('obsWebsocketUrl') || '',
  musicHostUrl: localStorage.getItem('musicHostUrl') || '',
  hymnalApiUrl: localStorage.getItem('hymnalApiUrl') || ''
})

export const defaultValues = {
  obsWebsocketUrl: 'localhost:4444',
  hymnalApiUrl: 'https://hymnal.up.railway.app'
}