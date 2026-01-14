'use client'

interface LessonFilterProps {
  filter: 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  onFilterChange: (filter: 'all' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2') => void
}

export function LessonFilter({ filter, onFilterChange }: LessonFilterProps) {
  const filters = [
    { value: 'all' as const, label: 'All Levels' },
    { value: 'A1' as const, label: 'A1 Beginner' },
    { value: 'A2' as const, label: 'A2 Elementary' },
    { value: 'B1' as const, label: 'B1 Intermediate' },
    { value: 'B2' as const, label: 'B2 Upper Intermediate' },
    { value: 'C1' as const, label: 'C1 Advanced' },
    { value: 'C2' as const, label: 'C2 Proficient' }
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