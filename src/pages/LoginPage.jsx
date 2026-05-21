import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş başarısız. Bilgilerinizi kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">JUKELY</div>
        <div className="login-sub">Admin Paneli — İşletme Girişi</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input className="form-input" type="text" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="admin" required />
          </div>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input className="form-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? '⏳ Giriş yapılıyor…' : 'Giriş Yap →'}
          </button>
        </form>

        <div style={{
          marginTop: 24, padding: '12px 16px',
          background: 'var(--green-10)', border: '1px solid var(--border-g)',
          borderRadius: 'var(--r-md)', fontSize: '0.76rem', color: 'var(--text-2)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--green)' }}>Demo Modu</strong><br />
          Kullanıcı adı: <code style={{ color: 'var(--green)' }}>admin</code>
          &nbsp;·&nbsp;
          Şifre: <code style={{ color: 'var(--green)' }}>admin</code>
        </div>
      </div>
    </div>
  )
}
