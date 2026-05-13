export type ProductCategory = {
  id: string
  name: string
  slug: string
  description: string | null
}

export type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  servings: number
  cook_time: number | null
  difficulty: 'easy' | 'medium' | 'hard'
  image_url: string | null
  is_subscription: boolean
  is_active: boolean
  stock: number
  created_at: string
  product_categories?: ProductCategory
}

export type Profile = {
  id: string
  name: string | null
  phone: string | null
  nutrition_goal: string | null
  created_at: string
}

export type Address = {
  id: string
  user_id: string
  label: string
  address: string
  detail: string | null
  is_default: boolean
}

export type CartItem = {
  id: string
  user_id: string
  product_id: string
  quantity: number
  is_subscription: boolean
  created_at: string
  products?: Product
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type Order = {
  id: string
  user_id: string
  status: OrderStatus
  total_price: number
  payment_method: string | null
  payment_status: PaymentStatus
  address_id: string | null
  created_at: string
  order_items?: OrderItem[]
  addresses?: Address
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
  products?: Product
}

export type SubscriptionPlanType = 'basic' | 'standard' | 'premium'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

export type Subscription = {
  id: string
  user_id: string
  plan_type: SubscriptionPlanType
  status: SubscriptionStatus
  delivery_day: number
  next_delivery_at: string | null
  created_at: string
  subscription_items?: SubscriptionItem[]
}

export type SubscriptionItem = {
  id: string
  subscription_id: string
  product_id: string
  quantity: number
  products?: Product
}

export type Review = {
  id: string
  user_id: string
  product_id: string
  rating: number
  content: string | null
  created_at: string
  profiles?: { name: string | null }
}

export type RecipeStep = {
  id: string
  product_id: string
  step_number: number
  title: string
  description: string
  duration_minutes: number | null
  created_at: string
}

export type Coupon = {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

export type FilterState = {
  category?: string
  minCalories?: number
  maxCalories?: number
  servings?: number
  difficulty?: string
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc'
}
