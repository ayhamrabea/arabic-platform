
// app/[locale]/lessons/page.tsx

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { LessonFilter } from '@/components/lessons/LessonFilter'
import { LessonCard } from '@/components/lessons/LessonCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { CTACard } from '@/components/ui/CTACard'
import { useGetLessonsWithProgressQuery } from '@/store/apis/lessonsApi'

// دالة حساب النسبة المئوية بدقة
const calculateAccurateProgress = (progress: any, totalItems: number) => {
  if (!progress) return 0
  if (progress.status === 'completed') return 100
  if (progress.status === 'in_progress' && progress.completed_items) {
    const completedCount = Array.isArray(progress.completed_items) ? progress.completed_items.length : 0
    if (totalItems > 0) return Math.round((completedCount / totalItems) * 100)
  }
  return 0
}

export default function LessonsPage() {
  const [filter, setFilter] = useState<'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('all')

  const { data: lessons = [], isLoading, isError, error } = useGetLessonsWithProgressQuery({
    level: filter !== 'all' ? filter : undefined
  })

  const t = useTranslations('LessonsPage') // namespace في ملفات JSON

  if (isLoading) return <LoadingSpinner messageKey="loading" />

  if (isError) return <ErrorMessage messageKey="error" />


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('headerTitle')}
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {t('headerDescription')}
          </p>
        </div>

        {/* Filters */}
        <LessonFilter filter={filter} onFilterChange={setFilter} />

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => {
            const progress = lesson.progress
            const progressPercentage = calculateAccurateProgress(progress, lesson.total_items)
            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                progress={progressPercentage}
                progressData={progress}
                itemStats={{
                  completed: progress?.completed_items?.length || 0,
                  total: lesson.total_items,
                  vocabulary: lesson.vocabulary_count,
                  grammar: lesson.grammar_count
                }}
              />
            )
          })}
        </div>

        {/* Empty State */}
        {lessons.length === 0 && (
          <EmptyState
            title={t('noLessons')}
            message={t('noLessonsMessage', { level: filter !== 'all' ? filter : '' })}
            action={
              filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  {t('viewAllLessons')}
                </button>
              )
            }
          />
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <CTACard
            title={t('ctaTitle')}
            description={t('ctaDescription')}
            buttonText={t('ctaButton')}
            onButtonClick={() => console.log('Upgrade clicked')}
          />
        </div>
      </div>
    </div>
  )
}
