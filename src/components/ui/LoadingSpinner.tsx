'use client'

import { useTranslations } from 'next-intl'

interface LoadingSpinnerProps {
  messageKey?: string // مفتاح الرسالة بدل النص الصريح
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ messageKey, size = 'md' }: LoadingSpinnerProps) {
  const t = useTranslations('General') 
  const sizes = {
    sm: 'h-8 w-8 border-t-2 border-b-2',
    md: 'h-16 w-16 border-t-4 border-b-4',
    lg: 'h-24 w-24 border-t-6 border-b-6'
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizes[size]} border-indigo-600 mx-auto mb-4`}></div>
        {messageKey && (
          <p className="text-gray-600">{t(messageKey)}</p>
        )}
      </div>
    </div>
  )
}
