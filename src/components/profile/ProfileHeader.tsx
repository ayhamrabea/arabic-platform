// components/profile/ProfileHeader.tsx
'use client'

import Icon from '@/components/icon/Icon'

import { Profile } from '@/store/slices/profileSlice'

interface BadgeProps {
  color: string
  children: React.ReactNode
}

const Badge: React.FC<BadgeProps> = ({ color, children }) => (
  <span className={`px-3 py-1 ${color} rounded-full text-sm font-medium`}>
    {children}
  </span>
)

interface ProfileHeaderProps {
  profile: Profile
  user: { id: string; email: string }
  isEditing: boolean
  loading: boolean
  levelLabel: string
  levelColor: string
  streakStatus: {
    text: string
    color: string
  }
  t: (key: string) => string
  onToggleEdit: () => void
}

export default function ProfileHeader({
  profile,
  user,
  isEditing,
  loading,
  levelLabel,
  levelColor,
  streakStatus,
  t,
  onToggleEdit
}: ProfileHeaderProps) {

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
      
      {/* Avatar */}
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
            {profile.name?.charAt(0)?.toUpperCase() ||
              user.email?.charAt(0)?.toUpperCase() ||
              'U'}
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
          {t('status.active')}
        </div>
      </div>

      {/* User Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {profile.name || user.email?.split('@')[0] || t('defaultName')}
        </h1>
        <p className="text-gray-600 mb-4">{user.email}</p>

        <div className="flex flex-wrap gap-2">
          <Badge color={levelColor}>{levelLabel}</Badge>
          <Badge color={streakStatus.color}>{streakStatus.text}</Badge>
          <Badge color="bg-indigo-100 text-indigo-800">{profile.total_xp || 0} {t('xp')}</Badge>
        </div>
      </div>

      {/* Edit Button */}
      <button
        onClick={onToggleEdit}
        disabled={loading}
        className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
      >
        {loading
          ? t('editButton.saving')
          : isEditing
          ? t('editButton.cancel')
          : t('editButton.edit')}
      </button>
    </div>
  )
}
