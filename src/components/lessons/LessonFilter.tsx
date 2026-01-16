'use client'

import { useTranslations } from 'next-intl'

interface LessonFilterProps {
  filter: 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  onFilterChange: (filter: 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2') => void
}

export function LessonFilter({ filter, onFilterChange }: LessonFilterProps) {
  const t = useTranslations('LessonFilter') // namespace في JSON

  const filters: { value: LessonFilterProps['filter']; label: string }[] = [
    { value: 'all', label: t('all') },
    { value: 'A1', label: t('A1') },
    { value: 'A2', label: t('A2') },
    { value: 'B1', label: t('B1') },
    { value: 'B2', label: t('B2') },
    { value: 'C1', label: t('C1') },
    { value: 'C2', label: t('C2') }
  ]

  return (
    <div className="mb-10">
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => onFilterChange(item.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === item.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
