'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Pin, Trash2, Plus, X, CheckCircle2, AlertCircle } from 'lucide-react'

type Notice = {
  id: string
  title: string
  content: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

type NoticeForm = {
  title: string
  content: string
  is_pinned: boolean
}

const EMPTY_FORM: NoticeForm = { title: '', content: '', is_pinned: false }

export default function AdminNoticesPage() {
  const supabase = createClient()

  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NoticeForm>(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile?.role !== 'admin') { window.location.href = '/'; return }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!authChecked) return
    fetchNotices()
  }, [authChecked])

  useEffect(() => {
    if (showModal) {
      setTimeout(() => titleRef.current?.focus(), 100)
    }
  }, [showModal])

  async function fetchNotices() {
    setLoading(true)
    const { data } = await supabase
      .from('notices')
      .select('id, title, content, is_pinned, created_at, updated_at')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
    setNotices((data ?? []) as Notice[])
    setLoading(false)
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleCreate() {
    if (!form.title.trim()) {
      showToast('error', '제목을 입력해주세요.')
      return
    }
    if (!form.content.trim()) {
      showToast('error', '내용을 입력해주세요.')
      return
    }
    setSubmitting(true)
    const now = new Date().toISOString()
    const { error } = await supabase.from('notices').insert({
      title: form.title.trim(),
      content: form.content.trim(),
      is_pinned: form.is_pinned,
      created_at: now,
      updated_at: now,
    })
    if (error) {
      showToast('error', '공지 작성에 실패했습니다.')
    } else {
      showToast('success', '공지가 등록됐습니다.')
      setShowModal(false)
      setForm(EMPTY_FORM)
      await fetchNotices()
    }
    setSubmitting(false)
  }

  async function handleDelete(id: string) {
    if (!window.confirm('공지를 삭제하시겠습니까?')) return
    setDeleting(id)
    const { error } = await supabase.from('notices').delete().eq('id', id)
    if (error) {
      showToast('error', '삭제에 실패했습니다.')
    } else {
      setNotices((prev) => prev.filter((n) => n.id !== id))
      showToast('success', '공지가 삭제됐습니다.')
    }
    setDeleting(null)
  }

  async function handleTogglePin(notice: Notice) {
    setToggling(notice.id)
    const { error } = await supabase
      .from('notices')
      .update({ is_pinned: !notice.is_pinned, updated_at: new Date().toISOString() })
      .eq('id', notice.id)
    if (error) {
      showToast('error', '핀 상태 변경에 실패했습니다.')
    } else {
      setNotices((prev) =>
        prev.map((n) => n.id === notice.id ? { ...n, is_pinned: !notice.is_pinned } : n)
          .sort((a, b) => {
            if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
      )
    }
    setToggling(null)
  }

  if (!authChecked || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-7 w-48 bg-line-2 rounded animate-pulse mb-4" />
        <div className="h-4 w-32 bg-line-2 rounded animate-pulse mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-5 mb-3 h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 토스트 */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-[#2d7a4f] text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">공지사항 관리</h1>
          <p className="text-sm text-ink-4 mt-1">총 {notices.length}개</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-sm text-[#2d7a4f] hover:underline">← 대시보드</a>
          <button
            onClick={() => { setForm(EMPTY_FORM); setShowModal(true) }}
            className="flex items-center gap-1.5 text-sm bg-[#2d7a4f] text-white px-4 py-2 rounded-xl hover:bg-[#245f3e] transition-colors"
          >
            <Plus size={15} />
            공지 작성
          </button>
        </div>
      </div>

      {/* 공지 목록 */}
      {notices.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-line p-16 text-center">
          <Bell size={32} className="mx-auto text-ink-5 mb-3" />
          <p className="text-sm text-ink-5">등록된 공지사항이 없습니다.</p>
          <button
            onClick={() => { setForm(EMPTY_FORM); setShowModal(true) }}
            className="mt-4 text-sm text-[#2d7a4f] hover:underline"
          >
            첫 공지 작성하기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-surface rounded-2xl border p-5 transition-all ${
                notice.is_pinned ? 'border-[#2d7a4f]/30 bg-green-50/20' : 'border-line'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {notice.is_pinned && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2d7a4f] bg-green-50 px-2 py-0.5 rounded-full">
                        <Pin size={10} />
                        고정
                      </span>
                    )}
                    <h3 className="font-semibold text-ink truncate">{notice.title}</h3>
                  </div>
                  <p className="text-sm text-ink-4 line-clamp-2 mb-2">{notice.content}</p>
                  <p className="text-xs text-ink-5">
                    {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* 핀 토글 */}
                  <button
                    onClick={() => handleTogglePin(notice)}
                    disabled={toggling === notice.id}
                    title={notice.is_pinned ? '핀 해제' : '핀 고정'}
                    className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                      notice.is_pinned
                        ? 'bg-[#2d7a4f] text-white hover:bg-[#245f3e]'
                        : 'bg-wash text-ink-4 hover:bg-line hover:text-ink'
                    }`}
                  >
                    <Pin size={14} />
                  </button>
                  {/* 삭제 */}
                  <button
                    onClick={() => handleDelete(notice.id)}
                    disabled={deleting === notice.id}
                    title="삭제"
                    className="p-2 rounded-xl bg-wash text-ink-4 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 공지 작성 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 백드롭 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { if (!submitting) setShowModal(false) }}
          />
          {/* 모달 */}
          <div className="relative bg-surface rounded-2xl border border-line shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-ink text-lg">공지사항 작성</h2>
              <button
                onClick={() => { if (!submitting) setShowModal(false) }}
                className="p-1.5 rounded-lg text-ink-4 hover:bg-wash transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-xs font-medium text-ink-4 mb-1.5">제목 *</label>
                <input
                  ref={titleRef}
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="공지 제목을 입력해주세요"
                  className="w-full border border-line rounded-xl px-3 py-2.5 text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]/30 focus:border-[#2d7a4f]"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-xs font-medium text-ink-4 mb-1.5">내용 *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="공지 내용을 입력해주세요"
                  rows={6}
                  className="w-full border border-line rounded-xl px-3 py-2.5 text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]/30 focus:border-[#2d7a4f] resize-none"
                />
              </div>

              {/* 핀 고정 */}
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={(e) => setForm((prev) => ({ ...prev, is_pinned: e.target.checked }))}
                  className="w-4 h-4 rounded accent-[#2d7a4f]"
                />
                <span className="text-sm text-ink">상단 고정 (핀)</span>
              </label>
            </div>

            <div className="flex items-center gap-3 mt-6 justify-end">
              <button
                onClick={() => { if (!submitting) setShowModal(false) }}
                disabled={submitting}
                className="text-sm px-4 py-2 rounded-xl border border-line text-ink hover:bg-wash transition-colors disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="text-sm px-5 py-2 rounded-xl bg-[#2d7a4f] text-white hover:bg-[#245f3e] transition-colors disabled:opacity-50"
              >
                {submitting ? '등록 중…' : '공지 등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
