'use client'

import { useTranslations } from 'next-intl'

interface SimpleLessonCardProps {
  title: string
  duration: string
  level: string
  status?: 'pending' | 'in_progress' | 'completed'
  progress?: number
  onStart?: () => void
}

export function SimpleLessonCard({ 
  title, 
  duration, 
  level, 
  status = 'pending', 
  progress = 0,
  onStart 
}: SimpleLessonCardProps) {
  const t = useTranslations('DashboardPage') 

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              level === 'A1' ? 'bg-green-100 text-green-800'
              : level === 'A2' ? 'bg-green-200 text-green-900'
              : level === 'B1' ? 'bg-yellow-100 text-yellow-800'
              : level === 'B2' ? 'bg-yellow-200 text-yellow-900'
              : level === 'C1' ? 'bg-blue-100 text-blue-800'
              : 'bg-blue-200 text-blue-900'
            }`}>
              {level}
            </span>

            {status === 'in_progress' && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium">
                {t('inProgress')}
              </span>
            )}
            {status === 'completed' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                {t('completed')}
              </span>
            )}
          </div>

          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{duration}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'}`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {status === 'in_progress' ? t('continue') : t('start')}
        </button>
      </div>
    </div>
  )
}
