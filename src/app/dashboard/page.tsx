'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { BookOpenIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { StatCard } from '@/components/dashboard/StatCard'
import { GradientCard } from '@/components/dashboard/GradientCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { QuickActionCard } from '@/components/dashboard/QuickActionCard'
import { LessonCard } from '@/components/lessons/LessonCard'
import { SimpleLessonCard } from '@/components/lessons/SimpleLessonCard'

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUserEmail(data.user.email || '')
      }
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return <LoadingSpinner />
  }

  const lessons = [
    { title: 'Basic Greetings', duration: '15 min', level: 'Beginner', isActive: true },
    { title: 'Present Tense', duration: '20 min', level: 'Beginner' },
    { title: 'Food Vocabulary', duration: '18 min', level: 'Beginner' }
  ]
  const quickActions = [
    { 
      title: 'Vocabulary Builder', 
      description: 'Learn 10 new words',
      emoji: '📚',
      href: '/vocabulary',
      gradientFrom: '#eff6ff',
      gradientTo: '#e0e7ff'
    },
    { 
      title: 'Grammar Quiz', 
      description: 'Test your knowledge',
      emoji: '✍️',
      href: '/grammar',
      gradientFrom: '#f0fdf4',
      gradientTo: '#d1fae5'
    },
    { 
      title: 'Speaking Practice', 
      description: 'Pronunciation exercises',
      emoji: '🎤',
      href: '/speaking',
      gradientFrom: '#faf5ff',
      gradientTo: '#fce7f3'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader userEmail={userEmail} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Continue Learning"
            description="5 lessons pending"
            icon={<BookOpenIcon className="h-8 w-8 text-blue-600" />}
            color="blue"
            href="/lessons"
            showProgress
            progress={65}
          />

          <StatCard
            title="Progress"
            description="Your learning journey"
            icon={<ChartBarIcon className="h-8 w-8 text-green-600" />}
            color="green"
          />

          <StatCard
            title="Time Spent"
            description="This week"
            value="12h 45m"
            icon={<ClockIcon className="h-8 w-8 text-yellow-600" />}
            color="yellow"
          />

          <GradientCard
            title="Practice"
            description="Speaking exercises"
            iconName="music"
            href="/practice"
            gradientFrom="#9333ea"
            gradientTo="#db2777"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <SectionHeader 
              title="Today's Lessons" 
              linkText="View all" 
              linkHref="/lessons" 
            />
            
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <SimpleLessonCard
                  key={index}
                  title={lesson.title}
                  duration={lesson.duration}
                  level={lesson.level}
                  isActive={lesson.isActive}
                  onStart={() => console.log(`Starting ${lesson.title}`)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <SectionHeader title="Quick Actions" />
            
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action.title}
                  description={action.description}
                  emoji={action.emoji}
                  href={action.href}
                  gradientFrom={action.gradientFrom}
                  gradientTo={action.gradientTo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}