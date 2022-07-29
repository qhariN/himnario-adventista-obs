import { reactive } from 'vue'

export const store = reactive({
  local: false,
  localApiUrl: 'http://localhost:5000/hymn',
  localMusicUrl: 'http://localhost:8080',
})