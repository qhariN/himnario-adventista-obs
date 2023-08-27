import type { HymnSequence } from '@/models/hymn'
import sHymn from '@/services/HymnService'
import { store } from '@/store'
import { ref, type Ref } from 'vue'

export function useHymn() {
  const hymnIndex: Ref<number> = ref(0)
  const hymnNumber: Ref<number | string> = ref('')
  const hymnData: Ref<HymnSequence | undefined> = ref()

  async function searchHymn(number: number | string) {
    if (!number) {
      alert('Ingrese un número de himno')
      return
    }
    const data = await sHymn.byNumber(+number)
    hymnData.value = data
    hymnIndex.value = 0
  }

  function fileUrl() {
    const hymnUrl = store.onlyInstrumental
      ? hymnData.value!.mp3UrlInstr
      : hymnData.value!.mp3Url
    const hostUrl = `${store.musicHostUrl}/${store.onlyInstrumental? 'instrumental' : 'cantado'}/${encodeURIComponent(hymnData.value!.mp3Filename)}`
    return store.musicHostUrl? hostUrl : hymnUrl
  }

  return {
    hymnIndex,
    hymnNumber,
    hymnData,
    searchHymn,
    fileUrl
  }
}