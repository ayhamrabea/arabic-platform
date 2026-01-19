// app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import Navbar from '@/components/Navbar'
import ReduxProvider from '@/providers/ReduxProvider'
import AuthProvider from '@/providers/AuthProvider'

// تعريف النوع مع Promise
type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const { locale } = params

  const metadata: Record<string, { title: string; description: string }> = {
    en: { title: 'AI Platform', description: 'Advanced AI Platform for your needs' },
    ru: { title: 'AI Платформа', description: 'Продвинутая AI платформа для ваших нужд' },
    ar: { title: 'منصة تعلم العربية', description: 'منصة تفاعلية لتعلم اللغة العربية' }
  }

  return metadata[locale] ?? metadata.en
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout(props: Props) {
  // انتظر Promise للحصول على params
  const params = await props.params
  const { locale } = params
  const { children } = props

  if (!locales.includes(locale as any)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ReduxProvider>
        <AuthProvider>
          <Navbar />
          <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="border-t bg-white py-6 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} AI Platform
          </footer>
        </AuthProvider>
      </ReduxProvider>
    </NextIntlClientProvider>
  )
}