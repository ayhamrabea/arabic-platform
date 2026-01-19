'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import Link from 'next/link'
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  HeartIcon,
  PlayCircleIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  UsersIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid'

export default function HomePage() {
  const router = useRouter()
  const t = useTranslations('HomePage')
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // إذا كان المستخدم مسجل الدخول، توجيه إلى Dashboard
    if (!authLoading && user) {
      router.push('/dashboard')
    }
    setIsLoading(false)
  }, [user, authLoading, router])

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  // Features list
  const features = [
    {
      icon: <BookOpenIcon className="h-8 w-8 text-blue-600" />,
      titleKey: 'features.lessons.title',
      descriptionKey: 'features.lessons.description',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-purple-600" />,
      titleKey: 'features.grammar.title',
      descriptionKey: 'features.grammar.description',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />,
      titleKey: 'features.speaking.title',
      descriptionKey: 'features.speaking.description',
      color: 'bg-green-50 border-green-200'
    },
    {
      icon: <HeartIcon className="h-8 w-8 text-rose-600" />,
      titleKey: 'features.favorites.title',
      descriptionKey: 'features.favorites.description',
      color: 'bg-rose-50 border-rose-200'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8 text-amber-600" />,
      titleKey: 'features.progress.title',
      descriptionKey: 'features.progress.description',
      color: 'bg-amber-50 border-amber-200'
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-cyan-600" />,
      titleKey: 'features.multilingual.title',
      descriptionKey: 'features.multilingual.description',
      color: 'bg-cyan-50 border-cyan-200'
    }
  ]

  // Stats
  const stats = [
    { value: '1000+', labelKey: 'stats.lessons' },
    { value: '5000+', labelKey: 'stats.vocabulary' },
    { value: '98%', labelKey: 'stats.satisfaction' },
    { value: '50K+', labelKey: 'stats.users' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-semibold">
                <StarIcon className="h-4 w-4 mr-2" />
                {t('hero.badge')}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              {t('hero.title.part1')}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.title.part2')}
              </span>{' '}
              {t('hero.title.part3')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t('hero.cta.primary')}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/lessons"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PlayCircleIcon className="mr-2 h-5 w-5" />
                {t('hero.cta.secondary')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {t(stat.labelKey)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} rounded-2xl p-8 border-2 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
              >
                <div className="mb-6">
                  <div className="inline-flex p-3 rounded-xl bg-white border mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600">
                    {t(feature.descriptionKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howItWorks.step1.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step1.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600 text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howItWorks.step2.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step2.description')}
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-teal-100 text-green-600 text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howItWorks.step3.title')}
              </h3>
              <p className="text-gray-600">
                {t('howItWorks.step3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white rounded-2xl hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {t('cta.button.primary')}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent rounded-2xl border-2 border-white hover:bg-white/10 transition-all duration-300"
            >
              {t('cta.button.secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-2xl font-bold">LearnAI</span>
              </div>
              <p className="text-gray-400">
                {t('footer.tagline')}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.product')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/lessons" className="hover:text-white">{t('footer.features')}</Link></li>
                <li><Link href="/pricing" className="hover:text-white">{t('footer.pricing')}</Link></li>
                <li><Link href="/about" className="hover:text-white">{t('footer.about')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.resources')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/blog" className="hover:text-white">{t('footer.blog')}</Link></li>
                <li><Link href="/help" className="hover:text-white">{t('footer.help')}</Link></li>
                <li><Link href="/contact" className="hover:text-white">{t('footer.contact')}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">{t('footer.privacy')}</Link></li>
                <li><Link href="/terms" className="hover:text-white">{t('footer.terms')}</Link></li>
                <li><Link href="/cookies" className="hover:text-white">{t('footer.cookies')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} LearnAI. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}