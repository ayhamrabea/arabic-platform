'use client'

import Link from 'next/link'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  BookOpenIcon,
  StarIcon 
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import type { LessonWithProgress } from '@/store/apis/lessonsApi/types'
import { useTranslations } from 'next-intl'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface LessonCardProps {
  lesson: LessonWithProgress
  progress: number
  progressData?: any
  itemStats: {
    completed: number
    total: number
    vocabulary: number
    grammar: number
  }
}

export function LessonCard({ 
  lesson, 
  progress, 
  progressData,
  itemStats 
}: LessonCardProps) {
  const t = useTranslations('LessonsPage')
  const isCompleted = progress === 100

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-400" />
    }
  }

  // استخراج العناوين العربية والروسية
  const [arabicTitle, russianTitle] = lesson.title.includes('<br>') 
    ? lesson.title.split('<br>').map(s => s.trim())
    : [lesson.title, lesson.title]

  return (
    <Link href={`/lessons/${lesson.id}`}>
      <div className={`
        bg-white rounded-2xl shadow-lg hover:shadow-2xl 
        transition-all duration-300 border overflow-hidden group h-full cursor-pointer
        ${isCompleted 
          ? 'border-green-200 hover:border-green-300' 
          : 'border-gray-200 hover:border-gray-300'
        }
      `}>
        
        {/* شريط الحالة العلوي - يتغير حسب الاكتمال */}
        <div className={`
          h-2 transition-all duration-500
          ${isCompleted 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
            : 'bg-gradient-to-r from-green-500 to-blue-500'
          }
        `}></div>

        {/* طبقة الاكتمال - Overlay خفيف عند اكتمال الدرس */}
        {isCompleted && (
          <>
            {/* Overlay أغمق + Blur خفيف */}
            <div className="absolute inset-0 bg-green-100/60 backdrop-blur-[1.5px] pointer-events-none"></div>

            {/* Gradient ناعم فوقه */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/40 via-green-100/20 to-emerald-200/30 pointer-events-none"></div>

            {/* Glow علوي */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-400/20 blur-3xl rounded-full"></div>

            {/* Glow سفلي */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400/15 blur-3xl rounded-full"></div>
          </>
        )}

        <div className="p-6 relative">
          {/* الهيدر مع المستوى والترتيب وأيقونات الحالة */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${getLevelColor(lesson.level)}
                ${isCompleted ? 'opacity-90' : ''}
              `}>
                {lesson.level}
              </span>
              <span className={`
                text-sm transition-colors
                ${isCompleted ? 'text-green-600' : 'text-gray-500'}
              `}>
                #{lesson.order_index}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* أيقونة الحالة */}
              {getStatusIcon(progressData?.status)}
              {/* المفضلة */}
              {progressData?.is_favorite && (
                <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              )}
              {/* شعار متعدد اللغات */}
              <div className={`
                flex items-center gap-1 text-xs px-3 py-1 rounded-full transition-colors
                ${isCompleted 
                  ? 'bg-green-100 border border-green-200' 
                  : 'bg-gray-100'
                }
              `}>
                <span className="text-green-600">🇸🇦</span>
                <span className="text-gray-400">/</span>
                <span className="text-blue-600">🇷🇺</span>
              </div>
            </div>
          </div>

          {/* العناوين - مع تأثير بسيط عند الاكتمال */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* العنوان العربي */}
            <div className="relative">
              <div className={`
                absolute right-0 top-0 bottom-0 w-1 rounded-full transition-colors
                ${isCompleted ? 'bg-green-400' : 'bg-green-500'}
              `}></div>
              <div className="mr-4">
                <span className={`
                  text-xs font-medium mb-1 flex items-center gap-1 transition-colors
                  ${isCompleted ? 'text-green-500' : 'text-green-600'}
                `}>
                  <span>🇸🇦</span>
                  <span>بالعربية</span>
                </span>
                <h3 className={`
                  text-lg font-bold leading-relaxed line-clamp-2 transition-colors
                  ${isCompleted ? 'text-gray-700' : 'text-gray-900'}
                `} dir="rtl">
                  {arabicTitle}
                </h3>
              </div>
            </div>
            
            {/* العنوان الروسي */}
            <div className="relative">
              <div className={`
                absolute left-0 top-0 bottom-0 w-1 rounded-full transition-colors
                ${isCompleted ? 'bg-green-400' : 'bg-blue-500'}
              `}></div>
              <div className="ml-4">
                <span className={`
                  text-xs font-medium mb-1 flex items-center gap-1 transition-colors
                  ${isCompleted ? 'text-green-500' : 'text-blue-600'}
                `}>
                  <span>🇷🇺</span>
                  <span>по-русски</span>
                </span>
                <h3 className={`
                  text-lg font-bold leading-relaxed line-clamp-2 transition-colors
                  ${isCompleted ? 'text-gray-700' : 'text-gray-900'}
                `} dir="ltr">
                  {russianTitle}
                </h3>
              </div>
            </div>
          </div>

          {/* Description - مع تأثير خفيف */}
           <div className="prose prose-sm max-w-none line-clamp-3 text-gray-600 mb-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content || ''}
            </ReactMarkdown>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <BookOpenIcon className={`h-4 w-4 ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isCompleted ? 'text-gray-500' : 'text-gray-500'}>
                  {itemStats.vocabulary} {t('words')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>📝</span>
                <span className={isCompleted ? 'text-gray-500' : 'text-gray-500'}>
                  {itemStats.grammar} {t('rules')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className={`h-4 w-4 ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isCompleted ? 'text-gray-500' : 'text-gray-500'}>
                {lesson.duration || 15} {t('minutes')}
              </span>
            </div>
          </div>

          {/* Progress Bar - مخفي إذا كان مكتمل ونعرض بدله رسالة نجاح */}
          {isCompleted ? (
            <div className="mb-3 bg-green-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircleSolid className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-700">
                  لقد أكملت هذا الدرس بنجاح! 🎉
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{t('progress')}</span>
                <span className="font-medium text-indigo-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300 bg-indigo-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Completion Stats */}
          <div className={`
            flex justify-between items-center mt-4 pt-4 border-t 
            transition-colors
            ${isCompleted ? 'border-green-100' : 'border-gray-100'}
          `}>
            <div className="text-sm">
              <span className="text-gray-600">{t('completed')}: </span>
              <span className={`
                font-semibold
                ${isCompleted ? 'text-green-600' : 'text-gray-900'}
              `}>
                {itemStats.completed}/{itemStats.total} {t('items')}
              </span>
            </div>
            
            <div className={`
              flex items-center gap-1 text-sm font-semibold
              ${isCompleted ? 'text-green-600' : 'text-green-600'}
            `}>
              <span>+{lesson.estimated_xp} XP</span>
            </div>
          </div>


        </div>
      </div>
    </Link>
  )
}