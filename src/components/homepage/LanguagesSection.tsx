import { useTranslations } from 'next-intl'
import { GlobeAltIcon } from '@heroicons/react/24/outline'

const supportedLanguages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
]

export default function LanguagesSection() {
  const t = useTranslations('HomePage.languages')

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-6 rounded-full bg-white text-blue-700 font-semibold border border-blue-200">
            <GlobeAltIcon className="h-4 w-4" />
            {t('title')}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('subtitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {supportedLanguages.map((language) => (
            <div 
              key={language.code}
              className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all text-center group"
            >
              <div className="text-3xl mb-3">{language.flag}</div>
              <h3 className="font-bold text-gray-900 mb-1">{language.name}</h3>
              <div className={`text-sm px-3 py-1 rounded-full inline-block ${
                language.code === 'ru' 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {language.code === 'ru' ? 'اللغة الأساسية' : 'مدعوم'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}