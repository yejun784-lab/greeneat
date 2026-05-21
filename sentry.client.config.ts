import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 프로덕션에서만 활성화
  enabled: process.env.NODE_ENV === 'production',

  // 성능 트래킹: 전체 트랜잭션의 10% 샘플링 (무료 티어 절약)
  tracesSampleRate: 0.1,

  // 세션 리플레이: 에러 발생 세션의 100%, 일반 세션의 1%
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.01,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,       // 개인정보 마스킹
      blockAllMedia: false,
    }),
  ],

  // 노이즈 제거: 무시할 에러 패턴
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    /^Loading chunk \d+ failed/,
    /^Failed to fetch/,
    'Network request failed',
    'ChunkLoadError',
  ],

  beforeSend(event) {
    // 개발 환경에서는 콘솔만 출력
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Sentry Dev]', event)
      return null
    }
    return event
  },
})
