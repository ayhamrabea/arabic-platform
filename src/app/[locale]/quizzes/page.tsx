'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { 
  useGetAllQuizzesQuery, 
  useGetUserAttemptsQuery,
  useGetUserQuizStatsQuery
} from '@/store/apis/quizApi'
import Link from 'next/link'

// Import Common Components
import { QuizCard } from '@/components/quizzes/QuizCard'
import { QuizzesFilters } from '@/components/quizzes/QuizzesFilters'
import { ProgressSummary } from '@/components/quizzes/ProgressSummary'
import { Pagination } from '@/components/quizzes/Pagination'

// Icons
import {
  BookOpenIcon,
  AcademicCapIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  HomeIcon,
  UserIcon,
  TrophyIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon
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
  is_active: boolean
  tags?: string[]
  estimated_xp?: number
  created_at?: string
  attempts_count?: number
  average_score?: number
  max_attempts?: number
}

interface QuizAttempt {
  id: string
  quiz_id: string
  profile_id: string
  score: number
  status: 'in_progress' | 'completed' | 'abandoned'
  started_at: string
  completed_at?: string
  time_spent: number
  correct_answers?: number
  total_questions?: number
}

interface UserQuizStats {
  totalAttempts: number
  completedAttempts: number
  passedAttempts: number
  averageScore: number
  passedQuizzes: string[]
  attemptsByQuiz: Record<string, QuizAttempt[]>
  quizStats: Record<string, {
    attemptsCount: number
    bestScore: number
    lastAttempt: string | null
    isPassed: boolean
    passingScore: number
    maxAttempts: number
    isActive: boolean
  }>
  success: boolean
}

export default function AllQuizzesPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('QuizzesPage')
  const tAll = useTranslations('QuizzesPage.allQuizzesPage')
  
  const { user } = useSelector((state: RootState) => state.auth)
  const profileId = user?.id

  // State
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'all',
    status: 'all',
    sortBy: 'newest'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const quizzesPerPage = 12

  // Fetch all quizzes
  const { 
    data: allQuizzes = [], 
    isLoading: isLoadingQuizzes, 
    isError: isQuizzesError, 
    error: quizzesError,
    refetch: refetchQuizzes 
  } = useGetAllQuizzesQuery()

  // Fetch user attempts
  const {
    data: userAttemptsData = [],
    isLoading: isLoadingAttempts,
    isError: isAttemptsError,
    error: attemptsError,
    refetch: refetchUserAttempts
  } = useGetUserAttemptsQuery(
    { profileId: profileId! }, 
    { 
      skip: !profileId,
      refetchOnMountOrArgChange: true
    }
  )

  // Fetch user quiz stats
  const {
    data: userStatsData = {
      totalAttempts: 0,
      completedAttempts: 0,
      passedAttempts: 0,
      averageScore: 0,
      passedQuizzes: [],
      attemptsByQuiz: {},
      quizStats: {},
      success: false
    },
    isLoading: isLoadingStats,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats
  } = useGetUserQuizStatsQuery(profileId!, { 
    skip: !profileId 
  })

  // Debug logging
  useEffect(() => {
    console.log('=== DEBUG INFO ===')
    console.log('User Profile ID:', profileId)
    console.log('Total quizzes:', allQuizzes.length)
    console.log('User attempts data:', userAttemptsData)
    console.log('User stats data:', userStatsData)
    console.log('Is loading quizzes:', isLoadingQuizzes)
    console.log('Is loading attempts:', isLoadingAttempts)
    console.log('Is loading stats:', isLoadingStats)
    console.log('=== END DEBUG ===')
  }, [profileId, allQuizzes, userAttemptsData, userStatsData, isLoadingQuizzes, isLoadingAttempts, isLoadingStats])

  // Combine loading states
  const isLoading = isLoadingQuizzes || isLoadingAttempts || isLoadingStats
  const isError = isQuizzesError || isAttemptsError || isStatsError
  const error = quizzesError || attemptsError || statsError

  // Process user attempts
  const userAttempts = useMemo(() => {
    if (!userAttemptsData) return []
    if (Array.isArray(userAttemptsData)) return userAttemptsData
    if (typeof userAttemptsData === 'object' && userAttemptsData.data) {
      return Array.isArray(userAttemptsData.data) ? userAttemptsData.data : []
    }
    return []
  }, [userAttemptsData])

  // Process user stats
  const userStats: UserQuizStats = useMemo(() => {
    return userStatsData
  }, [userStatsData])

  // Create comprehensive quiz data
  const quizDataWithStats = useMemo(() => {
    return allQuizzes.map((quiz: Quiz) => {
      const quizId = quiz.id
      
      // Get attempts for this quiz from multiple sources
      let attempts: QuizAttempt[] = []
      let attemptsCount = 0
      let bestScore = 0
      let lastAttempt: QuizAttempt | null = null
      let isPassed = false
      
      // Check stats from API
      const quizStatsFromAPI = userStats.quizStats?.[quizId]
      if (quizStatsFromAPI) {
        attemptsCount = quizStatsFromAPI.attemptsCount || 0
        bestScore = quizStatsFromAPI.bestScore || 0
        isPassed = quizStatsFromAPI.isPassed || false
        
        // Get attempts from attemptsByQuiz
        const apiAttempts = userStats.attemptsByQuiz?.[quizId] || []
        if (apiAttempts.length > 0) {
          attempts = apiAttempts
          // Get last attempt
          const sorted = [...apiAttempts].sort((a, b) => {
            const dateA = a.completed_at ? new Date(a.completed_at).getTime() : new Date(a.started_at).getTime()
            const dateB = b.completed_at ? new Date(b.completed_at).getTime() : new Date(b.started_at).getTime()
            return dateB - dateA
          })
          lastAttempt = sorted[0]
        }
      }
      
      // Also check direct attempts array
      if (attemptsCount === 0 && userAttempts.length > 0) {
        const directAttempts = userAttempts.filter((attempt: any) => 
          attempt && attempt.quiz_id === quizId
        )
        
        attempts = directAttempts
        attemptsCount = directAttempts.length
        
        if (attemptsCount > 0) {
          // Calculate best score
          const scores = directAttempts
            .map((a: any) => {
              const score = typeof a.score === 'number' ? a.score : parseFloat(a.score)
              return isNaN(score) ? 0 : score
            })
            .filter((s: number) => !isNaN(s))
          
          if (scores.length > 0) {
            bestScore = Math.max(...scores)
          }
          
          // Check if passed
          isPassed = directAttempts.some((attempt: any) => {
            const score = typeof attempt.score === 'number' ? attempt.score : parseFloat(attempt.score)
            return attempt.status === 'completed' && !isNaN(score) && score >= quiz.passing_score
          })
          
          // Get last attempt
          if (directAttempts.length > 0) {
            const sorted = [...directAttempts].sort((a: any, b: any) => {
              const dateA = a.completed_at ? new Date(a.completed_at).getTime() : new Date(a.started_at).getTime()
              const dateB = b.completed_at ? new Date(b.completed_at).getTime() : new Date(b.started_at).getTime()
              return dateB - dateA
            })
            lastAttempt = sorted[0]
          }
        }
      }
      
      // Determine quiz status
      let status: 'available' | 'completed' | 'locked' = 'available'
      
      if (!quiz.is_active) {
        status = 'locked'
      } else if (isPassed) {
        status = 'completed'
      } else if (bestScore >= quiz.passing_score) {
        status = 'completed'
      }
      
      // Calculate remaining attempts
      const maxAttempts = quiz.max_attempts || 3
      const remainingAttempts = Math.max(0, maxAttempts - attemptsCount)
      
      console.log(`Quiz ${quizId}: attempts=${attemptsCount}, bestScore=${bestScore}, status=${status}`)
      
      return {
        quiz,
        attempts,
        attemptsCount,
        bestScore,
        isPassed,
        status,
        remainingAttempts,
        lastAttempt,
        maxAttempts
      }
    })
  }, [allQuizzes, userStats, userAttempts])

  // Filter and sort quizzes
  const filteredQuizzes = useMemo(() => {
    return quizDataWithStats.filter(({ quiz, status }) => {
      // Search filter
      const matchesSearch = filters.search === '' || 
        quiz.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        quiz.lesson_title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        quiz.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      
      // Difficulty filter
      const matchesDifficulty = filters.difficulty === 'all' || 
        quiz.difficulty === filters.difficulty
      
      // Status filter
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'completed' && status === 'completed') ||
        (filters.status === 'available' && status === 'available') ||
        (filters.status === 'locked' && status === 'locked')
      
      return matchesSearch && matchesDifficulty && matchesStatus
    }).sort((a, b) => {
      // Sorting logic
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.quiz.created_at || 0).getTime() - new Date(a.quiz.created_at || 0).getTime()
        case 'oldest':
          return new Date(a.quiz.created_at || 0).getTime() - new Date(b.quiz.created_at || 0).getTime()
        case 'difficulty-asc':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrder[a.quiz.difficulty] - difficultyOrder[b.quiz.difficulty]
        case 'difficulty-desc':
          const difficultyOrderDesc = { easy: 1, medium: 2, hard: 3 }
          return difficultyOrderDesc[b.quiz.difficulty] - difficultyOrderDesc[a.quiz.difficulty]
        case 'questions-asc':
          return a.quiz.question_count - b.quiz.question_count
        case 'questions-desc':
          return b.quiz.question_count - a.quiz.question_count
        case 'popular':
          return (b.quiz.attempts_count || 0) - (a.quiz.attempts_count || 0)
        case 'score-asc':
          return a.bestScore - b.bestScore
        case 'score-desc':
          return b.bestScore - a.bestScore
        case 'attempts-asc':
          return a.attemptsCount - b.attemptsCount
        case 'attempts-desc':
          return b.attemptsCount - a.attemptsCount
        case 'completion':
          if (a.status === 'completed' && b.status !== 'completed') return -1
          if (a.status !== 'completed' && b.status === 'completed') return 1
          return b.bestScore - a.bestScore
        default:
          return 0
      }
    })
  }, [quizDataWithStats, filters])

  // Pagination
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage)
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  )

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    const totalQuizzes = allQuizzes.length
    const completedQuizzes = quizDataWithStats.filter(data => data.status === 'completed').length
    const availableQuizzes = quizDataWithStats.filter(data => data.status === 'available').length
    const lockedQuizzes = quizDataWithStats.filter(data => data.status === 'locked').length
    
    const totalQuestions = allQuizzes.reduce((sum: number, q: Quiz) => sum + q.question_count, 0)
    
    // Calculate average difficulty
    const averageDifficulty = allQuizzes.length > 0 
      ? allQuizzes.reduce((sum: number, q: Quiz) => {
          const diffValue = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3
          return sum + diffValue
        }, 0) / allQuizzes.length
      : 0
    
    // Get stats from userStats or calculate from data
    const totalAttempts = userStats.totalAttempts || userAttempts.length
    const passedAttempts = userStats.passedAttempts || 0
    const completedAttempts = userStats.completedAttempts || 0
    const averageScore = userStats.averageScore || 0
    
    // Calculate completion rate
    const completionRate = totalQuizzes > 0 
      ? Math.round((completedQuizzes / totalQuizzes) * 100)
      : 0
    
    // Calculate total XP earned
    const totalXPEarned = quizDataWithStats
      .filter(data => data.status === 'completed' && data.quiz.estimated_xp)
      .reduce((sum, data) => sum + (data.quiz.estimated_xp || 0), 0)
    
    // Calculate success rate (passed attempts / total attempts)
    const successRate = totalAttempts > 0
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0
    
    // Calculate average attempts per quiz
    const totalQuizzesWithAttempts = quizDataWithStats.filter(data => data.attemptsCount > 0).length
    const averageAttemptsPerQuiz = totalQuizzesWithAttempts > 0
      ? (totalAttempts / totalQuizzesWithAttempts).toFixed(1)
      : '0.0'

    return {
      totalQuizzes,
      completedQuizzes,
      availableQuizzes,
      lockedQuizzes,
      totalQuestions,
      averageDifficulty,
      totalAttempts,
      passedAttempts,
      completedAttempts,
      averageScore,
      completionRate,
      totalXPEarned,
      successRate,
      averageAttemptsPerQuiz,
      totalQuizzesWithAttempts
    }
  }, [allQuizzes, quizDataWithStats, userStats, userAttempts])

  // Handlers
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleRetry = useCallback(() => {
    refetchQuizzes()
    if (profileId) {
      refetchUserAttempts()
      refetchStats()
    }
  }, [refetchQuizzes, refetchUserAttempts, refetchStats, profileId])

  const handleRefreshData = useCallback(() => {
    handleRetry()
  }, [handleRetry])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            
            <div className="h-16 bg-gray-200 rounded-xl mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('errorLoading')}
          </h2>
          <p className="text-gray-600 mb-6">
            {(error as any)?.data?.error || t('errorDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              {t('retry')}
            </button>
            <Link
              href={`/${locale}`}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              {tAll('dashboard')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <TrophyIcon className="h-8 w-8 text-indigo-600" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {tAll('pageTitle')}
                </h1>
              </div>
              <p className="text-gray-600">
                {tAll('pageDescription')}
              </p>
              
              {profileId && (
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-xs">{user?.email}</span>
                  </div>
                  
                  {stats.totalAttempts > 0 && (
                    <>
                      <div className="hidden md:block text-sm text-gray-500">
                        <span className="font-medium">{stats.passedAttempts}</span> {tAll('passedOf')} <span className="font-medium">{stats.totalAttempts}</span> {tAll('attempts')}
                      </div>
                      <div className="hidden md:block text-sm text-gray-500">
                        {tAll('successRate')}: <span className="font-medium text-green-600">{stats.successRate}%</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 self-start md:self-auto">
              <button
                onClick={handleRefreshData}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                {tAll('refresh')}
              </button>
              <Link
                href={`/${locale}/lessons`}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                <BookOpenIcon className="h-5 w-5 mr-2" />
                {tAll('allLessons')}
              </Link>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 font-medium"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                {tAll('dashboard')}
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <ProgressSummary stats={stats} showAllStats={true} />

          {/* Search and Filters */}
          <div className="mb-8">
            <QuizzesFilters 
              onFilterChange={handleFilterChange}
              showStatusFilter={true}
              showDifficultyFilter={true}
              showSortOptions={true}
              // currentFilters={filters}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              {tAll('showing')} <span className="font-semibold text-indigo-600">{paginatedQuizzes.length}</span> {tAll('of')} <span className="font-semibold">{filteredQuizzes.length}</span> {tAll('quizzes')}
            </p>
            
            {stats.totalAttempts > 0 && (
              <div className="hidden sm:flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                <TrophyIcon className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{tAll('completion')}: <span className="font-medium">{stats.completionRate}%</span></span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {paginatedQuizzes.length > 0 && (
              <p className="text-gray-600">
                {tAll('page')} <span className="font-semibold">{currentPage}</span> {tAll('of')} <span className="font-semibold">{totalPages}</span>
              </p>
            )}
          </div>
        </div>

        {/* Quizzes Grid */}
        {paginatedQuizzes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedQuizzes.map((data) => (
                <QuizCard
                  key={data.quiz.id}
                  quiz={data.quiz}
                  status={data.status}
                  bestScore={data.bestScore}
                  attemptsCount={data.attemptsCount}
                  remainingAttempts={data.remainingAttempts}
                  lastAttempt={data.lastAttempt}
                  showLessonInfo={true}
                  showTags={true}
                  showXP={true}
                  compact={false}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                // showNumbers={true}
              />
            )}
          </>
        ) : (
          /* No Results */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <AcademicCapIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {tAll('noQuizzesFound')}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {tAll('noQuizzesFoundDescription')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleFilterChange({
                  search: '',
                  difficulty: 'all',
                  status: 'all',
                  sortBy: 'newest'
                })}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                {tAll('clearAllFilters')}
              </button>
              <button
                onClick={handleRefreshData}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                {tAll('refreshData')}
              </button>
            </div>
          </div>
        )}

        {/* User Progress Summary */}
        {profileId && stats.totalAttempts > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-indigo-600" />
              {tAll('yourProgress')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.completedQuizzes}</div>
                <div className="text-sm text-gray-600">{tAll('quizzesCompleted')}</div>
                <div className="text-xs text-gray-500 mt-1">{tAll('outOf')} {stats.totalQuizzes} {tAll('quizzes')}</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.passedAttempts}</div>
                <div className="text-sm text-gray-600">{tAll('passedAttempts')}</div>
                <div className="text-xs text-gray-500 mt-1">{tAll('successRate')} {stats.successRate}%</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.totalXPEarned}</div>
                <div className="text-sm text-gray-600">{tAll('totalXP')}</div>
                <div className="text-xs text-gray-500 mt-1">{tAll('earned')}</div>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.averageScore}%</div>
                <div className="text-sm text-gray-600">{tAll('averageScore')}</div>
                <div className="text-xs text-gray-500 mt-1">{tAll('from')} {stats.totalAttempts} {tAll('attempts')}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{tAll('completionRate')}</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-indigo-600" />
                {tAll('tipsTitle')}
              </h3>
              <ul className="text-gray-700 space-y-3">
                <li className="flex items-start">
                  <span className="text-indigo-500 font-bold mr-2">•</span>
                  <span>{tAll('tip1')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 font-bold mr-2">•</span>
                  <span>{tAll('tip2')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 font-bold mr-2">•</span>
                  <span>{tAll('tip3')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 font-bold mr-2">•</span>
                  <span>{tAll('tip4')}</span>
                </li>
              </ul>
            </div>
            
            {/* Quick Stats */}
            <div className="w-full md:w-64 bg-white p-6 rounded-xl shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-4">{tAll('quickStats')}</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{tAll('activeQuizzes')}</span>
                  <span className="font-medium">{stats.availableQuizzes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{tAll('totalQuestions')}</span>
                  <span className="font-medium">{stats.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{tAll('avgAttempts')}</span>
                  <span className="font-medium">{stats.averageAttemptsPerQuiz}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{tAll('lockedQuizzes')}</span>
                  <span className="font-medium">{stats.lockedQuizzes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
            <details>
              <summary className="font-semibold text-sm cursor-pointer">{tAll('debugInfo')}</summary>
              <div className="mt-2 text-xs space-y-2">
                <div><span className="font-medium">{tAll('user')}:</span> {user?.email}</div>
                <div><span className="font-medium">{tAll('profileId')}:</span> {profileId}</div>
                <div><span className="font-medium">{tAll('totalQuizzes')}:</span> {allQuizzes.length}</div>
                <div><span className="font-medium">{tAll('totalAttempts')}:</span> {userAttempts.length}</div>
                <div><span className="font-medium">{tAll('passedAttempts')}:</span> {stats.passedAttempts}</div>
                <div><span className="font-medium">{tAll('completedQuizzes')}:</span> {stats.completedQuizzes}</div>
                <div><span className="font-medium">{tAll('quizzesWithAttempts')}:</span> {stats.totalQuizzesWithAttempts}</div>
                <div><span className="font-medium">User Stats API Success:</span> {userStats.success ? 'Yes' : 'No'}</div>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  )
}