import Database from 'bun:sqlite'
import { $, write } from 'bun'

const flags = process.argv
const instrumental = flags.includes('--instrumental')
const directory = instrumental ? 'instrumental' : 'cantado'

console.info('Reading hymn data from database...')
const db = new Database('himnario-adventista-api/src/database/himnario.db')
const query = db.query('SELECT * FROM hymn')
const hymns = query.all() as {
  mp3Url: string
  mp3UrlInstr: string
  mp3Filename: string
}[]

console.info('Fetching files...')
const responses = await Promise.all(
  hymns.map(async (hymn) =>
    fetch(hymn[instrumental ? 'mp3UrlInstr' : 'mp3Url']),
  ),
)
const buffers = await Promise.all(
  responses.map(async (response) => response.arrayBuffer()),
)

console.info('Writing files...')
await Promise.all(
  buffers.map(async (buffer, i) =>
    write(
      `${directory}/${hymns[i].mp3Filename}`,
      buffer,
    ),
  ),
)

console.info('Converting mp3 to ogg...')
for (const hymn of hymns) {
  await $`ffmpeg -i ${directory}/${hymn.mp3Filename} -c:a libvorbis -q:a 2 ${directory}/${hymn.mp3Filename.replace('mp3', 'ogg')} && rm ${directory}/${hymn.mp3Filename}`
}

console.info('Done!')
