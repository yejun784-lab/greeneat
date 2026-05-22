'use client'

import { ClipboardList } from 'lucide-react'
import { useQuestionnaireStore } from '@/components/onboarding/HealthQuestionnaire'

export function HealthProfileButton() {
  const { openQuestionnaire } = useQuestionnaireStore()

  return (
    <button
      onClick={openQuestionnaire}
      className="flex items-center gap-2 text-xs text-ink-4 hover:text-[#2d7a4f] transition-colors"
    >
      <ClipboardList size={13} />
      건강 프로필 수정
    </button>
  )
}
