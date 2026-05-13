export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: '결제 대기',
  confirmed: '주문 확인',
  preparing: '준비 중',
  shipped: '배송 중',
  delivered: '배송 완료',
  cancelled: '주문 취소',
}

export const SUBSCRIPTION_PLAN_LABEL: Record<string, string> = {
  basic: '베이직',
  standard: '스탠다드',
  premium: '프리미엄',
}
