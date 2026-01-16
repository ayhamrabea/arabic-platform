'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Icon from './icon/Icon'

interface LogoutButtonProps {
  variant?: 'default' | 'menu' | 'mobile'
}

export function LogoutButton({ variant = 'default' }: LogoutButtonProps) {
  const router = useRouter()
  const t = useTranslations('General') // استخدام ملف الرسائل العام
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    
    // تأخير قليل ثم إعادة التوجيه
    setTimeout(() => {
      router.push('/login')
      router.refresh()
    }, 100)
  }

  // أنماط مختلفة حسب الـ variant
  const buttonStyles = {
    default: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-medium',
    menu: 'block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 hover:text-red-700',
    mobile: 'block w-full text-left text-red-600 py-2 hover:text-red-700'
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`${buttonStyles[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {t('loggingOut')}
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-red-300" name="logout" />
          {t('logout')}
        </span>
      )}
    </button>
  )
}
