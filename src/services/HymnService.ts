import type { Hymn, HymnSequence } from '../models/hymn'
import { defaultValues, store } from '../store'
import Fetch from './api'

const sHymn = {
  async all(): Promise<Hymn[]> {
    const url = `${store.hymnalApiUrl || defaultValues.hymnalApiUrl}/hymn`
    const response = await Fetch(url)
    return response.json()
  },
  async byNumber(_number: number): Promise<HymnSequence> {
    const url = `${store.hymnalApiUrl || defaultValues.hymnalApiUrl}/hymn/${_number}`
    const response = await Fetch(url)
    if (response.status === 404) {
      return Promise.reject('Hymn not found')
    }
    return await response.json()
  }
}

export default sHymn