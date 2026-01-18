// components/profile/EditProfileForm.tsx
import React from 'react'
import { ProfileInputField } from './ProfileInputField'

interface EditProfileFormProps {
  editFormData: {
    name: string
    avatar_url: string
    country: string
    birth_date: string
  }
  setEditFormData: (data: any) => void
  profileLoading?: boolean
  handleUpdateProfile: () => void
  t: (key: string) => string
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  editFormData,
  setEditFormData,
  profileLoading = false,
  handleUpdateProfile,
  t
}) => {
  return (
    <div className="space-y-6">
      <ProfileInputField
        label={t('form.name')}
        value={editFormData.name}
        onChange={(v) => setEditFormData({...editFormData, name: v})}
        placeholder={t('form.namePlaceholder')}
        disabled={profileLoading}
      />

      <ProfileInputField
        label={t('form.avatarUrl')}
        value={editFormData.avatar_url}
        onChange={(v) => setEditFormData({...editFormData, avatar_url: v})}
        placeholder={t('form.avatarPlaceholder')}
        disabled={profileLoading}
        previewImage
      />

      <ProfileInputField
        label={t('form.country')}
        value={editFormData.country}
        onChange={(v) => setEditFormData({...editFormData, country: v})}
        placeholder={t('form.countryPlaceholder')}
        disabled={profileLoading}
      />

      <ProfileInputField
        label={t('form.birthDate')}
        type="date"
        value={editFormData.birth_date}
        onChange={(v) => setEditFormData({...editFormData, birth_date: v})}
        disabled={profileLoading}
      />

      <button
        onClick={handleUpdateProfile}
        disabled={profileLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {profileLoading ? t('form.saving') : t('form.save')}
      </button>
    </div>
  )
}
