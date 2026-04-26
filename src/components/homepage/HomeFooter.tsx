import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { FaTelegram, FaInstagram, FaVk } from 'react-icons/fa'

export default function HomeFooter() {
  const t = useTranslations('HomePage.footer')

  const socialLinks = [
    {
      name: 'Telegram',
      url: 'https://t.me/MyArabic05',
      icon: FaTelegram,
      color: 'hover:text-[#26A5E4]'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/yourusername',
      icon: FaInstagram,
      color: 'hover:text-[#E4405F]'
    },
    {
      name: 'VK',
      url: 'https://vk.com/club221531979',
      icon: FaVk,
      color: 'hover:text-[#0077FF]'
    }
  ]

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">ع</span>
              </div>
              <span className="text-xl font-bold text-white">الطريق الى العربية</span>
            </div>
            <p className="text-sm">
              منصة تعلم العربية الأولى للناطقين بالروسية
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-all duration-300 hover:scale-110 ${social.color}`}
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
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
            <p className="text-sm mb-2">
              <a href="mailto:arabicacademy05@gmail.com" className="hover:text-white transition">
                arabicacademy05@gmail.com
              </a>
            </p>
            <p className="text-sm">
              <a href="tel:+79127228061" className="hover:text-white transition">
                +7 (912) 722-80-61
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="mb-4">© {new Date().getFullYear()} الطريق الى العربية. {t('rights')}</p>
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