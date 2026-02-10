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

  // توليد قائمة الأرقام مع ellipsis
  const generatePageItems = () => {
    const pages: (number | 'ellipsis')[] = []

    const startPages = Array.from({ length: Math.min(boundaryCount, totalPages) }, (_, i) => i + 1)
    const endPages = Array.from(
      { length: Math.min(boundaryCount, totalPages - boundaryCount) },
      (_, i) => totalPages - boundaryCount + 1 + i
    )

    const siblingsStart = Math.max(currentPage - siblingCount, boundaryCount + 2)
    const siblingsEnd = Math.min(currentPage + siblingCount, totalPages - boundaryCount - 1)

    pages.push(...startPages)

    if (siblingsStart > boundaryCount + 2) {
      pages.push('ellipsis')
    } else if (boundaryCount + 1 < siblingsStart) {
      pages.push(boundaryCount + 1)
    }

    for (let i = siblingsStart; i <= siblingsEnd; i++) {
      pages.push(i)
    }

    if (siblingsEnd < totalPages - boundaryCount - 1) {
      pages.push('ellipsis')
    } else if (siblingsEnd + 1 < totalPages - boundaryCount) {
      pages.push(totalPages - boundaryCount)
    }

    pages.push(...endPages)

    // إزالة التكرارات
    return Array.from(new Set(pages))
  }

  const pageItems = generatePageItems()

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
        {pageItems.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            )
          }

          const pageNumber = Number(item)
          return (
            <button
              key={`page-${pageNumber}-${index}`}
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                currentPage === pageNumber
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
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
