'use client';
import { useState, useEffect } from 'react';
import { GROUPS } from '@/lib/data';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { if (authed) fetch('/api/matches').then(r=>r.json()).then(setData); }, [authed]);

  async function setResult(targetId: string, result: string, label: string) {
    setSaving(targetId);
    const res = await fetch('/api/matches', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ targetId, result, adminKey: key }) });
    setSaving('');
    if (res.ok) {
      setMsg('Result set: ' + label + ' = ' + result);
      fetch('/api/matches').then(r=>r.json()).then(setData);
      setTimeout(()=>setMsg(''), 3000);
    } else { setMsg('❌ Wrong admin key'); }
  }

  if (!authed) return (
    <div style={{minHeight:'100vh',background:'#071f10',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.3)',borderRadius:'16px',padding:'40px 24px',maxWidth:'360px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'36px',marginBottom:'12px'}}>🔐</div>
        <div style={{fontSize:'24px',fontWeight:900,color:'#f5c842',letterSpacing:'2px',marginBottom:'20px'}}>ADMIN</div>
        <input type="password" placeholder="Admin key..." value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&key)setAuthed(true);}}
          style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',fontSize:'16px',textAlign:'center',background:'#f0ede4',color:'#071f10',marginBottom:'12px',outline:'none',fontFamily:'inherit'}} autoFocus />
        <button onClick={()=>{if(key)setAuthed(true);}} style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:900,fontSize:'16px',background:'#f5c842',color:'#071f10',letterSpacing:'1px'}}>ENTER</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#071f10',color:'#f0ede4',padding:'16px',fontFamily:'inherit'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
          <div><div style={{fontSize:'24px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>⚙️ ADMIN PANEL</div><div style={{fontSize:'12px',color:'#a0a09a'}}>Set results to settle bets</div></div>
          <a href="/" style={{color:'#a0a09a',textDecoration:'none',fontSize:'13px'}}>← App</a>
        </div>
        {msg && <div style={{padding:'10px',borderRadius:'10px',marginBottom:'16px',background:msg.startsWith('✅')?'rgba(74,222,128,0.15)':'rgba(248,113,113,0.15)',color:msg.startsWith('✅')?'#4ade80':'#f87171',fontWeight:600,fontSize:'13px'}}>{msg}</div>}

        <div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',marginBottom:'12px',letterSpacing:'1px'}}>MATCHES</div>
        {GROUPS.map(g => (
          <div key={g} style={{marginBottom:'20px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#a0a09a',marginBottom:'8px',letterSpacing:'2px'}}>GROUP {g}</div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              {(data?.matches||[]).filter((m:any)=>m.group===g).map((m: any) => {
                const result = data.results?.[m.id];
                return (
                  <div key={m.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'12px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
                    <div style={{fontWeight:600,fontSize:'13px'}}>{m.homeFlag} {m.homeTeam} vs {m.awayFlag} {m.awayTeam} <span style={{color:'#a0a09a',fontSize:'11px'}}>({m.date})</span></div>
                    {result ? (
                      <span style={{fontSize:'12px',padding:'4px 10px',borderRadius:'20px',background:'rgba(74,222,128,0.2)',color:'#4ade80',fontWeight:700}}>✓ {result==='home'?m.homeTeam:result==='away'?m.awayTeam:'Draw'}</span>
                    ) : (
                      <div style={{display:'flex',gap:'6px'}}>
                        {[['home',m.homeTeam,'#4ade80'],['draw','Draw','#f5c842'],['away',m.awayTeam,'#f87171']].map(([sel,label,color]) => (
                          <button key={sel} onClick={()=>setResult(m.id,String(sel),m.homeTeam+' vs '+m.awayTeam)} disabled={saving===m.id}
                            style={{padding:'6px 10px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'12px',background:String(color),color:'#071f10',opacity:saving===m.id?0.5:1}}>
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',marginBottom:'12px',letterSpacing:'1px'}}>TOURNAMENT WINNER</div>
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'16px',marginBottom:'20px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:'6px'}}>
            {(data?.winners||[]).map((w: any) => {
              const result = data.results?.[w.id];
              return (
                <button key={w.id} onClick={()=>!result&&setResult(w.id,w.team,'Tournament Winner')} disabled={!!result}
                  style={{padding:'8px',borderRadius:'8px',border:'none',cursor:result?'default':'pointer',fontWeight:700,fontSize:'12px',background:result?'#4ade80':'#f5c842',color:'#071f10',opacity:result?0.7:1}}>
                  {w.flag} {w.team}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',marginBottom:'12px',letterSpacing:'1px'}}>TOP SCORER</div>
        <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'16px'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'6px'}}>
            {(data?.scorers||[]).map((s: any) => {
              const result = data.results?.[s.id];
              return (
                <button key={s.id} onClick={()=>!result&&setResult(s.id,s.player,'Top Scorer')} disabled={!!result}
                  style={{padding:'8px',borderRadius:'8px',border:'none',cursor:result?'default':'pointer',fontWeight:700,fontSize:'12px',background:result?'#4ade80':'#f5c842',color:'#071f10',opacity:result?0.7:1,textAlign:'left'}}>
                  {s.flag} {s.player}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
