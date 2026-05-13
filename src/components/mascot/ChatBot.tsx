'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, RotateCcw } from 'lucide-react'
import { MascotSvg } from './MascotSvg'

type Role = 'user' | 'assistant'
type Message = { role: Role; content: string }

const GREETING: Message = {
  role: 'assistant',
  content: '안녕하세요! 저는 GreenEat 도우미 **그리니**예요 🌿\n메뉴 추천, 구독 플랜, 쿠폰 정보까지 뭐든 물어보세요!',
}

const QUICK_QUESTIONS = [
  '인기 메뉴 추천해줘',
  '구독 플랜 알려줘',
  '쿠폰 있어?',
  '다이어트 메뉴 뭐가 좋아?',
]

function renderContent(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return (
      <span key={i}>
        {part.split('\n').map((line, j, arr) => (
          <span key={j}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))}
      </span>
    )
  })
}

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mood, setMood] = useState<'idle' | 'talking' | 'happy' | 'thinking'>('idle')
  const [bounce, setBounce] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) return
    const interval = setInterval(() => {
      setBounce(true)
      setTimeout(() => setBounce(false), 600)
    }, 6000)
    return () => clearInterval(interval)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setMood('thinking')

    try {
      const firstUserIdx = newMessages.findIndex((m) => m.role === 'user')
      const apiMessages = newMessages
        .slice(firstUserIdx)
        .map(({ role, content }) => ({ role, content }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })
      const { message } = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: message }])
      setMood('talking')
      setTimeout(() => setMood('idle'), 2000)

      if (!open) {
        setUnread((n) => n + 1)
        setBounce(true)
        setTimeout(() => setBounce(false), 600)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '잠깐 문제가 생겼어요 🙈 다시 한번 말씀해주세요!' },
      ])
      setMood('idle')
    } finally {
      setLoading(false)
    }
  }, [messages, loading, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleReset() {
    setMessages([GREETING])
    setMood('happy')
    setTimeout(() => setMood('idle'), 1500)
  }

  return (
    <>
      {/* ── 플로팅 버튼 ── */}
      <div className="fixed bottom-6 right-6 z-[9998] flex flex-col items-end gap-2">
        {!open && unread === 0 && (
          <div
            className="bg-surface border border-line-2 shadow-lg rounded-2xl px-3 py-2 text-sm text-ink-2 max-w-[180px] text-center animate-bounce-in"
            style={{ animationDelay: '1s' }}
          >
            안녕하세요! 무엇이든 물어보세요 👋
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-surface border-r border-b border-line-2 rotate-45" />
          </div>
        )}

        {unread > 0 && !open && (
          <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10">
            {unread}
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className={`relative w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-[#2d7a4f] flex items-center justify-center ${
            bounce ? 'animate-mascot-bounce' : ''
          } ${open ? 'scale-95' : 'hover:scale-110'}`}
          aria-label="그리니 채팅 열기"
        >
          {open ? (
            <X size={24} className="text-white" />
          ) : (
            <MascotSvg size={52} mood={mood} />
          )}
        </button>
      </div>

      {/* ── 채팅 패널 ── */}
      <div
        className={`fixed bottom-24 right-6 z-[9997] w-[340px] max-w-[calc(100vw-2rem)] bg-surface rounded-3xl shadow-2xl border border-line flex flex-col transition-all duration-300 origin-bottom-right ${
          open
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxHeight: '520px' }}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#2d7a4f] to-[#4caf72] rounded-t-3xl">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <MascotSvg size={36} mood={mood} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm">그리니</p>
            <p className="text-green-100 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
              GreenEat 도우미
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="대화 초기화"
            title="대화 초기화"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0" style={{ maxHeight: '340px' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-green-tint flex items-center justify-center shrink-0 mt-0.5">
                  <MascotSvg size={22} mood={i === messages.length - 1 ? mood : 'idle'} />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#2d7a4f] text-white rounded-tr-sm'
                    : 'bg-tint text-ink rounded-tl-sm'
                }`}
              >
                {renderContent(msg.content)}
              </div>
            </div>
          ))}

          {/* 로딩 버블 */}
          {loading && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-green-tint flex items-center justify-center shrink-0 mt-0.5">
                <MascotSvg size={22} mood="thinking" />
              </div>
              <div className="bg-tint rounded-2xl rounded-tl-sm px-3 py-3 flex gap-1 items-center">
                <span className="w-2 h-2 bg-ink-5 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-ink-5 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-ink-5 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 빠른 질문 칩 */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-2.5 py-1.5 rounded-full border border-[#2d7a4f] text-[#2d7a4f] hover:bg-green-tint transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* 입력 영역 */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3 py-3 border-t border-line"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-3 py-2 text-sm bg-tint text-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:bg-surface transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-[#2d7a4f] text-white flex items-center justify-center hover:bg-[#235f3d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="전송"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      <style jsx global>{`
        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-8px) scale(1.05); }
          60% { transform: translateY(-4px) scale(1.02); }
        }
        .animate-mascot-bounce {
          animation: mascot-bounce 0.6s ease-out;
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8) translateY(8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out both;
        }
      `}</style>
    </>
  )
}
