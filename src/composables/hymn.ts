import { type Ref, ref } from 'vue'
import type { HymnSequence } from '../models/hymn'
import sHymn from '../services/HymnService'
import { defaultValues, store } from '../store'

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
    if (!hymnData.value) {
      return ''
    }
    const hostUrl = `${store.musicHostUrl ? store.musicHostUrl : defaultValues.musicHostUrl}/${
      store.onlyInstrumental ? 'instrumental' : 'vocal'
    }/${encodeURIComponent(hymnData.value.mp3Filename)}`
    return hostUrl
  }

  return {
    hymnIndex,
    hymnNumber,
    hymnData,
    searchHymn,
    fileUrl,
  }
}
