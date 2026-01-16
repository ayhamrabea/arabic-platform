import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/config'
import Navbar from '@/components/Navbar'
import ReduxProvider from '@/providers/ReduxProvider'
import AuthProvider from '@/providers/AuthProvider'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: 'en' | 'ru' }>
}) {
  const { locale } = await params

  const metadata: Record<'en' | 'ru', { title: string; description: string }> = {
    en: { title: 'AI Platform', description: 'Advanced AI Platform for your needs' },
    ru: { title: 'AI Платформа', description: 'Продвинутая AI платформа для ваших нужд' }
  }

  return metadata[locale] ?? metadata.en
}


export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: 'en' | 'ru' }>
}) {
  const { locale } = await params  // ✅ unwrap the Promise

  if (!locales.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ReduxProvider>
        <AuthProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="border-t bg-white py-6 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} AI Platform
          </footer>
        </AuthProvider>
      </ReduxProvider>
    </NextIntlClientProvider>
  )
}
