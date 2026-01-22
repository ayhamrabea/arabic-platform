// components/quizzes/Pagination.tsx
'use client'

import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  boundaryCount?: number
}

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1
}: PaginationProps) {
  const t = useTranslations('QuizzesPage.allQuizzes')

  if (totalPages <= 1) return null

  const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, i) => start + i)
  }

  const startPages = range(1, Math.min(boundaryCount, totalPages))
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages)

  const siblingsStart = Math.max(
    Math.min(
      currentPage - siblingCount,
      totalPages - boundaryCount - siblingCount * 2 - 1
    ),
    boundaryCount + 2
  )

  const siblingsEnd = Math.min(
    Math.max(
      currentPage + siblingCount,
      boundaryCount + siblingCount * 2 + 2
    ),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  )

  const itemList = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2 ? ['ellipsis-start'] : boundaryCount + 1 < siblingsStart ? [boundaryCount + 1] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < totalPages - boundaryCount - 1 ? ['ellipsis-end'] : siblingsEnd + 1 < totalPages - boundaryCount ? [totalPages - boundaryCount] : []),
    ...endPages
  ]

  return (
    <div className="flex justify-center items-center gap-2 mb-12">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('previous')}
      >
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="hidden sm:inline ml-1">{t('previous')}</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {itemList.map((item, index) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            )
          }

          const page = Number(item)
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label={t('next')}
      >
        <span className="hidden sm:inline mr-1">{t('next')}</span>
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  )
})