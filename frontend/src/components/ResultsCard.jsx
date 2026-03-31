import { CheckCircle, Flame, Beef, Wheat, Droplets, Target, Scale, Zap } from 'lucide-react'
import React from 'react'

const MacroBox = ({ icon: Icon, label, value, unit, color }) => (
  <div className="glass-card" style={{
    padding: '24px 20px',
    display:'flex', flexDirection:'column', gap:8,
    border:`1px solid ${color}22`, flex:1, minWidth:140,
    background: `${color}08`
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Icon size={20} color={color}/>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
    <div style={{ marginTop: 4 }}>
      <span style={{ fontSize:28, fontWeight:800, color }}>{value}</span>
      <span style={{ fontSize:14, color: 'var(--text-muted)', marginLeft: 4, fontWeight: 500 }}>{unit}</span>
    </div>
  </div>
)

export default function ResultsCard({ result }) {
  if (!result?.success) return null

  return (
    <div className="animate-fade-in" style={{ display:'flex', flexDirection:'column', gap:32 }}>
      
      {/* Success Badge */}
      <div style={{
        background:'rgba(34, 197, 94, 0.1)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius:20, padding:'24px 32px',
        display:'flex', alignItems:'center', justifyContent: 'space-between',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'var(--primary)', padding: 10, borderRadius: '50%' }}>
            <CheckCircle size={24} color="#fff"/>
          </div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f0fdf4' }}>{result.message}</h3>
            <p style={{ fontSize:13, color:'var(--text-muted)', marginTop: 4 }}>
              Processed at {new Date(result.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>MEAL ID</p>
           <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>#{result.meal_id}</p>
        </div>
      </div>

      {/* Main Nutrition Grid */}
      <div>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.1em' }}>
           Nutritional Summary
        </h4>
        <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
          <MacroBox icon={Flame}    label="Calories" value={result.total_calories} unit="kcal" color="#f97316"/>
          <MacroBox icon={Beef}     label="Protein"  value={result.total_protein}  unit="g"    color="#3b82f6"/>
          <MacroBox icon={Wheat}    label="Carbs"    value={result.total_carbs}    unit="g"    color="#eab308"/>
          <MacroBox icon={Droplets} label="Fat"      value={result.total_fat}      unit="g"    color="#a855f7"/>
        </div>
      </div>

      {/* Itemized Detections */}
      <div>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.1em' }}>
           Detected Items ({result.detections.length})
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {result.detections.map((d, i) => (
            <div key={i} className="glass-card" style={{ padding: 24 }}>
              <div style={{
                display:'flex', justifyContent:'space-between',
                alignItems:'center', marginBottom:20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Zap size={20} color="var(--primary)" />
                  </div>
                  <h3 style={{
                    fontSize:18, fontWeight:700, color: 'var(--text-main)',
                    textTransform:'capitalize'
                  }}>
                    {d.food_name.replace(/_/g,' ')}
                  </h3>
                </div>
                <div style={{
                  background: d.confidence > 0.7 ? 'rgba(34,197,94,0.2)' : 'rgba(202,138,4,0.2)',
                  color: d.confidence > 0.7 ? '#4ade80' : '#facc15', 
                  borderRadius:12, padding:'6px 14px', fontSize:13, fontWeight: 700,
                  border: `1px solid ${d.confidence > 0.7 ? 'rgba(34,197,94,0.2)' : 'rgba(202,138,4,0.2)'}`
                }}>
                  {(d.confidence * 100).toFixed(1)}% Match
                </div>
              </div>

              <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                {/* Portion Info */}
                <div style={{
                  background:'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)', borderRadius:12, padding:16, flex:1, minWidth: 200
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Scale size={14} color="var(--text-muted)" />
                    <p style={{ color:'var(--text-muted)', fontSize:11, fontWeight: 700, textTransform: 'uppercase' }}>ESTIMATED PORTION</p>
                  </div>
                  <p style={{ fontSize: 18, fontWeight:700, color:'var(--text-main)' }}>
                    {d.portion.grams}g
                    <span style={{
                      marginLeft:12, fontSize:13, fontWeight: 600,
                      padding: '2px 10px', borderRadius: 20,
                      background: d.portion.label === 'large'  ? 'rgba(239,68,68,0.15)' :
                             d.portion.label === 'medium' ? 'rgba(249,115,22,0.15)' :
                             d.portion.label === 'small'  ? 'rgba(234,179,8,0.15)' : 'rgba(34,197,94,0.15)',
                      color: d.portion.label === 'large'  ? '#f87171' :
                             d.portion.label === 'medium' ? '#fb923c' :
                             d.portion.label === 'small'  ? '#facc15' : '#4ade80'
                    }}>
                      {d.portion.label.toUpperCase()}
                    </span>
                  </p>
                </div>

                {/* Nutrition Highlights */}
                <div style={{ display: 'flex', gap: 12, flex: 2, minWidth: 250 }}>
                   <div style={{ background:'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.2)', borderRadius:12, padding:16, flex: 1 }}>
                      <p style={{ color:'#f97316', fontSize:11, fontWeight: 700, marginBottom: 4 }}>CALORIES</p>
                      <p style={{ fontSize: 18, fontWeight:700, color:'#f97316' }}>{d.nutrition.calories} <span style={{fontSize: 12, opacity: 0.8}}>kcal</span></p>
                   </div>
                   <div style={{ background:'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius:12, padding:16, flex: 1 }}>
                      <p style={{ color:'#3b82f6', fontSize:11, fontWeight: 700, marginBottom: 4 }}>PROTEIN</p>
                      <p style={{ fontSize: 18, fontWeight:700, color:'#3b82f6' }}>{d.nutrition.protein_g} <span style={{fontSize: 12, opacity: 0.8}}>g</span></p>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}