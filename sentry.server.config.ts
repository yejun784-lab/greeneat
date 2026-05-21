import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,

  // 결제·주문 관련 에러는 100% 캡처
  tracesSampler: (samplingContext) => {
    const name = samplingContext.name ?? ''
    if (name.includes('/api/payment') || name.includes('/api/orders')) return 1.0
    return 0.1
  },
})
