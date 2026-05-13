'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Star, Pencil, Trash2, X, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

type Address = {
  id: string
  label: string | null
  address: string
  detail: string | null
  is_default: boolean
}

type FormState = { label: string; address: string; detail: string }
const EMPTY: FormState = { label: '', address: '', detail: '' }

export function AddressManager({
  userId,
  initialAddresses,
}: {
  userId: string
  initialAddresses: Address[]
}) {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openNew() {
    setEditId(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  function openEdit(addr: Address) {
    setEditId(addr.id)
    setForm({ label: addr.label ?? '', address: addr.address, detail: addr.detail ?? '' })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY)
  }

  async function handleSave() {
    if (!form.address.trim()) { toast.error('주소를 입력해주세요.'); return }
    setSaving(true)
    const supabase = createClient()

    if (editId) {
      const { data, error } = await supabase
        .from('addresses')
        .update({
          label: form.label.trim() || null,
          address: form.address.trim(),
          detail: form.detail.trim() || null,
        })
        .eq('id', editId)
        .select()
        .single()

      if (!error && data) {
        setAddresses((prev) => prev.map((a) => (a.id === editId ? (data as Address) : a)))
        toast.success('배송지를 수정했습니다.')
        closeForm()
      }
    } else {
      const isFirst = addresses.length === 0
      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          label: form.label.trim() || null,
          address: form.address.trim(),
          detail: form.detail.trim() || null,
          is_default: isFirst,
        })
        .select()
        .single()

      if (!error && data) {
        setAddresses((prev) => [...prev, data as Address])
        toast.success('배송지를 추가했습니다.')
        closeForm()
      }
    }
    setSaving(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const supabase = createClient()
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses((prev) => prev.filter((a) => a.id !== id))
    toast.success('배송지를 삭제했습니다.')
    setDeletingId(null)
    router.refresh()
  }

  async function handleSetDefault(id: string) {
    const supabase = createClient()
    // 기존 기본 해제 후 새 기본 설정
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId)
    await supabase.from('addresses').update({ is_default: true }).eq('id', id)
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    )
    toast.success('기본 배송지로 설정했습니다.')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* 주소 목록 */}
      {addresses.length === 0 && !showForm && (
        <div className="text-center py-14 bg-surface rounded-2xl border border-line">
          <MapPin size={32} className="text-ink-5 mx-auto mb-3" />
          <p className="text-sm text-ink-5">저장된 배송지가 없습니다.</p>
        </div>
      )}

      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={`bg-surface rounded-2xl border p-5 transition-colors ${
            addr.is_default ? 'border-[#2d7a4f]/40' : 'border-line'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <MapPin size={16} className={`mt-0.5 shrink-0 ${addr.is_default ? 'text-[#2d7a4f]' : 'text-ink-5'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {addr.label && (
                    <span className="text-xs font-medium text-ink-3 bg-tint px-2 py-0.5 rounded-full">
                      {addr.label}
                    </span>
                  )}
                  {addr.is_default && (
                    <span className="text-xs font-medium text-[#2d7a4f] bg-green-tint px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={10} fill="currentColor" />
                      기본
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-ink mt-1">{addr.address}</p>
                {addr.detail && <p className="text-xs text-ink-4 mt-0.5">{addr.detail}</p>}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!addr.is_default && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="p-2 text-ink-5 hover:text-yellow-500 transition-colors"
                  title="기본 배송지로 설정"
                >
                  <Star size={15} />
                </button>
              )}
              <button
                onClick={() => openEdit(addr)}
                className="p-2 text-ink-5 hover:text-[#2d7a4f] transition-colors"
                title="수정"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                disabled={deletingId === addr.id}
                className="p-2 text-ink-5 hover:text-red-400 transition-colors disabled:opacity-40"
                title="삭제"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* 추가 폼 */}
      {showForm && (
        <div className="bg-surface rounded-2xl border border-[#2d7a4f]/30 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">{editId ? '배송지 수정' : '새 배송지 추가'}</h3>
            <button onClick={closeForm} className="text-ink-5 hover:text-ink-3">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-ink-4 mb-1">별칭 (선택)</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="집, 회사, 부모님 집 등"
                className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:border-[#2d7a4f] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-4 mb-1">주소 *</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="도로명 주소를 입력하세요"
                className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:border-[#2d7a4f] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-ink-4 mb-1">상세 주소</label>
              <input
                type="text"
                value={form.detail}
                onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
                placeholder="동, 호수 등"
                className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:border-[#2d7a4f] transition-colors"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#2d7a4f] text-white text-sm font-medium rounded-xl hover:bg-[#235f3d] disabled:opacity-50 transition-colors"
              >
                <Check size={15} />
                {saving ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={closeForm}
                className="px-4 py-2.5 border border-line-2 rounded-xl text-sm text-ink-3 hover:border-line-3 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 추가 버튼 */}
      {!showForm && (
        <button
          onClick={openNew}
          className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-line-2 rounded-2xl text-sm text-ink-4 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
        >
          <Plus size={16} />
          배송지 추가
        </button>
      )}
    </div>
  )
}
