// app/[locale]/lessons/[id]/page.tsx

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'github-markdown-css/github-markdown-light.css';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BackButton } from '@/components/ui/BackButton'
import { MediaPlayer } from '@/components/media/MediaPlayer'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { GrammarCard } from '@/components/grammar/GrammarCard'

import { ClockIcon, StarIcon, FireIcon, BookmarkIcon, CheckCircleIcon, HeartIcon, ArrowRightIcon, BookOpenIcon, TrophyIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { getLevelColor } from '@/components/favorites/helpers'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

import {
  useGetLessonByIdQuery,
  useUpdateCompletedItemsMutation,
  useCompleteLessonMutation,
} from '@/store/apis/lessonsApi'

import { useToggleFavoriteMutation as useToggleWordFavoriteMutation } from '@/store/apis/favoritesApi'
import { useLessonTimeTracker } from '@/hooks/useLessonTimeTracker'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { useToggleLessonFavoriteMutation } from '@/store/apis/lessonsApi/lessonFavoritesApi'
import Link from 'next/link'

export default function LessonDetailPage() {
  const t = useTranslations('LessonDetailPage')
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const { 
    data: lessonData, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useGetLessonByIdQuery(id as string)

  const [toggleLessonFavorite] = useToggleLessonFavoriteMutation()
  const [updateCompletedItems] = useUpdateCompletedItemsMutation()
  const [completeLesson] = useCompleteLessonMutation()
  const [toggleFavoriteWordMutation] = useToggleWordFavoriteMutation()

  const [favoriteItems, setFavoriteItems] = useState<{
    word: Record<string, boolean>
    grammar: Record<string, boolean>
    sentence: Record<string, boolean>
  }>({
    word: {},
    grammar: {},
    sentence: {},
  })

  useEffect(() => {
    if (!lessonData || !user) return

    const initialWordFavorites: Record<string, boolean> = {}
    lessonData.vocabulary.forEach(word => {
      initialWordFavorites[word.id] = lessonData.favorite_words?.includes(word.id) || false
    })

    const initialGrammarFavorites: Record<string, boolean> = {}
    lessonData.grammar.forEach(rule => {
      initialGrammarFavorites[rule.id] = lessonData.favorite_grammar?.includes(rule.id) || false
    })

    setFavoriteItems({
      word: initialWordFavorites,
      grammar: initialGrammarFavorites,
      sentence: {}
    })
  }, [lessonData, user])

  const toggleFavoriteItem = async (itemId: string, itemType: 'word' | 'grammar' | 'sentence') => {
    try {
      const newValue = !favoriteItems[itemType][itemId]
      await toggleFavoriteWordMutation({ itemId, itemType }).unwrap()
      setFavoriteItems(prev => ({
        ...prev,
        [itemType]: {
          ...prev[itemType],
          [itemId]: newValue
        }
      }))
    } catch (error) {
      console.error(`Failed to toggle favorite ${itemType}`, error)
    }
  }

  // حساب الوقت المنقضي 
  useLessonTimeTracker(user?.id)


  if (isLoading) return <LoadingSpinner messageKey={'loading'} />


  if (isError || !lessonData?.lesson) {
    return (
      <div className="max-w-4xl mx-auto">
          <BackButton href="/lessons" textKey={'back'} />
          <ErrorMessage messageKey={t('error')} />
        </div>
    )
  }


  const { lesson, grammar, vocabulary, progress } = lessonData

  

  const handleMarkFavorite = async () => {
    try {
      await toggleLessonFavorite({ lessonId: lesson.id }).unwrap()
      refetch()
    } catch (error) {
      console.error('Failed to toggle lesson favorite:', error)
    }
  }

  const toggleCompleteItem = async (itemId: string) => {
    if (progress?.status === 'completed') return
    const completed = !progress?.completed_items?.includes(itemId)
    try {
      await updateCompletedItems({ lessonId: lesson.id, itemId, completed }).unwrap()
    } catch (error) {
      console.error('Failed to update completed items:', error)
    }
  }

  const handleCompleteLesson = async () => {
    if (progress?.status === 'completed') return
    try {
      await completeLesson({ lessonId: lesson.id }).unwrap()
    } catch (error) {
      console.error('Failed to complete lesson:', error)
    }
  }



  const totalItems = lessonData.total_items
  const completedItems = progress?.completed_items?.length || 0
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <BackButton href="/lessons" textKey={'back'} />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(lesson.level)}`}>
                  {lesson.level}
                </span>

                {lesson.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>{lesson.duration || 15} {t('minutes')}</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-2" />
                  <span>{t('lessonNumber', { order: lesson.order_index })}</span>
                </div>

                  <FavoriteButton
                    isFavorite={progress?.is_favorite}
                    onClick={handleMarkFavorite}
                  />

              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{t('progress')}</span>
                  <span className="font-semibold capitalize">{progress?.status || t('pending')}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{completedItems} {t('of')} {totalItems} {t('items')}</span>
                  <span>{progressPercentage}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center">
                <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">{t('completeToEarn')}</div>
                  <div className="text-2xl font-bold text-gray-900">{lesson.estimated_xp} XP</div>
                  {progress?.status === 'completed' && (
                    <div className="flex items-center text-green-600 text-sm mt-1">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      <span>{t('lessonCompleted')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {lesson.video_url && <MediaPlayer type="video" url={lesson.video_url} title={lesson.title} />}
            {lesson.audio_url && <MediaPlayer type="audio" url={lesson.audio_url} title={lesson.title} />}

            {lesson.content && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('lessonContent')}</h2>
                <div className="markdown-body">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // تخصيص المكونات إذا لزم الأمر
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-emerald-700" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-3 text-gray-800" {...props} />,
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 my-4" {...props} />
                        </div>
                      ),
                      code: ({node, ...props}) => (
                        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm" {...props} />
                      ),
                    }}
                  >
                    {lesson.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {vocabulary.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{t('vocabulary')}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {t('wordsCount', { count: vocabulary.length })}
                  </span>
                </div>
                <div className="space-y-4">
                  {vocabulary.map(word => (
                    <VocabularyCard
                      key={word.id}
                      word={word}
                      completed={progress?.completed_items?.includes(word.id) || false}
                      isFavorite={favoriteItems.word[word.id] || false}
                      onToggleComplete={() => toggleCompleteItem(word.id)}
                      onToggleFavorite={() => toggleFavoriteItem(word.id, 'word')}
                    />
                  ))}
                </div>
              </div>
            )}

            {grammar.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('grammar')}</h2>
                <div className="space-y-4">
                  {grammar.map(rule => (
                    <GrammarCard
                      key={rule.id}
                      rule={rule}
                      completed={progress?.completed_items?.includes(rule.id) || false}
                      isFavorite={favoriteItems.grammar[rule.id] || false}
                      onToggleComplete={() => toggleCompleteItem(rule.id)}
                      onToggleFavorite={() => toggleFavoriteItem(rule.id, 'grammar')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push('/lessons')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('backToLessons')}
          </button>

            <Link
                href={`/lessons/${id}/quizzes`}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ArrowRightIcon className="h-5 w-5" />
                {t('startQuiz')}
              </Link>

          <button
            onClick={handleCompleteLesson}
            disabled={progress?.status === 'completed'}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              progress?.status === 'completed'
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {progress?.status === 'completed' ? t('lessonCompleted') : t('completeLesson')}
          </button>
        </div>

      </div>
    </div>
  )
}
