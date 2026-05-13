import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/types'

interface NutritionBadgeProps {
  product: Pick<Product, 'calories' | 'protein' | 'difficulty' | 'cook_time' | 'servings'>
}

export function NutritionBadge({ product }: NutritionBadgeProps) {
  const diffLabel = { easy: '쉬움', medium: '보통', hard: '어려움' }[product.difficulty]
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.calories && (
        <Badge variant="green">{product.calories}kcal</Badge>
      )}
      {product.protein && (
        <Badge variant="blue">단백질 {product.protein}g</Badge>
      )}
      {product.cook_time && (
        <Badge variant="gray">{product.cook_time}분</Badge>
      )}
      <Badge variant="gray">{product.servings}인분</Badge>
      <Badge variant={product.difficulty === 'easy' ? 'green' : product.difficulty === 'hard' ? 'orange' : 'gray'}>
        {diffLabel}
      </Badge>
    </div>
  )
}
