'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, ChevronDown, RotateCcw, ChevronLeft, Shuffle } from 'lucide-react'
import { GreeniAvatar } from './GreeniAvatar'
import { type CharKey, type Mood, CHAR_META, CHAR_SVGS } from './characters'

type Message = { role: 'bot' | 'user'; text: string }

const QUICK_REPLIES = ['배송은 언제 오나요?', '구독 플랜 알려줘', '포인트 적립 방법', '주문 취소하고 싶어요']
const TYPING_DELAY = 700
const INITIAL_MESSAGE: Message = { role: 'bot', text: '안녕하세요! 저는 그린잇 도우미예요 🍀\n무엇이든 물어보세요!' }

function loadChar(): CharKey {
  // SSR/CSR hydration 일치를 위해 항상 기본값 반환
  // 실제 localStorage 값은 useEffect에서 읽음
  return 'tomato'
}
function loadHistory(): Message[] {
  if (typeof window === 'undefined') return [INITIAL_MESSAGE]
  try {
    const saved = localStorage.getItem('greeni-chat')
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE]
  } catch { return [INITIAL_MESSAGE] }
}

export function ChatBot() {
  const [open, setOpen]             = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [charKey, setCharKey]       = useState<CharKey>(loadChar)
  const [mood, setMood]             = useState<Mood>('idle')
  const [input, setInput]           = useState('')
  const [messages, setMessages]     = useState<Message[]>(loadHistory)
  const [typing, setTyping]         = useState(false)
  const [unread, setUnread]         = useState(0)
  const [kbOffset, setKbOffset]     = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const happyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const meta = CHAR_META.find(c => c.key === charKey)!

  /* ── 마운트 후 localStorage에서 캐릭터 복원 (hydration 안전) ── */
  useEffect(() => {
    const saved = localStorage.getItem('greeni-char') as CharKey | null
    if (saved && saved !== charKey) setCharKey(saved)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── mood 자동 전환 ───────────────────────── */
  useEffect(() => {
    if (typing) {
      setMood('thinking')
    } else {
      setMood('happy')
      if (happyTimer.current) clearTimeout(happyTimer.current)
      happyTimer.current = setTimeout(() => setMood('idle'), 2000)
    }
    return () => { if (happyTimer.current) clearTimeout(happyTimer.current) }
  }, [typing])

  /* ── 기타 사이드이펙트 ──────────────────── */
  useEffect(() => {
    if (open) {
      setUnread(0)
      setPickerOpen(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (messages.length > 1) {
      try { localStorage.setItem('greeni-chat', JSON.stringify(messages.slice(-40))) } catch {}
    }
  }, [messages])

  useEffect(() => {
    localStorage.setItem('greeni-char', charKey)
  }, [charKey])

  // 모바일 키보드 오프셋
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      setKbOffset(offset)
    }
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  /* ── 핸들러 ─────────────────────────────── */
  function selectChar(key: CharKey) {
    setCharKey(key)
    setPickerOpen(false)
  }

  function resetChat() {
    setMessages([INITIAL_MESSAGE])
    try { localStorage.removeItem('greeni-chat') } catch {}
  }

  const callApi = useCallback(async (msg: string, currentMessages: Message[]) => {
    setTyping(true)
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: currentMessages.slice(-20), charKey }),
      })
      const json = await res.json()
      const reply: string = json.reply ?? (res.ok ? '응답을 받지 못했습니다.' : json.error ?? '오류가 발생했어요. 다시 시도해주세요 😅')
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { role: 'bot', text: reply }])
        if (!open) setUnread(n => n + 1)
      }, TYPING_DELAY)
    } catch {
      setTimeout(() => {
        setTyping(false)
        setMessages(m => [...m, { role: 'bot', text: '잠깐 오류가 생겼어요. 다시 시도해주세요 😅' }])
      }, TYPING_DELAY)
    }
  }, [charKey, open])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || typing) return
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', text: msg }]
    setMessages(newMessages)
    await callApi(msg, newMessages)
  }

  /* 🎰 메뉴 뽑기 */
  async function rollMenu() {
    if (typing) return
    const trigger = '오늘 판매 중인 메뉴 중에서 딱 하나만 랜덤으로 추천해줘. 이름·가격·칼로리·한줄 추천 이유만 짧게!'
    const newMessages: Message[] = [...messages, { role: 'user', text: '🎰 오늘 메뉴 뽑기!' }]
    setMessages(newMessages)
    await callApi(trigger, newMessages)
  }

  /* ── 렌더 ───────────────────────────────── */
  return (
    <>
      {/* ── 플로팅 버튼 ─────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed right-4 z-50 w-14 h-14 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
        style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${kbOffset + 16}px)` }}
        aria-label={open ? '챗봇 닫기' : '도우미에게 물어보기'}
      >
        {open ? (
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: meta.headerColor }}>
            <X size={26} className="text-white" />
          </div>
        ) : (
          <div className="relative">
            <GreeniAvatar size={64} charKey={charKey} mood="idle" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
        )}
      </button>

      {/* ── 채팅창 ──────────────────────────────────── */}
      {open && (
        <div className="fixed right-2 left-2 sm:left-auto sm:right-6 sm:w-[420px] z-50 bg-surface rounded-2xl shadow-2xl border border-line flex flex-col overflow-hidden animate-fade-up" style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + ${kbOffset + 80}px)` }}>

          {/* 헤더 */}
          <div
            className="px-4 py-3.5 flex items-center gap-3 transition-colors duration-300"
            style={{ backgroundColor: meta.headerColor }}
          >
            <button
              onClick={() => setPickerOpen(p => !p)}
              title="캐릭터 변경"
              className="rounded-full ring-2 ring-white/30 hover:ring-white/60 transition-all shrink-0 active:scale-95"
            >
              {/* 헤더 아바타는 mood 반영 */}
              <GreeniAvatar size={44} charKey={charKey} mood={mood} />
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-base leading-tight">{meta.name}</p>
              <p className="text-white/70 text-xs">
                {mood === 'thinking' ? '생각 중...' : mood === 'happy' ? '답변 완료! 😊' : '그린잇 AI 도우미'}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={resetChat} title="새 대화 시작" className="p-1.5 text-white/60 hover:text-white transition-colors">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setOpen(false)} className="p-1.5 text-white/60 hover:text-white transition-colors">
                <ChevronDown size={22} />
              </button>
            </div>
          </div>

          {/* ── 캐릭터 픽커 ─────────────────────────── */}
          {pickerOpen ? (
            <div className="flex-1 bg-wash p-4 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setPickerOpen(false)} className="p-1 text-ink-4 hover:text-ink transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <p className="text-sm font-semibold text-ink">캐릭터 선택</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {CHAR_META.map(c => {
                  const Svg = CHAR_SVGS[c.key]
                  const selected = charKey === c.key
                  return (
                    <button
                      key={c.key}
                      onClick={() => selectChar(c.key)}
                      className={`flex flex-col items-center py-3 px-2 rounded-2xl transition-all active:scale-95 ${
                        selected ? 'ring-2 ring-primary bg-surface shadow-md' : 'bg-surface hover:shadow-md hover:-translate-y-0.5'
                      }`}
                    >
                      <Svg size={58} mood="happy" />
                      <span className={`text-xs font-medium mt-1.5 ${selected ? 'text-primary' : 'text-ink'}`}>
                        {c.name}
                      </span>
                      {selected && <span className="text-[10px] text-primary font-semibold mt-0.5">✓ 선택 중</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <>
              {/* ── 메시지 영역 ──────────────────────── */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-wash">
                {messages.map((m, i) => (
                  <div key={i} className={`flex items-end gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'bot' && (
                      <GreeniAvatar
                        size={32}
                        charKey={charKey}
                        mood={i === messages.length - 1 ? mood : 'idle'}
                        className="shrink-0 mb-0.5"
                      />
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-base max-w-[80%] whitespace-pre-line leading-relaxed ${
                        m.role === 'user'
                          ? 'text-white rounded-br-sm'
                          : 'bg-surface text-ink border border-line rounded-bl-sm shadow-sm'
                      }`}
                      style={m.role === 'user' ? { backgroundColor: meta.headerColor } : undefined}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {/* 타이핑 인디케이터 */}
                {typing && (
                  <div className="flex items-end gap-2.5">
                    <GreeniAvatar size={32} charKey={charKey} mood="thinking" className="shrink-0 mb-0.5" />
                    <div className="px-4 py-4 bg-surface border border-line rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-2 h-2 bg-ink-4 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* ── 빠른 답변 ────────────────────────── */}
              {messages.length <= 1 && (
                <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 bg-wash border-t border-line">
                  {QUICK_REPLIES.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-sm px-3 py-1.5 rounded-full border transition-colors"
                      style={{ borderColor: `${meta.headerColor}66`, color: meta.headerColor }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* ── 입력창 ───────────────────────────── */}
              <div className="p-3 border-t border-line flex gap-2 bg-surface items-center">
                {/* 🎰 메뉴 뽑기 버튼 */}
                <button
                  onClick={rollMenu}
                  disabled={typing}
                  title="오늘 메뉴 랜덤 추천"
                  className="w-10 h-10 rounded-xl border border-line-2 bg-wash flex items-center justify-center hover:border-primary hover:text-primary disabled:opacity-40 transition-colors shrink-0 text-ink-4"
                >
                  <Shuffle size={17} />
                </button>

                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (!e.nativeEvent.isComposing) send()
                    }
                  }}
                  placeholder={`${meta.name}에게 물어보세요...`}
                  className="flex-1 text-base px-4 py-2.5 rounded-xl border border-line-2 bg-wash outline-none focus:border-primary text-ink placeholder:text-ink-5"
                />

                <button
                  onClick={() => send()}
                  disabled={typing || !input.trim()}
                  className="w-10 h-10 text-white rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors shrink-0"
                  style={{ backgroundColor: meta.headerColor }}
                >
                  <Send size={17} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
