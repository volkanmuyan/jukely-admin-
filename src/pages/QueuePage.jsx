import { useState, useCallback, useRef } from 'react'
import { useAuth }   from '../context/AuthContext'
import { useSocket } from '../hooks/useSocket'
import Toast         from '../components/Toast'
import api           from '../api/client'

function fmtMs(ms) {
  const s = Math.floor((ms || 0) / 1000)
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

export default function QueuePage() {
  const { token }                    = useAuth()
  const { queue, connected, emit }   = useSocket(token)
  const [toast, setToast]            = useState(null)
  const toastId                      = useRef(0)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: ++toastId.current, message, type })
  }, [])

  const handlePlayed = useCallback(async (item) => {
    try {
      emit('admin:song_played', { queueId: item.id })
      showToast(`"${item.track_name}" oynandı olarak işaretlendi`)
    } catch { showToast('İşlem başarısız', 'error') }
  }, [emit, showToast])

  const handleRemove = useCallback(async (item) => {
    try {
      emit('admin:remove_song', { queueId: item.id })
      showToast(`"${item.track_name}" kuyruktan kaldırıldı`)
    } catch { showToast('İşlem başarısız', 'error') }
  }, [emit, showToast])

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar__title">Canlı Kuyruk</div>
          <div className="topbar__sub">
            {connected
              ? <span style={{ color: 'var(--green)' }}>● Gerçek zamanlı</span>
              : <span style={{ color: 'var(--text-3)' }}>○ Bağlanıyor…</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
            {queue.length} şarkı
          </span>
        </div>
      </div>

      <div className="page-content">
        {queue.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🎼</div>
            <div className="empty-state__title">Kuyruk boş</div>
            <div className="empty-state__sub">Müşteriler QR kodu okutarak şarkı ekleyebilir.</div>
          </div>
        ) : (
          <>
            {queue.some(i => i.is_paid) && (
              <>
                <div className="divider">⚡ Fast Pass</div>
                <div className="queue-table" style={{ marginBottom: 20 }}>
                  {queue.filter(i => i.is_paid).map((item, idx) => (
                    <QueueRow key={item.id} item={item} idx={idx}
                      onPlayed={handlePlayed} onRemove={handleRemove} />
                  ))}
                </div>
              </>
            )}

            <div className="divider">♫ Normal Sıra</div>
            <div className="queue-table">
              {queue.filter(i => !i.is_paid).map((item, idx) => (
                <QueueRow key={item.id} item={item} idx={idx}
                  onPlayed={handlePlayed} onRemove={handleRemove} />
              ))}
            </div>
          </>
        )}
      </div>

      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </>
  )
}

function QueueRow({ item, idx, onPlayed, onRemove }) {
  return (
    <div className={`queue-row${item.is_paid ? ' is-paid' : ''}`} style={{ animationDelay: `${idx * 45}ms` }}>
      <span className="queue-row__pos">#{item.position}</span>

      <img
        className="queue-row__art"
        src={item.album_art_url || `https://picsum.photos/seed/${item.spotify_track_id}/80/80`}
        alt={item.album_name}
        draggable={false}
      />

      <div className="queue-row__info">
        <div className="queue-row__title">{item.track_name}</div>
        <div className="queue-row__artist">
          {item.artist_name}
          {item.session_token && (
            <span style={{ marginLeft: 6, opacity: 0.5 }}>
              · {item.session_token.slice(0, 8)}…
            </span>
          )}
        </div>
      </div>

      <div className="queue-row__meta">
        <span style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{fmtMs(item.duration_ms)}</span>

        {item.is_paid && <span className="fastpass-badge">⚡ FAST PASS</span>}

        <div className={`vote-count${item.upvotes > 0 ? ' has-votes' : ''}`}>
          ▲ {item.upvotes}
        </div>

        <button
          className="icon-btn icon-btn-play"
          onClick={() => onPlayed(item)}
          title="Çalındı olarak işaretle"
        >
          ✓
        </button>

        <button
          className="icon-btn icon-btn-remove"
          onClick={() => onRemove(item)}
          title="Kuyruktan kaldır"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
