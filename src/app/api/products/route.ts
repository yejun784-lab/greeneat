import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category   = searchParams.get('category') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''
  const servings   = searchParams.get('servings') ?? ''
  const sort       = searchParams.get('sort') ?? 'newest'
  const search     = searchParams.get('search') ?? ''
  const exclude    = searchParams.get('exclude') ?? ''
  const page       = parseInt(searchParams.get('page') ?? '1', 10)
  const limit      = parseInt(searchParams.get('limit') ?? '9', 10)
  const from       = (page - 1) * limit
  const to         = from + limit - 1

  const supabase = await createClient()

  const selectClause = category
    ? '*, product_categories!inner(id, name, slug, description)'
    : '*, product_categories(id, name, slug, description)'

  let query = supabase.from('products').select(selectClause, { count: 'exact' })

  if (category)   query = query.eq('product_categories.slug', category)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (servings)   query = query.eq('servings', Number(servings))
  if (search)     query = query.ilike('name', `%${search}%`)
  if (exclude)    query = query.not('allergens', 'cs', `{${exclude}}`)

  if (sort === 'price_asc')  query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    products: data ?? [],
    total: count ?? 0,
    page,
    hasMore: to < (count ?? 0) - 1,
  })
}
