import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import ReduxProvider from '@/providers/ReduxProvider'
import AuthProvider from '@/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Platform',
  description: 'Advanced AI Platform for your needs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <ReduxProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <footer className="border-t bg-white py-6">
              <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
                © {new Date().getFullYear()} AI Platform. All rights reserved.
              </div>
            </footer>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}