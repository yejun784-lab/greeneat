'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

interface Props {
  userId: string
  userName: string
  currentRole: string
}

export function UserRoleToggle({ userId, userName, currentRole }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const isAdmin = currentRole === 'admin'

  async function toggle() {
    setLoading(true)
    setOpen(false)
    const newRole = isAdmin ? 'user' : 'admin'
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
    if (error) toast.error('권한 변경 실패')
    else { toast.success(`${userName}님을 ${newRole === 'admin' ? '어드민' : '일반회원'}으로 변경했습니다.`); router.refresh() }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={loading}
        className={`p-1.5 rounded-lg transition-colors ${isAdmin ? 'text-purple-500 bg-purple-50 hover:bg-purple-100' : 'text-ink-5 hover:text-purple-500 hover:bg-purple-50'}`}
        title={isAdmin ? '어드민 → 일반회원' : '일반회원 → 어드민'}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setOpen(false)}>
          <div className="bg-surface rounded-2xl border border-line p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-ink text-base mb-2">권한 변경</h3>
            <p className="text-sm text-ink-4 mb-5">
              <span className="font-semibold text-ink">{userName}</span>님을{' '}
              <span className={`font-semibold ${isAdmin ? 'text-ink' : 'text-purple-600'}`}>
                {isAdmin ? '일반회원' : '어드민'}
              </span>으로 변경하시겠습니까?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setOpen(false)} className="px-4 py-2 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash">취소</button>
              <button onClick={toggle} className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${isAdmin ? 'bg-ink hover:bg-ink-2' : 'bg-purple-500 hover:bg-purple-600'}`}>
                변경
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
