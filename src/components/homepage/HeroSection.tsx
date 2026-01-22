import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  LanguageIcon
} from '@heroicons/react/24/outline'
import {
  BookOpenIcon,
  MicrophoneIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

const supportedLanguages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
]

export default function HeroSection() {
  const t = useTranslations('HomePage.hero')

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 pt-24 pb-32">
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white border border-blue-200 text-blue-700 text-sm font-semibold shadow-sm">
              <StarIcon className="h-4 w-4" />
              {t('badge')}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">
                {t('title.part1')}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                {t('title.part2')}
              </span>
              <span className="block">
                {t('title.part3')}
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {t('subtitle')}
            </p>

            <div className="flex items-center gap-3 mb-8 p-4 bg-white rounded-xl border border-gray-200 shadow-sm w-fit">
              <LanguageIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">مدعوم بعدة لغات</p>
                <div className="flex gap-1 mt-1">
                  {supportedLanguages.slice(0, 4).map(lang => (
                    <span key={lang.code} className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {lang.flag} {lang.code.toUpperCase()}
                    </span>
                  ))}
                  <span className="text-sm text-gray-500">+2</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t('cta.primary')}
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/lessons"
                className="group px-8 py-4 rounded-xl border-2 border-gray-300 font-semibold text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-center gap-2"
              >
                <PlayCircleIcon className="h-5 w-5 text-blue-600" />
                {t('cta.secondary')}
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-3xl p-8 border border-blue-100 shadow-2xl">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div className="flex-1 text-center">
                    <span className="font-semibold text-gray-700">درس العربية اليوم</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <BookOpenIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">المفردات الأساسية</p>
                      <p className="text-sm text-gray-600">15 كلمة جديدة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <MicrophoneIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">التدرب على النطق</p>
                      <p className="text-sm text-gray-600">تحسين النطق العربي</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">محادثة مع الذكاء الاصطناعي</p>
                      <p className="text-sm text-gray-600">محادثة باللغة العربية</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg">
                <FlagIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-full p-3 shadow-lg">
                <DevicePhoneMobileIcon className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}