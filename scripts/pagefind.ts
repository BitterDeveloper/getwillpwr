import { spawn } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

async function main() {
  const root = process.cwd()
  const candidates = [
    path.join(root, '.next/server/app'),
    path.join(root, 'out'),
  ]
  const site = candidates.find((p) => fs.existsSync(p))
  if (!site) {
    console.warn('[pagefind] No build output found; skipping index')
    return
  }

  const outputPath = path.join(root, 'public/pagefind')
  fs.mkdirSync(outputPath, { recursive: true })

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      'npx',
      ['-y', 'pagefind', '--site', site, '--output-path', outputPath],
      { stdio: 'inherit', shell: process.platform === 'win32' },
    )
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`pagefind exited with code ${code}`))
    })
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
