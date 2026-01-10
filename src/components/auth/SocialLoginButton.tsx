// components/auth/SocialLoginButton.tsx

import Icon from "../icon/Icon"

interface SocialLoginButtonProps {
  provider: 'google' | 'github' | 'facebook'
  onClick: () => void
  loading?: boolean
}

export function SocialLoginButton({ provider, onClick, loading }: SocialLoginButtonProps) {
  const providers = {
    google: { name: 'Google', icon: 'google', color: 'border-gray-300 hover:bg-gray-50' },
    github: { name: 'GitHub', icon: 'github', color: 'border-gray-800 hover:bg-gray-800 text-white' },
    facebook: { name: 'Facebook', icon: 'facebook', color: 'border-blue-600 hover:bg-blue-600 text-white' }
  }

  const config = providers[provider]

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg transition ${config.color} disabled:opacity-50`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
      ) : (
        <Icon className="h-5 w-5 mr-3" name={config.icon} />
      )}
      Continue with {config.name}
    </button>
  )
}