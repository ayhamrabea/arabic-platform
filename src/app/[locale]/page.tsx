'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

import {
  AcademicCapIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  GlobeAltIcon,
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const t = useTranslations('HomePage')
  const router = useRouter()
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    // if (!loading && user) {
    //   router.push('/dashboard')
    // }
    setPageLoading(false)
  }, [user, loading, router])

  // if (pageLoading || user) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
  //       <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-indigo-600" />
  //     </div>
  //   )
  // }

  const features = [
    { icon: BookOpenIcon, title: 'features.lessons.title', desc: 'features.lessons.description' },
    { icon: AcademicCapIcon, title: 'features.grammar.title', desc: 'features.grammar.description' },
    { icon: ChatBubbleLeftRightIcon, title: 'features.speaking.title', desc: 'features.speaking.description' },
    { icon: ChartBarIcon, title: 'features.progress.title', desc: 'features.progress.description' },
    { icon: GlobeAltIcon, title: 'features.multilingual.title', desc: 'features.multilingual.description' }
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            <StarIcon className="h-4 w-4" />
            {t('hero.badge')}
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title.part1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('hero.title.part2')}
            </span>{' '}
            {t('hero.title.part3')}
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition"
            >
              {t('hero.cta.primary')}
              <ArrowRightIcon className="inline ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/lessons"
              className="px-8 py-4 rounded-xl border font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <PlayCircleIcon className="inline mr-2 h-5 w-5" />
              {t('hero.cta.secondary')}
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            {t('features.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="p-8 rounded-2xl border hover:shadow-xl transition"
                >
                  <Icon className="h-10 w-10 text-blue-600 mb-6" />
                  <h3 className="text-xl font-bold mb-3">
                    {t(f.title)}
                  </h3>
                  <p className="text-gray-600">
                    {t(f.desc)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">
            {t('howItWorks.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map(step => (
              <div key={step}>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                  {step}
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {t(`howItWorks.step${step}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`howItWorks.step${step}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">
          {t('cta.title')}
        </h2>
        <p className="max-w-xl mx-auto text-blue-100 mb-10">
          {t('cta.subtitle')}
        </p>
        <Link
          href="/signup"
          className="inline-block px-10 py-4 rounded-xl bg-white text-blue-700 font-semibold hover:bg-gray-100 transition"
        >
          {t('cta.button.primary')}
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <AcademicCapIcon className="h-10 w-10 mx-auto text-blue-500 mb-4" />
        <p className="mb-2">LearnAI</p>
        <p className="text-sm">
          © {new Date().getFullYear()} LearnAI. {t('footer.rights')}
        </p>
      </footer>
    </div>
  )
}
