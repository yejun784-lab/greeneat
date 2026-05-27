import React from 'react'

export type CharKey = 'tomato' | 'broccoli' | 'carrot' | 'corn' | 'avocado' | 'strawberry'
export type Mood = 'idle' | 'thinking' | 'happy'

export const CHAR_META: { key: CharKey; name: string; headerColor: string }[] = [
  { key: 'tomato',     name: '토마토',  headerColor: '#b82020' },
  { key: 'broccoli',   name: '브로콜리', headerColor: '#2d7a4f' },
  { key: 'carrot',     name: '당근이',   headerColor: '#c87000' },
  { key: 'corn',       name: '옥수수',   headerColor: '#9a8000' },
  { key: 'avocado',    name: '아보카',   headerColor: '#4a7824' },
  { key: 'strawberry', name: '딸기',    headerColor: '#b81838' },
]

interface P { size?: number; className?: string; mood?: Mood }

/* ── 공통 눈·입 헬퍼 ────────────────────────────────────────── */
function Eyes({ mood = 'idle', lx, ly, rx, ry }: { mood?: Mood; lx: number; ly: number; rx: number; ry: number }) {
  if (mood === 'happy') return (
    <>
      <path d={`M${lx-5} ${ly+2}Q${lx} ${ly-5} ${lx+5} ${ly+2}`} stroke="#1a0a0a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d={`M${rx-5} ${ry+2}Q${rx} ${ry-5} ${rx+5} ${ry+2}`} stroke="#1a0a0a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </>
  )
  if (mood === 'thinking') return (
    <>
      <circle cx={lx} cy={ly} r="4.5" fill="#1a0a0a"/>
      <circle cx={lx+1.5} cy={ly-1.5} r="1.6" fill="white"/>
      <path d={`M${rx-5} ${ry+1}Q${rx} ${ry-4} ${rx+5} ${ry+1}`} stroke="#1a0a0a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* 땀방울 */}
      <path d={`M${rx+9} ${ry-9}Q${rx+13} ${ry-3}${rx+9} ${ry-1}Q${rx+5} ${ry-3}${rx+9} ${ry-9}`} fill="#88ccff" opacity="0.85"/>
    </>
  )
  return (
    <>
      <circle cx={lx} cy={ly} r="4.5" fill="#1a0a0a"/>
      <circle cx={lx+1.5} cy={ly-1.5} r="1.6" fill="white"/>
      <circle cx={rx} cy={ry} r="4.5" fill="#1a0a0a"/>
      <circle cx={rx+1.5} cy={ry-1.5} r="1.6" fill="white"/>
    </>
  )
}

function Mouth({ mood = 'idle', mx, my }: { mood?: Mood; mx: number; my: number }) {
  if (mood === 'happy') return (
    <path d={`M${mx-14} ${my-4}Q${mx} ${my+11} ${mx+14} ${my-4}`} stroke="#1a0a0a" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
  )
  if (mood === 'thinking') return (
    <path d={`M${mx-11} ${my+3}Q${mx-4} ${my-2}${mx+1} ${my+3}Q${mx+7} ${my+7}${mx+11} ${my+2}`} stroke="#1a0a0a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  )
  return (
    <path d={`M${mx-11} ${my}Q${mx} ${my+10}${mx+11} ${my}`} stroke="#1a0a0a" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
  )
}

/* ── 토마토 ─────────────────────────────────────────────────── */
export function TomatoSvg({ size = 100, className = '', mood = 'idle' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="42" cy="16" rx="8" ry="5" fill="#3aaf3a" transform="rotate(-30 42 16)" />
      <ellipse cx="50" cy="13" rx="7" ry="5" fill="#4cc44c" />
      <ellipse cx="58" cy="16" rx="8" ry="5" fill="#3aaf3a" transform="rotate(30 58 16)" />
      <rect x="47" y="16" width="6" height="10" rx="3" fill="#2d8a2d" />
      <circle cx="50" cy="58" r="37" fill="#ff3c4e" />
      <ellipse cx="37" cy="38" rx="12" ry="8" fill="white" opacity="0.18" transform="rotate(-20 37 38)" />
      <ellipse cx="34" cy="36" rx="5" ry="3" fill="white" opacity="0.25" transform="rotate(-20 34 36)" />
      <path d="M50 22 Q46 58 50 90" stroke="#e02030" strokeWidth="1.2" opacity="0.3" fill="none" />
      <path d="M50 22 Q54 58 50 90" stroke="#e02030" strokeWidth="1.2" opacity="0.3" fill="none" />
      <ellipse cx="30" cy="62" rx="7" ry="4.5" fill="#ff8090" opacity="0.5" />
      <ellipse cx="70" cy="62" rx="7" ry="4.5" fill="#ff8090" opacity="0.5" />
      <Eyes mood={mood} lx={40} ly={54} rx={60} ry={54} />
      <Mouth mood={mood} mx={50} my={67} />
    </svg>
  )
}

/* ── 브로콜리 ───────────────────────────────────────────────── */
export function BroccoliSvg({ size = 100, className = '', mood = 'idle' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="44" y="72" width="12" height="16" rx="5" fill="#7a5c14" />
      <circle cx="32" cy="46" r="17" fill="#48c87a" />
      <circle cx="68" cy="46" r="17" fill="#48c87a" />
      <circle cx="50" cy="30" r="19" fill="#48c87a" />
      <circle cx="50" cy="54" r="24" fill="#2d7a4f" />
      <ellipse cx="36" cy="38" rx="9" ry="5" fill="white" opacity="0.2" transform="rotate(-20 36 38)" />
      <ellipse cx="30" cy="60" rx="6" ry="4" fill="#ff8090" opacity="0.4" />
      <ellipse cx="70" cy="60" rx="6" ry="4" fill="#ff8090" opacity="0.4" />
      <Eyes mood={mood} lx={41} ly={52} rx={59} ry={52} />
      <Mouth mood={mood} mx={50} my={63} />
    </svg>
  )
}

/* ── 당근 ───────────────────────────────────────────────────── */
export function CarrotSvg({ size = 100, className = '', mood = 'idle' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M44 26 Q36 8 26 14 Q36 22 44 26Z" fill="#3aaf3a" />
      <path d="M50 22 Q50 6 50 6 Q50 18 50 22Z" fill="#4cc44c" />
      <path d="M56 26 Q64 8 74 14 Q64 22 56 26Z" fill="#3aaf3a" />
      <path d="M46 24 Q43 12 47 17 Q48 21 46 24Z" fill="#2d9a2d" />
      <path d="M54 24 Q57 12 53 17 Q52 21 54 24Z" fill="#2d9a2d" />
      <ellipse cx="50" cy="60" rx="30" ry="32" fill="#ff8c00" />
      <ellipse cx="37" cy="42" rx="10" ry="6" fill="white" opacity="0.22" transform="rotate(-20 37 42)" />
      <path d="M26 55 Q50 52 74 55" stroke="#cc7000" strokeWidth="1" opacity="0.25" fill="none" />
      <path d="M24 65 Q50 62 76 65" stroke="#cc7000" strokeWidth="1" opacity="0.25" fill="none" />
      <path d="M26 75 Q50 72 74 75" stroke="#cc7000" strokeWidth="1" opacity="0.25" fill="none" />
      <ellipse cx="30" cy="62" rx="7" ry="4.5" fill="#ff6080" opacity="0.4" />
      <ellipse cx="70" cy="62" rx="7" ry="4.5" fill="#ff6080" opacity="0.4" />
      <Eyes mood={mood} lx={40} ly={54} rx={60} ry={54} />
      <Mouth mood={mood} mx={50} my={67} />
    </svg>
  )
}

/* ── 옥수수 ─────────────────────────────────────────────────── */
export function CornSvg({ size = 100, className = '', mood = 'idle' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M28 40 Q8 54 18 74 Q28 58 36 46Z" fill="#3aaf3a" />
      <path d="M72 40 Q92 54 82 74 Q72 58 64 46Z" fill="#3aaf3a" />
      <path d="M28 40 Q16 48 18 60 Q26 52 32 44Z" fill="#2d9a2d" />
      <path d="M72 40 Q84 48 82 60 Q74 52 68 44Z" fill="#2d9a2d" />
      <ellipse cx="50" cy="58" rx="26" ry="34" fill="#f5c400" />
      <ellipse cx="50" cy="58" rx="22" ry="30" fill="#f5d700" />
      <circle cx="41" cy="42" r="2.5" fill="#d4aa00" opacity="0.55"/>
      <circle cx="50" cy="40" r="2.5" fill="#d4aa00" opacity="0.55"/>
      <circle cx="59" cy="42" r="2.5" fill="#d4aa00" opacity="0.55"/>
      <circle cx="37" cy="75" r="2.5" fill="#d4aa00" opacity="0.45"/>
      <circle cx="63" cy="75" r="2.5" fill="#d4aa00" opacity="0.45"/>
      <ellipse cx="37" cy="40" rx="9" ry="5" fill="white" opacity="0.2" transform="rotate(-20 37 40)" />
      <ellipse cx="31" cy="61" rx="6.5" ry="4" fill="#ff8090" opacity="0.45" />
      <ellipse cx="69" cy="61" rx="6.5" ry="4" fill="#ff8090" opacity="0.45" />
      <Eyes mood={mood} lx={42} ly={53} rx={58} ry={53} />
      <Mouth mood={mood} mx={50} my={65} />
    </svg>
  )
}

/* ── 아보카도 ───────────────────────────────────────────────── */
export function AvocadoSvg({ size = 100, className = '', mood = 'idle' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="47" y="10" width="6" height="12" rx="3" fill="#3d5c18" />
      <ellipse cx="50" cy="58" rx="34" ry="40" fill="#3d6b21" />
      <ellipse cx="50" cy="62" rx="25" ry="30" fill="#d0e888" />
      <circle cx="50" cy="72" r="10" fill="#8b5e20" />
      <ellipse cx="47" cy="69" rx="3" ry="2" fill="#b07840" opacity="0.5" />
      <ellipse cx="36" cy="36" rx="10" ry="6" fill="white" opacity="0.18" transform="rotate(-20 36 36)" />
      <ellipse cx="29" cy="57" rx="7" ry="4.5" fill="#ff8090" opacity="0.4" />
      <ellipse cx="71" cy="57" rx="7" ry="4.5" fill="#ff8090" opacity="0.4" />
      <Eyes mood={mood} lx={41} ly={50} rx={59} ry={50} />
      <Mouth mood={mood} mx={50} my={61} />
    </svg>
  )
}

/* ── 딸기 ───────────────────────────────────────────────────── */
export function StrawberrySvg({ size = 100, className = '', mood = 'idle' }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M35 32 Q24 14 37 20 Q41 26 43 32Z" fill="#3aaf3a" />
      <path d="M50 28 Q50 10 50 10 Q50 10 50 28Z" fill="#4cc44c" />
      <path d="M65 32 Q76 14 63 20 Q59 26 57 32Z" fill="#3aaf3a" />
      <path d="M43 30 Q46 16 50 18 Q50 18 50 30Z" fill="#2d9a2d" />
      <path d="M57 30 Q54 16 50 18 Q50 18 50 30Z" fill="#2d9a2d" />
      <path d="M20 40 Q18 72 50 90 Q82 72 80 40 Q66 28 50 30 Q34 28 20 40Z" fill="#e8234a" />
      <ellipse cx="36" cy="44" rx="9" ry="6" fill="white" opacity="0.2" transform="rotate(-20 36 44)" />
      <ellipse cx="34" cy="54" rx="1.8" ry="2.6" fill="#b01030" opacity="0.5" transform="rotate(-10 34 54)" />
      <ellipse cx="50" cy="49" rx="1.8" ry="2.6" fill="#b01030" opacity="0.5" />
      <ellipse cx="66" cy="54" rx="1.8" ry="2.6" fill="#b01030" opacity="0.5" transform="rotate(10 66 54)" />
      <ellipse cx="37" cy="68" rx="1.8" ry="2.6" fill="#b01030" opacity="0.45" transform="rotate(-5 37 68)" />
      <ellipse cx="63" cy="68" rx="1.8" ry="2.6" fill="#b01030" opacity="0.45" transform="rotate(5 63 68)" />
      <ellipse cx="29" cy="59" rx="7" ry="4.5" fill="#ff8090" opacity="0.5" />
      <ellipse cx="71" cy="59" rx="7" ry="4.5" fill="#ff8090" opacity="0.5" />
      <Eyes mood={mood} lx={41} ly={52} rx={59} ry={52} />
      <Mouth mood={mood} mx={50} my={64} />
    </svg>
  )
}

export const CHAR_SVGS: Record<CharKey, (p: P) => React.JSX.Element> = {
  tomato:     TomatoSvg,
  broccoli:   BroccoliSvg,
  carrot:     CarrotSvg,
  corn:       CornSvg,
  avocado:    AvocadoSvg,
  strawberry: StrawberrySvg,
}
