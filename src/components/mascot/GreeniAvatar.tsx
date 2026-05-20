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
      {/* 얼굴 */}
      <circle cx="50" cy="56" r="36" fill="#4caf72" />

      {/* 왼쪽 잎 */}
      <ellipse cx="34" cy="22" rx="9" ry="16" fill="#2d7a4f" transform="rotate(-25 34 22)" />
      {/* 오른쪽 잎 */}
      <ellipse cx="66" cy="22" rx="9" ry="16" fill="#2d7a4f" transform="rotate(25 66 22)" />
      {/* 가운데 줄기 */}
      <rect x="48" y="20" width="4" height="18" rx="2" fill="#235f3d" />

      {/* 볼터치 */}
      <ellipse cx="34" cy="62" rx="7" ry="5" fill="#a8e6bc" opacity="0.6" />
      <ellipse cx="66" cy="62" rx="7" ry="5" fill="#a8e6bc" opacity="0.6" />

      {/* 눈 */}
      <ellipse cx="40" cy="52" rx="4" ry="5" fill="#1a3a28" />
      <ellipse cx="60" cy="52" rx="4" ry="5" fill="#1a3a28" />
      {/* 눈 하이라이트 */}
      <circle cx="42" cy="50" r="1.5" fill="white" />
      <circle cx="62" cy="50" r="1.5" fill="white" />

      {/* 미소 */}
      <path d="M38 66 Q50 76 62 66" stroke="#1a3a28" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  )
}
