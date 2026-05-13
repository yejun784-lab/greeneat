import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GreenEat — 건강한 밀키트 구독',
    short_name: 'GreenEat',
    description: '신선하고 건강한 밀키트로 매일의 식사를 특별하게',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2d7a4f',
    orientation: 'portrait',
    categories: ['food', 'shopping', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '390x844',
        type: 'image/png',
        label: 'GreenEat 홈',
      },
    ],
  }
}
