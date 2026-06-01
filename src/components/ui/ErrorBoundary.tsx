'use client'

import { Component, type ReactNode } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  /** 커스텀 폴백 UI — 생략 시 기본 카드 표시 */
  fallback?: ReactNode
  /** 에러 발생 시 콜백 */
  onError?: (error: Error) => void
  /** 폴백 카드에 표시할 컨텍스트 이름 (예: "피드", "건강관리") */
  label?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error)
    this.props.onError?.(error)
  }

  reset = () => this.setState({ hasError: false, error: null })

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center rounded-2xl border border-line bg-surface">
        <AlertTriangle size={28} className="text-orange-400" />
        <div>
          <p className="font-semibold text-ink text-sm">
            {this.props.label ? `${this.props.label} 로드 오류` : '일시적인 오류가 발생했어요'}
          </p>
          <p className="text-xs text-ink-5 mt-1">잠시 후 다시 시도해주세요</p>
        </div>
        <button
          onClick={this.reset}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white text-xs font-medium rounded-lg hover:bg-[#235f3d] transition-colors"
        >
          <RefreshCw size={12} />
          다시 시도
        </button>
      </div>
    )
  }
}

/**
 * 함수형 컴포넌트용 래퍼 — 간단하게 쓸 때 사용
 * <WithErrorBoundary label="피드"><FeedClient /></WithErrorBoundary>
 */
export function WithErrorBoundary({ children, label, fallback }: Props) {
  return (
    <ErrorBoundary label={label} fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}
