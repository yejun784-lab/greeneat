import Image from 'next/image'

const POSTS = [
  { src: 'hankki-dakgaseum.png',  caption: '닭가슴살 도시락 🍱' },
  { src: 'manrep-bulgogi.png',    caption: '만렙 소불고기 🥩' },
  { src: 'granola-gamgyul2.png',  caption: '감귤 그래놀라 🍊' },
  { src: 'hankki-dakgalbi.png',   caption: '치즈닭갈비 🧀' },
  { src: 'manrep-omurice.png',    caption: '치즈 오므라이스 🍳' },
  { src: 'hankki-buldakroze.png', caption: '불닭로제 도시락 🌶️' },
]

const BASE = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/'

export function InstagramGrid() {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2">
      {POSTS.map((post, i) => (
        <a
          key={i}
          href="https://www.instagram.com/green_eat_food"
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square overflow-hidden rounded-sm group block bg-tint"
        >
          <Image
            src={`${BASE}${post.src}`}
            alt={post.caption}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity text-center px-2">
              {post.caption}
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
