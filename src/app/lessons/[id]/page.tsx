'use client'

import { useParams, useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BackButton } from '@/components/ui/BackButton'
import { MediaPlayer } from '@/components/media/MediaPlayer'
import { VocabularyCard } from '@/components/vocabulary/VocabularyCard'
import { GrammarCard } from '@/components/grammar/GrammarCard'
import { ClockIcon, StarIcon, FireIcon, BookmarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { useCompleteLessonMutation, useGetLessonByIdQuery, useUpdateCompletedItemsMutation } from '@/store/apis/lessonsApi'
import { useToggleFavoriteMutation as useToggleLessonFavoriteMutation } from '@/store/apis/lessonsApi'
import { useToggleFavoriteMutation as useToggleWordFavoriteMutation } from '@/store/apis/favoritesApi'
import { updateTimeSpent } from '@/store/slices/dashboardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '@/store/store'



export default function LessonDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);

  // استخدام RTK Query
  const { data: lessonData, isLoading, isError, error } = useGetLessonByIdQuery(id as string)

  // استخدام Mutations
  const [toggleFavorite] = useToggleLessonFavoriteMutation()
  const [updateCompletedItems] = useUpdateCompletedItemsMutation()
  const [completeLesson] = useCompleteLessonMutation()
  const [toggleFavoriteWordMutation] = useToggleWordFavoriteMutation()


  // لأضافة الكلمات الى المفضلة
  const [favoriteItems, setFavoriteItems] = useState<{
    word: Record<string, boolean>
    grammar: Record<string, boolean>
    sentence: Record<string, boolean>
  }>({
    word: {},
    grammar: {},
    sentence: {},
  });

useEffect(() => {
  if (!lessonData) return

  const initialWordFavorites: Record<string, boolean> = {}
  lessonData.vocabulary.forEach(word => {
    initialWordFavorites[word.id] = false
  })

  const initialGrammarFavorites: Record<string, boolean> = {}
  lessonData.grammar.forEach(rule => {
    initialGrammarFavorites[rule.id] = false
  })

  // نستخدم setTimeout لتأجيل setState بعد الرندر
  setTimeout(() => {
    setFavoriteItems({
      word: initialWordFavorites,
      grammar: initialGrammarFavorites,
      sentence: {} // لاحقًا يمكن إضافة الجمل
    })
  }, 0)
}, [lessonData])




  const toggleFavoriteItem = async (itemId: string, itemType: 'word' | 'grammar' | 'sentence') => {
  try {
    // القيمة الجديدة للـ state
    const newValue = !favoriteItems[itemType][itemId];

    // استدعاء الـ mutation
    await toggleFavoriteWordMutation({
      itemId,
      itemType
    }).unwrap();

    // تحديث state فورًا لتغيير لون القلب
    setFavoriteItems(prev => ({
      ...prev,
      [itemType]: {
        ...prev[itemType],
        [itemId]: newValue
      }
    }));
  } catch (error) {
    console.error(`Failed to toggle favorite ${itemType}`, error);
  }
};



  // لحساب الوقت المنقضي في الدرس
useEffect(() => {
  if (!user) return;

  let start = Date.now();
  let accumulated = 0;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      accumulated += Date.now() - start;
    } else {
      start = Date.now();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  const handleBeforeUnload = () => {
    accumulated += Date.now() - start;
    const minutes = Math.floor(accumulated / 60000);
    if (minutes > 0) {
      dispatch(updateTimeSpent({ userId: user.id, minutes }) as any);
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);

    accumulated += Date.now() - start;
    const minutes = Math.floor(accumulated / 60000);
    if (minutes > 0) {
      dispatch(updateTimeSpent({ userId: user.id, minutes }) as any);
    }
  };
}, [user, dispatch]);





  if (isLoading) return <LoadingSpinner />
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <BackButton href="/lessons" />
          <ErrorMessage message={(error as any).message} />
        </div>
      </div>
    )
  }

  if (!lessonData?.lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <BackButton href="/lessons" />
          <ErrorMessage message="Lesson not found" />
        </div>
      </div>
    )
  }

  const { lesson, grammar, vocabulary, progress } = lessonData

  const handleMarkFavorite = async () => {
    try {
      await toggleFavorite({ 
        lessonId: lesson.id, 
        isFavorite: !progress?.is_favorite 
      }).unwrap()
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const toggleCompleteItem = async (itemId: string) => {
    if (progress?.status === 'completed') return
    const completed = !progress?.completed_items?.includes(itemId)
    
    try {
      await updateCompletedItems({
        lessonId: lesson.id,
        itemId,
        completed
      }).unwrap()
    } catch (error) {
      console.error('Failed to update completed items:', error)
    }
  }

  const handleCompleteLesson = async () => {
    if (progress?.status === 'completed') return

    try {
      await completeLesson({
        lessonId: lesson.id
      }).unwrap()
    } catch (error) {
      console.error('Failed to complete lesson:', error)
    }
  }

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

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  const totalItems = lessonData.total_items
  const completedItems = progress?.completed_items?.length || 0
  const progressPercentage = totalItems > 0 ? 
    Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <BackButton href="/lessons" />
        </div>

        {/* Lesson Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(lesson.level)}`}>
                  {lesson.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
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
                  <span>{lesson.duration || 15} min</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 mr-2" />
                  <span>Lesson #{lesson.order_index}</span>
                </div>
                <button
                  onClick={handleMarkFavorite}
                  className={`flex items-center ${progress?.is_favorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                >
                  <BookmarkIcon className="h-5 w-5 mr-1" />
                  {progress?.is_favorite ? 'Saved' : 'Save'}
                </button>
              </div>

              {/* Progress Status */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold capitalize">{progress?.status || 'pending'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{completedItems} of {totalItems} items</span>
                  <span>{progressPercentage}%</span>
                </div>
              </div>
            </div>

            {/* XP Badge */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center">
                <FireIcon className="h-8 w-8 text-orange-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-600">Complete to earn</div>
                  <div className="text-2xl font-bold text-gray-900">{lesson.estimated_xp} XP</div>
                  {progress?.status === 'completed' && (
                    <div className="flex items-center text-green-600 text-sm mt-1">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      <span>Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Media & Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video/Audio */}
            {lesson.video_url && (
              <MediaPlayer 
                type="video"
                url={lesson.video_url}
                title={lesson.title}
              />
            )}

            {lesson.audio_url && (
              <MediaPlayer 
                type="audio"
                url={lesson.audio_url}
                title={lesson.title}
              />
            )}

            {/* Lesson Content */}
            {lesson.content && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lesson Content</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {typeof lesson.content === 'string' 
                    ? lesson.content 
                    : JSON.stringify(lesson.content, null, 2)}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Grammar & Vocabulary */}
          <div className="space-y-8">
            {/* Vocabulary */}
            {vocabulary.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Vocabulary</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {vocabulary.length} words
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

            {/* Grammar */}
            {grammar.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Grammar Rules</h2>
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

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push('/lessons')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Lessons
          </button>
          <button
            onClick={handleCompleteLesson}
            disabled={progress?.status === 'completed'}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              progress?.status === 'completed'
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {progress?.status === 'completed' ? '✓ Lesson Completed' : 'Complete Lesson'}
          </button>
        </div>
      </div>
    </div>
  )
}