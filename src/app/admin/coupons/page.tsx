import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CouponForm } from '@/components/admin/CouponForm'
import { CouponDeleteButton } from '@/components/admin/CouponDeleteButton'
import { PencilLine, Tag } from 'lucide-react'

function formatDiscount(type: string, value: number) {
  return type === 'percent' ? `${value}%` : `${value.toLocaleString()}원`
}

function formatExpiry(expires_at: string | null) {
  if (!expires_at) return '무제한'
  const d = new Date(expires_at)
  const now = new Date()
  if (d < now) return <span className="text-red-500">만료됨</span>
  return d.toLocaleDateString('ko-KR', { year: '2-digit', month: 'short', day: 'numeric' })
}

export default async function AdminCouponsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  const { data: coupons } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">쿠폰 관리</h1>
          <p className="text-sm text-ink-4 mt-1">총 {coupons?.length ?? 0}개 쿠폰</p>
        </div>
        <CouponForm mode="create" />
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">코드</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">할인</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">최소 주문</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">사용 / 한도</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">만료일</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상태</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-20">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(!coupons || coupons.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Tag size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-5">등록된 쿠폰이 없습니다.</p>
                  </td>
                </tr>
              )}
              {(coupons ?? []).map((c) => (
                <tr key={c.id} className="hover:bg-wash/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-ink tracking-wider">{c.code}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#2d7a4f]">
                    {formatDiscount(c.discount_type, c.discount_value)}
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-xs">
                    {c.min_order_amount > 0 ? `${c.min_order_amount.toLocaleString()}원+` : '없음'}
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-xs">
                    {c.used_count ?? 0} / {c.max_uses ?? '∞'}
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-xs">
                    {formatExpiry(c.expires_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-50 text-green-600' : 'bg-tint text-ink-5'}`}>
                      {c.is_active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <CouponForm
                        mode="edit"
                        coupon={c}
                        trigger={
                          <button className="p-1.5 text-ink-5 hover:text-[#2d7a4f] hover:bg-green-tint rounded-lg transition-colors">
                            <PencilLine size={14} />
                          </button>
                        }
                      />
                      <CouponDeleteButton couponId={c.id} couponCode={c.code} />
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
