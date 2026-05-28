'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import { Camera, Users, Plus, Copy, Check, Flame, LogIn, X, Loader2, Utensils } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import type { MealLog, FeedGroup, MealType } from '@/types'

const MEAL_LABELS: Record<MealType, { label: string; emoji: string; time: string }> = {
  breakfast: { label: '아침', emoji: '🌅', time: '~10시' },
  lunch:     { label: '점심', emoji: '☀️', time: '11~14시' },
  dinner:    { label: '저녁', emoji: '🌙', time: '17~21시' },
  snack:     { label: '간식', emoji: '🍪', time: '언제든' },
}

const EMOJIS = ['🔥', '😋', '👍', '❤️', '😍', '🥺']
const STREAK_REWARD_DAY = 5

function StreakBadge({ streak }: { streak: number }) {
  const pct = Math.min(100, (streak / STREAK_REWARD_DAY) * 100)
  return (
    <div className="bg-surface border border-line rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Flame size={16} className={streak > 0 ? 'text-orange-400' : 'text-ink-5'} />
          <span className="text-sm font-semibold text-ink">
            {streak > 0 ? `${streak}일 연속 기록 중 🔥` : '오늘 첫 기록을 남겨보세요!'}
          </span>
        </div>
        <span className="text-xs text-ink-5">{streak}/{STREAK_REWARD_DAY}일</span>
      </div>
      <div className="w-full bg-line-2 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {streak >= STREAK_REWARD_DAY && (
        <p className="text-xs text-orange-500 font-medium mt-1.5">🎉 5일 달성! 500P 지급됐어요</p>
      )}
      {streak < STREAK_REWARD_DAY && streak > 0 && (
        <p className="text-xs text-ink-5 mt-1.5">{STREAK_REWARD_DAY - streak}일 더 기록하면 500P!</p>
      )}
    </div>
  )
}

function MealLogCard({
  log,
  userId,
  onReact,
}: {
  log: MealLog
  userId: string
  onReact: (logId: string, emoji: string) => void
}) {
  const meal = MEAL_LABELS[log.meal_type]
  const myReaction = log.meal_reactions?.find((r) => r.user_id === userId)
  const reactionCount = (log.meal_reactions ?? []).reduce<Record<string, number>>((acc, r) => {
    acc[r.emoji] = (acc[r.emoji] ?? 0) + 1
    return acc
  }, {})

  const timeAgo = (() => {
    const diff = Date.now() - new Date(log.created_at).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return '방금 전'
    if (m < 60) return `${m}분 전`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}시간 전`
    return `${Math.floor(h / 24)}일 전`
  })()

  return (
    <div className="bg-surface border border-line rounded-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-full bg-green-tint flex items-center justify-center shrink-0">
          <span className="text-base">{meal.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink truncate">
            {log.profiles?.name ?? '익명'}
          </p>
          <p className="text-xs text-ink-5">{meal.label} · {timeAgo}</p>
        </div>
        {log.streak_day >= STREAK_REWARD_DAY && (
          <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-medium">
            🔥 {log.streak_day}일
          </span>
        )}
      </div>

      {/* 사진 */}
      {log.photo_url && (
        <div className="relative w-full aspect-square bg-wash">
          <Image
            src={log.photo_url}
            alt="식사 사진"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 캡션 */}
      {log.caption && (
        <p className="px-4 py-3 text-sm text-ink leading-relaxed">{log.caption}</p>
      )}

      {/* 리액션 */}
      <div className="px-4 pb-4">
        {/* 기존 리액션 표시 */}
        {Object.keys(reactionCount).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {Object.entries(reactionCount).map(([emoji, count]) => (
              <button
                key={emoji}
                onClick={() => onReact(log.id, emoji)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm border transition-colors ${
                  myReaction?.emoji === emoji
                    ? 'bg-green-tint border-[#2d7a4f]/40 text-[#2d7a4f]'
                    : 'bg-wash border-line hover:border-[#2d7a4f]/30'
                }`}
              >
                {emoji} <span className="text-xs text-ink-4">{count}</span>
              </button>
            ))}
          </div>
        )}
        {/* 이모지 선택 */}
        <div className="flex gap-1.5">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReact(log.id, emoji)}
              className={`text-lg w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                myReaction?.emoji === emoji ? 'bg-green-tint scale-110' : 'hover:bg-wash'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 그룹 없을 때 화면 ─────────────────────────────────────────
function NoGroup({ onCreateGroup, onJoinGroup }: {
  onCreateGroup: (name: string) => Promise<void>
  onJoinGroup: (code: string) => Promise<void>
}) {
  const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-green-tint flex items-center justify-center mb-6">
        <Utensils size={36} className="text-[#2d7a4f]" />
      </div>
      <h2 className="text-xl font-bold text-ink mb-2">밥로그 시작하기</h2>
      <p className="text-ink-4 text-sm mb-8 leading-relaxed">
        친구들과 그룹을 만들고<br />오늘 뭐 먹었는지 공유해보세요 🍽️
      </p>

      {mode === 'idle' && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => setMode('create')}
            className="w-full py-3.5 bg-[#2d7a4f] text-white rounded-2xl font-medium hover:bg-[#235f3d] transition-colors"
          >
            그룹 만들기
          </button>
          <button
            onClick={() => setMode('join')}
            className="w-full py-3.5 bg-surface border border-line text-ink rounded-2xl font-medium hover:bg-wash transition-colors"
          >
            초대코드로 참여
          </button>
        </div>
      )}

      {mode === 'create' && (
        <div className="w-full max-w-xs space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="그룹 이름 (예: 다이어트 모임)"
            maxLength={20}
            className="w-full px-4 py-3 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
          />
          <button
            onClick={() => startTransition(() => onCreateGroup(name))}
            disabled={!name.trim() || pending}
            className="w-full py-3.5 bg-[#2d7a4f] text-white rounded-2xl font-medium hover:bg-[#235f3d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            그룹 만들기
          </button>
          <button onClick={() => setMode('idle')} className="text-sm text-ink-5 hover:text-ink-3">
            취소
          </button>
        </div>
      )}

      {mode === 'join' && (
        <div className="w-full max-w-xs space-y-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="초대코드 6자리"
            maxLength={6}
            className="w-full px-4 py-3 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] tracking-widest text-center font-mono text-lg"
          />
          <button
            onClick={() => startTransition(() => onJoinGroup(code))}
            disabled={code.length !== 6 || pending}
            className="w-full py-3.5 bg-[#2d7a4f] text-white rounded-2xl font-medium hover:bg-[#235f3d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {pending && <Loader2 size={16} className="animate-spin" />}
            <LogIn size={16} />
            참여하기
          </button>
          <button onClick={() => setMode('idle')} className="text-sm text-ink-5 hover:text-ink-3">
            취소
          </button>
        </div>
      )}
    </div>
  )
}

// ── 식사 기록 모달 ────────────────────────────────────────────
function LogModal({
  groupId,
  userId,
  currentStreak,
  onClose,
  onSubmit,
}: {
  groupId: string
  userId: string
  currentStreak: number
  onClose: () => void
  onSubmit: (log: MealLog) => void
}) {
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [caption, setCaption] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능해요.')
      e.target.value = ''
      return
    }
    const MAX_MB = 5
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`사진은 ${MAX_MB}MB 이하만 업로드 가능해요.`)
      e.target.value = ''
      return
    }
    setPhotoFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const supabase = createClient()
      let photo_url: string | null = null

      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const path = `${userId}/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('meal-photos')
          .upload(path, photoFile, { upsert: true })
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('meal-photos').getPublicUrl(path)
          photo_url = publicUrl
        }
      }

      // 스트릭 계산: 어제 기록 있으면 +1, 없으면 1
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const { data: yesterdayLog } = await supabase
        .from('meal_logs')
        .select('streak_day')
        .eq('user_id', userId)
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', todayStart.toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const newStreak = yesterdayLog ? (yesterdayLog.streak_day + 1) : 1

      const { data, error } = await supabase
        .from('meal_logs')
        .insert({
          user_id: userId,
          group_id: groupId,
          photo_url,
          caption: caption.trim() || null,
          meal_type: mealType,
          streak_day: newStreak,
        })
        .select('*, profiles(name), meal_reactions(*)')
        .single()

      if (error) throw error

      // 5일 연속 달성 시 포인트 지급
      if (newStreak === STREAK_REWARD_DAY) {
        try { await supabase.rpc('increment_points', { uid: userId, amount: 500 }) } catch { /* ignore */ }
        toast.success('🎉 5일 연속 달성! 500P가 지급됐어요!')
      } else {
        toast.success(`${newStreak}일 연속 기록! ${STREAK_REWARD_DAY - newStreak > 0 ? `${STREAK_REWARD_DAY - newStreak}일 더 하면 500P!` : ''}`)
      }

      onSubmit(data as MealLog)
      onClose()
    } catch {
      toast.error('기록에 실패했어요. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md bg-surface rounded-t-3xl sm:rounded-3xl border border-line pb-safe">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h2 className="font-bold text-ink text-lg">오늘 뭐 먹었어? 🍽️</h2>
          <button onClick={onClose} className="text-ink-5 hover:text-ink-2">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 식사 타입 */}
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(MEAL_LABELS) as [MealType, typeof MEAL_LABELS[MealType]][]).map(([type, info]) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 transition-colors ${
                  mealType === type
                    ? 'border-[#2d7a4f] bg-green-tint'
                    : 'border-line-2 hover:border-[#2d7a4f]/30'
                }`}
              >
                <span className="text-xl">{info.emoji}</span>
                <span className="text-xs font-medium text-ink">{info.label}</span>
              </button>
            ))}
          </div>

          {/* 사진 업로드 */}
          <div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />
            {preview ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-wash">
                <Image src={preview} alt="preview" fill className="object-cover" />
                <button
                  onClick={() => { setPhotoFile(null); setPreview(null) }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-video rounded-2xl border-2 border-dashed border-line-2 hover:border-[#2d7a4f]/40 hover:bg-green-tint/30 transition-all flex flex-col items-center justify-center gap-2 text-ink-5 hover:text-[#2d7a4f]"
              >
                <Camera size={28} />
                <span className="text-sm">사진 찍기 / 업로드</span>
              </button>
            )}
          </div>

          {/* 캡션 */}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="오늘 뭐 먹었어? (선택)"
            maxLength={100}
            rows={2}
            className="w-full px-4 py-3 border border-line-2 rounded-xl text-sm bg-surface text-ink resize-none focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 bg-[#2d7a4f] text-white rounded-2xl font-semibold hover:bg-[#235f3d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : '기록 남기기 🍽️'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 메인 클라이언트 컴포넌트 ──────────────────────────────────
export function FeedClient({
  userId,
  userName,
  group: initialGroup,
  initialLogs,
  members,
  currentStreak,
}: {
  userId: string
  userName: string
  group: FeedGroup | null
  initialLogs: MealLog[]
  members: { user_id: string; profiles: { name: string | null } | null }[]
  currentStreak: number
}) {
  const [group, setGroup] = useState(initialGroup)
  const [logs, setLogs] = useState<MealLog[]>(initialLogs)
  const [streak, setStreak] = useState(currentStreak)
  const [showLog, setShowLog] = useState(false)
  const [copied, setCopied] = useState(false)

  async function createGroup(name: string) {
    const supabase = createClient()
    const { data: g, error } = await supabase
      .from('feed_groups')
      .insert({ name, created_by: userId })
      .select()
      .single()
    if (error || !g) { toast.error('그룹 생성에 실패했어요.'); return }

    await supabase.from('feed_group_members').insert({ group_id: g.id, user_id: userId })
    setGroup(g as FeedGroup)
    toast.success(`"${name}" 그룹이 만들어졌어요! 친구에게 코드를 공유하세요.`)
  }

  async function joinGroup(code: string) {
    const supabase = createClient()
    const { data: g, error } = await supabase
      .from('feed_groups')
      .select('*, feed_group_members(user_id)')
      .eq('invite_code', code)
      .maybeSingle()

    if (error || !g) { toast.error('유효하지 않은 초대코드예요.'); return }

    const memberCount = (g.feed_group_members ?? []).length
    if (memberCount >= 4) { toast.error('그룹 인원이 꽉 찼어요 (최대 4명).'); return }

    const already = (g.feed_group_members ?? []).some((m: { user_id: string }) => m.user_id === userId)
    if (already) { toast.info('이미 참여 중인 그룹이에요.'); setGroup(g as FeedGroup); return }

    await supabase.from('feed_group_members').insert({ group_id: g.id, user_id: userId })
    setGroup(g as FeedGroup)
    toast.success(`"${g.name}" 그룹에 참여했어요!`)
  }

  async function handleReact(logId: string, emoji: string) {
    const supabase = createClient()
    const log = logs.find((l) => l.id === logId)
    const existing = log?.meal_reactions?.find((r) => r.user_id === userId)

    if (existing?.emoji === emoji) {
      await supabase.from('meal_reactions').delete().eq('log_id', logId).eq('user_id', userId)
      setLogs((prev) => prev.map((l) =>
        l.id === logId
          ? { ...l, meal_reactions: (l.meal_reactions ?? []).filter((r) => r.user_id !== userId) }
          : l
      ))
    } else {
      await supabase.from('meal_reactions').upsert({ log_id: logId, user_id: userId, emoji })
      setLogs((prev) => prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              meal_reactions: [
                ...(l.meal_reactions ?? []).filter((r) => r.user_id !== userId),
                { log_id: logId, user_id: userId, emoji },
              ],
            }
          : l
      ))
    }
  }

  function handleNewLog(log: MealLog) {
    setLogs((prev) => [log, ...prev])
    setStreak(log.streak_day)
  }

  function copyCode() {
    if (!group) return
    navigator.clipboard.writeText(group.invite_code)
    setCopied(true)
    toast.success('초대코드가 복사됐어요!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!group) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-ink mb-1">밥로그 🍽️</h1>
        <p className="text-ink-4 text-sm mb-8">친구들과 오늘 뭐 먹었는지 공유해요</p>
        <NoGroup onCreateGroup={createGroup} onJoinGroup={joinGroup} />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-ink">{group.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Users size={13} className="text-ink-5" />
            <span className="text-xs text-ink-5">{members.length}/4명</span>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-xs text-[#2d7a4f] hover:underline"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {group.invite_code}
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowLog(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2d7a4f] text-white rounded-2xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
        >
          <Plus size={16} />
          기록하기
        </button>
      </div>

      {/* 스트릭 */}
      <div className="mb-5">
        <StreakBadge streak={streak} />
      </div>

      {/* 피드 */}
      {logs.length === 0 ? (
        <div className="text-center py-20 text-ink-5">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-sm">아직 기록이 없어요.<br />첫 번째 밥로그를 남겨보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <MealLogCard key={log.id} log={log} userId={userId} onReact={handleReact} />
          ))}
        </div>
      )}

      {/* 기록 모달 */}
      {showLog && group && (
        <LogModal
          groupId={group.id}
          userId={userId}
          currentStreak={streak}
          onClose={() => setShowLog(false)}
          onSubmit={handleNewLog}
        />
      )}
    </div>
  )
}
