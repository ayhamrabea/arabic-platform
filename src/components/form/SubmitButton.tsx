// components/form/SubmitButton.tsx

interface SubmitButtonProps {
  loading: boolean
  type: 'login' | 'register'
  disabled?: boolean
}

export function SubmitButton({ loading, type, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          {type === 'login' ? 'Signing in...' : 'Creating account...'}
        </div>
      ) : (
        type === 'login' ? 'Sign In' : 'Create Account'
      )}
    </button>
  )
}