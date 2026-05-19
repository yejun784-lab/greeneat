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

// Supabase Auth 영어 에러 메시지 → 한국어 변환
const AUTH_ERROR_MAP: [RegExp | string, string][] = [
  ['User already registered',                   '이미 가입된 이메일이에요.'],
  ['Email already in use',                       '이미 사용 중인 이메일이에요.'],
  ['Invalid login credentials',                  '이메일 또는 비밀번호가 올바르지 않아요.'],
  ['Email not confirmed',                        '이메일 인증이 완료되지 않았어요. 메일함을 확인해주세요.'],
  ['Password should be at least',                '비밀번호는 6자 이상이어야 해요.'],
  ['Signup requires a valid password',           '올바른 비밀번호를 입력해주세요.'],
  [/invalid.*email/i,                            '올바른 이메일 형식을 입력해주세요.'],
  ['Email rate limit exceeded',                  '요청이 너무 많아요. 잠시 후 다시 시도해주세요.'],
  ['For security purposes',                      '보안을 위해 잠시 후 다시 시도해주세요.'],
  ['Token has expired',                          '링크가 만료됐어요. 다시 요청해주세요.'],
  ['User not found',                             '가입된 이메일을 찾을 수 없어요.'],
  ['New password should be different',           '현재 비밀번호와 다른 비밀번호를 입력해주세요.'],
  ['Auth session missing',                       '로그인 세션이 만료됐어요. 다시 로그인해주세요.'],
  ['Unable to validate email address',           '이메일 주소를 확인할 수 없어요.'],
]

export function translateAuthError(message: string): string {
  for (const [pattern, korean] of AUTH_ERROR_MAP) {
    if (typeof pattern === 'string' ? message.includes(pattern) : pattern.test(message)) {
      return korean
    }
  }
  return '오류가 발생했어요. 잠시 후 다시 시도해주세요.'
}
