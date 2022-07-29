export interface HymnHistory {
  hymn:    Hymn;
  history: History[];
}

export interface History {
  position: number;
  verse:    Verse;
}

export interface Verse {
  number:  number;
  content: string;
}

export interface Hymn {
  id:          number;
  number:      number;
  title:       string;
  mp3Url:      string;
  mp3Filename: string;
}
