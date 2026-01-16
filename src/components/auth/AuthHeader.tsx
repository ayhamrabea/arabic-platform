// components/auth/AuthHeader.tsx
'use client'

import { useTranslations } from 'next-intl'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

interface AuthHeaderProps {
  type: 'login' | 'register'
}

export function AuthHeader({ type }: AuthHeaderProps) {
  const t = useTranslations('Auth.header')
  
  return (
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-6">
        <GlobeAltIcon className="h-8 w-8 text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {type === 'login' ? t('loginTitle') : t('registerTitle')}
      </h1>
      
      <p className="text-gray-600">
        {type === 'login' ? t('loginSubtitle') : t('registerSubtitle')}
      </p>
    </div>
  )
}