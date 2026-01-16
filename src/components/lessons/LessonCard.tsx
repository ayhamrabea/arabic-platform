'use client'

import Link from 'next/link'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  BookOpenIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import type { LessonWithProgress } from '@/store/apis/lessonsApi/types'
import { useTranslations } from 'next-intl'

interface LessonCardProps {
  lesson: LessonWithProgress
  progress: number
  progressData?: any
  itemStats: {
    completed: number
    total: number
    vocabulary: number
    grammar: number
  }
}

export function LessonCard({ 
  lesson, 
  progress, 
  progressData,
  itemStats 
}: LessonCardProps) {
  const t = useTranslations('LessonsPage') // ملف الرسائل الخاص بالصفحة

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-400" />
    }
  }

  return (
    <Link href={`/lessons/${lesson.id}`}>
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-200 h-full cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>
              {lesson.level}
            </span>
            <span className="text-sm text-gray-500">
              #{lesson.order_index}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {getStatusIcon(progressData?.status)}
            {progressData?.is_favorite && (
              <StarIcon className="h-5 w-5 text-yellow-500" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {lesson.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {typeof lesson.content === 'string' 
            ? lesson.content.substring(0, 120) + '...' 
            : t('lessonDescription')}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <BookOpenIcon className="h-4 w-4" />
              <span>{itemStats.vocabulary} {t('words')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>📝</span>
              <span>{itemStats.grammar} {t('rules')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>{lesson.duration || 15} {t('minutes')}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">{t('progress')}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Completion Stats */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="text-sm">
            <span className="text-gray-600">{t('completed')}: </span>
            <span className="font-semibold">
              {itemStats.completed}/{itemStats.total} {t('items')}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
            <span>+{lesson.estimated_xp} XP</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
