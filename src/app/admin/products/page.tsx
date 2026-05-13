import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { ProductForm } from '@/components/admin/ProductForm'
import { ProductDeleteButton } from '@/components/admin/ProductDeleteButton'
import { Package, Plus, PencilLine, ChefHat } from 'lucide-react'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_categories(id, name, slug)')
      .order('created_at', { ascending: false }),
    supabase
      .from('product_categories')
      .select('id, name, slug')
      .order('name'),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">상품 관리</h1>
          <p className="text-sm text-ink-4 mt-1">총 {products?.length ?? 0}개 상품</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-ink-4 hover:underline">← 대시보드</Link>
          <ProductForm categories={categories ?? []} mode="create" />
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-14">이미지</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상품명</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">카테고리</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">가격</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">재고</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상태</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-24">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(!products || products.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Package size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-5">등록된 상품이 없습니다.</p>
                  </td>
                </tr>
              )}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(products ?? []).map((p: any) => (
                <tr key={p.id} className="hover:bg-wash/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-wash shrink-0">
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={14} className="text-ink-5" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-ink-5 mt-0.5 line-clamp-1">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-xs">
                    {p.product_categories?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${
                      p.stock === 0 ? 'text-red-500' : p.stock < 20 ? 'text-orange-500' : 'text-ink'
                    }`}>
                      {p.stock === 0 ? '품절' : `${p.stock}개`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.is_active ? 'bg-green-50 text-green-600' : 'bg-tint text-ink-5'
                      }`}>
                        {p.is_active ? '판매중' : '숨김'}
                      </span>
                      {p.is_subscription && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">구독</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <ProductForm
                        categories={categories ?? []}
                        mode="edit"
                        product={p}
                        trigger={
                          <button className="p-1.5 text-ink-5 hover:text-[#2d7a4f] hover:bg-green-tint rounded-lg transition-colors">
                            <PencilLine size={14} />
                          </button>
                        }
                      />
                      <Link href={`/admin/products/${p.id}/recipe`}>
                        <button className="p-1.5 text-ink-5 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="레시피 관리">
                          <ChefHat size={14} />
                        </button>
                      </Link>
                      <ProductDeleteButton productId={p.id} productName={p.name} />
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
