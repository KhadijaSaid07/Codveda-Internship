import { useState } from 'react'
import { Eye, EyeOff, GraduationCap, LoaderCircle, LockKeyhole, Mail, UserRound } from 'lucide-react'
import './AuthPage.css'

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5001/api/auth'

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')

    try {
      const response = await fetch(`${AUTH_URL}/${mode === 'login' ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          mode === 'login'
            ? { email: email.trim(), password }
            : { fullName: fullName.trim(), email: email.trim(), password },
        ),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed. Please try again.')
      }

      if (mode === 'register') {
        setMode('login')
        setPassword('')
        setNotice('Account created successfully. Sign in to continue.')
        return
      }

      if (!result.token || !result.user) {
        throw new Error('The server returned an incomplete login response.')
      }

      sessionStorage.setItem('studentHubToken', result.token)
      onAuthenticated(result.user)
    } catch (requestError) {
      setError(requestError.message || 'Unable to connect to the authentication server.')
    } finally {
      setBusy(false)
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setNotice('')
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand-mark"><GraduationCap size={29} /></div>
        <p className="auth-eyebrow">STUDENT RECORD MANAGEMENT</p>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
        <p className="auth-description">
          {mode === 'login'
            ? 'Sign in to access your StudentHub workspace.'
            : 'Register to get access to the student records workspace.'}
        </p>

        <div className="auth-tabs">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => switchMode('login')}>
            Sign in
          </button>
          <button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => switchMode('register')}>
            Register
          </button>
        </div>

        {error && <div className="auth-message auth-error" role="alert">{error}</div>}
        {notice && <div className="auth-message auth-success" role="status">{notice}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Full name
              <span className="auth-input-wrap">
                <UserRound size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value.replace(/[^\p{L}\p{M}\s'-]/gu, ''))}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
              </span>
            </label>
          )}

          <label>
            Email address
            <span className="auth-input-wrap">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={254}
                required
              />
            </span>
          </label>

          <label>
            Password
            <span className="auth-input-wrap">
              <LockKeyhole size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === 'register' ? 'Create a password' : 'Enter your password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                maxLength={72}
                required
              />
              <button
                className="auth-password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy ? <LoaderCircle size={18} className="auth-spinner" /> : null}
            {busy ? 'Please wait...' : mode === 'login' ? 'Sign in to StudentHub' : 'Create account'}
          </button>
        </form>

        <p className="auth-security">
          <LockKeyhole size={14} /> Protected access to student records
        </p>
      </section>
    </main>
  )
}
