import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { RecipeStepForm } from '@/components/admin/RecipeStepForm'
import { ChevronLeft } from 'lucide-react'

export default async function AdminRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  const [{ data: product }, { data: steps }] = await Promise.all([
    supabase.from('products').select('id, name').eq('id', id).single(),
    supabase
      .from('recipe_steps')
      .select('id, step_number, title, description, duration_minutes')
      .eq('product_id', id)
      .order('step_number'),
  ])

  if (!product) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/admin/products" className="p-1 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">레시피 관리</h1>
          <p className="text-sm text-ink-4 mt-0.5">{product.name}</p>
        </div>
      </div>

      <RecipeStepForm
        productId={id}
        productName={product.name}
        initialSteps={steps ?? []}
      />
    </div>
  )
}
