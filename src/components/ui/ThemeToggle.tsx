'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  const options = [
    { value: 'light',  icon: Sun,     label: '라이트' },
    { value: 'dark',   icon: Moon,    label: '다크' },
    { value: 'system', icon: Monitor, label: '시스템' },
  ]

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`p-1.5 rounded-md transition-colors ${
            theme === value
              ? 'bg-white dark:bg-gray-600 text-[#2d7a4f] shadow-sm'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  )
}
