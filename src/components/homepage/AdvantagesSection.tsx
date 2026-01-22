import { useTranslations } from 'next-intl'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const advantages = [
  'learnAtYourOwnPace',
  'arabicForRussianSpeakers',
  'aiPoweredExercises',
  'culturalContext',
  'mobileFriendly',
  'certificate'
]

export default function AdvantagesSection() {
  const t = useTranslations('HomePage.advantages')

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            لماذا تختار <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">عربيتنا</span>؟
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            منصة مصممة خصيصاً لمساعدة الناطقين بالروسية على تعلم العربية بفعالية
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantageKey, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {t(`${advantageKey}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`${advantageKey}.desc`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}