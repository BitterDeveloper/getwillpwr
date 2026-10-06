import { describe, it, expect } from 'vitest'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(__dirname, '../..')

const GENERATED_PNGS: { file: string; width: number; height: number }[] = [
  { file: 'app/icon.png', width: 32, height: 32 },
  { file: 'app/apple-icon.png', width: 180, height: 180 },
  { file: 'public/og-default.png', width: 1200, height: 630 },
  { file: 'public/icons/icon-16.png', width: 16, height: 16 },
  { file: 'public/icons/icon-32.png', width: 32, height: 32 },
  { file: 'public/icons/icon-48.png', width: 48, height: 48 },
  { file: 'public/icons/icon-64.png', width: 64, height: 64 },
  { file: 'public/icons/icon-180.png', width: 180, height: 180 },
  { file: 'public/icons/icon-192.png', width: 192, height: 192 },
  { file: 'public/icons/icon-512.png', width: 512, height: 512 },
  { file: 'public/icons/icon-1024.png', width: 1024, height: 1024 },
  { file: 'public/icons/maskable-512.png', width: 512, height: 512 },
]

describe('generated icon set', () => {
  for (const { file, width, height } of GENERATED_PNGS) {
    it(`${file} exists at ${width}x${height}`, async () => {
      const metadata = await sharp(path.join(ROOT, file)).metadata()
      expect(metadata.width).toBe(width)
      expect(metadata.height).toBe(height)
    })
  }

  it('public/favicon.ico exists and carries 16, 32 and 48px resolutions', async () => {
    const buffer = await readFile(path.join(ROOT, 'public/favicon.ico'))
    expect(buffer.readUInt16LE(2)).toBe(1) // ICO type marker
    const count = buffer.readUInt16LE(4)
    expect(count).toBe(3)
    const sizes = Array.from({ length: count }, (_, i) => {
      const entryOffset = 6 + i * 16
      const raw = buffer.readUInt8(entryOffset)
      return raw === 0 ? 256 : raw
    }).sort((a, b) => a - b)
    expect(sizes).toEqual([16, 32, 48])
  })
})

describe('public/brand SVGs', () => {
  it('contain no <text> elements (font-independent letterforms)', async () => {
    const dir = path.join(ROOT, 'public/brand')
    const files = (await readdir(dir)).filter((f) => f.endsWith('.svg'))
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) {
      const contents = await readFile(path.join(dir, file), 'utf-8')
      expect(contents).not.toMatch(/<text[\s>]/)
    }
  })
})
