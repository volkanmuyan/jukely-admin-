import { useState, useEffect, useRef } from 'react'
import api from '../api/client'

export function useSpotifySDK() {
  const playerRef   = useRef(null)
  const [ready,       setReady]       = useState(false)
  const [deviceId,    setDeviceId]    = useState(null)
  const [track,       setTrack]       = useState(null)
  const [paused,      setPaused]      = useState(true)
  const [position,    setPosition]    = useState(0)   // ms
  const [volume,      setVolume]      = useState(0.8)
  const [sdkLoaded,   setSdkLoaded]   = useState(false)
  const [error,       setError]       = useState(null)

  // Step 1: Load SDK script once
  useEffect(() => {
    if (window.Spotify || document.getElementById('spotify-sdk')) {
      setSdkLoaded(true)
      return
    }
    const script   = document.createElement('script')
    script.id      = 'spotify-sdk'
    script.src     = 'https://sdk.scdn.co/spotify-player.js'
    script.async   = true
    document.body.appendChild(script)

    window.onSpotifyWebPlaybackSDKReady = () => setSdkLoaded(true)
  }, [])

  // Step 2: Init player once SDK is ready + access token available
  useEffect(() => {
    if (!sdkLoaded) return

    async function init() {
      try {
        // Get Spotify access token from our backend
        const { data } = await api.get('/admin/spotify/player-token')
        const spotifyToken = data.accessToken

        const player = new window.Spotify.Player({
          name:   'Jukely Admin Player',
          volume: volume,
          getOAuthToken: (cb) => cb(spotifyToken),
        })

        player.addListener('ready', ({ device_id }) => {
          setDeviceId(device_id)
          setReady(true)
          // Register device with backend so queue can target it
          api.post('/auth/spotify/device', { deviceId: device_id })
        })

        player.addListener('not_ready', () => setReady(false))

        player.addListener('player_state_changed', (state) => {
          if (!state) return
          setTrack(state.track_window.current_track)
          setPaused(state.paused)
          setPosition(state.position)
        })

        player.addListener('initialization_error', ({ message }) => setError(message))
        player.addListener('authentication_error',  ({ message }) => setError(message))
        player.addListener('account_error',         ({ message }) => setError(message))

        await player.connect()
        playerRef.current = player
      } catch (err) {
        setError(err.message)
      }
    }

    init()
    return () => { playerRef.current?.disconnect() }
  }, [sdkLoaded])   // intentionally not in deps: volume

  // Progress ticker
  useEffect(() => {
    if (paused || !track) return
    const id = setInterval(() => setPosition((p) => p + 1000), 1000)
    return () => clearInterval(id)
  }, [paused, track])

  const togglePlay  = () => playerRef.current?.togglePlay()
  const nextTrack   = () => playerRef.current?.nextTrack()
  const prevTrack   = () => playerRef.current?.previousTrack()
  const setVol      = (v) => { setVolume(v); playerRef.current?.setVolume(v) }

  return { ready, deviceId, track, paused, position, volume, error, togglePlay, nextTrack, prevTrack, setVolume: setVol }
}
