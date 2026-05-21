import { useState, useEffect } from 'react'
import Toast from '../components/Toast'
import api   from '../api/client'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    allowExplicit:         false,
    songsPerUserPerHour:   3,
    fastPassEnabled:       false,
    fastPassPrice:         '1.00',
  })
  const [customApi, setCustomApi] = useState({ clientId: '', clientSecret: '' })
  const [apiMode,   setApiMode]   = useState('shared')
  const [loading,   setLoading]   = useState(false)
  const [toast,     setToast]     = useState(null)
  const toastId = { current: 0 }

  const showToast = (msg, type='success') => setToast({ id: ++toastId.current, msg, type })

  useEffect(() => {
    api.get('/admin/dashboard').then(r => {
      const c = r.data.company
      if (!c) return
      setApiMode(c.api_mode || 'shared')
      setSettings({
        allowExplicit:       c.allow_explicit       ?? false,
        songsPerUserPerHour: c.songs_per_user_per_hour ?? 3,
        fastPassEnabled:     c.fast_pass_enabled    ?? false,
        fastPassPrice:       String(c.fast_pass_price ?? '1.00'),
      })
    }).catch(() => {})
  }, [])

  async function saveSettings(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/admin/settings', {
        allowExplicit:        settings.allowExplicit,
        songsPerUserPerHour:  parseInt(settings.songsPerUserPerHour),
        fastPassEnabled:      settings.fastPassEnabled,
        fastPassPrice:        parseFloat(settings.fastPassPrice),
      })
      showToast('Ayarlar kaydedildi')
    } catch { showToast('Kaydetme başarısız', 'error') }
    finally { setLoading(false) }
  }

  async function saveCustomApi(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/admin/spotify-credentials', customApi)
      showToast('Kendi Spotify API anahtarlarınız kaydedildi')
      setApiMode('custom')
    } catch { showToast('Kaydetme başarısız', 'error') }
    finally { setLoading(false) }
  }

  function toggle(key) {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  return (
    <>
      <div className="topbar">
        <div className="topbar__title">Ayarlar</div>
      </div>

      <div className="page-content" style={{ maxWidth: 640 }}>
        {/* Content filters */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>İçerik & Limitler</div>
          <form onSubmit={saveSettings}>
            <div className="toggle-row">
              <div>
                <div className="toggle-label">Explicit (18+) İçerik</div>
                <div className="toggle-sub">Küfür veya yetişkin içerikli şarkılara izin ver</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.allowExplicit} onChange={() => toggle('allowExplicit')} />
                <div className="toggle-track" />
              </label>
            </div>

            <div className="toggle-row">
              <div>
                <div className="toggle-label">Fast Pass (Öne Al)</div>
                <div className="toggle-sub">Müşterilerin ücret ödeyerek sıraya öne geçmesine izin ver</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={settings.fastPassEnabled} onChange={() => toggle('fastPassEnabled')} />
                <div className="toggle-track" />
              </label>
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Kullanıcı Başına Saatlik Şarkı Limiti</label>
              <input className="form-input" type="number" min="1" max="20"
                value={settings.songsPerUserPerHour}
                onChange={e => setSettings(s => ({ ...s, songsPerUserPerHour: e.target.value }))}
                style={{ maxWidth: 120 }}
              />
            </div>

            {settings.fastPassEnabled && (
              <div className="form-group">
                <label className="form-label">Fast Pass Fiyatı (₺)</label>
                <input className="form-input" type="number" min="0" step="0.50"
                  value={settings.fastPassPrice}
                  onChange={e => setSettings(s => ({ ...s, fastPassPrice: e.target.value }))}
                  style={{ maxWidth: 120 }}
                />
              </div>
            )}

            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? '⏳' : '✓ Kaydet'}
            </button>
          </form>
        </div>

        {/* Spotify connection */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-title" style={{ marginBottom: 4 }}>Spotify Bağlantısı</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 18 }}>
            Şu an: <strong style={{ color: apiMode === 'custom' ? 'var(--gold)' : 'var(--green)' }}>
              {apiMode === 'custom' ? 'Kendi API Anahtarlarım' : 'Jukely Ortak API'}
            </strong>
          </div>
          <a href="/api/auth/spotify" className="btn btn-outline" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            ♫ &nbsp;Spotify Hesabını Yeniden Bağla
          </a>
        </div>

        {/* Phase 2: Custom Spotify API */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 4 }}>Kendi Spotify API Anahtarlarım</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginBottom: 18 }}>
            Rate limit sorunlarını önlemek için Spotify Developer Console'dan kendi uygulama anahtarlarınızı girin.
          </div>
          <form onSubmit={saveCustomApi}>
            <div className="form-group">
              <label className="form-label">Client ID</label>
              <input className="form-input" type="text"
                placeholder="a1b2c3d4e5f6..."
                value={customApi.clientId}
                onChange={e => setCustomApi(s => ({ ...s, clientId: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Client Secret</label>
              <input className="form-input" type="password"
                placeholder="••••••••••••••••••••••••••••••••"
                value={customApi.clientSecret}
                onChange={e => setCustomApi(s => ({ ...s, clientSecret: e.target.value }))}
              />
            </div>
            <button className="btn btn-gold" type="submit" disabled={loading || !customApi.clientId || !customApi.clientSecret}>
              {loading ? '⏳' : '⚡ Kendi API\'mi Kullan'}
            </button>
          </form>
        </div>
      </div>

      {toast && (
        <Toast key={toast.id} message={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </>
  )
}
