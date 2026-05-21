import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      // 신규 유저 판단: user_coupons가 0개 = 아직 웰컴 쿠폰 미지급
      const { count } = await supabase
        .from('user_coupons')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
      const isNew = (count ?? 0) === 0

      if (isNew) {
        // WELCOME10 쿠폰 찾기
        const { data: coupon } = await supabase
          .from('coupons')
          .select('id')
          .eq('code', 'WELCOME10')
          .eq('is_active', true)
          .maybeSingle()

        if (coupon) {
          // 중복 지급 방지: unique constraint violation 무시
          try {
            await supabase
              .from('user_coupons')
              .insert({ user_id: user.id, coupon_id: coupon.id })
          } catch {
            // unique constraint violation 무시
          }
        }

        // 웰컴 포인트 1000P
        const { data: profile } = await supabase
          .from('profiles')
          .select('point_balance')
          .eq('id', user.id)
          .maybeSingle()

        if (profile !== null) {
          await Promise.all([
            supabase.from('points').insert({
              user_id: user.id,
              amount: 1000,
              reason: '신규 가입 웰컴 포인트',
            }),
            supabase.from('profiles').update({
              point_balance: (profile.point_balance ?? 0) + 1000,
            }).eq('id', user.id),
          ])
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
