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
  const path = url.pathname
  const asset = file(\`.\${path}\`)
  return new Response(asset, responseInit)
}`)

await $`bun i --production`

await $`bun run build`

await $`cp -r dist/* himnario-adventista && rm -rf dist`

await $`cd himnario-adventista && bun i --production`

await $`cd himnario-adventista && bun build src/index.ts --compile --outfile Himnario`

await $`rm -rf himnario-adventista/node_modules`

const db = new Database('himnario-adventista/src/database/himnario.db')
const query = db.query('SELECT * FROM hymn')
const hymns = query.all() as { mp3Url: string, mp3Filename: string }[]
const responses = await Promise.all(hymns.map(async hymn => fetch(hymn.mp3Url)))
const buffers = await Promise.all(responses.map(async response => response.arrayBuffer()))
await Promise.all(buffers.map(async (buffer, i) => write(`hymns/${hymns[i].mp3Filename}`, buffer)))