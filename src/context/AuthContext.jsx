import { createContext, useContext, useState, useCallback } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token,   setToken]   = useState(() => localStorage.getItem('jukely_token'))
  const [company, setCompany] = useState(() => {
    try { return JSON.parse(localStorage.getItem('jukely_company') || 'null') }
    catch { return null }
  })

  const login = useCallback(async (email, password) => {
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

  return (
    <AuthContext.Provider value={{ token, company, login, logout, isAuthed: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
