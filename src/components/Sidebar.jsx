import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', icon: '◈', label: 'Dashboard' },
  { to: '/queue',     icon: '♫', label: 'Canlı Kuyruk' },
  { to: '/tables',    icon: '⬡', label: 'Masalar & QR' },
  { to: '/settings',  icon: '⚙', label: 'Ayarlar' },
]

export default function Sidebar({ queueCount, spotifyConnected }) {
  const { company, logout } = useAuth()
  const navigate            = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        JUKELY
        <span>Admin Panel</span>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section-label">Menü</div>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-item__icon">{icon}</span>
            {label}
            {label === 'Canlı Kuyruk' && queueCount > 0 && (
              <span className="nav-item__badge">{queueCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="spotify-status">
          <div className={`spotify-status__dot ${spotifyConnected ? 'connected' : 'disconnected'}`} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {spotifyConnected ? 'Spotify Bağlı' : 'Spotify Bağlı Değil'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-3)', marginTop: 1 }}>
              {company?.name || '—'}
            </div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          ⎋ &nbsp;Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
