'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { 
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  CpuChipIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon,
  DevicePhoneMobileIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { BackButton } from '@/components/ui/BackButton'

export default function PricingPage() {
  const t = useTranslations('PricingPage')
  const locale = useLocale()
  
  // State for email form
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Your Sheet.best API URL from step 2
  const SHEET_BEST_URL = 'https://api.sheetbest.com/sheets/01756bb4-a438-4fb1-baaa-4cd6045bd495'

  const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!email) return

  setEmailStatus('loading')
  
  try {
    console.log('📧 جاري الإرسال إلى:', SHEET_BEST_URL)
    console.log('📧 البيانات:', { email, date: new Date().toISOString(), source: 'pricing_page', locale })
    
    const response = await fetch(SHEET_BEST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        date: new Date().toISOString(),
        source: 'pricing_page',
        locale: locale
      }),
    })
    
    console.log('📧 حالة الاستجابة:', response.status, response.statusText)
    
    const responseText = await response.text()
    console.log('📧 نص الاستجابة:', responseText)
    
    if (response.ok) {
      setEmailStatus('success')
      setEmail('')
      setTimeout(() => setEmailStatus('idle'), 3000)
    } else {
      console.error('خطأ من الخادم:', responseText)
      setEmailStatus('error')
    }
  } catch (error) {
    console.error('❌ خطأ في الإرسال:', error)
    setEmailStatus('error')
  }
}

  const freeFeatures = [
    { key: 'allLessonsPDF', icon: DocumentArrowDownIcon },
    { key: 'downloadExercises', icon: DocumentArrowDownIcon },
    { key: 'basicProgress', icon: ChartBarIcon },
    { key: 'russianExplanations', icon: AcademicCapIcon },
    { key: 'mobileAccess', icon: DevicePhoneMobileIcon },
  ]

  const premiumFeatures = [
    { key: 'aiConversation', icon: CpuChipIcon, soon: true },
    { key: 'voiceRecognition', icon: CpuChipIcon, soon: true },
    { key: 'aiExercises', icon: CpuChipIcon, soon: true },
    { key: 'detailedAnalytics', icon: ChartBarIcon, soon: true },
    { key: 'prioritySupport', icon: UserGroupIcon, soon: false },
    { key: 'certificate', icon: TrophyIcon, soon: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton href="/" />
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Current Status Banner */}
        <div className="mb-10 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p className="text-green-700">
            🎉 {t('currentStatus')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">{t('freePlan')}</h2>
              <div className="text-4xl font-bold">0 ₽</div>
              <p className="text-gray-200 text-sm mt-2">{t('foreverFree')}</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <li key={feature.key} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{t(feature.key)}</span>
                    </li>
                  )
                })}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300"
              >
                {t('startFree')}
              </Link>
            </div>
          </div>

          {/* Premium Plan (Coming Soon) */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow relative">
            <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {t('comingSoonBadge')}
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">{t('premiumPlan')}</h2>
              <div className="text-4xl font-bold">499 ₽<span className="text-lg"> / {t('month')}</span></div>
              <p className="text-amber-100 text-sm mt-2">{t('earlyBirdDiscount')}</p>
            </div>
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                {freeFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <li key={feature.key} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{t(feature.key)}</span>
                    </li>
                  )
                })}
                {premiumFeatures.map((feature) => {
                  const Icon = feature.icon
                  return (
                    <li key={feature.key} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        {t(feature.key)}
                        {feature.soon && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {t('soon')}
                          </span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <button
                disabled
                className="block w-full text-center bg-gray-300 text-gray-500 font-semibold py-3 px-6 rounded-xl cursor-not-allowed"
              >
                {t('notifyMe')}
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">
                {t('leaveEmail')}
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="bg-gray-800 px-6 py-4">
            <h3 className="text-xl font-bold text-white text-center">
              {t('comparisonTitle')}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-gray-900 font-semibold">{t('feature')}</th>
                  <th className="px-6 py-4 text-center text-gray-900 font-semibold">{t('free')}</th>
                  <th className="px-6 py-4 text-center text-amber-600 font-semibold">{t('premium')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-gray-700">{t('allLessonsPDF')}</td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{t('aiConversation')}</td>
                  <td className="px-6 py-4 text-center"><XCircleIcon className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-amber-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700">{t('voiceRecognition')}</td>
                  <td className="px-6 py-4 text-center"><XCircleIcon className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-amber-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{t('aiExercises')}</td>
                  <td className="px-6 py-4 text-center"><XCircleIcon className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-amber-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700">{t('detailedAnalytics')}</td>
                  <td className="px-6 py-4 text-center"><XCircleIcon className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-amber-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 text-gray-700">{t('certificate')}</td>
                  <td className="px-6 py-4 text-center"><XCircleIcon className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-amber-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700">{t('prioritySupport')}</td>
                  <td className="px-6 py-4 text-center"><XCircleIcon className="h-5 w-5 text-gray-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><CheckCircleIcon className="h-5 w-5 text-amber-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            ❓ {t('questions')}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('questionsDesc')}
          </p>
          <Link
            href="/faq"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {t('readFaq')} →
          </Link>
        </div>

        {/* Email Signup for Early Access - WORKING FORM */}
        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">
            📧 {t('earlyAccessTitle')}
          </h3>
          <p className="text-gray-600 text-center text-sm mb-4">
            {t('earlyAccessDesc')}
          </p>
          
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              required
              disabled={emailStatus === 'loading'}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={emailStatus === 'loading'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailStatus === 'loading' && '⏳'}
              {emailStatus === 'success' && '✓'}
              {emailStatus === 'idle' && t('notifyBtn')}
              {emailStatus === 'error' && '⟳'}
            </button>
          </form>
          
          {emailStatus === 'success' && (
            <p className="text-green-600 text-center text-sm mt-3">
              ✅ {t('successMessage')}
            </p>
          )}
          {emailStatus === 'error' && (
            <p className="text-red-600 text-center text-sm mt-3">
              ❌ {t('errorMessage')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}