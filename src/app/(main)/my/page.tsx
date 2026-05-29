import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, ORDER_STATUS_LABEL, SUBSCRIPTION_PLAN_LABEL } from '@/lib/utils'
import { Package, RefreshCw, ChevronRight, Target, Calendar, Heart, Coins, Ticket, MapPin, Bell } from 'lucide-react'
import { AIRecommend } from '@/components/my/AIRecommend'
import { SubscriptionActions } from '@/components/my/SubscriptionActions'
import { ReferralCard } from '@/components/my/ReferralCard'
import { WeeklyNutritionReport } from '@/components/my/WeeklyNutritionReport'
import { GoalEditor } from '@/components/my/GoalEditor'
import { MembershipBadge } from '@/components/my/MembershipBadge'
import { AllergySettings } from '@/components/my/AllergySettings'
import { ProfileEditor } from '@/components/my/ProfileEditor'
import { WithdrawButton } from '@/components/my/WithdrawButton'
import { HealthProfileButton } from '@/components/my/HealthProfileButton'
import type { Order, Subscription } from '@/types'

const GOAL_INFO: Record<string, { label: string; emoji: string; calTarget: number; proteinTarget: number }> = {
  diet:     { label: '다이어트', emoji: '🥗', calTarget: 1500, proteinTarget: 80 },
  balanced: { label: '균형식',   emoji: '⚖️', calTarget: 2000, proteinTarget: 100 },
  muscle:   { label: '근육 증가', emoji: '💪', calTarget: 2500, proteinTarget: 150 },
}

async function getMyData(userId: string) {
  const supabase = await createClient()

  const [ordersRes, subRes] = await Promise.all([
    supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url, calories, protein))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'paused'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return {
    orders: (ordersRes.data ?? []) as Order[],
    subscription: subRes.data as Subscription | null,
  }
}

function DeliveryCalendar({ nextDeliveryAt }: { nextDeliveryAt: string | null }) {
  if (!nextDeliveryAt) return null
  const next = new Date(nextDeliveryAt)
  const today = new Date()
  const daysUntil = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const month = next.getMonth() + 1
  const day = next.getDate()
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[next.getDay()]

  return (
    <div className="mt-3 bg-surface rounded-xl border border-[#2d7a4f]/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={15} className="text-[#2d7a4f]" />
        <span className="text-sm font-medium text-ink-2">다음 배송 일정</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center bg-green-tint rounded-xl px-4 py-2.5">
          <p className="text-xs text-ink-4">{month}월</p>
          <p className="text-2xl font-bold text-[#2d7a4f]">{day}</p>
          <p className="text-xs text-ink-4">{weekday}요일</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">
            {daysUntil > 0 ? `${daysUntil}일 후 배송` : '오늘 배송!'}
          </p>
          <p className="text-xs text-ink-5 mt-0.5">{formatDate(nextDeliveryAt)} 예정</p>
          <div className="mt-2 w-32 bg-tint rounded-full h-1.5">
            <div
              className="bg-[#2d7a4f] h-1.5 rounded-full transition-all"
              style={{ width: `${Math.max(10, 100 - Math.min(100, daysUntil * 10))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function MyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, point_balance, referral_code, allergen_profile, role')
    .eq('id', user.id)
    .maybeSingle()

  const { orders, subscription } = await getMyData(user.id)

  // 누적 결제 총액 (paid 주문만)
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('total_price')
    .eq('user_id', user.id)
    .eq('payment_status', 'paid')
  const totalOrderAmount = (paidOrders ?? []).reduce((s, o) => s + (o.total_price ?? 0), 0)

  const goal = profile?.nutrition_goal ?? 'balanced'
  const goalInfo = GOAL_INFO[goal] ?? GOAL_INFO.balanced

  const todayStr = new Date().toISOString().split('T')[0]
  const todayOrderItems = orders
    .filter((o) => o.payment_status === 'paid' && o.created_at?.startsWith(todayStr))
    .flatMap((o) => o.order_items ?? [])
  const todayCal = todayOrderItems.reduce((s: number, i: { products?: { calories?: number | null } | null; quantity: number }) => s + ((i.products?.calories ?? 0) * i.quantity), 0)
  const todayProtein = todayOrderItems.reduce((s: number, i: { products?: { protein?: number | null } | null; quantity: number }) => s + ((i.products?.protein ?? 0) * i.quantity), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-ink">마이페이지</h1>
        {profile?.role === 'admin' && (
          <Link href="/admin" className="text-xs text-ink-5 hover:text-ink-3 transition-colors">
            관리자 →
          </Link>
        )}
      </div>

      <div className="grid gap-5">
        {/* 프로필 + 영양 목표 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-4 mb-4">
            <ProfileEditor userId={user.id} initialName={profile?.name ?? null} initialPhone={profile?.phone ?? null} email={user.email ?? ''} />
            <GoalEditor current={goal} userId={user.id} />
          </div>

          {/* 영양 목표 진행률 */}
          <div className="bg-cream rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-[#2d7a4f]" />
              <span className="text-sm font-medium text-ink-2">오늘의 영양 목표</span>
              <span className="text-xs text-ink-5 ml-auto">최근 주문 기준</span>
            </div>
            <div className="space-y-3">
              {[
                { label: '칼로리', current: todayCal, target: goalInfo.calTarget, unit: 'kcal', color: 'bg-orange-400' },
                { label: '단백질', current: todayProtein, target: goalInfo.proteinTarget, unit: 'g', color: 'bg-[#2d7a4f]' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-ink-3 mb-1">
                    <span>{item.label}</span>
                    <span>{item.current} / {item.target} {item.unit}</span>
                  </div>
                  <div className="w-full bg-line-2 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all`}
                      style={{ width: `${Math.min(100, (item.current / item.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 멤버십 등급 */}
        <MembershipBadge totalOrderAmount={totalOrderAmount} />

        {/* 친구 초대 */}
        <ReferralCard code={profile?.referral_code ?? null} />

        {/* 퀵 링크 그리드 */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/my/wishlist"
            className="flex items-center justify-between bg-surface rounded-2xl border border-line p-4 hover:border-[#2d7a4f]/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart size={16} className="text-red-400" fill="currentColor" />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">찜 목록</p>
                <p className="text-xs text-ink-5 mt-0.5">저장한 밀키트</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-5 group-hover:text-[#2d7a4f] transition-colors" />
          </Link>
          <Link
            href="/my/points"
            className="flex items-center justify-between bg-surface rounded-2xl border border-line p-4 hover:border-[#2d7a4f]/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Coins size={16} className="text-yellow-500" />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">포인트</p>
                <p className="text-xs text-ink-5 mt-0.5">{(profile?.point_balance ?? 0).toLocaleString()}P 보유</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-5 group-hover:text-[#2d7a4f] transition-colors" />
          </Link>
          <Link
            href="/my/coupons"
            className="flex items-center justify-between bg-surface rounded-2xl border border-line p-4 hover:border-[#2d7a4f]/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                <Ticket size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">쿠폰함</p>
                <p className="text-xs text-ink-5 mt-0.5">보유 쿠폰 관리</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-5 group-hover:text-[#2d7a4f] transition-colors" />
          </Link>
          <Link
            href="/my/addresses"
            className="flex items-center justify-between bg-surface rounded-2xl border border-line p-4 hover:border-[#2d7a4f]/30 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <MapPin size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">배송지</p>
                <p className="text-xs text-ink-5 mt-0.5">배송지 관리</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-5 group-hover:text-[#2d7a4f] transition-colors" />
          </Link>
          <Link
            href="/my/notifications"
            className="flex items-center justify-between bg-surface rounded-2xl border border-line p-4 hover:border-[#2d7a4f]/30 transition-colors group col-span-2"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                <Bell size={16} className="text-[#2d7a4f]" />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">알림 센터</p>
                <p className="text-xs text-ink-5 mt-0.5">주문·재입고·이벤트 알림</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-ink-5 group-hover:text-[#2d7a4f] transition-colors" />
          </Link>
        </div>

        {/* 알레르기 프로필 */}
        <AllergySettings
          userId={user.id}
          initial={(profile?.allergen_profile as string[]) ?? []}
        />

        {/* 주간 영양 리포트 */}
        <WeeklyNutritionReport userId={user.id} />

        {/* AI 맞춤 추천 */}
        <AIRecommend />

        {/* 구독 현황 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className="text-[#2d7a4f]" />
              <h2 className="font-semibold text-ink">구독 현황</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/my/subscription" className="text-sm text-[#2d7a4f] hover:underline font-medium">
                메뉴 변경
              </Link>
              <Link href="/subscription" className="text-sm text-ink-4 hover:underline">
                플랜 변경
              </Link>
            </div>
          </div>

          {subscription ? (
            <>
              <div className="bg-green-tint-2 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#2d7a4f]">
                      {SUBSCRIPTION_PLAN_LABEL[subscription.plan_type]} 플랜
                    </p>
                    <p className="text-sm text-ink-4 mt-1">활성 구독</p>
                  </div>
                  <span className="text-xs bg-[#2d7a4f] text-white px-2.5 py-1 rounded-full font-medium">
                    구독 중
                  </span>
                </div>
              </div>
              <DeliveryCalendar nextDeliveryAt={subscription.next_delivery_at} />
              <SubscriptionActions
                status={subscription.status as 'active' | 'paused'}
                subscriptionId={subscription.id}
                nextDeliveryAt={subscription.next_delivery_at}
              />
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-ink-5 text-sm mb-3">현재 구독 중인 플랜이 없습니다.</p>
              <Link href="/subscription" className="text-sm font-medium text-[#2d7a4f] hover:underline">
                구독 시작하기 →
              </Link>
            </div>
          )}
        </div>

        {/* 최근 주문 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#2d7a4f]" />
              <h2 className="font-semibold text-ink">최근 주문</h2>
            </div>
            <Link href="/my/orders" className="text-sm text-[#2d7a4f] hover:underline">
              전체 보기
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/my/orders/${order.id}`}
                  className="flex items-center justify-between py-3 border-b border-line last:border-0 hover:bg-tint rounded-lg -mx-1 px-1 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {ORDER_STATUS_LABEL[order.status]}
                    </p>
                    <p className="text-xs text-ink-5 mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{formatPrice(order.total_price)}</span>
                    <ChevronRight size={14} className="text-ink-5" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-ink-5 text-sm">
              주문 내역이 없습니다.
            </div>
          )}
        </div>

        {/* 계정 설정 */}
        <div className="pt-2 flex items-center justify-between text-xs text-ink-5">
          <div className="flex items-center gap-4">
            <span>GreenEat v1.0</span>
            <HealthProfileButton />
          </div>
          <WithdrawButton />
        </div>
      </div>
    </div>
  )
}
