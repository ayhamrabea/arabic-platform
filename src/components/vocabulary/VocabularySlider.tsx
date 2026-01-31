'use client'

import { useEffect, useRef } from 'react'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

import type { Vocabulary } from '@/store/apis/lessonsApi/types'
import { VocabularyCard } from './VocabularyCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

interface VocabularySliderProps {
  vocabulary: Vocabulary[]
  favoriteWords: Record<string, boolean>
  completedItems?: string[]
  onToggleComplete: (id: string) => void
  onToggleFavorite: (id: string, type: 'word') => void
}

export function VocabularySlider({
  vocabulary,
  favoriteWords,
  completedItems = [],
  onToggleComplete,
  onToggleFavorite,
}: VocabularySliderProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const t = useTranslations('VocabularyCard')

  if (!vocabulary || vocabulary.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">لا توجد كلمات لهذا الدرس</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative">
      <div className="flex items-center justify-between mb-6">


          
          {/* أزرار التنقل المخصصة */}
          <div className="flex gap-2">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="الكلمة السابقة"
            >
              <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="الكلمة التالية"
            >
              <ChevronRightIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>

      </div>

      {/* السلايدر */}
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 1,
          },
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet bg-gray-300 opacity-100',
          bulletActiveClass: 'swiper-pagination-bullet-active bg-blue-600',
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        className="pb-12"
      >
        {vocabulary.map((word, index) => (
          <SwiperSlide key={word.id}>
            <div className="h-full">
              {/* مؤشر رقم الكلمة */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
              </div>

              <VocabularyCard
                word={word}
                completed={completedItems.includes(word.id)}
                isFavorite={favoriteWords[word.id] || false}
                onToggleComplete={() => onToggleComplete(word.id)}
                onToggleFavorite={() => onToggleFavorite(word.id, 'word')}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  )
}