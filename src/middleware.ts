import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export const config = {
  matcher: ['/api/:path*'],
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // IP 추출: Vercel/프록시 환경 우선, 없으면 unknown 처리
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  const { allowed, remaining, limit } = checkRateLimit(ip, pathname)

  if (!allowed) {
    return NextResponse.json(
      { error: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'Retry-After': '60',
        },
      },
    )
  }

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(limit))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  return response
}
