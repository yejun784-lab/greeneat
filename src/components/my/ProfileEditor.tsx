'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Check, X } from 'lucide-react'

interface Props {
  userId: string
  initialName: string | null
  initialPhone: string | null
  email: string
}

export function ProfileEditor({ userId, initialName, initialPhone, email }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ?? '')
  const [saving, setSaving] = useState(false)

  const initials = (name || email).slice(0, 2).toUpperCase()

  async function save() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ name, phone }).eq('id', userId)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-12 h-12 rounded-full bg-[#2d7a4f] flex items-center justify-center text-white font-bold text-sm shrink-0">
        {initials}
      </div>
      {editing ? (
        <div className="flex-1 space-y-1.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="w-full text-sm border border-line-2 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2d7a4f]"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="전화번호"
            className="w-full text-sm border border-line-2 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2d7a4f]"
          />
          <div className="flex gap-1.5">
            <button onClick={save} disabled={saving} className="flex items-center gap-1 text-xs bg-[#2d7a4f] text-white px-2.5 py-1 rounded-lg disabled:opacity-50">
              <Check size={11} /> 저장
            </button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs border border-line-2 text-ink-4 px-2.5 py-1 rounded-lg">
              <X size={11} /> 취소
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-ink text-sm truncate">{name || '이름 없음'}</p>
            <button onClick={() => setEditing(true)} className="text-ink-5 hover:text-ink-2 transition-colors shrink-0">
              <Pencil size={12} />
            </button>
          </div>
          <p className="text-xs text-ink-5 truncate">{email}</p>
          {phone && <p className="text-xs text-ink-5">{phone}</p>}
        </div>
      )}
    </div>
  )
}
