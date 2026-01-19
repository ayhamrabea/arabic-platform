import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Platform',
  description: 'Advanced AI Platform'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html >
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
