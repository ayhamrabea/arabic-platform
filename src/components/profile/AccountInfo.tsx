// components/profile/AccountInfo.tsx
import { Profile } from "@/store/slices/profileSlice"
import { memo } from "react"
import { formatDate } from "../favorites/helpers"

interface AccountInfoProps {
  user: {
    email: string
    id: string
  }
  profile: Profile
  t: (key: string, params?: Record<string, any>) => string
}

// const formatDate = (date: string) =>
//   new Date(date).toLocaleDateString()

export const AccountInfo = memo(function AccountInfo({
  user,
  profile,
  t
}: AccountInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {t("accountInfo.title")}
      </h3>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {t("accountInfo.email")}
          </p>
          <p className="font-medium text-gray-900 truncate" title={user.email}>
            {user.email}
          </p>
        </div>

        {/* User ID */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {t("accountInfo.userId")}
          </p>
          <p
            className="font-medium text-gray-900 text-xs truncate"
            title={user.id}
          >
            {user.id}
          </p>
        </div>

        {/* Status */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {t("accountInfo.status")}
          </p>
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {t("accountInfo.active")}
          </span>
        </div>

        {/* Updated At */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            {t("accountInfo.profileUpdated")}
          </p>
          <p className="font-medium text-gray-900 text-sm">
            {formatDate(profile.updated_at)}
          </p>
        </div>
      </div>
    </div>
  )
})
