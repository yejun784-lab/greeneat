import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserPointAdjust } from '@/components/admin/UserPointAdjust'
import { UserRoleToggle } from '@/components/admin/UserRoleToggle'
import { Users, Shield } from 'lucide-react'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  // profiles 테이블 기준으로 회원 목록 조회
  const { data: users } = await supabase
    .from('profiles')
    .select('id, name, phone, role, point_balance, created_at')
    .order('created_at', { ascending: false })

  // 각 유저의 주문 수를 배치로 가져오기
  const { data: orderCounts } = await supabase
    .from('orders')
    .select('user_id')
    .eq('payment_status', 'paid')

  const countMap: Record<string, number> = {}
  for (const o of orderCounts ?? []) {
    countMap[o.user_id] = (countMap[o.user_id] ?? 0) + 1
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">회원 관리</h1>
          <p className="text-sm text-ink-4 mt-1">총 {users?.length ?? 0}명</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">회원</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">연락처</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">권한</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">포인트</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주문 수</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">가입일</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Users size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-5">가입한 회원이 없습니다.</p>
                  </td>
                </tr>
              )}
              {(users ?? []).map((u) => (
                <tr key={u.id} className="hover:bg-wash/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{u.name ?? '이름 없음'}</p>
                    <p className="text-xs text-ink-5 font-mono">{u.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-xs">
                    {u.phone ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-tint text-ink-4'
                    }`}>
                      {u.role === 'admin' && <Shield size={10} />}
                      {u.role === 'admin' ? '어드민' : '회원'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-[#2d7a4f]">
                      {(u.point_balance ?? 0).toLocaleString()}P
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-sm">
                    {countMap[u.id] ?? 0}건
                  </td>
                  <td className="px-4 py-3 text-ink-5 text-xs">
                    {new Date(u.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <UserPointAdjust
                        userId={u.id}
                        userName={u.name ?? '회원'}
                        currentBalance={u.point_balance ?? 0}
                      />
                      {u.id !== user.id && (
                        <UserRoleToggle
                          userId={u.id}
                          userName={u.name ?? '회원'}
                          currentRole={u.role ?? 'user'}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
