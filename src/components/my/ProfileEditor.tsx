'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Check, X, Camera, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast-store'

interface Props { userId: string; initialName: string | null; initialPhone: string | null; email: string; initialAvatarUrl?: string | null }

export function ProfileEditor({ userId, initialName, initialPhone, email, initialAvatarUrl }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName ?? '')
  const [phone, setPhone] = useState(initialPhone ?? '')
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = name ? name.slice(0, 2) : email.slice(0, 2).toUpperCase()

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('이미지는 2MB 이하만 가능해요.'); return }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('JPG / PNG / WebP 형식만 가능해요.'); return
    }

    setUploading(true)
    const supabase = createClient()
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
    const path = `${userId}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setUploading(false)
      toast.error('업로드에 실패했어요.')
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    // 캐시 무효화를 위해 타임스탬프 쿼리 부착
    const url = `${publicUrl}?v=${Date.now()}`
    const { error: updateError } = await supabase.from('profiles').update({ avatar_url: url }).eq('id', userId)
    setUploading(false)

    if (updateError) { toast.error('저장에 실패했어요.'); return }
    setAvatarUrl(url)
    toast.success('프로필 사진이 변경됐어요.')
  }

  const save = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) { toast.error('이름을 입력해주세요.'); return }
    if (trimmedName.length > 20) { toast.error('이름은 20자 이내로 입력해주세요.'); return }
    if (phone && !/^[\d\-+\s()]{0,20}$/.test(phone)) { toast.error('올바른 전화번호 형식이 아니에요.'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ name: trimmedName, phone: phone.trim() || null }).eq('id', userId)
    setSaving(false)
    if (error) { toast.error('저장에 실패했어요.'); return }
    toast.success('프로필이 저장됐어요.')
    setEditing(false)
  }

  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="relative shrink-0">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label="프로필 사진 변경"
          className="block w-14 h-14 rounded-full overflow-hidden bg-[#2d7a4f] text-white group relative"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="프로필 사진" className="w-full h-full object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-lg font-bold">{initials}</span>
          )}
          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
            {uploading
              ? <Loader2 size={16} className="animate-spin text-white" />
              : <Camera size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleAvatarChange}
          className="hidden"
        />
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