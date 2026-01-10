// components/lessons/LessonFilter.tsx
import { useState } from 'react'

interface LessonFilterProps {
  filter: string
  onFilterChange: (filter: string) => void
  filters?: Array<{ id: string; label: string }>
}

export function LessonFilter({ 
  filter, 
  onFilterChange,
  filters = [
    { id: 'all', label: 'All' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ]
}: LessonFilterProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      {filters.map((filterItem) => (
        <button
          key={filterItem.id}
          onClick={() => onFilterChange(filterItem.id)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            filter === filterItem.id 
              ? 'bg-indigo-600 text-white shadow-lg' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          {filterItem.label}
        </button>
      ))}
    </div>
  )
}