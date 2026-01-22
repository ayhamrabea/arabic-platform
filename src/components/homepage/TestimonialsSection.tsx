import { useTranslations } from 'next-intl'
import { UserGroupIcon, StarIcon } from '@heroicons/react/24/outline'

export default function TestimonialsSection() {
  const t = useTranslations('HomePage.testimonials')

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-6 rounded-full bg-white border border-blue-200 text-blue-700 font-semibold">
            <UserGroupIcon className="h-4 w-4" />
            {t('badge')}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((testimonialNum) => (
            <div key={testimonialNum} className="bg-white p-8 rounded-3xl border border-gray-200 hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                  {testimonialNum === 1 ? 'А' : testimonialNum === 2 ? 'М' : 'И'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {t(`testimonial${testimonialNum}.name`)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t(`testimonial${testimonialNum}.role`)}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">
                {t(`testimonial${testimonialNum}.quote`)}
              </p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}