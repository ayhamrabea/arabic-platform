// app/profile/page.tsx
'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { fetchProfile, setEditing, updateProfile } from '@/store/slices/profileSlice'
import { updateStreak } from '@/utils/services/streak'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import ProfileHeader from '@/components/profile/ProfileHeader'
import XPProgress from '@/components/profile/XPProgress'
import { AccountInfo } from '@/components/profile/AccountInfo'
import { QuickActions } from '@/components/profile/QuickActions'
import { EditProfileForm } from '@/components/profile/EditProfileForm'
import { ProfileDisplay } from '@/components/profile/ProfileDisplay'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { BackButton } from '@/components/ui/BackButton'
import { LogoutButton } from '@/components/Logout'
import { getLevel } from '@/utils/levels'
import { getAge, getStreakStatus } from '@/utils/profile'

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const t = useTranslations('ProfilePage')

  // Auth state
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)

  // Profile state
  const { profile, loading: profileLoading, error, isEditing } = useSelector((state: RootState) => state.profile)

  // Safe profile for hooks
  const safeProfile = useMemo(() => profile || {
    id: '',
    name: '',
    email: '',
    avatar_url: '/default-avatar.png',
    total_xp: 0,
    streak_days: 0,
    country: '',
    birth_date: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
  }, [profile])


  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: safeProfile.name || '',
    avatar_url: safeProfile.avatar_url || '/default-avatar.png',
    country: safeProfile.country || '',
    birth_date: safeProfile.birth_date || ''
  })

  useEffect(() => {
    setEditFormData({
      name: profile?.name || '',
      avatar_url: profile?.avatar_url || '/default-avatar.png',
      country: profile?.country || '',
      birth_date: profile?.birth_date || ''
    })
  }, [profile])

  // Load profile on mount
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
      return
    }

    if (user?.id && !profile) {
      dispatch(fetchProfile(user.id) as any)
      updateStreak(user.id).catch(console.error)
    }
  }, [user, authLoading, profile, dispatch, router])

  // Update profile
  const handleUpdateProfile = async () => {
    if (!user || !profile) return

    dispatch(updateProfile({
      id: user.id,
      updates: {
        name: editFormData.name,
        avatar_url: editFormData.avatar_url,
        country: editFormData.country,
        birth_date: editFormData.birth_date
      }
    }) as any)
  }



  const isLoading = authLoading || profileLoading

  if (isLoading || !user || !profile) {
    return isLoading ? <LoadingSpinner /> : <ErrorMessage messageKey={error?.toString() || t('loadError')} />
  }


  // Level info
  const levelInfo = getLevel(profile.total_xp || 0)
  const userLevel = t(`levels.${levelInfo.key}`)
  const nextLevel = levelInfo.nextKey ? t(`levels.${levelInfo.nextKey}`) : null
  const levelColor = levelInfo.color
  const progressPercentage = levelInfo.progress
  const nextXP = levelInfo.nextXP
  const streakStatus = getStreakStatus(profile.streak_days || 0)
  const age = profile.birth_date ? getAge(profile.birth_date) : null

  // Safe user email
  const userEmail = user.email || 'unknown@email.com'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton href="/dashboard" />
        </div>

        {/* Error Message */}
        {error && <ErrorMessage messageKey={error?.toString() || t('loadError')} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <ProfileHeader
                profile={profile}
                user={{ email: userEmail, id: user.id }}
                isEditing={isEditing}
                loading={profileLoading}
                levelLabel={userLevel}
                levelColor={levelColor}
                streakStatus={streakStatus}
                t={t}
                onToggleEdit={() => dispatch(setEditing(!isEditing))}
              />

              <XPProgress
                profile={profile}
                t={t}
                userLevel={userLevel}
                nextXP={nextXP}
                progressPercentage={progressPercentage}
              />

              {isEditing ? (
                <EditProfileForm
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                  profileLoading={profileLoading}
                  handleUpdateProfile={handleUpdateProfile}
                  t={t}
                />
              ) : (
                <ProfileDisplay profile={profile} age={age} t={t} />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <AccountInfo user={{ email: userEmail, id: user.id }} profile={profile} t={t} />
            <QuickActions t={t} />
            <LogoutButton variant="profile" />
          </div>
        </div>
      </div>
    </div>
  )
}
