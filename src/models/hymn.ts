export interface Hymn {
  id: number
  number: number
  title: string
  mp3Url: string
  mp3UrlInstr: string
  mp3Filename: string
}

export interface HymnSequence {
  id: number
  number: number
  title: string
  mp3Url: string
  mp3UrlInstr: string
  mp3Filename: string
  verses: Verse[]
  sequence: Sequence[]
}

export interface Verse {
  id: number
  number: number
  contents: Content[]
}

export interface Content {
  id: number
  content: string
}

export interface Sequence {
  id: number
  timestamp: number
  verseId: number
  verseContentId: number
}
