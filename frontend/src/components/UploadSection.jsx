import React, { useState, useRef } from 'react'
import { Upload, Camera, Loader2, FileImage } from 'lucide-react'

export default function UploadSection({ onDetect, loading, error }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef  = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onDetect(file)
  }

  return (
    <div className="glass-card" style={{ padding: 40, background: 'rgba(30, 41, 59, 0.4)' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {/* Drop zone */}
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true)  }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => {
            e.preventDefault(); setDragging(false)
            handleFile(e.dataTransfer.files[0])
          }}
          style={{
            border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 20, padding: 64,
            textAlign: 'center', cursor: 'pointer',
            background: dragging ? 'rgba(34,197,94,0.08)' : 'rgba(15, 23, 42, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: dragging ? '0 0 20px rgba(34,197,94,0.2)' : 'none'
          }}
        >
          <input
            ref={inputRef} type="file" accept="image/*"
            style={{ display:'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
              <Loader2 size={64} color="var(--primary)" className="spinning" />
              <div>
                <p style={{ color:'var(--text-main)', fontWeight: 600, fontSize: 18 }}>Analyzing Food...</p>
                <p style={{ color:'var(--text-muted)', fontSize: 14 }}>Identifying ingredients and portions</p>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
              <div style={{
                background:'rgba(34,197,94,0.1)', borderRadius:24,
                width:88, height:88,
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow: '0 8px 16px rgba(34,197,94,0.1)'
              }}>
                <Camera size={40} color="var(--primary)"/>
              </div>
              <div>
                <p style={{ color:'var(--text-main)', fontWeight:700, fontSize: 20 }}>
                  Take or Upload a Food Photo
                </p>
                <p style={{ color:'var(--text-muted)', fontSize:15, marginTop: 4 }}>
                  JPG, PNG or WEBP (Max 10MB)
                </p>
              </div>
              <button className="btn-primary" style={{ marginTop: 8 }}>
                <Upload size={18} /> Select Image
              </button>
            </div>
          )}
        </div>

        {/* Preview Container */}
        {preview && (
          <div className="animate-fade-in" style={{
            borderRadius:16, overflow:'hidden',
            border:'1px solid var(--border)', 
            maxHeight:400, position:'relative',
            boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
          }}>
             <div style={{
               position:'absolute', top: 12, left:12, zIndex: 1,
               background: 'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)',
               padding: '4px 12px', borderRadius: 8, color: '#fff',
               fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
             }}>
               <FileImage size={14} /> Image Preview
             </div>
            <img src={preview} alt="preview"
              style={{ width:'100%', height:400, objectFit:'cover', filter: loading ? 'grayscale(0.5)' : 'none', transition: 'all .4s' }}/>
          </div>
        )}

        {/* Error Feedback */}
        {error && (
          <div className="animate-fade-in" style={{
            background:'rgba(239,68,68,0.1)', border:'1px solid #ef4444',
            borderRadius:12, padding:'16px 20px', color:'#f87171', fontSize:14,
            display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 4px 12px rgba(239,68,68,0.1)'
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <p style={{ fontWeight: 600 }}>System Error</p>
              <p style={{ opacity: 0.9 }}>{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}