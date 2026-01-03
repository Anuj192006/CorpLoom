import { useState, useEffect } from 'react'
import './App.css'
import Auth from './components/Auth'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="badge pulse" style={{ marginTop: '20vh' }}>
        Initializing CorpLoom...
      </div>
    )
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />
  }

  return (
    <div className="dashboard-container">
      <div className="user-header">
        <div>
          <div className="badge">
            <div className="dot pulse"></div>
            Session Active
          </div>
          <h1 style={{ textAlign: 'left', fontSize: '2.5rem' }}>Welcome, {user.name || 'User'}</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>
            Account: {user.email}
          </p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      <div className="glass-card" style={{ maxWidth: 'none', textAlign: 'left' }}>
        <h2 style={{ marginBottom: '1.5rem', fontWeight: '600' }}>Your Dashboard</h2>
        <p style={{ color: 'var(--text-dim)', lineHeight: '1.8' }}>
          Welcome to the official **CorpLoom** workspace. Your account is secured with JWT encryption 
          and your data is stored in our Prisma-managed PostgreSQL database.
        </p>
        
        <div style={{ 
          marginTop: '2rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Profile Status</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Verified Member</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Data Sync</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Live Connection</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
