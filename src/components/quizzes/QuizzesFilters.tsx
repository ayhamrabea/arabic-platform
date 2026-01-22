// components/quizzes/QuizzesFilters.tsx
'use client'

import { useState, useCallback, memo } from 'react'
import { useTranslations } from 'next-intl'
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline'

interface QuizzesFiltersProps {
  onFilterChange: (filters: {
    search: string
    difficulty: string
    status: string
    sortBy: string
  }) => void
  showStatusFilter?: boolean
  showDifficultyFilter?: boolean
  showSortOptions?: boolean
}

export const QuizzesFilters = memo(function QuizzesFilters({
  onFilterChange,
  showStatusFilter = true,
  showDifficultyFilter = true,
  showSortOptions = true
}: QuizzesFiltersProps) {
  const t = useTranslations('QuizzesPage')
  const tAll = useTranslations('QuizzesPage.allQuizzes')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onFilterChange({ search: value, difficulty: selectedDifficulty, status: selectedStatus, sortBy })
  }, [selectedDifficulty, selectedStatus, sortBy, onFilterChange])

  const handleDifficultyChange = useCallback((value: string) => {
    setSelectedDifficulty(value)
    onFilterChange({ search: searchQuery, difficulty: value, status: selectedStatus, sortBy })
  }, [searchQuery, selectedStatus, sortBy, onFilterChange])

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value)
    onFilterChange({ search: searchQuery, difficulty: selectedDifficulty, status: value, sortBy })
  }, [searchQuery, selectedDifficulty, sortBy, onFilterChange])

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value)
    onFilterChange({ search: searchQuery, difficulty: selectedDifficulty, status: selectedStatus, sortBy: value })
  }, [searchQuery, selectedDifficulty, selectedStatus, onFilterChange])

  const handleResetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedDifficulty('all')
    setSelectedStatus('all')
    setSortBy('newest')
    onFilterChange({ search: '', difficulty: 'all', status: 'all', sortBy: 'newest' })
  }, [onFilterChange])

  const hasActiveFilters = searchQuery || selectedDifficulty !== 'all' || selectedStatus !== 'all' || sortBy !== 'newest'

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={tAll('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange({ target: { value: '' } } as any)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Difficulty Filter */}
          {showDifficultyFilter && (
            <div className="relative">
              <select
                value={selectedDifficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[180px]"
              >
                <option value="all">{tAll('allDifficulties')}</option>
                <option value="easy">{tAll('easy')}</option>
                <option value="medium">{tAll('medium')}</option>
                <option value="hard">{tAll('hard')}</option>
              </select>
              <AdjustmentsHorizontalIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Status Filter */}
          {showStatusFilter && (
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[180px]"
              >
                <option value="all">{tAll('allStatuses')}</option>
                <option value="completed">{t('completed')}</option>
                <option value="available">{t('available')}</option>
                <option value="locked">{t('locked')}</option>
              </select>
              <FunnelIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Sort By */}
          {showSortOptions && (
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[200px]"
              >
                <option value="newest">{tAll('newest')}</option>
                <option value="oldest">{tAll('oldest')}</option>
                <option value="difficulty-asc">{tAll('difficultyAsc')}</option>
                <option value="difficulty-desc">{tAll('difficultyDesc')}</option>
                <option value="questions-asc">{tAll('questionsAsc')}</option>
                <option value="questions-desc">{tAll('questionsDesc')}</option>
                <option value="popular">{tAll('popular')}</option>
              </select>
              <ArrowUpIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {tAll('resetFilters')}
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedDifficulty !== 'all' || selectedStatus !== 'all') && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              {tAll('search')}: {searchQuery}
              <button
                onClick={() => handleSearchChange({ target: { value: '' } } as any)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedDifficulty !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              {tAll('difficulty')}: {tAll(selectedDifficulty)}
              <button
                onClick={() => handleDifficultyChange('all')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedStatus !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              {tAll('status')}: {t(selectedStatus)}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
})