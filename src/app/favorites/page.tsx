// app/favorites/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BackButton } from '@/components/ui/BackButton'
import {
  StarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  TrashIcon,
  FunnelIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  SpeakerWaveIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import {
  useGetFavoriteItemsQuery,
  useToggleFavoriteMutation,
  useClearAllFavoritesMutation
} from '@/store/apis/favoritesApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FavoriteVocabularyCard } from '@/components/favorites/FavoriteVocabularyCard'
import { FavoriteGrammarCard } from '@/components/favorites/FavoriteGrammarCard'
import { getLevelColor } from '@/components/favorites/helpers'

type ItemType = 'word' | 'grammar' | 'sentence' | 'all'
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
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)

  const [selectedType, setSelectedType] = useState<ItemType>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])

  const {
    data: favoritesData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetFavoriteItemsQuery(undefined, {
    skip: !user,
  })

  const [toggleFavorite] = useToggleFavoriteMutation()
  const [clearAllFavorites] = useClearAllFavoritesMutation()

  const [stats, setStats] = useState({
    total: 0,
    words: 0,
    grammar: 0,
    sentences: 0
  })

  useEffect(() => {
    if (favoritesData) {
      const wordsCount = favoritesData.words?.length || 0
      const grammarCount = favoritesData.grammar?.length || 0
      const sentencesCount = favoritesData.sentences?.length || 0

      setStats({
        total: wordsCount + grammarCount + sentencesCount,
        words: wordsCount,
        grammar: grammarCount,
        sentences: sentencesCount
      })
    }
  }, [favoritesData])

  // دالة الحصول على مستوى العنصر (من الدرس)
  const getItemLevel = (item: any): string => {
    return item.lesson_level || ''
  }

  // التصفية والترتيب
  const getFilteredItems = () => {
    if (!favoritesData) {
      return { words: [], grammar: [], sentences: [] }
    }

    let items = { ...favoritesData }

    // تصفية حسب النوع
    if (selectedType !== 'all') {
      if (selectedType === 'word') {
        items = { ...items, grammar: [], sentences: [] }
      } else if (selectedType === 'grammar') {
        items = { ...items, words: [], sentences: [] }
      } else if (selectedType === 'sentence') {
        items = { ...items, words: [], grammar: [] }
      }
    }

    // البحث
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
    }

    // تصفية حسب المستوى (من الدرس)
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
        sentences: items.sentences.filter(sentence => {
          // للجمل يمكنك إضافة مستوى إذا كان موجوداً
          return true // تخطي التصفية للجمل إذا لم يكن هناك مستوى
        })
      }
    }

    // الترتيب
    const sortItems = <T extends { created_at?: string; word?: string; rule_name?: string; text?: string }>(
      items: T[]
    ): T[] => {
      return [...items].sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
          case 'oldest':
            return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          case 'alphabetical':
            const aText = a.word || a.rule_name || a.text || ''
            const bText = b.word || b.rule_name || b.text || ''
            return aText.localeCompare(bText)
          default:
            return 0
        }
      })
    }

    return {
      words: sortItems(items.words),
      grammar: sortItems(items.grammar),
      sentences: sortItems(items.sentences)
    }
  }

  const filteredItems = getFilteredItems()

  const handleRemoveFavorite = async (itemId: string, itemType: 'word' | 'grammar' | 'sentence') => {
    try {
      await toggleFavorite({ itemId, itemType }).unwrap()
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to remove all favorites?')) return

    try {
      await clearAllFavorites().unwrap()
    } catch (error) {
      console.error('Failed to clear all favorites:', error)
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  
  const handleViewLesson = (lessonId: string) => {
    router.push(`/lessons/${lessonId}`)
  }



  // دالة الحصول على أيقونة النوع
  const getTypeIcon = (type: ItemType) => {
    const icons = {
      word: BookOpenIcon,
      grammar: AcademicCapIcon,
      sentence: ChatBubbleLeftRightIcon,
      all: HeartIcon
    }
    return icons[type]
  }

  // دالة الحصول على لون النوع
  const getTypeColor = (type: ItemType) => {
    const colors = {
      word: 'bg-blue-50 text-blue-600 border-blue-200',
      grammar: 'bg-purple-50 text-purple-600 border-purple-200',
      sentence: 'bg-green-50 text-green-600 border-green-200',
      all: 'bg-rose-50 text-rose-600 border-rose-200'
    }
    return colors[type]
  }

  // تشغيل الصوت
  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      new Audio(audioUrl).play()
    }
  }

  if (isLoading || authLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton href="/dashboard" />
          <ErrorMessage message={error?.toString() || 'Error loading favorites'} />
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
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Sign in to view favorites</h2>
            <p className="text-gray-600 mb-8">Please sign in to see your favorite items</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign In
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
    filteredItems.sentences.length > 0

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
                My Favorites
              </h1>
              <p className="text-gray-600">
                All your saved words, grammar rules, and sentences in one place
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </button>

              {hasItems && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <HeartIconSolid className="h-8 w-8 text-rose-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Words</p>
                <p className="text-3xl font-bold text-blue-600">{stats.words}</p>
              </div>
              <BookOpenIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Grammar</p>
                <p className="text-3xl font-bold text-purple-600">{stats.grammar}</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sentences</p>
                <p className="text-3xl font-bold text-green-600">{stats.sentences}</p>
              </div>
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-400" />
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
                  placeholder="Search in favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'word', 'grammar', 'sentence'] as ItemType[]).map(type => {
                const Icon = getTypeIcon(type)
                const count = type === 'all' ? stats.total :
                  type === 'word' ? stats.words :
                    type === 'grammar' ? stats.grammar : stats.sentences

                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center px-4 py-2 rounded-lg border transition-all ${selectedType === type
                      ? getTypeColor(type) + ' font-semibold'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
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
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A-Z</option>
              </select>
              <FunnelIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Level Filters */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Filter by Level:</p>
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
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {!hasItems ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No favorites yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start saving words, grammar rules, and sentences by clicking the heart icon on any item
            </p>
            <button
              onClick={() => router.push('/lessons')}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Lessons
            </button>
          </div>
        ) : !hasFilteredItems ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try changing your search or filter settings
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Words Section */}
            {filteredItems.words.length > 0 && (selectedType === 'all' || selectedType === 'word') && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpenIcon className="h-6 w-6 text-blue-500 mr-3" />
                    Favorite Words
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      ({filteredItems.words.length} items)
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
                    Favorite Grammar Rules
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      ({filteredItems.grammar.length} items)
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
                    Favorite Sentences
                    <span className="ml-3 text-sm font-normal text-gray-500">
                      ({filteredItems.sentences.length} items)
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
                              title="Play audio"
                            >
                              <SpeakerWaveIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveFavorite(sentence.id, 'sentence')}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Remove from favorites"
                          >
                            <HeartIconSolid className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {sentence.context && (
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">Context: {sentence.context}</p>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleViewLesson(sentence.lesson_id)}
                          className="text-sm text-green-600 hover:text-green-800 flex items-center"
                        >
                          View Lesson
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