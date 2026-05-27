import { type CharKey, type Mood, CHAR_SVGS } from './characters'

interface Props {
  size?: number
  className?: string
  charKey?: CharKey
  mood?: Mood
}

export function GreeniAvatar({ size = 40, className = '', charKey = 'tomato', mood = 'idle' }: Props) {
  const Svg = CHAR_SVGS[charKey]
  return <Svg size={size} className={className} mood={mood} />
}
