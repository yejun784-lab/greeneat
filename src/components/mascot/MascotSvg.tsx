interface MascotSvgProps {
  size?: number
  /** idle | talking | happy | thinking */
  mood?: 'idle' | 'talking' | 'happy' | 'thinking'
  className?: string
}

export function MascotSvg({ size = 80, mood = 'idle', className = '' }: MascotSvgProps) {
  // 눈 깜빡임 / 표정은 mood 별로 다름
  const eyeY = mood === 'happy' ? 44 : 42
  const eyeOpen = mood !== 'thinking'

  // 입 모양
  const mouth =
    mood === 'happy'
      ? 'M 30 58 Q 40 66 50 58' // 크게 웃음
      : mood === 'talking'
      ? 'M 33 57 Q 40 63 47 57' // 살짝 벌림
      : mood === 'thinking'
      ? 'M 34 58 Q 40 56 46 58' // 살짝 삐죽
      : 'M 32 57 Q 40 63 48 57' // 기본 미소

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="그리니 마스코트"
    >
      {/* ── 새싹 줄기 ── */}
      <path
        d="M40 6 Q40 14 40 18"
        stroke="#2d7a4f"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ── 왼쪽 잎 ── */}
      <ellipse
        cx="33"
        cy="11"
        rx="7"
        ry="4"
        fill="#4caf72"
        transform="rotate(-30 33 11)"
      />

      {/* ── 오른쪽 잎 ── */}
      <ellipse
        cx="47"
        cy="11"
        rx="7"
        ry="4"
        fill="#4caf72"
        transform="rotate(30 47 11)"
      />

      {/* ── 얼굴 (그림자) ── */}
      <circle cx="41" cy="48" r="26" fill="#1f6b3e" opacity="0.15" />

      {/* ── 얼굴 본체 ── */}
      <circle cx="40" cy="47" r="26" fill="#2d7a4f" />

      {/* ── 얼굴 하이라이트 ── */}
      <ellipse cx="30" cy="37" rx="8" ry="5" fill="#4caf72" opacity="0.35" />

      {/* ── 볼 (왼) ── */}
      <ellipse cx="25" cy="54" rx="6" ry="4" fill="#ff9e7a" opacity="0.55" />
      {/* ── 볼 (오) ── */}
      <ellipse cx="55" cy="54" rx="6" ry="4" fill="#ff9e7a" opacity="0.55" />

      {/* ── 왼쪽 눈 ── */}
      {eyeOpen ? (
        <>
          <ellipse cx="31" cy={eyeY} rx="5" ry="5.5" fill="white" />
          <circle cx="32" cy={eyeY + 1} r="3" fill="#1a1a2e" />
          <circle cx="33" cy={eyeY} r="1" fill="white" />
        </>
      ) : (
        <path
          d={`M 26 ${eyeY} Q 31 ${eyeY - 4} 36 ${eyeY}`}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* ── 오른쪽 눈 ── */}
      {eyeOpen ? (
        <>
          <ellipse cx="49" cy={eyeY} rx="5" ry="5.5" fill="white" />
          <circle cx="50" cy={eyeY + 1} r="3" fill="#1a1a2e" />
          <circle cx="51" cy={eyeY} r="1" fill="white" />
        </>
      ) : (
        <path
          d={`M 44 ${eyeY} Q 49 ${eyeY - 4} 54 ${eyeY}`}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* ── 코 ── */}
      <ellipse cx="40" cy="51" rx="2" ry="1.5" fill="#1f6b3e" opacity="0.4" />

      {/* ── 입 ── */}
      <path
        d={mouth}
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── 말풍선 말할 때 말풍선 점 ── */}
      {mood === 'talking' && (
        <>
          <circle cx="60" cy="28" r="3" fill="white" opacity="0.8" />
          <circle cx="66" cy="22" r="2" fill="white" opacity="0.6" />
          <circle cx="70" cy="17" r="1.5" fill="white" opacity="0.4" />
        </>
      )}

      {/* ── 생각 중 물음표 ── */}
      {mood === 'thinking' && (
        <text
          x="62"
          y="26"
          fontSize="13"
          fill="white"
          opacity="0.85"
          fontWeight="bold"
        >
          ?
        </text>
      )}
    </svg>
  )
}
