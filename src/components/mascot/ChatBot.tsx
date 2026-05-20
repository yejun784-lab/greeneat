'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { role: 'bot', text: '안녕하세요! 그린잇 도우미예요 🌿\n궁금한 점을 물어보세요!' },
  ])

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages((m) => [...m, { role: 'user', text }, { role: 'bot', text: '문의가 접수됐어요. 빠르게 답변 드릴게요 😊' }])
    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 bg-[#2d7a4f] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#235f3d] transition-colors"
        aria-label="챗봇 열기"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-line flex flex-col overflow-hidden">
          <div className="bg-[#2d7a4f] px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="text-white font-semibold text-sm">그린잇 도우미</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-72">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] whitespace-pre-line ${m.role === 'user' ? 'bg-[#2d7a4f] text-white' : 'bg-tint text-ink'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-line flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="메시지 입력..."
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-line-2 outline-none focus:border-[#2d7a4f]"
            />
            <button onClick={send} className="w-9 h-9 bg-[#2d7a4f] text-white rounded-xl flex items-center justify-center hover:bg-[#235f3d]">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
