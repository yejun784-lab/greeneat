import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { AddressManager } from '@/components/my/AddressManager'

export default async function AddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/my" className="flex items-center gap-1 text-sm text-ink-4 hover:text-ink-2 mb-6">
        <ChevronLeft size={16} />
        마이페이지
      </Link>

      <div className="flex items-center gap-2 mb-6">
        <MapPin size={20} className="text-[#2d7a4f]" />
        <h1 className="text-2xl font-bold text-ink">배송지 관리</h1>
      </div>

      <AddressManager userId={user.id} initialAddresses={data ?? []} />
    </div>
  )
}
