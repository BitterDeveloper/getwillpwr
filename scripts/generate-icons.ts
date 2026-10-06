import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(__dirname, '..')
const SOURCE_SVG = path.join(ROOT, 'public/brand/willpwr-favicon.svg')
const OG_SOURCE_SVG = path.join(ROOT, 'public/og-default.svg')
const BRAND_COLOR = '#5B2FFF'

const ICON_SIZES = [16, 32, 48, 64, 180, 192, 512, 1024] as const
const ICO_SIZES = [16, 32, 48] as const
const MASKABLE_SIZE = 512
const MASKABLE_SAFE_ZONE = 0.8 // Android maskable spec: content within the inner 80% circle

async function renderPng(size: number): Promise<Buffer> {
  return sharp(SOURCE_SVG).resize(size, size).png().toBuffer()
}

function buildIco(images: { size: number; buffer: Buffer }[]): Buffer {
  const HEADER_SIZE = 6
  const ENTRY_SIZE = 16
  const header = Buffer.alloc(HEADER_SIZE)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4) // image count

  const entries = Buffer.alloc(ENTRY_SIZE * images.length)
  let offset = HEADER_SIZE + ENTRY_SIZE * images.length
  const buffers: Buffer[] = []

  images.forEach(({ size, buffer }, i) => {
    const entryOffset = i * ENTRY_SIZE
    entries.writeUInt8(size === 256 ? 0 : size, entryOffset + 0) // width
    entries.writeUInt8(size === 256 ? 0 : size, entryOffset + 1) // height
    entries.writeUInt8(0, entryOffset + 2) // color count (0 = no palette)
    entries.writeUInt8(0, entryOffset + 3) // reserved
    entries.writeUInt16LE(1, entryOffset + 4) // color planes
    entries.writeUInt16LE(32, entryOffset + 6) // bits per pixel
    entries.writeUInt32LE(buffer.length, entryOffset + 8) // size of PNG data
    entries.writeUInt32LE(offset, entryOffset + 12) // offset of PNG data
    offset += buffer.length
    buffers.push(buffer)
  })

  return Buffer.concat([header, entries, ...buffers])
}

async function main() {
  await mkdir(path.join(ROOT, 'public/icons'), { recursive: true })

  // Next.js App Router picks these up automatically — no <link> tags needed.
  await sharp(SOURCE_SVG).resize(32, 32).png().toFile(path.join(ROOT, 'app/icon.png'))
  await sharp(SOURCE_SVG).resize(180, 180).png().toFile(path.join(ROOT, 'app/apple-icon.png'))

  for (const size of ICON_SIZES) {
    const buffer = await renderPng(size)
    await writeFile(path.join(ROOT, `public/icons/icon-${size}.png`), buffer)
  }

  const icoBuffers = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, buffer: await renderPng(size) }))
  )
  await writeFile(path.join(ROOT, 'public/favicon.ico'), buildIco(icoBuffers))

  const contentSize = Math.round(MASKABLE_SIZE * MASKABLE_SAFE_ZONE)
  const content = await renderPng(contentSize)
  const maskable = await sharp({
    create: {
      width: MASKABLE_SIZE,
      height: MASKABLE_SIZE,
      channels: 4,
      background: BRAND_COLOR,
    },
  })
    .composite([{ input: content, gravity: 'center' }])
    .png()
    .toBuffer()
  await writeFile(path.join(ROOT, 'public/icons/maskable-512.png'), maskable)

  await sharp(OG_SOURCE_SVG)
    .resize(1200, 630)
    .png()
    .toFile(path.join(ROOT, 'public/og-default.png'))

  console.log('Icons generated from', path.relative(ROOT, SOURCE_SVG))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
