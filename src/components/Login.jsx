// Login Component with Email/Password, Google, and GitHub authentication
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

function Login({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  const { signup, login, signInWithGoogle, signInWithGitHub, resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signup(email, password, displayName || null)
      } else {
        await login(email, password)
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      onClose()
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGitHub()
      onClose()
    } catch (err) {
      setError(err.message || 'GitHub sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setResetEmailSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">
              {showResetPassword ? 'Reset Password' : isSignUp ? 'Sign Up' : 'Sign In'}
            </h2>
            <button
              onClick={onClose}
              className="text-black/40 hover:text-black/60 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {resetEmailSent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">Email Sent!</h3>
              <p className="text-sm text-black/60 mb-6">
                Check your email for password reset instructions.
              </p>
              <button
                onClick={() => {
                  setResetEmailSent(false)
                  setShowResetPassword(false)
                }}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          ) : showResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>

              <button
                type="button"
                onClick={() => setShowResetPassword(false)}
                className="w-full text-sm text-black/60 hover:text-black/80 transition-colors"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium text-black/70 mb-2">
                      Display Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                      placeholder="Your Name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black/70 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/40"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-black/60 hover:text-black/80 transition-colors text-left"
                  >
                    Forgot password?
                  </button>
                )}

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-black/60">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-black/20 rounded-lg hover:bg-black/5 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-medium">Google</span>
                  </button>

                  <button
                    onClick={handleGitHubSignIn}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-black/20 rounded-lg hover:bg-black/5 transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium">GitHub</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                  className="text-sm text-black/60 hover:text-black/80 transition-colors"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Login

