// components/profile/ProfileDisplay.tsx
import { Profile } from '@/store/slices/profileSlice'
import React from 'react'

interface ProfileDisplayProps {
  profile: Profile
  age?: number | null
  t: (key: string) => string
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ profile, age, t }) => {
  return (
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
  )
}
