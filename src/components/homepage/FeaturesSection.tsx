import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { StarIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

const features = [
  { 
    icon: BookOpenIcon, 
    key: 'lessons',
    color: 'from-blue-500 to-cyan-500' 
  },
  { 
    icon: AcademicCapIcon, 
    key: 'grammar',
    color: 'from-emerald-500 to-teal-500' 
  },
  { 
    icon: ChatBubbleLeftRightIcon, 
    key: 'speaking',
    color: 'from-orange-500 to-amber-500' 
  },
  { 
    icon: MicrophoneIcon, 
    key: 'pronunciation',
    color: 'from-purple-500 to-pink-500' 
  },
  { 
    icon: ChartBarIcon, 
    key: 'progress',
    color: 'from-indigo-500 to-blue-500' 
  },
  { 
    icon: GlobeAltIcon, 
    key: 'multilingual',
    color: 'from-rose-500 to-red-500' 
  }
]

export default function FeaturesSection() {
  const t = useTranslations('HomePage.features')

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-50 to-emerald-50 text-blue-700 font-semibold">
            <StarIcon className="h-4 w-4" />
            {t('badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            مجموعة شاملة من الأدوات والميزات المصممة لتعلم اللغة العربية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-8 rounded-3xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-full w-full text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-gray-800">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                  
                  <div className="mt-6">
                    <Link 
                      href={`/features#${feature.key}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all"
                    >
                      تعرف أكثر
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}