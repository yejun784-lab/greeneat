'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AlertTriangle, CheckCircle2, AlertCircle, Package } from 'lucide-react'

type Product = {
  id: string
  name: string
  stock: number
  is_active: boolean
  price: number
  category?: string
}

export default function AdminInventoryPage() {
  const supabase = createClient()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile?.role !== 'admin') { window.location.href = '/'; return }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!authChecked) return
    fetchProducts()
  }, [authChecked])

  async function fetchProducts() {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('id, name, stock, is_active, price')
      .order('stock', { ascending: true })
    const list = (data ?? []) as Product[]
    setProducts(list)
    const inputs: Record<string, string> = {}
    for (const p of list) inputs[p.id] = String(p.stock)
    setStockInputs(inputs)
    setLoading(false)
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSaveStock(productId: string) {
    const raw = stockInputs[productId]
    const newStock = parseInt(raw, 10)
    if (isNaN(newStock) || newStock < 0) {
      showToast('error', '올바른 재고 수량을 입력해주세요.')
      return
    }
    setSaving(productId)
    const prevProduct = products.find((p) => p.id === productId)
    const prevStock = prevProduct?.stock ?? 0

    const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', productId)
    if (error) {
      showToast('error', '재고 업데이트에 실패했습니다.')
    } else {
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, stock: newStock } : p))
      showToast('success', '재고가 업데이트됐습니다.')

      // 재입고 알림 발송: 재고 0 → 1 이상으로 변경 시
      if (prevStock === 0 && newStock > 0 && prevProduct) {
        const { data: alerts } = await supabase
          .from('restock_alerts')
          .select('id')
          .eq('product_id', productId)
          .limit(1)
        if (alerts && alerts.length > 0) {
          try {
            const res = await fetch('/api/push/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productId, productName: prevProduct.name }),
            })
            if (res.ok) {
              const result = await res.json()
              showToast('success', `재입고 알림 ${result.sent}명에게 발송 완료!`)
            } else {
              showToast('error', '재입고 알림 발송에 실패했습니다.')
            }
          } catch {
            showToast('error', '재입고 알림 발송 중 오류가 발생했습니다.')
          }
        }
      }
    }
    setSaving(null)
  }

  async function handleToggleActive(productId: string, current: boolean) {
    setToggling(productId)
    const { error } = await supabase.from('products').update({ is_active: !current }).eq('id', productId)
    if (error) {
      showToast('error', '상태 변경에 실패했습니다.')
    } else {
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, is_active: !current } : p))
      showToast('success', !current ? '상품이 활성화됐습니다.' : '상품이 비활성화됐습니다.')
    }
    setToggling(null)
  }

  const lowStockProducts = products.filter((p) => p.stock < 10)
  const activeProducts = products.filter((p) => p.is_active)
  const inactiveProducts = products.filter((p) => !p.is_active)

  if (!authChecked || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-7 w-48 bg-line-2 rounded animate-pulse mb-4" />
        <div className="h-4 w-32 bg-line-2 rounded animate-pulse mb-8" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-5 mb-3 h-16 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 토스트 */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-[#2d7a4f] text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">재고 관리</h1>
          <p className="text-sm text-ink-4 mt-1">
            전체 {products.length}개 · 활성 {activeProducts.length}개 · 비활성 {inactiveProducts.length}개
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#2d7a4f] hover:underline">← 대시보드</a>
      </div>

      {/* 재고 부족 경고 */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-orange-500" />
            <span className="text-sm font-semibold text-orange-700">재고 부족 상품 {lowStockProducts.length}개</span>
            <span className="text-xs text-orange-500">(10개 미만)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((p) => (
              <span key={p.id} className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {p.name} — {p.stock === 0 ? '품절' : `${p.stock}개`}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 상품 목록 */}
      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상품명</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">판매가</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">현재 재고</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-48">재고 수정</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">활성 상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <Package size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-5">등록된 상품이 없습니다.</p>
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className={`hover:bg-wash/50 ${!product.is_active ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{product.name}</p>
                    <p className="text-xs font-mono text-ink-5">{product.id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-sm">
                    {(product.price ?? 0).toLocaleString('ko-KR')}원
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${
                      product.stock === 0 ? 'text-red-500' :
                      product.stock < 10 ? 'text-orange-500' : 'text-ink'
                    }`}>
                      {product.stock === 0 ? '품절' : `${product.stock}개`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={stockInputs[product.id] ?? ''}
                        onChange={(e) => setStockInputs((prev) => ({ ...prev, [product.id]: e.target.value }))}
                        className="w-20 text-xs border border-line rounded-lg px-2 py-1.5 bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-[#2d7a4f]"
                      />
                      <button
                        onClick={() => handleSaveStock(product.id)}
                        disabled={saving === product.id}
                        className="text-xs bg-[#2d7a4f] text-white px-3 py-1.5 rounded-lg hover:bg-[#245f3e] transition-colors disabled:opacity-50"
                      >
                        {saving === product.id ? '저장 중…' : '저장'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(product.id, product.is_active)}
                      disabled={toggling === product.id}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
                        product.is_active ? 'bg-[#2d7a4f]' : 'bg-line-2'
                      }`}
                      aria-label={product.is_active ? '비활성화' : '활성화'}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        product.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                    <span className="ml-2 text-xs text-ink-4">
                      {product.is_active ? '판매 중' : '판매 중지'}
                    </span>
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
