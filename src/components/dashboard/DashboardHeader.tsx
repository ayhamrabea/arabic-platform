'use client'

import { LogoutButton } from '@/components/Logout'
import { AcademicCapIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

interface DashboardHeaderProps {
  userEmail: string
  level?: string
  streak?: number
}

export function DashboardHeader({ userEmail, level = 'Beginner Level', streak = 7 }: DashboardHeaderProps) {
  const t = useTranslations('DashboardHeader') // ملف الرسائل الخاص بالهيدر

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('dashboardTitle')}</h1>
          <p className="text-indigo-100 text-lg">
            {t('welcomeBack')}, <span className="font-semibold text-white">{userEmail}</span>
          </p>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">
                {t('level')}: {level}
              </span>
            </div>
            <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">
                {t('dailyStreak')}: {streak} {t('days')}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}
