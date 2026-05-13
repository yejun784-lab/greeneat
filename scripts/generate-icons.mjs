import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgPath = join(__dirname, '../public/icons/icon.svg')
const svg = readFileSync(svgPath)

const sizes = [192, 512]
for (const size of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(join(__dirname, `../public/icons/icon-${size}.png`))
  console.log(`Generated icon-${size}.png`)
}

// apple-touch-icon (180x180)
await sharp(svg)
  .resize(180, 180)
  .png()
  .toFile(join(__dirname, '../public/icons/apple-touch-icon.png'))
console.log('Generated apple-touch-icon.png')

// favicon
await sharp(svg)
  .resize(32, 32)
  .png()
  .toFile(join(__dirname, '../public/favicon.png'))
console.log('Generated favicon.png')
