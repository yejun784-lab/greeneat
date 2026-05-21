/**
 * Sliding window in-memory rate limiter (Edge Runtime compatible)
 *
 * 외부 라이브러리 없이 순수 Map 기반으로 구현.
 * Edge Runtime에서는 isolate 간 메모리가 공유되지 않으므로
 * 이 구현은 단일 인스턴스 환경(개발 서버, 단일 edge worker)에 적합합니다.
 */

interface WindowEntry {
  timestamps: number[]
}

// 라우트 패턴별 분당 허용 요청 수
export const RATE_LIMIT_RULES: Array<{ pattern: RegExp; limit: number }> = [
  { pattern: /^\/api\/payment(\/|$)/, limit: 10 },
  { pattern: /^\/api\/chatbot(\/|$)/, limit: 20 },
  { pattern: /^\/api\/orders(\/|$)/, limit: 30 },
  { pattern: /^\/api\/auth(\/|$)/, limit: 10 },
  { pattern: /^\/api\//, limit: 60 },
]

const WINDOW_MS = 60_000 // 1분

// Edge Runtime 글로벌 스코프에 저장 (모듈 레벨 Map은 isolate 재시작 시 초기화됨)
declare const globalThis: typeof global & {
  __rateLimitStore?: Map<string, WindowEntry>
}

function getStore(): Map<string, WindowEntry> {
  if (!globalThis.__rateLimitStore) {
    globalThis.__rateLimitStore = new Map()
  }
  return globalThis.__rateLimitStore
}

/**
 * IP + 경로별 슬라이딩 윈도우 rate limit 확인
 * @returns { allowed: boolean; remaining: number; limit: number }
 */
export function checkRateLimit(
  ip: string,
  pathname: string,
): { allowed: boolean; remaining: number; limit: number } {
  const rule = RATE_LIMIT_RULES.find((r) => r.pattern.test(pathname))
  // 매칭 규칙 없으면 통과 (API 경로 외)
  if (!rule) return { allowed: true, remaining: 1, limit: 1 }

  const { limit } = rule
  const key = `${ip}:${rule.pattern.source}`
  const now = Date.now()
  const store = getStore()

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // 윈도우 밖의 타임스탬프 제거 (슬라이딩)
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < WINDOW_MS)

  if (entry.timestamps.length >= limit) {
    return { allowed: false, remaining: 0, limit }
  }

  entry.timestamps.push(now)
  return { allowed: true, remaining: limit - entry.timestamps.length, limit }
}
