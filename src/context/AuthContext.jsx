import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

// Demo credentials — work without a running backend
const DEMO_USER     = 'admin'
const DEMO_PASSWORD = 'admin'
const DEMO_COMPANY  = {
  id:          'demo-company-uuid',
  name:        'Barca Café',
  slug:        'barca-cafe',
  owner_email: 'admin@jukely.demo',
  plan_name:   'Pro',
  api_mode:    'shared',
  allow_explicit:          false,
  songs_per_user_per_hour: 3,
  fast_pass_enabled:       true,
  fast_pass_price:         '1.00',
}
const DEMO_TOKEN = 'demo_jwt_token_not_for_production'

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(() => localStorage.getItem('jukely_token'))
  const [company, setCompany] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jukely_company') || 'null') }
    catch { return null }
  })

  const login = useCallback(async (email, password) => {
    // Demo mode: admin / admin — works without backend
    if (
      (email === DEMO_USER || email === 'admin@jukely.demo') &&
      password === DEMO_PASSWORD
    ) {
      localStorage.setItem('jukely_token',   DEMO_TOKEN)
      localStorage.setItem('jukely_company', JSON.stringify(DEMO_COMPANY))
      setToken(DEMO_TOKEN)
      setCompany(DEMO_COMPANY)
      return { token: DEMO_TOKEN, company: DEMO_COMPANY }
    }

    // Real backend login
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('jukely_token',   data.token)
    localStorage.setItem('jukely_company', JSON.stringify(data.company))
    setToken(data.token)
    setCompany(data.company)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('jukely_token')
    localStorage.removeItem('jukely_company')
    setToken(null)
    setCompany(null)
  }, [])

  const isDemo = token === DEMO_TOKEN

  return (
    <AuthContext.Provider value={{ token, company, login, logout, isAuthed: !!token, isDemo }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
