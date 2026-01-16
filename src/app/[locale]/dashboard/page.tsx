'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { 
  BookOpenIcon, 
  ChartBarIcon, 
  ClockIcon, 
  TrophyIcon,
  FireIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { GradientCard } from '@/components/dashboard/GradientCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { QuickActionCard } from '@/components/dashboard/QuickActionCard'
import { SimpleLessonCard } from '@/components/lessons/SimpleLessonCard'
import { fetchDashboardData, startLesson } from '@/store/slices/dashboardSlice'
import { getLevelProgressByXP } from '@/utils/levels'
import { formatTime } from '@/utils/profile'
import { updateStreak } from '@/utils/services/streak'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const t = useTranslations('DashboardPage')

  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const { 
    stats, 
    recentLessons, 
    recommendedLessons,
    isLoading: dashboardLoading, 
    error 
  } = useSelector((state: RootState) => state.dashboard)

  const [localStats, setLocalStats] = useState(stats)
  const [progress, setProgress] = useState(getLevelProgressByXP(stats?.totalXP || 0))

  // auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [user, authLoading])

  // fetch dashboard data
  useEffect(() => {
    if (!user?.id) return
    dispatch(fetchDashboardData(user.id) as any)
    updateStreak(user.id).catch(console.error)
  }, [user?.id])

  // update local stats and progress
  useEffect(() => {
    if (stats) {
      setLocalStats(stats)
      setProgress(getLevelProgressByXP(stats.totalXP))
    }
  }, [stats])

  const handleStartLesson = async (lessonId: string) => {
    if (user) {
      await dispatch(startLesson({ userId: user.id, lessonId }) as any)
      router.push(`/lessons/${lessonId}`)
    }
  }

  const isLoading = authLoading || dashboardLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <LoadingSpinner messageKey="loading" />
      </div>
    )
  }

  if (!user) return null

  const quickActions = [
    { 
      titleKey: 'continueLearning', 
      descriptionKey: 'continueLearningDesc',
      emoji: '📚',
      href: recentLessons[0]?.id ? `/lessons/${recentLessons[0].id}` : '/lessons',
      gradientFrom: '#eff6ff',
      gradientTo: '#e0e7ff'
    },
    { 
      titleKey: 'grammarQuiz', 
      descriptionKey: 'grammarQuizDesc',
      emoji: '✍️',
      href: '/grammar',
      gradientFrom: '#f0fdf4',
      gradientTo: '#d1fae5'
    },
    { 
      titleKey: 'vocabularyBuilder', 
      descriptionKey: 'vocabularyBuilderDesc',
      emoji: '🔤',
      href: '/vocabulary',
      gradientFrom: '#faf5ff',
      gradientTo: '#fce7f3'
    },
    { 
      titleKey: 'speakingPractice', 
      descriptionKey: 'speakingPracticeDesc',
      emoji: '🎤',
      href: '/speaking',
      gradientFrom: '#fffbeb',
      gradientTo: '#fef3c7'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          userEmail={user.email?.split('@')[0] || ''}
          streak={stats?.streakDays}
          level={stats?.currentLevel}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="h-5 w-5 text-red-500 mr-2">⚠️</div>
              <p className="text-red-600">{t('error')}</p>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">{t('currentLevel')}</h2>
              <p className="text-indigo-100">{stats?.currentLevel || t('levelDefault')}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats?.totalXP || 0} XP</p>
              {stats && (
                <p className="text-indigo-100">
                  {stats.nextLevelXP - stats.totalXP} {t('xpToNextLevel')}
                </p>
              )}
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t('lessonsCompleted')}
            description={t('learningJourney')}
            value={`${stats?.completedLessons || 0}/${stats?.totalLessons || 0}`}
            icon={<BookOpenIcon className="h-8 w-8 text-blue-600" />}
            color="blue"
            href="/lessons"
            progress={localStats?.totalLessons ? 
              Math.round(((localStats?.completedLessons || 0) / localStats.totalLessons) * 100) : 0
            }
          />

          <StatCard
            title={t('currentStreak')}
            description={t('dailyConsistency')}
            value={`${stats?.streakDays || 0} ${t('days')}`}
            icon={<FireIcon className="h-8 w-8 text-orange-600" />}
            color="orange"
          />

          <StatCard
            title={t('learningAccuracy')}
            description={t('averageScore')}
            value={`${stats?.completedLessons || 0}%`}
            icon={<AcademicCapIcon className="h-8 w-8 text-green-600" />}
            color="green"
          />

          <StatCard
            title={t('timeSpent')}
            description={t('totalLearning')}
            value={formatTime(stats?.timeSpent || 0)}
            icon={<ClockIcon className="h-8 w-8 text-purple-600" />}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <SectionHeader 
                title={t('continueLearning')} 
                linkText={t('viewAllLessons')} 
                linkHref="/lessons" 
              />
              
              <div className="space-y-4">
                {recentLessons.length > 0 ? (
                  recentLessons.slice(0, 3).map((lesson) => (
                    <SimpleLessonCard
                      key={lesson.id}
                      title={lesson.title}
                      duration={`${lesson.duration} ${t('minutes')}`}
                      level={lesson.level}
                      status={lesson.status as any}
                      progress={lesson.status === 'completed' ? 100 : lesson.status === 'in_progress' ? 50 : 0}
                      onStart={() => handleStartLesson(lesson.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('noLessonsStarted')}</p>
                    <button
                      onClick={() => router.push('/lessons')}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {t('browseLessons')}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {recommendedLessons.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <SectionHeader 
                  title={t('recommendedForYou')} 
                />
                
                <div className="space-y-4">
                  {recommendedLessons.map((lesson) => (
                    <SimpleLessonCard
                        key={lesson.id}
                        title={lesson.title}
                        duration={`${lesson.duration} ${t('minutes')}`}
                        level={lesson.level}
                        status={lesson.status as any}
                        progress={lesson.status === 'completed' ? 100 : lesson.status === 'in_progress' ? 50 : 0}
                        onStart={() => handleStartLesson(lesson.id)}
                      />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <SectionHeader title={t('quickActions')} />
              
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard
                      key={index}
                      title={t(action.titleKey)}
                      description={t(action.descriptionKey)}
                      emoji={action.emoji}
                      href={action.href}
                      gradientFrom={action.gradientFrom}
                      gradientTo={action.gradientTo}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
