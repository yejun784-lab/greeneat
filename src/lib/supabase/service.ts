import { createClient } from '@supabase/supabase-js'

/** 서버-투-서버 전용 (웹훅 등). RLS 우회. 클라이언트 노출 절대 금지. */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
