// app/profile/page.tsx
'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Icon from '@/components/icon/Icon'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { supabase } from '@/lib/supabaseClient'
import { fetchProfile, setEditing, updateProfile } from '@/store/slices/profileSlice'
import { clearUser } from '@/store/slices/authSlice'
import { getAge , getStreakStatus } from '@/utils/profile'
import { getLevel } from '@/utils/levels'
import { updateStreak } from '@/utils/services/streak'

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useDispatch()

  const t = useTranslations('ProfilePage')
  
  // Get auth state from Redux
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth)
  
  // Get profile state from Redux
  const { 
    profile, 
    loading: profileLoading, 
    error, 
    isEditing 
  } = useSelector((state: RootState) => state.profile)
  
  // استخدم useMemo لإنشاء formData من profile
  const formData = useMemo(() => {
    if (!profile) {
      return {
        name: '',
        avatar_url: '/default-avatar.png',
        country: '',
        birth_date: ''
      }
    }
    
    return {
      name: profile.name || '',
      avatar_url: profile.avatar_url || '/default-avatar.png',
      country: profile.country || '',
      birth_date: profile.birth_date || ''
    }
  }, [profile])
  
  // state منفصل للـ editing
  const [editFormData, setEditFormData] = useState(formData)
  
  // تحديث editFormData عندما يتغير formData
  useEffect(() => {
    setEditFormData(formData)
  }, [formData])

  // Load profile when user is authenticated
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

  const handleUpdateProfile = async () => {
    if (!profile || !user) return

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    dispatch(clearUser())
    router.replace('/login')
  }

  const isLoading = authLoading || profileLoading

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="text-center">
          <div className="p-6 bg-white rounded-2xl shadow-lg max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('profileNotFound.title')}</h3>
            <p className="text-gray-600 mb-4">{t('profileNotFound.description')}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {t('profileNotFound.button')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const levelInfo = getLevel(profile.total_xp || 0)
  const userLevel = t(`levels.${levelInfo.key}`)
  const nextLevel = levelInfo.nextKey ? t(`levels.${levelInfo.nextKey}`): null
  const levelColor = levelInfo.color      
  const progressPercentage = levelInfo.progress  
  const nextXP = levelInfo.nextXP         

  const streakStatus = getStreakStatus(profile.streak_days || 0)
  const age = profile.birth_date ? getAge(profile.birth_date) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <Icon className='h-5 w-5 mr-2' name='back' />
            {t('backButton')}
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <Icon className="h-5 w-5 text-red-500 mr-2" name="alert" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="relative">
                  <div className="relative">
                    {profile.avatar_url && profile.avatar_url !== '/default-avatar.png' ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png'
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {profile.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {t('status.active')}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.name || user.email?.split('@')[0] || t('defaultName')}
                  </h1>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 ${levelColor} rounded-full text-sm font-medium`}>
                      {userLevel}
                    </span>
                    <span className={`px-3 py-1 ${streakStatus.color} rounded-full text-sm font-medium`}>
                      {streakStatus.text}
                    </span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {profile.total_xp || 0} {t('xp')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(setEditing(!isEditing))}
                  disabled={profileLoading}
                  className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileLoading ? t('editButton.saving') : isEditing ? t('editButton.cancel') : t('editButton.edit')}
                </button>
              </div>

              {/* XP Progress */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{t('progress.title')}</h3>
                  <span className="text-2xl font-bold text-indigo-600">{profile.total_xp || 0} {t('xp')}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>{t('progress.toLevel', { level: userLevel })}</span>
                      <span>{profile.total_xp || 0} / {nextXP} {t('xp')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form or Display Info */}
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.name')}</label>
                    <input
                      type="text"
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      disabled={profileLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                      placeholder={t('form.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.avatarUrl')}</label>
                    <input
                      type="text"
                      value={editFormData.avatar_url}
                      onChange={(e) => setEditFormData({...editFormData, avatar_url: e.target.value})}
                      disabled={profileLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                      placeholder={t('form.avatarPlaceholder')}
                    />
                    {editFormData.avatar_url && editFormData.avatar_url !== '/default-avatar.png' && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">{t('form.preview')}:</p>
                        <img 
                          src={editFormData.avatar_url} 
                          alt={t('form.avatarPreview')}
                          className="w-16 h-16 rounded-full object-cover border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-avatar.png'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.country')}</label>
                    <input
                      type="text"
                      value={editFormData.country}
                      onChange={(e) => setEditFormData({...editFormData, country: e.target.value})}
                      disabled={profileLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                      placeholder={t('form.countryPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('form.birthDate')}</label>
                    <input
                      type="date"
                      value={editFormData.birth_date}
                      onChange={(e) => setEditFormData({...editFormData, birth_date: e.target.value})}
                      disabled={profileLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                    />
                  </div>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={profileLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileLoading ? t('form.saving') : t('form.save')}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{t('personalInfo.title')}</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">{t('personalInfo.country')}</p>
                          <p className="font-medium text-gray-900">
                            {profile.country || <span className="text-gray-400">{t('personalInfo.notSpecified')}</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('personalInfo.birthDate')}</p>
                          <p className="font-medium text-gray-900">
                            {profile.birth_date ? (
                              <>
                                {new Date(profile.birth_date).toLocaleDateString()}
                                {age && <span className="text-gray-500 ml-2">({age} {t('personalInfo.yearsOld')})</span>}
                              </>
                            ) : (
                              <span className="text-gray-400">{t('personalInfo.notSpecified')}</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('personalInfo.memberSince')}</p>
                          <p className="font-medium text-gray-900">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">{t('personalInfo.lastActive')}</p>
                          <p className="font-medium text-gray-900">
                            {new Date(profile.last_active).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">{t('stats.title')}</h3>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">{t('stats.totalXP')}</span>
                            <span className="text-2xl font-bold text-indigo-600">{profile.total_xp || 0}</span>
                          </div>
                          <p className="text-sm text-gray-500">{t('stats.totalXpDesc')}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">{t('stats.currentStreak')}</span>
                            <span className="text-2xl font-bold text-orange-600">{profile.streak_days || 0} {t('stats.days')}</span>
                          </div>
                          <p className="text-sm text-gray-500">{t('stats.streakDesc')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-8">
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('accountInfo.title')}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('accountInfo.email')}</p>
                  <p className="font-medium text-gray-900 truncate">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('accountInfo.userId')}</p>
                  <p className="font-medium text-gray-900 text-xs truncate">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('accountInfo.status')}</p>
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {t('accountInfo.active')}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('accountInfo.profileUpdated')}</p>
                  <p className="font-medium text-gray-900 text-sm">
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('quickActions.title')}</h3>
              <div className="space-y-3">
                <Link
                  href="/settings"
                  className="flex items-center p-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Icon className='h-5 w-5 mr-3 text-gray-500' name='settings' />
                  {t('quickActions.settings')}
                </Link>
                <Link
                  href="/achievements"
                  className="flex items-center p-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Icon className='h-5 w-5 mr-3 text-gray-500' name='achievement' />
                  {t('quickActions.achievements')}
                </Link>
                <Link
                  href="/leaderboard"
                  className="flex items-center p-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Icon className='h-5 w-5 mr-3 text-gray-500' name='Leaderboard' />
                  {t('quickActions.leaderboard')}
                </Link>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              disabled={profileLoading}
              className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-600 rounded-xl font-bold hover:from-red-100 hover:to-pink-100 hover:border-red-300 transition-all disabled:opacity-50"
            >
              <Icon className='h-5 w-5 mr-2' name='logout' />
              {t('signOut')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}