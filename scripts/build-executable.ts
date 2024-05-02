import { $, write } from 'bun'
import Database from 'bun:sqlite'

await $`git clone https://github.com/qhariN/himnario-adventista-api.git`

await $`mv himnario-adventista-api himnario-adventista`

await write('himnario-adventista/api/index.ts', `import { file } from 'bun'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ responseInit }) => {
  const index = file('./index.html')
  return new Response(index, responseInit)
}`)

await write('himnario-adventista/api/assets/[...slug].ts', `import { file } from 'bun'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ url, responseInit }) => {
  const path = decodeURIComponent(url.pathname)
  const asset = file(\`.\${path}\`)
  return new Response(asset, responseInit)
}`)

await $`bun i --production`

await $`bun run build`

await $`cp -r dist/* himnario-adventista && rm -rf dist`

await $`cd himnario-adventista && bun i --production`

await $`cd himnario-adventista && bun build src/index.ts --compile --minify --sourcemap --outfile Himnario`

await $`rm -rf himnario-adventista/node_modules`

const db = new Database('himnario-adventista/src/database/himnario.db')
const query = db.query('SELECT * FROM hymn')
const hymns = query.all() as { mp3Url: string, mp3Filename: string, mp3UrlInstr: string }[]
const responses = await Promise.all(hymns.map(async hymn => fetch(hymn.mp3Url)))
const buffers = await Promise.all(responses.map(async response => response.arrayBuffer()))
await Promise.all(buffers.map(async (buffer, i) => write(`cantado/${hymns[i].mp3Filename}`, buffer)))
const responses2 = await Promise.all(hymns.map(async hymn => fetch(hymn.mp3UrlInstr)))
const buffers2 = await Promise.all(responses2.map(async response => response.arrayBuffer()))
await Promise.all(buffers2.map(async (buffer, i) => write(`instrumental/${hymns[i].mp3Filename}`, buffer)))

for (const hymn of hymns) {
  await $`ffmpeg -i cantado/${hymn.mp3Filename} -c:a libvorbis -q:a 2 cantado/${hymn.mp3Filename.replace('mp3', 'ogg')} && rm cantado/${hymn.mp3Filename}`
  await $`ffmpeg -i instrumental/${hymn.mp3Filename} -c:a libvorbis -q:a 2 instrumental/${hymn.mp3Filename.replace('mp3', 'ogg')} && rm instrumental/${hymn.mp3Filename}`
}