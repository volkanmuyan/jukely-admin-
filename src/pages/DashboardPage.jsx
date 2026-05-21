import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../hooks/useSocket'
import SpotifyPlayer from '../components/SpotifyPlayer'
import StatCard     from '../components/StatCard'
import api          from '../api/client'

const MOCK_STATS = { played: 47, active: 12, tables: 3, uptime: '6s 14dk' }

export default function DashboardPage() {
  const { token, company } = useAuth()
  const { queue, connected } = useSocket(token)
  const [dashboard, setDashboard] = useState(null)
  const [spotifyOk, setSpotifyOk] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => { setDashboard(r.data); setSpotifyOk(!!r.data.spotify) })
      .catch(() => {})
  }, [])

  const stats = dashboard
    ? [
        { label: 'Bugün Çalınan', value: MOCK_STATS.played,  color: 'green', sub: 'şarkı' },
        { label: 'Kuyrukta',      value: queue.length,        color: 'pink',  sub: 'şarkı bekliyor' },
        { label: 'Aktif Masa',    value: dashboard.spotify ? MOCK_STATS.tables : '—', color: 'blue', sub: 'QR aktif' },
        { label: 'Çalışma Süresi',value: MOCK_STATS.uptime,  color: 'gold',  sub: 'bu oturumda' },
      ]
    : []

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar__title">Dashboard</div>
          <div className="topbar__sub">
            {connected
              ? <span style={{ color: 'var(--green)' }}>● Canlı bağlantı aktif</span>
              : <span style={{ color: 'var(--text-3)' }}>○ Bağlanıyor…</span>}
          </div>
        </div>
        {!spotifyOk && (
          <a href="/api/auth/spotify" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            ♫ &nbsp;Spotify Bağla
          </a>
        )}
      </div>

      <div className="page-content">
        {stats.length > 0 && (
          <div className="stats-grid">
            {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 60} />)}
          </div>
        )}

        <SpotifyPlayer />

        <div className="section-header">
          <div>
            <div className="section-title">Son Eklenen Şarkılar</div>
            <div className="section-sub">{queue.length} şarkı kuyrukta</div>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/queue')}>
            Tümünü Gör →
          </button>
        </div>

        {queue.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎼</div>
            <div className="empty-state__title">Kuyruk boş</div>
            <div className="empty-state__sub">Müşteriler QR kodu taratarak şarkı ekleyebilir.</div>
          </div>
        ) : (
          <div className="queue-table">
            {queue.slice(0, 5).map((item, i) => (
              <MiniRow key={item.id} item={item} idx={i} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function MiniRow({ item, idx }) {
  return (
    <div className={`queue-row${item.is_paid ? ' is-paid' : ''}`} style={{ animationDelay: `${idx * 50}ms` }}>
      <span className="queue-row__pos">#{item.position}</span>
      <img className="queue-row__art" src={item.album_art_url || `https://picsum.photos/seed/${item.spotify_track_id}/80/80`} alt="" />
      <div className="queue-row__info">
        <div className="queue-row__title">{item.track_name}</div>
        <div className="queue-row__artist">{item.artist_name}</div>
      </div>
      {item.is_paid && <span className="fastpass-badge">⚡ FAST PASS</span>}
      {item.upvotes > 0 && (
        <div className={`vote-count${item.upvotes > 0 ? ' has-votes' : ''}`}>▲ {item.upvotes}</div>
      )}
    </div>
  )
}
