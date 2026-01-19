// app/favorites/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BackButton } from '@/components/ui/BackButton'
import {
  StarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  SpeakerWaveIcon,
  ChevronRightIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import {
  useGetFavoriteItemsQuery,
  useToggleFavoriteMutation,
} from '@/store/apis/favoritesApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FavoriteVocabularyCard } from '@/components/favorites/FavoriteVocabularyCard'
import { FavoriteGrammarCard } from '@/components/favorites/FavoriteGrammarCard'
import { getLevelColor } from '@/components/favorites/helpers'
import { FavoriteLesson, useGetFavoriteLessonsQuery, useToggleLessonFavoriteMutation } from '@/store/apis/lessonsApi/lessonFavoritesApi'

type ItemType = 'word' | 'grammar' | 'sentence' | 'lesson' | 'all'
type SortOption = 'newest' | 'oldest' | 'alphabetical'

interface SentenceItem {
  id: string
  text: string
  translation: string
  context?: string
  lesson_id: string
  audio_url?: string
  favorite_id: string
  created_at: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const t = useTranslations('FavoritesPage')
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)

  const [selectedType, setSelectedType] = useState<ItemType>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])

  // Queries for favorite items
  const {
    data: favoritesData,
    isLoading: isLoadingItems,
    isError: isItemsError,
    error: itemsError,
    refetch: refetchItems
  } = useGetFavoriteItemsQuery(undefined, {
    skip: !user,
  })

  // Queries for favorite lessons
  const {
    data: favoriteLessonsData,
    isLoading: isLoadingLessons,
    isError: isLessonsError,
    error: lessonsError,
    refetch: refetchLessons
  } = useGetFavoriteLessonsQuery(undefined, {
    skip: !user,
  })

  const [toggleFavorite] = useToggleFavoriteMutation()
  const [toggleLessonFavorite] = useToggleLessonFavoriteMutation()

  const [stats, setStats] = useState({
    total: 0,
    words: 0,
    grammar: 0,
    sentences: 0,
    lessons: 0
  })

  useEffect(() => {
    if (favoritesData && favoriteLessonsData) {
      const wordsCount = favoritesData.words?.length || 0
      const grammarCount = favoritesData.grammar?.length || 0
      const sentencesCount = favoritesData.sentences?.length || 0
      const lessonsCount = favoriteLessonsData?.length || 0

      setStats({
        total: wordsCount + grammarCount + sentencesCount + lessonsCount,
        words: wordsCount,
        grammar: grammarCount,
        sentences: sentencesCount,
        lessons: lessonsCount
      })
    }
  }, [favoritesData, favoriteLessonsData])

  // Get item level
  const getItemLevel = (item: any): string => {
    return item.lesson_level || item.level || ''
  }

  // Get progress status icon
  const getProgressStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'started':
        return <PlayCircleIcon className="h-4 w-4 text-blue-500" />
      case 'not_started':
        return <ClockIcon className="h-4 w-4 text-gray-400" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />
    }
  }

  const getProgressStatusText = (status: string) => {
    return t(`progressStatus.${status}`, { defaultValue: status })
  }

  // Filtering and sorting
  const getFilteredItems = () => {
    const result = {
      words: [] as any[],
      grammar: [] as any[],
      sentences: [] as any[],
      lessons: [] as FavoriteLesson[]
    }

    if (!favoritesData || !favoriteLessonsData) {
      return result
    }

    // Filter regular items
    let items = { ...favoritesData }

    // Filter by type
    if (selectedType !== 'all') {
      if (selectedType === 'word') {
        items = { ...items, grammar: [], sentences: [] }
      } else if (selectedType === 'grammar') {
        items = { ...items, words: [], sentences: [] }
      } else if (selectedType === 'sentence') {
        items = { ...items, words: [], grammar: [] }
      }
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = {
        words: items.words.filter(word =>
          word.word.toLowerCase().includes(query) ||
          word.translation.toLowerCase().includes(query) ||
          (word.example_sentence && word.example_sentence.toLowerCase().includes(query))
        ),
        grammar: items.grammar.filter(rule =>
          rule.rule_name.toLowerCase().includes(query) ||
          rule.explanation.toLowerCase().includes(query) ||
          (rule.examples && rule.examples.toString().toLowerCase().includes(query))
        ),
        sentences: items.sentences.filter(sentence =>
          sentence.text.toLowerCase().includes(query) ||
          sentence.translation.toLowerCase().includes(query) ||
          (sentence.context && sentence.context.toLowerCase().includes(query))
        )
      }

      // Filter lessons
      result.lessons = favoriteLessonsData.filter(lesson =>
        lesson.title.toLowerCase().includes(query) 
      )
    } else {
      result.lessons = [...favoriteLessonsData]
    }

    // Filter by level
    if (selectedLevels.length > 0) {
      items = {
        words: items.words.filter(word => {
          const level = getItemLevel(word)
          return level && selectedLevels.includes(level)
        }),
        grammar: items.grammar.filter(rule => {
          const level = getItemLevel(rule)
          return level && selectedLevels.includes(level)
        }),
        sentences: items.sentences.filter(sentence => true)
      }

      result.lessons = result.lessons.filter(lesson => {
        const level = lesson.level
        return level && selectedLevels.includes(level)
      })
    }

    // Apply filters to regular items
    result.words = items.words
    result.grammar = items.grammar
    result.sentences = items.sentences

    // Sorting
    const sortItems = <T extends { created_at?: string; word?: string; rule_name?: string; text?: string; title?: string }>(
      items: T[]
    ): T[] => {
      return [...items].sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          case 'oldest':
            return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          case 'alphabetical':
            const aText = a.word || a.rule_name || a.text || a.title || ''
            const bText = b.word || b.rule_name || b.text || b.title || ''
            return aText.localeCompare(bText)
          default:
            return 0
        }
      })
    }

    // Sort lessons
    result.lessons = sortItems(result.lessons)

    // Additional filtering by type
    if (selectedType === 'lesson') {
      result.words = []
      result.grammar = []
      result.sentences = []
    } else if (selectedType !== 'all') {
      result.lessons = []
    }

    return result
  }

  const filteredItems = getFilteredItems()

  const handleRemoveFavorite = async (itemId: string, itemType: 'word' | 'grammar' | 'sentence') => {
    try {
      await toggleFavorite({ itemId, itemType }).unwrap()
    } catch (error) {
      console.error(t('removeError'), error)
    }
  }

  const handleToggleLessonFavorite = async (lessonId: string) => {
    try {
      await toggleLessonFavorite({ lessonId }).unwrap()
    } catch (error) {
      console.error(t('removeError'), error)
    }
  }

  const handleRefresh = () => {
    refetchItems()
    refetchLessons()
  }

  const handleViewLesson = (lessonId: string) => {
    router.push(`/lessons/${lessonId}`)
  }

  // Get type icon
  const getTypeIcon = (type: ItemType) => {
    const icons = {
      word: BookOpenIcon,
      grammar: AcademicCapIcon,
      sentence: ChatBubbleLeftRightIcon,
      lesson: StarIcon,
      all: HeartIcon
    }
    return icons[type]
  }

  // Get type color
  const getTypeColor = (type: ItemType) => {
    const colors = {
      word: 'bg-blue-50 text-blue-600 border-blue-200',
      grammar: 'bg-purple-50 text-purple-600 border-purple-200',
      sentence: 'bg-green-50 text-green-600 border-green-200',
      lesson: 'bg-amber-50 text-amber-600 border-amber-200',
      all: 'bg-rose-50 text-rose-600 border-rose-200'
    }
    return colors[type]
  }

  // Play audio
  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      new Audio(audioUrl).play()
    }
  }

  const isLoading = isLoadingItems || isLoadingLessons || authLoading
  const isError = isItemsError || isLessonsError
  const error = itemsError || lessonsError

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton href="/dashboard" />
          <ErrorMessage messageKey={error?.toString() || t('loadError')} />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton href="/" />
          <div className="text-center py-12">
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">{t('signInRequired.title')}</h2>
            <p className="text-gray-600 mb-8">{t('signInRequired.description')}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('signInRequired.button')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const hasItems = stats.total > 0
  const hasFilteredItems =
    filteredItems.words.length > 0 ||
    filteredItems.grammar.length > 0 ||
    filteredItems.sentences.length > 0 ||
    filteredItems.lessons.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <BackButton href="/dashboard" />
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <HeartIconSolid className="h-10 w-10 text-rose-500 mr-3" />
                {t('title')}
              </h1>
              <p className="text-gray-600">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                title={t('refreshButton')}
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                {t('refreshButton')}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.total')}</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <HeartIconSolid className="h-8 w-8 text-rose-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.words')}</p>
                <p className="text-3xl font-bold text-blue-600">{stats.words}</p>
              </div>
              <BookOpenIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.grammar')}</p>
                <p className="text-3xl font-bold text-purple-600">{stats.grammar}</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t('stats.sentences')}</p>
                <p className="text-3xl font-bold text-green-600">{stats.sentences}</p>
              </div>
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Favorite Lessons</p>
                <p className="text-3xl font-bold text-amber-600">{stats.lessons}</p>
              </div>
              <StarIcon className="h-8 w-8 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'word', 'grammar', 'sentence', 'lesson'] as ItemType[]).map(type => {
                const Icon = getTypeIcon(type)
                const count = 
                  type === 'all' ? stats.total :
                  type === 'word' ? stats.words :
                  type === 'grammar' ? stats.grammar :
                  type === 'sentence' ? stats.sentences :
                  stats.lessons

                // Use existing translations with fallback
                const typeLabel = type === 'lesson' 
                  ? 'Lessons' 
                  : t(`filters.types.${type}`)

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-all ${selectedType === type
                      ? getTypeColor(type) + ' font-semibold'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {typeLabel}
                    <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="newest">{t('sortOptions.newest')}</option>
                <option value="oldest">{t('sortOptions.oldest')}</option>
                <option value="alphabetical">{t('sortOptions.alphabetical')}</option>
              </select>
              <FunnelIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Level Filters */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">{t('filters.levelLabel')}:</p>
            <div className="flex flex-wrap gap-2">
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setSelectedLevels(prev =>
                      prev.includes(level)
                        ? prev.filter(l => l !== level)
                        : [...prev, level]
                    )
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedLevels.includes(level)
                    ? getLevelColor(level)
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {level}
                </button>
              ))}
              {selectedLevels.length > 0 && (
                <button
                  onClick={() => setSelectedLevels([])}
                  className="px-3 py-1 text-sm text-rose-600 hover:text-rose-700"
                >
                  {t('filters.clearFilters')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {!hasItems ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">{t('emptyState.title')}</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {t('emptyState.description')}
            </p>
            <button
              onClick={() => router.push('/lessons')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('emptyState.browseButton')}
            </button>
          </div>
        ) : !hasFilteredItems ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('noResults.title')}</h3>
            <p className="text-gray-600">
              {t('noResults.description')}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Lessons Section */}
            {filteredItems.lessons.length > 0 && (selectedType === 'all' || selectedType === 'lesson') && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <StarIcon className="h-6 w-6 text-amber-500 mr-3" />
                    Favorite Lessons
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      ({filteredItems.lessons.length} {t('items')})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-amber-50 to-white group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(lesson.level)}`}>
                              {lesson.level}
                            </span>
                            <div className="flex items-center text-sm text-gray-500">
                              {getProgressStatusIcon(lesson.progress_status)}
                              <span className="ml-1">
                                {getProgressStatusText(lesson.progress_status)}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                            {lesson.title}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleToggleLessonFavorite(lesson.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 ml-2"
                          title={t('removeFavorite')}
                        >
                          <HeartIconSolid className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleViewLesson(lesson.id)}
                          className="text-sm text-amber-600 hover:text-amber-800 flex items-center font-medium"
                        >
                          {t('viewLesson')}
                          <ChevronRightIcon className="h-3 w-3 ml-1" />
                        </button>
                        {lesson.duration && (
                          <div className="text-xs text-gray-500">
                            {lesson.duration} min
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Words Section */}
            {filteredItems.words.length > 0 && (selectedType === 'all' || selectedType === 'word') && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpenIcon className="h-6 w-6 text-blue-500 mr-3" />
                    {t('sections.words')}
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      ({filteredItems.words.length} {t('items')})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.words.map(word => (
                    <FavoriteVocabularyCard
                      key={word.id}
                      word={word}
                      onRemoveFavorite={handleRemoveFavorite}
                      onViewLesson={handleViewLesson}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grammar Section */}
            {filteredItems.grammar.length > 0 && (selectedType === 'all' || selectedType === 'grammar') && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <AcademicCapIcon className="h-6 w-6 text-purple-500 mr-3" />
                    {t('sections.grammar')}
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      ({filteredItems.grammar.length} {t('items')})
                    </span>
                  </h2>
                </div>
                <div className="space-y-4">
                  {filteredItems.grammar.map(rule => (
                    <FavoriteGrammarCard
                      key={rule.id}
                      rule={rule}
                      onRemoveFavorite={handleRemoveFavorite}
                      onViewLesson={handleViewLesson}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sentences Section */}
            {filteredItems.sentences.length > 0 && (selectedType === 'all' || selectedType === 'sentence') && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-500 mr-3" />
                    {t('sections.sentences')}
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      ({filteredItems.sentences.length} {t('items')})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.sentences.map(sentence => (
                    <div
                      key={sentence.id}
                      className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <p className="text-lg text-gray-900 mb-2">{sentence.text}</p>
                          <p className="text-gray-600 text-sm italic">{sentence.translation}</p>
                        </div>
                        <div className="flex items-start gap-2 ml-2">
                          {sentence.audio_url && (
                            <button
                              onClick={() => playAudio(sentence.audio_url)}
                              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                              title={t('playAudio')}
                            >
                              <SpeakerWaveIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveFavorite(sentence.id, 'sentence')}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title={t('removeFavorite')}
                          >
                            <HeartIconSolid className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {sentence.context && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">{t('contextLabel')}: {sentence.context}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleViewLesson(sentence.lesson_id)}
                          className="text-sm text-green-600 hover:text-green-800 flex items-center"
                        >
                          {t('viewLesson')}
                          <ChevronRightIcon className="h-3 w-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}