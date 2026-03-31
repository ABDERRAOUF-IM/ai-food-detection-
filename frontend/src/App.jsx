import React, { useState, useEffect } from 'react'
import UploadSection  from './components/UploadSection'
import ResultsCard    from './components/ResultsCard'
import MealHistory    from './components/MealHistory'
import NutritionChart from './components/NutritionChart'
import { Utensils, History, BarChart3, Zap, Info } from 'lucide-react'

const API = 'http://localhost:8001'

export default function App() {
  const [tab,     setTab]     = useState('detect')
  const [result,  setResult]  = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => { fetchHistory() }, [])

  const fetchHistory = async () => {
    try {
      const r = await fetch(`${API}/history`)
      if (!r.ok) return
      const d = await r.json()
      setHistory(d.meals || [])
    } catch (err) {
      console.error("Failed to fetch history:", err)
    }
  }

  const handleDetect = async (file) => {
    setLoading(true); setError(''); setResult(null)
    const form = new FormData()
    form.append('file', file)
    try {
      const r = await fetch(`${API}/detect`, { method:'POST', body: form })
      if (!r.ok) {
        const errorData = await r.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Detection failed. Please check the backend connection.')
      }
      const d = await r.json()
      setResult(d)
      fetchHistory()
      setTab('detect')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClearHistory = async () => {
    try {
      await fetch(`${API}/history`, { method: 'DELETE' })
      setHistory([])
    } catch (err) {
      setError("Failed to clear history")
    }
  }

  const tabs = [
    { id:'detect',  label:'Detect',  icon: Utensils  },
    { id:'history', label:'History', icon: History   },
    { id:'charts',  label:'Charts',  icon: BarChart3 },
  ]

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header style={{
        background: 'linear-gradient(135deg,rgba(22, 101, 52, 0.9),rgba(21, 128, 61, 0.9))',
        backdropFilter: 'blur(10px)',
        padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="glass-card" style={{ padding: 10, borderRadius: 12, border: 'none', background: 'rgba(255,255,255,0.1)' }}>
            <Zap size={32} color="#86efac" />
          </div>
          <div>
            <h1 style={{ fontSize:26, fontWeight:700, color:'#f0fdf4', letterSpacing: '-0.02em' }}>
              AI Food Detector
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize:12, color:'#86efac', fontWeight: 600 }}>YOLOv8 ENGINE</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span style={{ fontSize:12, color:'#86efac', opacity: 0.8 }}>UECFOOD-256</span>
            </div>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.2)', border: 'none' }}>
           <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></div>
           <span style={{ fontSize: 13, fontWeight: 600, color: '#86efac' }}>System Online</span>
        </div>
      </header>

      {/* Tabs Menu */}
      <nav style={{
        display:'flex', justifyContent: 'center', padding:'16px', gap: 32,
        background:'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom:'1px solid var(--border)',
        position: 'sticky', top: 104, zIndex: 90
      }}>
        {tabs.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`btn-ghost ${active ? 'active' : ''}`} style={{ fontSize: 16 }}>
              <Icon size={20}/> {t.label}
            </button>
          )
        })}
      </nav>

      {/* Main Content Area */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        <div className="animate-fade-in">
          {tab === 'detect' && (
            <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
              <UploadSection onDetect={handleDetect} loading={loading} error={error}/>
              {result && <ResultsCard result={result}/>}
            </div>
          )}
          {tab === 'history' && (
            <MealHistory history={history} onClear={handleClearHistory}/>
          )}
          {tab === 'charts' && (
            <NutritionChart history={history}/>
          )}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 14, borderTop: '1px solid var(--border)', marginTop: 80 }}>
        Powered by Advanced AI Food Detection Systems • 2026
      </footer>

      <style>{`
        .app-container {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #1e293b 0%, #0f172a 100%);
        }
      `}</style>
    </div>
  )
}