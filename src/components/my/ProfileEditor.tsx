'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Check, X } from 'lucide-react'

interface Props { userId: string; initialName: string | null; initialPhone: string | null; email: string }

export function ProfileEditor({ userId, initialName, initialPhone, email }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ?? '')
  const [saving, setSaving] = useState(false)

  const initials = name ? name.slice(0, 2) : email.slice(0, 2).toUpperCase()

  const save = async () => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ name, phone }).eq('id', userId)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="w-14 h-14 rounded-full bg-[#2d7a4f] text-white flex items-center justify-center text-lg font-bold shrink-0">
        {initials}
      </div>
      {editing ? (
        <div className="flex-1 space-y-1.5">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" className="w-full text-sm px-2.5 py-1.5 border border-line-2 rounded-lg outline-none focus:border-[#2d7a4f]" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="전화번호" className="w-full text-sm px-2.5 py-1.5 border border-line-2 rounded-lg outline-none focus:border-[#2d7a4f]" />
          <div className="flex gap-1.5">
            <button onClick={save} disabled={saving} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-[#2d7a4f] text-white rounded-lg hover:bg-[#235f3d]">
              <Check size={11} /> 저장
            </button>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs px-2.5 py-1 border border-line-2 text-ink-3 rounded-lg">
              <X size={11} /> 취소
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-ink">{name || '이름 없음'}</p>
            <button onClick={() => setEditing(true)} className="text-ink-5 hover:text-ink-3 transition-colors">
              <Pencil size={13} />
            </button>
          </div>
          <p className="text-sm text-ink-4 mt-0.5">{email}</p>
          {phone && <p className="text-xs text-ink-5 mt-0.5">{phone}</p>}
        </div>
      )}
    </div>
  )
}