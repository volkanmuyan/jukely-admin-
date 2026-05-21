import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth }   from '../context/AuthContext'
import { useSocket } from '../hooks/useSocket'
import SpotifyPlayer from '../components/SpotifyPlayer'
import StatCard      from '../components/StatCard'
import api           from '../api/client'
import { MOCK_QUEUE, MOCK_STATS } from '../data/mockData'

export default function DashboardPage() {
  const { token, company, isDemo } = useAuth()
  const { queue: liveQueue, connected } = useSocket(isDemo ? null : token)
  const [spotifyOk, setSpotifyOk]  = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isDemo) return
    api.get('/admin/dashboard')
      .then(r => setSpotifyOk(!!r.data.spotify))
      .catch(() => {})
  }, [isDemo])

  // Demo uses mock queue, live uses socket queue
  const queue = isDemo
    ? MOCK_QUEUE
    : (connected ? liveQueue : [])

  const stats = [
    { label: 'Bugün Çalınan',  value: MOCK_STATS.played,  color: 'green', sub: 'şarkı',           delay: 0   },
    { label: 'Kuyrukta',       value: queue.length,         color: 'pink',  sub: 'şarkı bekliyor',  delay: 60  },
    { label: 'Aktif Masa',     value: MOCK_STATS.active,    color: 'blue',  sub: 'QR aktif',        delay: 120 },
    { label: 'Çalışma Süresi', value: MOCK_STATS.uptime,    color: 'gold',  sub: 'bu oturumda',     delay: 180 },
  ]

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar__title">Dashboard</div>
          <div className="topbar__sub">
            {isDemo
              ? <span style={{ color: 'var(--gold)' }}>◈ Demo Modu — gerçek veri yok</span>
              : connected
                ? <span style={{ color: 'var(--green)' }}>● Canlı bağlantı aktif</span>
                : <span style={{ color: 'var(--text-3)' }}>○ Bağlanıyor…</span>}
          </div>
        </div>
        {!isDemo && !spotifyOk && (
          <a href="/api/auth/spotify" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            ♫ &nbsp;Spotify Bağla
          </a>
        )}
        {isDemo && (
          <span style={{
            fontSize: '0.72rem', padding: '5px 12px',
            background: 'var(--gold-20)', color: 'var(--gold)',
            border: '1px solid rgba(255,215,0,0.25)', borderRadius: 'var(--r-f)',
          }}>
            Demo
          </span>
        )}
      </div>

      <div className="page-content">
        <div className="stats-grid">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {!isDemo && <SpotifyPlayer />}

        {isDemo && (
          <div className="card card--glow" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
            <div style={{ fontSize: '2rem' }}>🎵</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Blinding Lights</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', marginTop: 2 }}>The Weeknd · After Hours</div>
              <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, width: 220 }}>
                <div style={{ width: '43%', height: '100%', background: 'linear-gradient(90deg,var(--green),#5affd4)', borderRadius: 99, boxShadow: '0 0 8px rgba(0,255,136,.6)' }} />
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-3)' }}>
              Demo Player<br />(Backend gerekli)
            </div>
          </div>
        )}

        <div className="section-header">
          <div>
            <div className="section-title">Kuyruk</div>
            <div className="section-sub">{queue.length} şarkı</div>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/queue')}>
            Tümünü Gör →
          </button>
        </div>

        {queue.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎼</div>
            <div className="empty-state__title">Kuyruk boş</div>
            <div className="empty-state__sub">Müşteriler QR kodu okutarak şarkı ekleyebilir.</div>
          </div>
        ) : (
          <div className="queue-table">
            {queue.slice(0, 5).map((item, i) => (
              <div key={item.id} className={`queue-row${item.is_paid ? ' is-paid' : ''}`}
                style={{ animationDelay: `${i * 50}ms` }}>
                <span className="queue-row__pos">#{item.position}</span>
                <img className="queue-row__art"
                  src={item.album_art_url || `https://picsum.photos/seed/${item.spotify_track_id}/80/80`}
                  alt="" />
                <div className="queue-row__info">
                  <div className="queue-row__title">{item.track_name}</div>
                  <div className="queue-row__artist">{item.artist_name}</div>
                </div>
                {item.is_paid && <span className="fastpass-badge">⚡ FAST PASS</span>}
                {item.upvotes > 0 && (
                  <div className="vote-count has-votes">▲ {item.upvotes}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
