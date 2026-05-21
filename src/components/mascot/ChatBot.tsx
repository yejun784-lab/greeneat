'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, ChevronDown } from 'lucide-react'
import { GreeniAvatar } from './GreeniAvatar'

type Message = { role: 'bot' | 'user'; text: string }

const QUICK_REPLIES = ['배송은 언제 오나요?', '구독 플랜 알려줘', '포인트 적립 방법', '주문 취소하고 싶어요']

const TYPING_DELAY = 700

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === 'undefined') return [{ role: 'bot', text: '안녕하세요! 저는 그린잇 도우미 토마토예요 🍅\n무엇이든 물어보세요!' }]
    try {
      const saved = localStorage.getItem('greeni-chat')
      return saved ? JSON.parse(saved) : [{ role: 'bot', text: '안녕하세요! 저는 그린잇 도우미 토마토예요 🍅\n무엇이든 물어보세요!' }]
    } catch {
      return [{ role: 'bot', text: '안녕하세요! 저는 그린잇 도우미 토마토예요 🍅\n무엇이든 물어보세요!' }]
    }
  })
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // 대화 localStorage 저장 (최근 40개)
  useEffect(() => {
    if (messages.length > 1) {
      try { localStorage.setItem('greeni-chat', JSON.stringify(messages.slice(-40))) } catch {}
    }
  }, [messages])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setTyping(true)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: messages.slice(-20) }),
      })
      const { reply } = await res.json()
      setTimeout(() => {
        setTyping(false)
        setMessages((m) => [...m, { role: 'bot', text: reply }])
        if (!open) setUnread((n) => n + 1)
      }, TYPING_DELAY)
    } catch {
      setTimeout(() => {
        setTyping(false)
        setMessages((m) => [...m, { role: 'bot', text: '잠깐 오류가 생겼어요. 다시 시도해주세요 😅' }])
      }, TYPING_DELAY)
    }
  }

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
        aria-label={open ? '챗봇 닫기' : '그린이에게 물어보기'}
      >
        {open ? (
          <div className="w-16 h-16 bg-[#2d7a4f] rounded-full flex items-center justify-center">
            <X size={26} className="text-white" />
          </div>
        ) : (
          <div className="relative">
            <GreeniAvatar size={64} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
        )}
      </button>

      {/* 채팅창 */}
      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[360px] sm:w-[420px] bg-surface rounded-2xl shadow-2xl border border-line flex flex-col overflow-hidden animate-fade-up">
          {/* 헤더 */}
          <div className="bg-[#2d7a4f] px-5 py-4 flex items-center gap-3">
            <GreeniAvatar size={44} />
            <div>
              <p className="text-white font-bold text-base leading-tight">그린이</p>
              <p className="text-green-200 text-xs">그린잇 AI 도우미</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto p-1.5 text-green-200 hover:text-white transition-colors"
            >
              <ChevronDown size={22} />
            </button>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-wash">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'bot' && <GreeniAvatar size={32} className="shrink-0 mb-0.5" />}
                <div
                  className={`px-4 py-3 rounded-2xl text-base max-w-[80%] whitespace-pre-line leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#2d7a4f] text-white rounded-br-sm'
                      : 'bg-surface text-ink border border-line rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* 타이핑 인디케이터 */}
            {typing && (
              <div className="flex items-end gap-2.5">
                <GreeniAvatar size={32} className="shrink-0 mb-0.5" />
                <div className="px-4 py-4 bg-surface border border-line rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 bg-ink-4 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 빠른 답변 */}
          {messages.length <= 1 && (
            <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 bg-wash border-t border-line">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-sm px-3 py-1.5 rounded-full border border-[#2d7a4f]/40 text-[#2d7a4f] hover:bg-green-tint transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* 입력창 */}
          <div className="p-4 border-t border-line flex gap-2.5 bg-surface">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && send()}
              placeholder="그린이에게 물어보세요..."
              className="flex-1 text-base px-4 py-2.5 rounded-xl border border-line-2 bg-wash outline-none focus:border-[#2d7a4f] text-ink placeholder:text-ink-5"
              disabled={typing}
            />
            <button
              onClick={() => send()}
              disabled={typing || !input.trim()}
              className="w-11 h-11 bg-[#2d7a4f] text-white rounded-xl flex items-center justify-center hover:bg-[#235f3d] disabled:opacity-40 transition-colors shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
