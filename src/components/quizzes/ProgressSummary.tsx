// components/quizzes/ProgressSummary.tsx
'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
import {
  TrophyIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HashtagIcon,
  ChartBarIcon,
  UsersIcon,
  AcademicCapIcon,
  FireIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface ProgressSummaryProps {
  stats: {
    totalQuizzes: number
    completedQuizzes: number
    availableQuizzes: number
    totalQuestions: number
    averageDifficulty: number
    totalAttempts: number
    averageScore: number
    completionRate: number
  }
  showAllStats?: boolean
  compact?: boolean
}

export const ProgressSummary = memo(function ProgressSummary({
  stats,
  showAllStats = true,
  compact = false
}: ProgressSummaryProps) {
  const t = useTranslations('QuizzesPage')
  const tAll = useTranslations('QuizzesPage.allQuizzes')

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">{t('totalQuizzes')}</p>
          <p className="text-lg font-bold text-gray-900">{stats.totalQuizzes}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">{t('completed')}</p>
          <p className="text-lg font-bold text-green-600">{stats.completedQuizzes}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">{t('available')}</p>
          <p className="text-lg font-bold text-blue-600">{stats.availableQuizzes}</p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">{tAll('completionRate')}</p>
          <p className="text-lg font-bold text-purple-600">{stats.completionRate}%</p>
        </div>
      </div>
    )
  }

  const statItems = showAllStats ? [
    {
      icon: TrophyIcon,
      label: t('totalQuizzes'),
      value: stats.totalQuizzes,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: CheckCircleIcon,
      label: t('completed'),
      value: stats.completedQuizzes,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: ArrowRightIcon,
      label: t('available'),
      value: stats.availableQuizzes,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: HashtagIcon,
      label: tAll('totalQuestions'),
      value: stats.totalQuestions,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: ChartBarIcon,
      label: tAll('avgDifficulty'),
      value: `${stats.averageDifficulty.toFixed(1)}/3`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: UsersIcon,
      label: tAll('completionRate'),
      value: `${stats.completionRate}%`,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      icon: AcademicCapIcon,
      label: tAll('averageScore'),
      value: `${Math.round(stats.averageScore)}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: FireIcon,
      label: tAll('totalAttempts'),
      value: stats.totalAttempts,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ] : [
    {
      icon: TrophyIcon,
      label: t('totalQuizzes'),
      value: stats.totalQuizzes,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      icon: CheckCircleIcon,
      label: t('completed'),
      value: stats.completedQuizzes,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: ArrowRightIcon,
      label: t('available'),
      value: stats.availableQuizzes,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: UsersIcon,
      label: tAll('completionRate'),
      value: `${stats.completionRate}%`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div 
          key={index} 
          className={`${item.bgColor} p-4 rounded-xl shadow-sm border border-opacity-20 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center mb-2">
            <item.icon className={`h-6 w-6 ${item.color} mr-2`} />
            <span className="text-sm text-gray-700 font-medium">{item.label}</span>
          </div>
          <p className={`text-2xl font-bold ${item.color}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
})