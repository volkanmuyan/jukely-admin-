import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onDone }) {
  const [out, setOut] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 2600)
    const t2 = setTimeout(onDone, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div className="toast-portal">
      <div className={`toast toast-${type}${out ? ' exiting' : ''}`}>
        <span>{type === 'success' ? '✓' : '⚠'}</span>
        <span>{message}</span>
      </div>
    </div>
  )
}
