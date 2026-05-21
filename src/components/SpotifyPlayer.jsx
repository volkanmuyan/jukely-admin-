import { useSpotifySDK } from '../hooks/useSpotifySDK'

function fmtMs(ms) {
  const s = Math.floor((ms || 0) / 1000)
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

export default function SpotifyPlayer() {
  const { ready, track, paused, position, volume, error, togglePlay, nextTrack, prevTrack, setVolume } = useSpotifySDK()

  if (error) {
    return (
      <div className="spotify-player">
        <div className="player-disconnected" style={{ flex: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <p>Spotify bağlantı hatası: {error}</p>
          <a href="/settings" style={{ color: 'var(--green)', fontSize: '0.8rem' }}>Ayarlara git →</a>
        </div>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="spotify-player">
        <div className="player-disconnected" style={{ flex: 1 }}>
          <span style={{ fontSize: '1.5rem', animation: 'spin 2s linear infinite', display: 'inline-block' }}>◌</span>
          <p>Spotify Player yükleniyor…</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>Spotify hesabı bağlı değilse Ayarlar'dan bağlayın.</p>
        </div>
      </div>
    )
  }

  const progress = track ? Math.min(100, (position / track.duration_ms) * 100) : 0

  return (
    <div className="spotify-player">
      {track ? (
        <img
          className={`player-art${!paused ? ' spinning' : ''}`}
          src={track.album.images[0]?.url}
          alt={track.album.name}
          draggable={false}
        />
      ) : (
        <div className="player-art" style={{ background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
          ♪
        </div>
      )}

      <div className="player-info" style={{ flex: 1, minWidth: 0 }}>
        <div className="player-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          NOW PLAYING
          {!paused && <div className="player-eq">{[1,2,3,4,5].map(i=><div key={i} className="player-eq__bar" style={{height:'18px'}}/>)}</div>}
        </div>
        <div className="player-track">{track?.name ?? 'Şarkı bekleniyor…'}</div>
        <div className="player-artist">{track?.artists.map(a=>a.name).join(', ') ?? '—'}</div>

        <div className="player-controls">
          <button className="ctrl-btn" onClick={prevTrack} title="Önceki">⏮</button>
          <button className={`ctrl-btn${!paused ? ' active' : ''}`} onClick={togglePlay} style={{ fontSize: '1.3rem' }}>
            {paused ? '▶' : '⏸'}
          </button>
          <button className="ctrl-btn" onClick={nextTrack} title="Sonraki">⏭</button>

          <div className="player-progress" style={{ flex: 1, margin: '0 8px' }}>
            <div className="player-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <span style={{ fontSize: '0.7rem', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
            {fmtMs(position)} / {fmtMs(track?.duration_ms)}
          </span>

          <span style={{ fontSize: '0.8rem', marginLeft: 8 }}>🔊</span>
          <input
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: 60, accentColor: 'var(--green)', cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  )
}
