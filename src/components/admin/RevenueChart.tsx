'use client'

interface DayData {
  date: string   // 'MM/DD'
  revenue: number
}

interface Props {
  data: DayData[]
  height?: number
}

export function RevenueChart({ data, height = 120 }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[120px] text-ink-5 text-sm">
        데이터가 없습니다
      </div>
    )
  }

  const maxVal = Math.max(...data.map((d) => d.revenue), 1)
  const W = 560
  const H = height
  const padX = 8
  const padY = 12
  const chartW = W - padX * 2
  const chartH = H - padY * 2
  const step = chartW / Math.max(data.length - 1, 1)

  const points = data.map((d, i) => ({
    x: padX + i * step,
    y: padY + chartH - (d.revenue / maxVal) * chartH,
    ...d,
  }))

  // SVG polyline path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  // Fill area
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${(padY + chartH).toFixed(1)} L${points[0].x.toFixed(1)},${(padY + chartH).toFixed(1)} Z`

  const formatK = (v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}만` : v.toLocaleString()

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: `${height}px` }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d7a4f" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2d7a4f" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* 그리드 라인 */}
        {[0, 0.5, 1].map((t) => {
          const y = padY + chartH * (1 - t)
          return (
            <g key={t}>
              <line x1={padX} y1={y} x2={W - padX} y2={y} stroke="var(--color-line-2, #e5e7eb)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={padX} y={y - 3} fontSize="9" fill="var(--color-ink-5, #9ca3af)">
                {formatK(maxVal * t)}
              </text>
            </g>
          )
        })}

        {/* 면적 */}
        <path d={areaPath} fill="url(#chartGrad)" />

        {/* 선 */}
        <path d={linePath} fill="none" stroke="#2d7a4f" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* 데이터 포인트 */}
        {points.map((p) => (
          <circle key={p.date} cx={p.x} cy={p.y} r="3" fill="#2d7a4f" />
        ))}
      </svg>

      {/* X축 날짜 레이블 */}
      <div className="flex justify-between px-2 mt-1">
        {data.map((d, i) => {
          // 처음, 중간, 끝만 표시 (데이터가 많을 때 겹침 방지)
          const show = i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)
          return (
            <span key={d.date} className={`text-[10px] text-ink-5 ${show ? '' : 'invisible'}`}>
              {d.date}
            </span>
          )
        })}
      </div>
    </div>
  )
}
