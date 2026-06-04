'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Search, Plus } from 'lucide-react'
import Link from 'next/link'

type Address = { id: string; label: string | null; address: string; detail: string | null; is_default: boolean }

interface Props {
  value: string
  detail: string
  onChange: (address: string, detail: string) => void
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: { address: string; zonecode: string }) => void
      }) => { open: () => void }
    }
  }
}

export function AddressPicker({ value, detail, onChange }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)
  const [manualAddress, setManualAddress] = useState(value)
  const [manualDetail, setManualDetail] = useState(detail)

  // 카카오 우편번호 스크립트 로드
  useEffect(() => {
    if (document.getElementById('daum-postcode-script')) return
    const script = document.createElement('script')
    script.id = 'daum-postcode-script'
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false }).then(({ data }) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const select = (addr: Address) => {
    setSelected(addr.id)
    onChange(addr.address, addr.detail ?? '')
  }

  function openAddressSearch() {
    if (!window.daum?.Postcode) {
      alert('주소 검색 서비스를 불러오는 중이에요. 잠시 후 다시 시도해주세요.')
      return
    }
    new window.daum.Postcode({
      oncomplete: (data) => {
        setManualAddress(data.address)
        onChange(data.address, manualDetail)
      },
    }).open()
  }

  if (loading) return <div className="h-12 bg-tint rounded-xl animate-pulse" />

  if (addresses.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-ink-4">등록된 배송지가 없어요</p>
          <Link href="/my/addresses" target="_blank" className="text-xs text-[#2d7a4f] hover:underline flex items-center gap-1">
            <Plus size={12} />
            배송지 관리
          </Link>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={manualAddress}
              readOnly
              onClick={openAddressSearch}
              placeholder="주소 검색 버튼을 눌러주세요"
              className="flex-1 px-3 py-2.5 border border-line-2 rounded-xl text-sm outline-none bg-wash cursor-pointer"
            />
            <button
              type="button"
              onClick={openAddressSearch}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-[#2d7a4f] text-white text-sm font-medium rounded-xl hover:bg-[#235f3d] transition-colors whitespace-nowrap"
            >
              <Search size={14} />
              검색
            </button>
          </div>
          <input
            value={manualDetail}
            onChange={(e) => {
              setManualDetail(e.target.value)
              onChange(manualAddress, e.target.value)
            }}
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
            {addr.label && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                selected === addr.id ? 'bg-[#2d7a4f] text-white' : 'bg-tint text-ink-4'
              }`}>
                {addr.label}
              </span>
            )}
            {addr.is_default && <span className="text-xs text-ink-5">기본</span>}
          </div>
          <p className="text-sm text-ink mt-1">{addr.address}</p>
          {addr.detail && <p className="text-xs text-ink-4">{addr.detail}</p>}
        </button>
      ))}
      <Link
        href="/my/addresses"
        target="_blank"
        className="flex items-center justify-center gap-2 w-full py-2.5 border border-dashed border-line-2 rounded-xl text-xs text-ink-4 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors mt-1"
      >
        <MapPin size={13} />
        배송지 추가/관리
      </Link>
    </div>
  )
}
