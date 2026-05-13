'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Plus, Check, BookmarkPlus, Search } from 'lucide-react'
import { toast } from '@/lib/toast-store'

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeResult) => void
        onclose?: () => void
        width?: number
        height?: number
      }) => { open: () => void }
    }
  }
}

interface DaumPostcodeResult {
  address: string
  addressType: string
  bname: string
  buildingName: string
  zonecode: string
  roadAddress: string
  jibunAddress: string
  autoJibunAddress: string
}

type SavedAddress = { id: string; address: string; detail: string | null; label: string | null }

interface Props {
  value: string
  detail: string
  onChange: (address: string, detail: string) => void
}

function loadKakaoPostcode(): Promise<void> {
  return new Promise((resolve) => {
    if (window.daum?.Postcode) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export function AddressPicker({ value, detail, onChange }: Props) {
  const [saved, setSaved] = useState<SavedAddress[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    loadKakaoPostcode().then(() => setScriptLoaded(true))
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: rows } = await supabase
        .from('addresses')
        .select('id, address, detail, label')
        .eq('user_id', data.user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5)
      setSaved((rows as SavedAddress[]) ?? [])
      if (rows && rows.length > 0) {
        const first = rows[0] as SavedAddress
        setSelectedId(first.id)
        onChange(first.address, first.detail ?? '')
      }
    })
  }, [])

  const openPostcode = useCallback(() => {
    if (!window.daum?.Postcode) {
      toast.error('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }
    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeResult) => {
        const addr = data.roadAddress || data.address
        onChange(addr, detail)
      },
      width: 500,
      height: 600,
    }).open()
  }, [detail, onChange, scriptLoaded])

  async function handleSaveAddress() {
    if (!userId || !value.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('addresses')
      .insert({ user_id: userId, address: value.trim(), detail: detail.trim() || null, is_default: saved.length === 0 })
      .select('id, address, detail, label')
      .single()
    if (data) {
      setSaved((prev) => [...prev, data as SavedAddress])
      setSelectedId((data as SavedAddress).id)
      setShowNew(false)
      toast.success('배송지를 저장했습니다.')
    }
    setSaving(false)
  }

  function selectSaved(addr: SavedAddress) {
    setSelectedId(addr.id)
    setShowNew(false)
    onChange(addr.address, addr.detail ?? '')
  }

  const AddressInputBlock = () => (
    <div className="space-y-2">
      <div>
        <label className="block text-sm text-ink-3 mb-1">주소 *</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            readOnly
            placeholder="주소 검색 버튼을 눌러주세요"
            required
            className="flex-1 px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-wash text-ink cursor-not-allowed"
          />
          <button
            type="button"
            onClick={openPostcode}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-[#2d7a4f] text-white rounded-lg text-sm font-medium hover:bg-[#235f3d] transition-colors shrink-0"
          >
            <Search size={14} />
            주소 검색
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm text-ink-3 mb-1">상세 주소</label>
        <input
          type="text"
          value={detail}
          onChange={(e) => onChange(value, e.target.value)}
          placeholder="동, 호수, 층 등 상세 주소 입력"
          className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
        />
      </div>
      {value.trim() && userId && (
        <button
          type="button"
          onClick={handleSaveAddress}
          disabled={saving}
          className="flex items-center gap-1.5 text-xs text-[#2d7a4f] hover:underline disabled:opacity-50"
        >
          <BookmarkPlus size={13} />
          {saving ? '저장 중...' : '이 주소 저장하기'}
        </button>
      )}
    </div>
  )

  if (saved.length === 0) {
    return <AddressInputBlock />
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {saved.map((addr) => (
          <button
            key={addr.id}
            type="button"
            onClick={() => selectSaved(addr)}
            className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${
              selectedId === addr.id
                ? 'border-[#2d7a4f] bg-green-tint-2'
                : 'border-line hover:border-line-2'
            }`}
          >
            <MapPin size={15} className={`mt-0.5 shrink-0 ${selectedId === addr.id ? 'text-[#2d7a4f]' : 'text-ink-5'}`} />
            <div className="flex-1 min-w-0">
              {addr.label && <p className="text-xs font-semibold text-[#2d7a4f] mb-0.5">{addr.label}</p>}
              <p className="text-sm font-medium text-ink truncate">{addr.address}</p>
              {addr.detail && <p className="text-xs text-ink-4">{addr.detail}</p>}
            </div>
            {selectedId === addr.id && <Check size={14} className="text-[#2d7a4f] shrink-0 mt-0.5" />}
          </button>
        ))}

        <button
          type="button"
          onClick={() => { setShowNew(true); setSelectedId(null); onChange('', '') }}
          className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
            showNew ? 'border-[#2d7a4f] bg-green-tint-2' : 'border-dashed border-line-2 hover:border-line-3'
          }`}
        >
          <Plus size={15} className={showNew ? 'text-[#2d7a4f]' : 'text-ink-5'} />
          <span className="text-sm text-ink-4">새 주소 입력</span>
        </button>
      </div>

      {showNew && (
        <div className="pl-1">
          <AddressInputBlock />
        </div>
      )}
    </div>
  )
}
