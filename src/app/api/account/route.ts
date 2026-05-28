import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// DELETE /api/account — 회원 탈퇴
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  // service_role 키로 auth.users 삭제 (일반 클라이언트는 권한 없음)
  const adminUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const adminKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!adminKey) {
    console.error('[account/DELETE] SUPABASE_SERVICE_ROLE_KEY 미설정 — auth 계정 삭제 불가')
    return NextResponse.json({ error: '서버 설정 오류로 탈퇴를 처리할 수 없습니다. 관리자에게 문의해주세요.' }, { status: 503 })
  }

  const admin = createAdminClient(adminUrl, adminKey)
  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    return NextResponse.json({ error: '탈퇴 처리 중 오류가 발생했어요.' }, { status: 500 })
  }

  await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
