import { useTranslations } from 'next-intl'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function HowItWorksSection() {
  const t = useTranslations('HomePage.howItWorks')

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-emerald-500"></div>

          <div className="space-y-12">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`relative flex flex-col lg:flex-row items-center ${
                step % 2 === 0 ? 'lg:flex-row-reverse' : ''
              } gap-8`}>
                <div className="relative z-10 flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                  {step}
                </div>
                
                <div className={`flex-1 ${step % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
                  <div className="bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-xl transition-all">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">
                      {t(`step${step}.title`)}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {t(`step${step}.description`)}
                    </p>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {[1, 2].map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                          <span className="text-gray-700">
                            {t(`step${step}.feature${feature}`)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}