'use client'

import Image from 'next/image'
import { useState } from 'react'

const INSTA_IMGS = ['insta01.jpg','insta02.jpg','insta03.jpg','insta04.jpg','insta05.jpg','insta06.jpg']
const BASE = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/'

export function InstagramGrid() {
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-2.5">
      {INSTA_IMGS.map((img, i) => (
        <a
          key={i}
          href="https://www.instagram.com/greeneatfood"
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-square rounded-2xl overflow-hidden group block bg-[#f0f0ee]"
        >
          {errors[i] ? (
            // 이미지 없을 때 그린잇 로고 플레이스홀더
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl opacity-30">🌿</span>
            </div>
          ) : (
            <Image
              src={`${BASE}${img}`}
              alt={`그린잇 인스타그램 ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 33vw, 16vw"
              onError={() => setErrors((prev) => ({ ...prev, [i]: true }))}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </a>
      ))}
    </div>
  )
}
