interface Props {
  size?: number
  className?: string
}

export function GreeniAvatar({ size = 40, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 꼭지 잎 */}
      <ellipse cx="42" cy="16" rx="8" ry="5" fill="#3aaf3a" transform="rotate(-30 42 16)" />
      <ellipse cx="50" cy="13" rx="7" ry="5" fill="#4cc44c" />
      <ellipse cx="58" cy="16" rx="8" ry="5" fill="#3aaf3a" transform="rotate(30 58 16)" />
      <rect x="47" y="16" width="6" height="10" rx="3" fill="#2d8a2d" />

      {/* 토마토 몸통 */}
      <circle cx="50" cy="58" r="37" fill="#ff3c4e" />

      {/* 하이라이트 */}
      <ellipse cx="37" cy="38" rx="12" ry="8" fill="white" opacity="0.18" transform="rotate(-20 37 38)" />
      <ellipse cx="34" cy="36" rx="5" ry="3" fill="white" opacity="0.25" transform="rotate(-20 34 36)" />

      {/* 세로 결선 */}
      <path d="M50 22 Q46 58 50 90" stroke="#e02030" strokeWidth="1.2" opacity="0.3" fill="none" />
      <path d="M50 22 Q54 58 50 90" stroke="#e02030" strokeWidth="1.2" opacity="0.3" fill="none" />

      {/* 눈 */}
      <circle cx="40" cy="54" r="4.5" fill="#1a0a0a" />
      <circle cx="60" cy="54" r="4.5" fill="#1a0a0a" />
      <circle cx="41.5" cy="52.5" r="1.6" fill="white" />
      <circle cx="61.5" cy="52.5" r="1.6" fill="white" />

      {/* 볼터치 */}
      <ellipse cx="30" cy="62" rx="7" ry="4.5" fill="#ff8090" opacity="0.5" />
      <ellipse cx="70" cy="62" rx="7" ry="4.5" fill="#ff8090" opacity="0.5" />

      {/* 입 */}
      <path d="M39 67 Q50 77 61 67" stroke="#1a0a0a" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    </svg>
  )
}
