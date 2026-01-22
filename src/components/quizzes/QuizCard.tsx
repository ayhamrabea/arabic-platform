// components/quizzes/QuizCard.tsx
'use client'

import { memo } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { 
  CheckCircleIcon as CheckCircleSolid, 
  XCircleIcon, 
  ArrowRightIcon, 
  LockClosedIcon, 
  PlayIcon, 
  TrophyIcon, 
  ClockIcon, 
  ChartBarIcon, 
  FireIcon, 
  HashtagIcon, 
  UsersIcon, 
  CalendarDaysIcon, 
  BookOpenIcon,
  StarIcon 
} from '@heroicons/react/24/outline'

interface Quiz {
  id: string
  title: string
  description?: string
  lesson_id: string
  lesson_title?: string
  question_count: number
  time_limit?: number
  passing_score: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags?: string[]
  estimated_xp?: number
  created_at?: string
}

interface QuizCardProps {
  quiz: Quiz
  status: 'completed' | 'locked' | 'available'
  bestScore: number
  attemptsCount: number
  remainingAttempts: number
  lastAttempt?: any
  showLessonInfo?: boolean
  showTags?: boolean
  showXP?: boolean
  compact?: boolean
}

export const QuizCard = memo(function QuizCard({
  quiz,
  status,
  bestScore,
  attemptsCount,
  remainingAttempts,
  lastAttempt,
  showLessonInfo = true,
  showTags = true,
  showXP = true,
  compact = false
}: QuizCardProps) {
  const locale = useLocale()
  const t = useTranslations('QuizzesPage')
  const tAll = useTranslations('QuizzesPage.allQuizzes')

  const isPassed = bestScore >= quiz.passing_score

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return tAll('easy')
      case 'medium': return tAll('medium')
      case 'hard': return tAll('hard')
      default: return tAll('unknown')
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircleSolid className="h-5 w-5 text-green-500" />
      case 'locked':
        return <XCircleIcon className="h-5 w-5 text-gray-400" />
      default:
        return <ArrowRightIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getBorderColor = () => {
    switch (status) {
      case 'completed': return 'border-green-200'
      case 'locked': return 'border-gray-200'
      default: return 'border-blue-200'
    }
  }

  const getStatusBarColor = () => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-green-400 to-green-500'
      case 'locked': return 'bg-gray-300'
      default: return 'bg-gradient-to-r from-blue-400 to-indigo-500'
    }
  }

  if (compact) {
    return (
      <Link 
        href={`/${locale}/lessons/${quiz.lesson_id}/quizzes/${quiz.id}`}
        className={`block bg-white rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 ${getBorderColor()}`}
      >
        <div className={`h-1 ${getStatusBarColor()}`} />
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {getStatusIcon()}
              <h3 className="font-semibold text-gray-900 truncate">{quiz.title}</h3>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
              {getDifficultyText(quiz.difficulty)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('questionsCount', { count: quiz.question_count })}</span>
            <span>{quiz.time_limit ? t('timeLimitMinutes', { minutes: quiz.time_limit }) : t('noTimeLimit')}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-xl
      ${status === 'locked' ? 'opacity-75' : ''}
      ${getBorderColor()}`}
    >
      {/* Status Indicator */}
      <div className={`h-1 ${getStatusBarColor()}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{quiz.title}</h3>
              {getStatusIcon()}
            </div>
            
            {quiz.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {quiz.description}
              </p>
            )}
            
            {showLessonInfo && quiz.lesson_title && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                <span className="line-clamp-1">{quiz.lesson_title}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <HashtagIcon className="h-4 w-4 mr-2" />
              <span>{tAll('questions')}</span>
            </div>
            <p className="font-bold text-lg">{quiz.question_count}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>{tAll('time')}</span>
            </div>
            <p className="font-bold text-lg">
              {quiz.time_limit ? `${quiz.time_limit} ${tAll('minutes')}` : tAll('unlimited')}
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              <span>{t('passingScore')}</span>
            </div>
            <p className="font-bold text-lg">{quiz.passing_score}%</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <FireIcon className="h-4 w-4 mr-2" />
              <span>{tAll('difficulty')}</span>
            </div>
            <p className={`font-bold text-lg ${getDifficultyColor(quiz.difficulty).replace('bg-', 'text-').split(' ')[0]}`}>
              {getDifficultyText(quiz.difficulty)}
            </p>
          </div>
        </div>

        {/* Tags */}
        {showTags && quiz.tags && quiz.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {quiz.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {quiz.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{quiz.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Progress and Score */}
        {attemptsCount > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <TrophyIcon className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {t('bestScore')}
                </span>
              </div>
              <span className={`text-lg font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {bestScore}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  isPassed ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                }`}
                style={{ width: `${Math.min(bestScore, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <UsersIcon className="h-3 w-3 mr-1" />
                <span>{attemptsCount} {t('attempts')}</span>
              </div>
              
              {lastAttempt && (
                <div className="flex items-center">
                  <CalendarDaysIcon className="h-3 w-3 mr-1" />
                  <span>
                    {new Date(lastAttempt.completed_at).toLocaleDateString(locale)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* XP Reward */}
        {showXP && quiz.estimated_xp && (
          <div className="mb-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="font-bold text-yellow-700">
                {tAll('reward')}: {quiz.estimated_xp} XP
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6">
          {status === 'locked' ? (
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center justify-center text-gray-500">
                <LockClosedIcon className="h-5 w-5 mr-2" />
                <span>{t('quizLocked')}</span>
              </div>
            </div>
          ) : status === 'completed' ? (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/${locale}/lessons/${quiz.lesson_id}/quizzes/${quiz.id}/review`}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 text-center"
              >
                {tAll('review')}
              </Link>
              {remainingAttempts > 0 && (
                <Link
                  href={`/${locale}/lessons/${quiz.lesson_id}/quizzes/${quiz.id}`}
                  className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all font-medium text-center"
                >
                  {tAll('retake')}
                </Link>
              )}
            </div>
          ) : (
            <Link
              href={`/${locale}/lessons/${quiz.lesson_id}/quizzes/${quiz.id}`}
              className={`block w-full px-4 py-3 rounded-lg font-medium text-center transition-all ${
                remainingAttempts === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg'
              }`}
            >
              {remainingAttempts === 0 ? (
                <div className="flex items-center justify-center">
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  {t('noAttemptsLeft')}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  {t('startQuiz')}
                  {attemptsCount > 0 && (
                    <span className="ml-2 text-sm opacity-90">
                      ({remainingAttempts} {t('attemptsLeft')})
                    </span>
                  )}
                </div>
              )}
            </Link>
          )}
        </div>

        {/* Creation Date */}
        {quiz.created_at && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              {tAll('created')}: {new Date(quiz.created_at).toLocaleDateString(locale)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
})