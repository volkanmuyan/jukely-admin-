import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import Toast  from '../components/Toast'
import api    from '../api/client'
import { MOCK_TABLES } from '../data/mockData'

const BASE_URL = 'https://volkanmuyan.github.io/jukely'

export default function TablesPage() {
  const { isDemo }                    = useAuth()
  const [tables,  setTables]          = useState([])
  const [label,   setLabel]           = useState('')
  const [loading, setLoading]         = useState(false)
  const [toast,   setToast]           = useState(null)
  const toastId                       = { current: 0 }

  const showToast = (msg, type = 'success') => setToast({ id: ++toastId.current, msg, type })

  const loadTables = useCallback(() => {
    if (isDemo) { setTables(MOCK_TABLES); return }
    api.get('/admin/tables').then(r => setTables(r.data.tables)).catch(() => setTables([]))
  }, [isDemo])

  useEffect(() => { loadTables() }, [loadTables])

  async function createTable(e) {
    e.preventDefault()
    if (!label.trim()) return
    setLoading(true)
    try {
      if (isDemo) {
        const newTable = {
          id: `t_${Date.now()}`, company_id: 'demo-company-uuid',
          label: label.trim(),
          qr_token: `tok_${label.toLowerCase().replace(/\s+/g,'_')}_demo_${Math.random().toString(36).slice(2,8)}`,
          is_active: true, scans: 0,
        }
        setTables(prev => [...prev, newTable])
      } else {
        await api.post('/admin/tables', { label: label.trim() })
        loadTables()
      }
      showToast(`"${label}" masası oluşturuldu`)
      setLabel('')
    } catch (err) {
      showToast(err.response?.data?.error || 'Hata', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar__title">Masalar & QR Kodlar</div>
          <div className="topbar__sub">{tables.length} masa tanımlı</div>
        </div>
      </div>

      <div className="page-content">
        <div className="card card--glow" style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Yeni Masa Ekle</div>
          <form onSubmit={createTable} style={{ display: 'flex', gap: 10 }}>
            <input
              className="form-input"
              placeholder='Masa adı — "Masa 5", "Teras", "Bar"'
              value={label}
              onChange={e => setLabel(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" type="submit" disabled={loading || !label.trim()}>
              {loading ? '⏳' : '+ Oluştur'}
            </button>
          </form>
        </div>

        {tables.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">⬡</div>
            <div className="empty-state__title">Henüz masa yok</div>
            <div className="empty-state__sub">Yukarıdan ilk masanı ekle.</div>
          </div>
        ) : (
          <>
            <div className="section-header">
              <div className="section-title">QR Kodlar</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Baskı için sağ tık → Resmi kaydet</span>
            </div>
            <div className="qr-grid">
              {tables.map((table, i) => (
                <QRCard key={table.id} table={table} baseUrl={BASE_URL} delay={i * 50} />
              ))}
            </div>
          </>
        )}
      </div>

      {toast && (
        <Toast key={toast.id} message={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </>
  )
}

function QRCard({ table, baseUrl, delay }) {
  const url    = `${baseUrl}/#/v/barca-cafe?t=${table.qr_token}`
  const qrSrc  = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(url)}`

  return (
    <div className="qr-card" style={{ animationDelay: `${delay}ms` }}>
      <img className="qr-card__img" src={qrSrc} alt={`QR - ${table.label}`} loading="lazy" />
      <div className="qr-card__label">{table.label}</div>
      <div className="qr-card__token">{table.qr_token.slice(0, 20)}…</div>
      <a href={qrSrc} download={`jukely-qr-${table.label}.png`}
        className="btn btn-outline"
        style={{ fontSize: '0.75rem', padding: '6px 14px', width: '100%', justifyContent: 'center' }}>
        ↓ İndir
      </a>
    </div>
  )
}
