'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { 
  UserIcon, 
  RocketLaunchIcon, 
  HeartIcon, 
  AcademicCapIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'
import { BackButton } from '@/components/ui/BackButton'

export default function AboutPage() {
  const t = useTranslations('AboutPage')

  // Values data
  const values = [
    {
      titleKey: 'mission',
      descriptionKey: 'missionDesc',
      icon: RocketLaunchIcon,
      color: 'blue'
    },
    {
      titleKey: 'vision',
      descriptionKey: 'visionDesc',
      icon: GlobeAltIcon,
      color: 'purple'
    },
    {
      titleKey: 'values',
      descriptionKey: 'valuesDesc',
      icon: HeartIcon,
      color: 'red'
    }
  ]

  // Features (what we offer now)
  const currentFeatures = [
    {
      titleKey: 'freePDFs',
      descriptionKey: 'freePDFsDesc',
      icon: DocumentArrowDownIcon,
      color: 'green'
    },
    {
      titleKey: 'interactivePlatform',
      descriptionKey: 'interactivePlatformDesc',
      icon: AcademicCapIcon,
      color: 'blue'
    },
    {
      titleKey: 'russianExplanations',
      descriptionKey: 'russianExplanationsDesc',
      icon: UserIcon,
      color: 'indigo'
    }
  ]

  // Coming soon features
  const comingFeatures = [
    {
      titleKey: 'aiConversation',
      descriptionKey: 'aiConversationDesc',
      icon: CpuChipIcon,
      color: 'orange'
    },
    {
      titleKey: 'voiceRecognition',
      descriptionKey: 'voiceRecognitionDesc',
      icon: SparklesIcon,
      color: 'yellow'
    },
    {
      titleKey: 'personalizedExercises',
      descriptionKey: 'personalizedExercisesDesc',
      icon: ArrowPathIcon,
      color: 'pink'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton href="/" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Founder Story Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white text-center">
              {t('founderStory')}
            </h2>
          </div>
          <div className="p-8 space-y-6 text-gray-700 leading-relaxed">
            <p>
              <strong className="text-blue-700">{t('founderName')}</strong> — {t('story1')}
            </p>
            <p>
              {t('story2')}
            </p>
            <p>
              {t('story3')}
            </p>
            <div className="bg-blue-50 p-6 rounded-xl border-r-4 border-blue-500 italic">
              <p className="text-blue-800">
                💙 {t('philosophy')}
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            {t('ourValues')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value) => {
              const Icon = value.icon
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600',
                purple: 'from-purple-500 to-purple-600',
                red: 'from-red-500 to-red-600'
              }
              return (
                <div key={value.titleKey} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[value.color as keyof typeof colorClasses]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {t(value.titleKey)}
                  </h3>
                  <p className="text-gray-600">
                    {t(value.descriptionKey)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* What We Offer Now */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            {t('whatWeOfferNow')}
            <span className="block text-sm font-normal text-green-600 mt-1">
              {t('completelyFree')}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentFeatures.map((feature) => {
              const Icon = feature.icon
              const colorClasses = {
                green: 'from-green-500 to-green-600',
                blue: 'from-blue-500 to-blue-600',
                indigo: 'from-indigo-500 to-indigo-600'
              }
              return (
                <div key={feature.titleKey} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
              {t('comingSoon')}
            </h2>
            <p className="text-center text-gray-600 mb-6">
              {t('comingSoonDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comingFeatures.map((feature) => {
                const Icon = feature.icon
                const colorClasses = {
                  orange: 'from-orange-500 to-orange-600',
                  yellow: 'from-yellow-500 to-yellow-600',
                  pink: 'from-pink-500 to-pink-600'
                }
                return (
                  <div key={feature.titleKey} className="bg-white rounded-xl p-4 text-center">
                    <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800">
                      {t(feature.titleKey)}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-10 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ✨ {t('ctaTitle')} ✨
            </h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              {t('ctaDesc')}
            </p>
            <p className="text-amber-200 text-sm mb-6">
              ⭐ {t('earlyBird')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
              >
                {t('startNow')}
              </Link>
              <Link
                href="/lessons"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-700 font-bold py-3 px-8 rounded-full transition duration-300"
              >
                {t('browseLessons')}
              </Link>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {t('contactVia')}{' '}
            <a href="https://t.me/MyArabic05" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Telegram
            </a>
            {' / '}
            <a href="https://vk.com/club221531979" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
              VK
            </a>
          </p>
          <p className="mt-4">
            © 2026 Arabic Academy – {t('footerText')}
          </p>
        </div>
      </div>
    </div>
  )
}