import { write } from 'bun'

await write(
  'himnario-adventista/api/index.ts',
  `import { file } from 'bun'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ responseInit }) => {
  const index = file('./index.html')
  return new Response(index, responseInit)
}`,
)

await write(
  'himnario-adventista/api/assets/[...slug].ts',
  `import { file } from 'bun'
import type { CromoHandler } from 'cromo'

export const GET: CromoHandler = ({ url, responseInit }) => {
  const path = decodeURIComponent(url.pathname)
  const asset = file(\`.\${path.replace('.mp3', '.ogg')}\`)
  return new Response(asset, responseInit)
}`,
)
