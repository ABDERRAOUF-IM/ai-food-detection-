import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'
import { BarChart3, TrendingUp, PieChart as PieIcon } from 'lucide-react'
import React from 'react'

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#a855f7']

export default function NutritionChart({ history }) {
  if (!history.length) return (
    <div className="glass-card" style={{
      textAlign:'center', padding:80,
      color: 'var(--text-muted)', background:'rgba(30, 41, 59, 0.4)'
    }}>
      <div style={{ background: 'rgba(51, 65, 85, 0.2)', padding: 24, borderRadius: '50%', width: 100, height: 100, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <BarChart3 size={56} style={{ opacity:.3 }}/>
      </div>
      <p style={{ fontWeight:700, fontSize: 20, color: 'var(--text-main)' }}>No Data Visualized</p>
      <p style={{ fontSize:15, marginTop:8, maxWidth: 300, margin: '8px auto', opacity: 0.7 }}>
        Log meals to see your nutritional insights and trends.
      </p>
    </div>
  )

  // Daily calories bar chart
  const dailyData = history.reduce((acc, meal) => {
    const day = new Date(meal.timestamp).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })
    const existing = acc.find(d => d.day === day)
    if (existing) { existing.calories += meal.total_calories }
    else acc.push({ day, calories: Math.round(meal.total_calories) })
    return acc
  }, [])

  // Macros pie chart (total)
  const totals = history.reduce((acc, m) => ({
    protein: acc.protein + m.total_protein,
    carbs:   acc.carbs   + m.total_carbs,
    fat:     acc.fat     + m.total_fat,
  }), { protein:0, carbs:0, fat:0 })

  const pieData = [
    { name:'Protein', value: Math.round(totals.protein) },
    { name:'Carbs',   value: Math.round(totals.carbs)   },
    { name:'Fat',     value: Math.round(totals.fat)      },
  ]

  const tooltipStyle = {
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    color: '#e2e8f0',
    padding: '8px 12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(8px)'
  }

  return (
    <div className="animate-fade-in" style={{ display:'flex', flexDirection:'column', gap:32 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
        
        {/* Calories Trend */}
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: 10, borderRadius: 12 }}>
               <TrendingUp size={24} color="#f97316" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Daily Energy Log</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Calories trend over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill:'#64748b', fontSize:12 }} dy={10}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fill:'#64748b', fontSize:12 }} dx={-10}/>
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(34,197,94,0.05)' }}/>
              <Bar dataKey="calories" fill="url(#colorCal)" radius={[8,8,0,0]} barSize={40} />
              <defs>
                 <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.2}/>
                 </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Global Distribution */}
        <div className="glass-card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: 10, borderRadius: 12 }}>
               <PieIcon size={24} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Nutrient Balance</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Aggregate macro distribution</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%"
                innerRadius={60} outerRadius={100} paddingAngle={8}
                dataKey="value" stroke="none">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i+1]}/>
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle}/>
              <Legend verticalAlign="bottom" height={36} iconType="circle"
                formatter={(val) => <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600 }}>{val}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}