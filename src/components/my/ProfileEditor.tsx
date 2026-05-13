'use client'

import { useState } from 'react'
import { User, Pencil, Check, X, Loader2, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

interface Props {
  userId: string
  initialName: string | null
  initialPhone: string | null
  email: string
}

type Field = 'name' | 'phone'

function InlineField({
  value,
  onSave,
  placeholder,
  icon,
  pattern,
  inputMode,
}: {
  value: string
  onSave: (v: string) => Promise<void>
  placeholder: string
  icon?: React.ReactNode
  pattern?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)

  function start() { setDraft(value); setEditing(true) }
  function cancel() { setEditing(false); setDraft('') }

  async function save() {
    const trimmed = draft.trim()
    if (trimmed === value) { setEditing(false); return }
    setSaving(true)
    await onSave(trimmed)
    setEditing(false)
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-1.5 group">
      {icon}
      {editing ? (
        <>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
            autoFocus
            pattern={pattern}
            inputMode={inputMode}
            placeholder={placeholder}
            className="flex-1 min-w-0 px-2.5 py-1.5 border border-[#2d7a4f] rounded-lg text-sm bg-surface text-ink focus:outline-none"
          />
          <button onClick={save} disabled={saving} className="p-1.5 text-[#2d7a4f] hover:bg-green-tint rounded-lg transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          </button>
          <button onClick={cancel} className="p-1.5 text-ink-5 hover:bg-wash rounded-lg transition-colors">
            <X size={13} />
          </button>
        </>
      ) : (
        <>
          <span className={`text-sm truncate ${value ? 'text-ink' : 'text-ink-5 italic'}`}>
            {value || placeholder}
          </span>
          <button
            onClick={start}
            className="p-1 text-ink-5 opacity-0 group-hover:opacity-100 hover:text-ink-2 transition-all rounded shrink-0"
          >
            <Pencil size={11} />
          </button>
        </>
      )}
    </div>
  )
}

export function ProfileEditor({ userId, initialName, initialPhone, email }: Props) {
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ?? '')

  async function saveName(v: string) {
    if (!v) { toast.error('이름을 입력해주세요.'); return }
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ name: v }).eq('id', userId)
    if (error) toast.error('이름 변경에 실패했습니다.')
    else { setName(v); toast.success('이름이 변경됐습니다.') }
  }

  async function savePhone(v: string) {
    if (v && !/^[0-9\-+\s]{7,15}$/.test(v)) {
      toast.error('올바른 전화번호를 입력해주세요.')
      return
    }
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ phone: v || null }).eq('id', userId)
    if (error) toast.error('전화번호 변경에 실패했습니다.')
    else { setPhone(v); toast.success('전화번호가 변경됐습니다.') }
  }

  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="w-12 h-12 rounded-full bg-green-tint flex items-center justify-center shrink-0">
        <User size={22} className="text-[#2d7a4f]" />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <InlineField
          value={name}
          onSave={saveName}
          placeholder="이름을 입력하세요"
        />
        <p className="text-sm text-ink-4 truncate">{email}</p>
        <InlineField
          value={phone}
          onSave={savePhone}
          placeholder="전화번호 추가"
          icon={<Phone size={12} className="text-ink-5 shrink-0" />}
          pattern="[0-9\-+\s]*"
          inputMode="tel"
        />
      </div>
    </div>
  )
}
