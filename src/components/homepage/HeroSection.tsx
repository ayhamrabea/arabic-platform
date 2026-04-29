import { Link } from '@/i18n/navigation'
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
import VideoPreview from './VideoPreview'

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
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 pt-24 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6">
      {/* الخلفيات المتحركة */}
      <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 sm:w-64 h-48 sm:h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-32 sm:top-40 right-4 sm:right-10 w-56 sm:w-72 h-56 sm:h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* الجانب الأيسر: النصوص والأزرار */}
          <div className="lg:w-1/2 w-full">
            {/* البادج */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white border border-blue-200 text-blue-700 text-sm font-semibold shadow-sm w-fit">
              <StarIcon className="h-4 w-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{t('badge')}</span>
            </div>

            {/* العنوان */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-snug sm:leading-tight">
              <span className="block">
                {t('title.part1')}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 block">
                {t('title.part2')}
              </span>
              <span className="block">
                {t('title.part3')}
              </span>
            </h1>

            {/* الوصف */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              {t('subtitle')}
            </p>

            {/* اللغات المدعومة */}
            <div className="flex items-start gap-3 mb-6 sm:mb-8 p-3 sm:p-4 bg-white rounded-xl border border-gray-200 shadow-sm w-full max-w-md">
              <LanguageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  مدعوم بعدة لغات
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {supportedLanguages.slice(0, 4).map(lang => (
                    <span 
                      key={lang.code}
                      className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-gray-100 rounded-lg text-xs sm:text-sm min-w-[60px] sm:min-w-[70px] justify-center"
                      title={lang.name}
                    >
                      <span className="text-sm sm:text-base leading-none">{lang.flag}</span>
                      <span className="font-medium truncate hidden xs:inline">
                        {lang.name}
                      </span>
                      <span className="font-medium xs:hidden">
                        {lang.code.toUpperCase()}
                      </span>
                    </span>
                  ))}
                  <span className="text-xs sm:text-sm text-gray-500 flex items-center px-2">
                    +{supportedLanguages.length - 4}
                  </span>
                </div>
              </div>
            </div>

            {/* أزرار CTA */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full">
              <Link
                href="/lessons"
                className="group px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 min-w-0 xs:min-w-[200px] text-center whitespace-nowrap flex-1"
              >
                <span className="truncate">{t('cta.primary')}</span>
                <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Link>

              
            </div>
          </div>

          {/* الجانب الأيمن: بطاقة العرض */}

          <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
            <div className="relative bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-blue-100 shadow-xl sm:shadow-2xl">
              <VideoPreview />
              {/* <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400 flex-shrink-0"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400 flex-shrink-0"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400 flex-shrink-0"></div>
                  <div className="flex-1 text-center min-w-0">
                    <span className="font-semibold text-gray-700 text-sm sm:text-base truncate block">
                      درس العربية اليوم
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <BookOpenIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        المفردات الأساسية
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        15 كلمة جديدة
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 sm:p-3 bg-emerald-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <MicrophoneIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        التدرب على النطق
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        تحسين النطق العربي
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 sm:p-3 bg-amber-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        محادثة مع الذكاء الاصطناعي
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        محادثة باللغة العربية
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
              
              {/* الأيقونات الزخرفية */}
              {/* <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-white rounded-full p-2 sm:p-3 shadow-lg">
                <FlagIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-white rounded-full p-2 sm:p-3 shadow-lg">
                <DevicePhoneMobileIcon className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}