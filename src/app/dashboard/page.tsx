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
import { fetchDashboardData, startLesson, updateTimeSpent } from '@/store/slices/dashboardSlice'
import { getLevelProgressByXP, LEVELS } from '@/utils/levels'
import { formatTime } from '@/utils/profile'


export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { 
    stats, 
    recentLessons, 
    recommendedLessons,
    isLoading: dashboardLoading, 
    error 
  } = useSelector((state: RootState) => state.dashboard);

  const [localStats, setLocalStats] = useState(stats);
  const [progress, setProgress] = useState(getLevelProgressByXP(stats?.totalXP || 0));


  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    if (user?.id) {
      dispatch(fetchDashboardData(user.id) as any);
    }
  }, [user, authLoading, dispatch, router]);



  useEffect(() => {
  if (stats) {
    setLocalStats(stats);
    setProgress(getLevelProgressByXP(stats.totalXP));
  }
}, [stats]);


  const handleStartLesson = async (lessonId: string) => {
    if (user) {
      await dispatch(startLesson({ userId: user.id, lessonId }) as any);
      router.push(`/lessons/${lessonId}`);
    }
  };





  const isLoading = authLoading || dashboardLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }






  const quickActions = [
    { 
      title: 'Continue Learning', 
      description: 'Pick up where you left off',
      emoji: '📚',
      href: recentLessons[0]?.id ? `/lessons/${recentLessons[0].id}` : '/lessons',
      gradientFrom: '#eff6ff',
      gradientTo: '#e0e7ff'
    },
    { 
      title: 'Grammar Quiz', 
      description: 'Test your knowledge',
      emoji: '✍️',
      href: '/grammar',
      gradientFrom: '#f0fdf4',
      gradientTo: '#d1fae5'
    },
    { 
      title: 'Vocabulary Builder', 
      description: 'Learn 10 new words',
      emoji: '🔤',
      href: '/vocabulary',
      gradientFrom: '#faf5ff',
      gradientTo: '#fce7f3'
    },
    { 
      title: 'Speaking Practice', 
      description: 'Pronunciation exercises',
      emoji: '🎤',
      href: '/speaking',
      gradientFrom: '#fffbeb',
      gradientTo: '#fef3c7'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          userEmail={user.email || ''} 
          // userName={user.user_metadata?.name || user.email?.split('@')[0]}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <div className="h-5 w-5 text-red-500 mr-2">⚠️</div>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Level Progress */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Current Level</h2>
              <p className="text-indigo-100">{stats?.currentLevel || 'A1 Beginner'}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats?.totalXP || 0} XP</p>
                {stats && (
                  <p className="text-indigo-100">
                    {stats.nextLevelXP - stats.totalXP} XP to next level
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
            title="Lessons Completed"
            description="Your learning journey"
            value={`${stats?.completedLessons || 0}/${stats?.totalLessons || 0}`}
            icon={<BookOpenIcon className="h-8 w-8 text-blue-600" />}
            color="blue"
            href="/lessons"
            progress={localStats?.totalLessons ? 
              Math.round(((localStats?.completedLessons || 0) / localStats.totalLessons) * 100) : 0
            }
          />

          <StatCard
            title="Current Streak"
            description="Daily consistency"
            value={`${stats?.streakDays || 0} days`}
            icon={<FireIcon className="h-8 w-8 text-orange-600" />}
            color="orange"
            // showStreak
            // streakDays={stats?.streakDays || 0}
          />

          <StatCard
            title="Learning Accuracy"
            description="Average score"
            value={`${stats?.completedLessons || 0}%`}
            icon={<AcademicCapIcon className="h-8 w-8 text-green-600" />}
            color="green"
            // showAccuracy
            // accuracy={stats?.accuracy || 0}
          />

          <StatCard
            title="Time Spent"
            description="Total learning"
            value={formatTime(stats?.timeSpent || 0)}
            icon={<ClockIcon className="h-8 w-8 text-purple-600" />}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <SectionHeader 
                title="Continue Learning" 
                linkText="View all lessons" 
                linkHref="/lessons" 
              />
              
              <div className="space-y-4">
                {recentLessons.length > 0 ? (
                  recentLessons.slice(0, 3).map((lesson) => (
                    <SimpleLessonCard
                      key={lesson.id}
                      title={lesson.title}
                      duration={`${lesson.duration} min`}
                      level={lesson.level}
                      status={lesson.status as any}
                      progress={lesson.status === 'completed' ? 100 : lesson.status === 'in_progress' ? 50 : 0}
                      onStart={() => handleStartLesson(lesson.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No lessons started yet.</p>
                    <button
                      onClick={() => router.push('/lessons')}
                      className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Browse Lessons →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Lessons */}
            {recommendedLessons.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <SectionHeader 
                  title="Recommended for You" 
                  // description="Based on your current level"
                />
                
                <div className="space-y-4">
                  {recommendedLessons.map((lesson) => (
                    <SimpleLessonCard
                        key={lesson.id}
                        title={lesson.title}
                        duration={`${lesson.duration} min`}
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
              <SectionHeader title="Quick Actions" />
              
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <QuickActionCard
                      key={index}
                      title={action.title}
                      description={action.description}
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
  );
}

