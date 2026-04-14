// app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import ReduxProvider from '@/providers/ReduxProvider'
import AuthProvider from '@/providers/AuthProvider'
import Navbar from '@/components/navbar/Navbar'
import { locales } from '@/i18n/config'

// تعريف النوع مع Promise
type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const { locale } = params

  const metadata: Record<string, { title: string; description: string }> = {
    
    ru: { 
      title: 'Путь к арабскому языку', 
      description: 'Платформа для изучения арабского языка для носителей русского языка. Осваивайте грамматику, лексику и разговорный арабский легко и увлекательно.' 
    },
    en: { 
      title: 'Путь к арабскому языку', 
      description: 'A platform to learn Arabic for Russian speakers. Learn grammar, vocabulary, and conversational Arabic easily.' 
    },
    ar: { 
      title: 'Путь к арабскому языку', 
      description: 'منصة لتعلم اللغة العربية للناطقين بالروسية. تعلم القواعد والمفردات والعربية المحكية بسهولة.' 
    }
  }

  return metadata[locale] ?? metadata.en
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout(props: Props) {
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
          <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <footer className="border-t bg-white py-6 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Путь к арабскому языку
          </footer>
        </AuthProvider>
      </ReduxProvider>
    </NextIntlClientProvider>
  )
}