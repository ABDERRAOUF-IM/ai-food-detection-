import { Trash2, Clock, Flame, Calendar, ChevronRight } from 'lucide-react'
import React from 'react'

export default function MealHistory({ history, onClear }) {
  if (!history.length) return (
    <div className="glass-card" style={{
      textAlign:'center', padding:80,
      color: 'var(--text-muted)', background:'rgba(30, 41, 59, 0.4)'
    }}>
      <div style={{ background: 'rgba(51, 65, 85, 0.2)', padding: 24, borderRadius: '50%', width: 100, height: 100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Clock size={56} style={{ opacity:.3 }}/>
      </div>
      <p style={{ fontWeight:700, fontSize: 20, color: 'var(--text-main)' }}>No History Found</p>
      <p style={{ fontSize:15, marginTop:8, maxWidth: 300, margin: '8px auto', opacity: 0.7 }}>
        Start by uploading an image in the Detect tab to build your log.
      </p>
    </div>
  )

  return (
    <div className="animate-fade-in" style={{ display:'flex', flexDirection:'column', gap:32 }}>

      {/* Header with Stats */}
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'flex-end'
      }}>
        <div>
          <h2 style={{ color:'#f0fdf4', fontWeight:800, fontSize: 28, letterSpacing: '-0.02em' }}>
            Personal Log
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tracked {history.length} meals total</p>
        </div>
        <button onClick={onClear} className="btn-ghost" style={{ color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', padding: '10px 18px', background: 'rgba(239,68,68,0.05)' }}>
          <Trash2 size={16}/> Wipe History
        </button>
      </div>

      {/* Meals Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[...history].reverse().map((meal, i) => (
          <div key={i} className="glass-card" style={{
            padding: 24, display: 'flex', gap: 24, alignItems: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              width: 70, height: 70, borderRadius: 16, border: '1px solid var(--border)',
              display: 'flex', flexWrap: 'wrap', overflow: 'hidden', padding: 4, gap: 2,
              justifyContent: 'center', alignItems: 'center', shrink: 0
            }}>
              {meal.detections.slice(0, 4).map((_, idx) => (
                <div key={idx} style={{ width: 28, height: 28, background: 'var(--primary)', borderRadius: 4, opacity: 0.2 + (idx * 0.2) }}></div>
              ))}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, alignItems: 'center' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Calendar size={14} color="var(--primary)"/>
                  <span style={{ color:'var(--text-main)', fontSize:14, fontWeight:600 }}>
                    {new Date(meal.timestamp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span style={{ color:'var(--text-muted)', fontSize:12, marginBottom: -2 }}>
                    at {new Date(meal.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, background: 'rgba(249,115,22,0.1)', padding: '6px 12px', borderRadius: 20 }}>
                  <Flame size={14} color="#f97316"/>
                  <span style={{ color:'#f97316', fontWeight:800, fontSize: 14 }}>
                    {Math.round(meal.total_calories)} kcal
                  </span>
                </div>
              </div>

              {/* Tags Section */}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {meal.detections.map((d, j) => (
                  <span key={j} style={{
                    background:'rgba(255,255,255,0.03)', border:'1px solid var(--border)',
                    borderRadius:8, padding:'4px 10px',
                    fontSize:12, color:'var(--text-muted)', textTransform: 'capitalize'
                  }}>
                    {d.food_name.replace(/_/g,' ')}
                  </span>
                ))}
              </div>

              {/* Progress Summary */}
              <div style={{
                display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap:24, marginTop:20,
                padding:'12px 20px', background:'rgba(15, 23, 42, 0.4)',
                borderRadius:12, fontSize:12
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                   <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PROTEIN</p>
                   <p style={{ color: '#3b82f6', fontWeight: 800, fontSize: 15 }}>{meal.total_protein}g</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                   <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>CARBS</p>
                   <p style={{ color: '#eab308', fontWeight: 800, fontSize: 15 }}>{meal.total_carbs}g</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                   <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>FAT</p>
                   <p style={{ color: '#a855f7', fontWeight: 800, fontSize: 15 }}>{meal.total_fat}g</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}