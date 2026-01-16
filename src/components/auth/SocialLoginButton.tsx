// components/auth/SocialLoginButton.tsx
'use client'

import { useTranslations } from 'next-intl'
import Icon from "../icon/Icon"

interface SocialLoginButtonProps {
  provider: 'google' | 'github' | 'facebook'
  onClick: () => void
  loading?: boolean
  label?: string // إضافة اختياري
}

export function SocialLoginButton({ 
  provider, 
  onClick, 
  loading,
  label 
}: SocialLoginButtonProps) {
  const t = useTranslations('Auth.social')
  
  const providers = {
    google: { 
      name: t('google'), 
      icon: 'google', 
      color: 'border-gray-300 hover:bg-gray-50 text-gray-700' 
    },
    github: { 
      name: t('github'), 
      icon: 'github', 
      color: 'border-gray-800 hover:bg-gray-800 text-white bg-gray-900 hover:bg-gray-800' 
    },
    facebook: { 
      name: t('facebook'), 
      icon: 'facebook', 
      color: 'border-blue-600 hover:bg-blue-600 text-white bg-blue-500 hover:bg-blue-600' 
    }
  }

  const config = providers[provider]
  
  // استخدام القيمة الممررة أو القيمة الافتراضية من الترجمة
  const buttonText = label || `${t('continueWith')} ${config.name}`

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg transition ${config.color} disabled:opacity-50 font-medium`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
      ) : (
        <Icon className="h-5 w-5 mr-3" name={config.icon} />
      )}
      {buttonText}
    </button>
  )
}