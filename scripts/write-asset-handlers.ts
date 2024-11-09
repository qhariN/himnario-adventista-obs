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
  let path = decodeURIComponent(url.pathname)
  path = path.replace(/_/g, ' ').replace('.mp3', '.ogg')
  const asset = file(\`.\${path}\`)
  return new Response(asset, responseInit)
}`,
)
