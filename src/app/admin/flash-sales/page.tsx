import { redirect } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { FlashSaleForm, FlashSaleToggle, FlashSaleDelete } from '@/components/admin/FlashSaleForm'
import { Package, Zap } from 'lucide-react'

type FlashSale = {
  id: string
  product_id: string
  discount_rate: number
  starts_at: string
  ends_at: string
  is_active: boolean
  created_at: string
  products: {
    id: string
    name: string
    price: number
    image_url: string | null
  } | null
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ sale }: { sale: FlashSale }) {
  const now = new Date()
  let label: string
  let cls: string

  if (!sale.is_active) {
    label = '비활성'
    cls = 'bg-tint text-ink-5'
  } else if (now < new Date(sale.starts_at)) {
    label = '예정'
    cls = 'bg-blue-50 text-blue-600'
  } else if (now > new Date(sale.ends_at)) {
    label = '종료'
    cls = 'bg-tint text-ink-5'
  } else {
    label = '진행중'
    cls = 'bg-green-50 text-green-600'
  }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{label}</span>
  )
}

export default async function AdminFlashSalesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  const { data } = await supabase
    .from('flash_sales')
    .select('*, products(id, name, price, image_url)')
    .order('created_at', { ascending: false })

  const sales = (data ?? []) as unknown as FlashSale[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">타임세일 관리</h1>
          <p className="text-sm text-ink-4 mt-1">총 {sales.length}개 타임세일</p>
        </div>
        <FlashSaleForm />
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상품</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">할인율</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">할인가</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">시작</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">종료</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상태</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sales.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Zap size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-5">등록된 타임세일이 없습니다.</p>
                  </td>
                </tr>
              )}
              {sales.map((sale) => {
                const product = sale.products
                const salePrice = product ? Math.floor(product.price * (1 - sale.discount_rate / 100)) : null
                return (
                  <tr key={sale.id} className="hover:bg-wash/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-wash shrink-0">
                          {product?.image_url ? (
                            <Image src={product.image_url} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={14} className="text-ink-5" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-ink">{product?.name ?? '삭제된 상품'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#2d7a4f]">{sale.discount_rate}%</td>
                    <td className="px-4 py-3">
                      {product && salePrice !== null ? (
                        <div>
                          <p className="font-semibold text-ink">{formatPrice(salePrice)}</p>
                          <p className="text-xs text-ink-5 line-through">{formatPrice(product.price)}</p>
                        </div>
                      ) : (
                        <span className="text-ink-5">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-4 text-xs">{formatDateTime(sale.starts_at)}</td>
                    <td className="px-4 py-3 text-ink-4 text-xs">{formatDateTime(sale.ends_at)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge sale={sale} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FlashSaleToggle id={sale.id} isActive={sale.is_active} />
                        <FlashSaleDelete id={sale.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
