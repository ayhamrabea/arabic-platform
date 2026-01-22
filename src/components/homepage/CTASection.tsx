import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  AcademicCapIcon,
  ArrowRightIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

export default function CTASection() {
  const t = useTranslations('HomePage.cta')

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600"></div>
      
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full mix-blend-overlay filter blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center text-white">
          <AcademicCapIcon className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="group px-10 py-5 rounded-2xl bg-white text-blue-700 font-bold text-lg hover:bg-gray-100 hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
            >
              {t('button.primary')}
              <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <Link
              href="/lessons"
              className="px-10 py-5 rounded-2xl border-2 border-white text-white font-bold text-lg hover:bg-white/10 transition"
            >
              {t('button.secondary')}
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-3">
              <CalendarIcon className="h-8 w-8 text-blue-200" />
              <div className="text-left">
                <p className="text-2xl font-bold">7 أيام</p>
                <p className="text-blue-200">تجربة مجانية</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <UserGroupIcon className="h-8 w-8 text-blue-200" />
              <div className="text-left">
                <p className="text-2xl font-bold">10,000+</p>
                <p className="text-blue-200">مستخدم روسي</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3">
              <ChartBarIcon className="h-8 w-8 text-blue-200" />
              <div className="text-left">
                <p className="text-2xl font-bold">95%</p>
                <p className="text-blue-200">رضا العملاء</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}