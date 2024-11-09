import { type Ref, ref } from 'vue'
import type { HymnSequence } from '../models/hymn.ts'
import sHymn from '../services/HymnService.ts'
import { defaultValues, SAME_HOST, store } from '../store.ts'

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
    const fileName = SAME_HOST
      ? hymnData.value.mp3Filename.replace(/ /g, '_')
      :  hymnData.value.mp3Filename
    const hostUrl = `${store.musicHostUrl ? store.musicHostUrl : defaultValues.musicHostUrl}/${
      store.onlyInstrumental ? 'instrumental' : 'vocal'
    }/${encodeURIComponent(fileName)}`
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
