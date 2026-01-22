'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

import HeroSection from '@/components/homepage/HeroSection'
import AdvantagesSection from '@/components/homepage/AdvantagesSection'
import FeaturesSection from '@/components/homepage/FeaturesSection'
import LanguagesSection from '@/components/homepage/LanguagesSection'
import HowItWorksSection from '@/components/homepage/HowItWorksSection'
import TestimonialsSection from '@/components/homepage/TestimonialsSection'
import CTASection from '@/components/homepage/CTASection'
import HomeFooter from '@/components/homepage/HomeFooter'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useSelector((state: RootState) => state.auth)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    setPageLoading(false)
  }, [user, loading, router])

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <HeroSection />
      <AdvantagesSection />
      <FeaturesSection />
      <LanguagesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <HomeFooter />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}