'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin } from 'lucide-react'

type Address = { id: string; label: string; address: string; detail: string | null; is_default: boolean }

interface Props {
  value: string
  detail: string
  onChange: (address: string, detail: string) => void
}

export function AddressPicker({ value, detail, onChange }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase.from('addresses').select('*').eq('user_id', user.id).then(({ data }) => {
        const list = (data ?? []) as Address[]
        setAddresses(list)
        const def = list.find((a) => a.is_default) ?? list[0]
        if (def && !value) {
          setSelected(def.id)
          onChange(def.address, def.detail ?? '')
        }
        setLoading(false)
      })
    })
  }, [])

  const select = (addr: Address) => {
    setSelected(addr.id)
    onChange(addr.address, addr.detail ?? '')
  }

  if (loading) return <div className="h-12 bg-tint rounded-xl animate-pulse" />

  if (addresses.length === 0) {
    return (
      <div className="space-y-3">
        <div className="border border-dashed border-line-3 rounded-xl p-4 text-center text-sm text-ink-4">
          <MapPin size={16} className="mx-auto mb-2 text-ink-5" />
          등록된 배송지가 없어요
        </div>
        <div className="space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value, detail)}
            placeholder="주소를 직접 입력해주세요"
            className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm outline-none focus:border-[#2d7a4f]"
          />
          <input
            value={detail}
            onChange={(e) => onChange(value, e.target.value)}
            placeholder="상세 주소 (동/호수 등)"
            className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm outline-none focus:border-[#2d7a4f]"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {addresses.map((addr) => (
        <button
          key={addr.id}
          type="button"
          onClick={() => select(addr)}
          className={`w-full text-left p-3 rounded-xl border transition-colors ${
            selected === addr.id ? 'border-[#2d7a4f] bg-green-tint-2' : 'border-line-2 hover:border-line-3'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              selected === addr.id ? 'bg-[#2d7a4f] text-white' : 'bg-tint text-ink-4'
            }`}>
              {addr.label}
            </span>
            {addr.is_default && <span className="text-xs text-ink-5">기본</span>}
          </div>
          <p className="text-sm text-ink mt-1">{addr.address}</p>
          {addr.detail && <p className="text-xs text-ink-4">{addr.detail}</p>}
        </button>
      ))}
    </div>
  )
}
