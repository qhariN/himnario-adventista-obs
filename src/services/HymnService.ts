import { HymnHistory } from '../models/hymn'
import { defaultValues, store } from '../store'
import Fetch from './api'

const sHymn = {
  byNumber(_number: number): Promise<HymnHistory> {
    return Fetch(`${store.hymnalApiUrl || defaultValues.hymnalApiUrl}/hymn/${_number}`)
  }
}

export default sHymn