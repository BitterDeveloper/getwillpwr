import fs from 'node:fs'
import path from 'node:path'

export function readLegalDoc(name: 'terms' | 'privacy'): string {
  const file = path.join(process.cwd(), 'content', `${name}.mdx`)
  return fs.readFileSync(file, 'utf8')
}
