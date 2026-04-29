'use client'

import { useTranslations } from 'next-intl'
import { BackButton } from '@/components/ui/BackButton'
import Link from 'next/link'

export default function PrivacyPage() {
  const t = useTranslations('PrivacyPage')
  const currentDate = new Date().toLocaleDateString()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton href="/" />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              {t('title')}
            </h1>
            <p className="text-gray-300 text-center text-sm mt-2">
              {t('lastUpdated')}: {currentDate}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6 text-gray-700">
            
            {/* Introduction */}
            <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
              <p className="text-blue-800 text-sm leading-relaxed">
                {t('intro')}
              </p>
            </div>

            {/* What Data */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📋</span> {t('whatDataTitle')}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-2">
                {t('whatDataText')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>{t('dataEmail')}</li>
                <li>{t('dataDate')}</li>
                <li>{t('dataSource')}</li>
                <li>{t('dataLocale')}</li>
              </ul>
            </section>

            {/* How We Use */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span> {t('howUseTitle')}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>{t('howUseNotify')}</li>
                <li>{t('howUseLaunch')}</li>
                <li>{t('howUseDiscount')}</li>
              </ul>
              <p className="text-gray-600 mt-2 text-sm">
                {t('howUseNote')}
              </p>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🤝</span> {t('sharingTitle')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('sharingText')}
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mt-2">
                <p className="text-sm text-gray-600">
                  🔒 {t('sharingThirdParty')}
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🛡️</span> {t('securityTitle')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('securityText')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded">
                  <span>✅</span> {t('securitySSL')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded">
                  <span>✅</span> {t('securityEncryption')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded">
                  <span>✅</span> {t('securityGDPR')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-2 rounded">
                  <span>✅</span> {t('securitySOC2')}
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚖️</span> {t('rightsTitle')}
              </h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li>{t('rightsAccess')}</li>
                <li>{t('rightsDelete')}</li>
                <li>{t('rightsObject')}</li>
              </ul>
            </section>

            {/* How to Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📧</span> {t('contactTitle')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('contactText')}
              </p>
              <div className="bg-gray-100 p-4 rounded-xl mt-3 text-center">
                <p className="font-mono text-blue-600">
                 ayhamrabea05@gmail.com
                </p>
              </div>
            </section>

            {/* Children */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">👶</span> {t('childrenTitle')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('childrenText')}
              </p>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">📝</span> {t('changesTitle')}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t('changesText')}
              </p>
            </section>

            {/* Footer Note */}
            <div className="border-t pt-6 mt-6 text-center text-sm text-gray-500">
              <p>
                {t('footerNote')}
              </p>
              <p className="mt-2">
                <Link href="/" className="text-blue-600 hover:underline">
                  ← {t('backToHome')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}