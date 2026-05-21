export const MOCK_QUEUE = [
  {
    id: 'q1', position: 1, spotify_track_id: 'tr01',
    track_name: 'Blinding Lights', artist_name: 'The Weeknd', album_name: 'After Hours',
    album_art_url: 'https://picsum.photos/seed/adm_q1/300/300',
    duration_ms: 200000, upvotes: 5, is_paid: true, session_token: 'sess_abc',
  },
  {
    id: 'q2', position: 2, spotify_track_id: 'tr02',
    track_name: 'Levitating', artist_name: 'Dua Lipa', album_name: 'Future Nostalgia',
    album_art_url: 'https://picsum.photos/seed/adm_q2/300/300',
    duration_ms: 203000, upvotes: 3, is_paid: false, session_token: 'sess_def',
  },
  {
    id: 'q3', position: 3, spotify_track_id: 'tr03',
    track_name: 'Watermelon Sugar', artist_name: 'Harry Styles', album_name: 'Fine Line',
    album_art_url: 'https://picsum.photos/seed/adm_q3/300/300',
    duration_ms: 174000, upvotes: 2, is_paid: false, session_token: 'sess_ghi',
  },
  {
    id: 'q4', position: 4, spotify_track_id: 'tr04',
    track_name: 'Shape of You', artist_name: 'Ed Sheeran', album_name: '÷',
    album_art_url: 'https://picsum.photos/seed/adm_q4/300/300',
    duration_ms: 234000, upvotes: 1, is_paid: false, session_token: 'sess_jkl',
  },
  {
    id: 'q5', position: 5, spotify_track_id: 'tr05',
    track_name: 'Şımarık', artist_name: 'Tarkan', album_name: 'Ölürüm Sana',
    album_art_url: 'https://picsum.photos/seed/adm_q5/300/300',
    duration_ms: 234000, upvotes: 0, is_paid: false, session_token: 'sess_mno',
  },
]

export const MOCK_TABLES = [
  { id: 't1', company_id: 'demo-company-uuid', label: 'Masa 1', qr_token: 'tok_masa1_demo_abc123', is_active: true, scans: 12 },
  { id: 't2', company_id: 'demo-company-uuid', label: 'Masa 2', qr_token: 'tok_masa2_demo_def456', is_active: true, scans: 8  },
  { id: 't3', company_id: 'demo-company-uuid', label: 'Teras',  qr_token: 'tok_teras_demo_ghi789', is_active: true, scans: 24 },
]

export const MOCK_STATS = {
  played:  47,
  active:   3,
  uptime:  '6s 14dk',
}

export const MOCK_NOW_PLAYING = {
  track_name:    'Blinding Lights',
  artist_name:   'The Weeknd',
  album_name:    'After Hours',
  album_art_url: 'https://picsum.photos/seed/adm_np/300/300',
  duration_ms:   200000,
}
