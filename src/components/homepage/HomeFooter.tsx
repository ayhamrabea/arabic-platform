import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function HomeFooter() {
  const t = useTranslations('HomePage.footer')

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">ع</span>
              </div>
              <span className="text-xl font-bold text-white">العربية</span>
            </div>
            <p className="text-sm">
              منصة تعلم العربية الأولى للناطقين بالروسية
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white transition">عن المنصة</Link></li>
              <li><Link href="/courses" className="hover:text-white transition">الدورات</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">الأسعار</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">المدونة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">قانوني</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-white transition">الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">الشروط</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition">الكوكيز</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
            <p className="text-sm mb-2">support@arabic-platform.com</p>
            <p className="text-sm">+7 (XXX) XXX-XX-XX</p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="mb-4">© {new Date().getFullYear()} العربية. {t('rights')}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/ru" className="hover:text-white transition">Русский</Link>
            <Link href="/en" className="hover:text-white transition">English</Link>
            <Link href="/ar" className="hover:text-white transition">العربية</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}