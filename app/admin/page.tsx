'use client';
import { useState, useEffect } from 'react';
import { GROUPS } from '@/lib/data';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [allBets, setAllBets] = useState<any[]>([]);
  const [saving, setSaving] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (authed) {
      fetch('/api/matches').then(r=>r.json()).then(setData);
      fetch('/api/bets').then(r=>r.json()).then(setAllBets);
    }
  }, [authed]);

  async function setResult(targetId: string, result: string, label: string) {
    setSaving(targetId);
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ targetId, result, adminKey: key }),
    });
    setSaving('');
    if (res.ok) {
      setMsg('✅ Result set: ' + label + ' → ' + result);
      fetch('/api/matches').then(r=>r.json()).then(setData);
      setTimeout(()=>setMsg(''), 3000);
    } else {
      setMsg('❌ Wrong admin key');
    }
  }

  async function resetBets(playerName?: string) {
    const who = playerName ? playerName : 'EVERYONE';
    if (!confirm('Reset all bets for ' + who + '? This cannot be undone.')) return;
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ adminKey: key, playerName: playerName || null }),
    });
    if (res.ok) {
      setMsg('✅ Bets cleared for ' + who);
      fetch('/api/bets').then(r=>r.json()).then(setAllBets);
      setTimeout(()=>setMsg(''), 3000);
    } else {
      setMsg('❌ Failed — check admin key');
    }
  }

  async function resetResults() {
    if (!confirm('Clear ALL match results? This cannot be undone.')) return;
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ adminKey: key, resetResults: true }),
    });
    if (res.ok) {
      setMsg('✅ All results cleared');
      fetch('/api/matches').then(r=>r.json()).then(setData);
      setTimeout(()=>setMsg(''), 3000);
    } else {
      setMsg('❌ Failed');
    }
  }

  const players = [...new Set(allBets.map((b:any) => b.playerName))].filter(Boolean);

  if (!authed) return (
    <div style={{minHeight:'100vh',background:'#071f10',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',fontFamily:'system-ui,sans-serif'}}>
      <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.3)',borderRadius:'16px',padding:'40px 24px',maxWidth:'360px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'36px',marginBottom:'12px'}}>🔐</div>
        <div style={{fontSize:'24px',fontWeight:900,color:'#f5c842',letterSpacing:'2px',marginBottom:'20px'}}>ADMIN</div>
        <input type="password" placeholder="Admin key..." value={key}
          onChange={e=>setKey(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&key)setAuthed(true);}}
          style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',fontSize:'16px',textAlign:'center',background:'#f0ede4',color:'#071f10',marginBottom:'12px',outline:'none',fontFamily:'inherit'}} autoFocus />
        <button onClick={()=>{if(key)setAuthed(true);}}
          style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:900,fontSize:'16px',background:'#f5c842',color:'#071f10',letterSpacing:'1px'}}>
          ENTER
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#071f10',color:'#f0ede4',padding:'16px',paddingBottom:'40px',fontFamily:'system-ui,sans-serif'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
          <div>
            <div style={{fontSize:'24px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>⚙️ ADMIN PANEL</div>
            <div style={{fontSize:'12px',color:'#a0a09a'}}>Set results · Reset bets</div>
          </div>
          <a href="/" style={{color:'#a0a09a',textDecoration:'none',fontSize:'13px'}}>← App</a>
        </div>

        {msg && (
          <div style={{padding:'10px',borderRadius:'10px',marginBottom:'16px',fontWeight:600,fontSize:'13px',background:msg.startsWith('✅')?'rgba(74,222,128,0.15)':'rgba(248,113,113,0.15)',color:msg.startsWith('✅')?'#4ade80':'#f87171'}}>
            {msg}
          </div>
        )}

        {/* RESET SECTION */}
        <div style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.25)',borderRadius:'12px',padding:'16px',marginBottom:'24px'}}>
          <div style={{fontSize:'16px',fontWeight:900,color:'#f87171',marginBottom:'12px',letterSpacing:'1px'}}>🗑️ RESET BETS</div>

          {/* Reset everyone */}
          <div style={{marginBottom:'12px'}}>
            <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'6px'}}>Reset ALL bets from everyone:</div>
            <button onClick={()=>resetBets()}
              style={{padding:'8px 16px',borderRadius:'8px',border:'1px solid rgba(248,113,113,0.5)',background:'rgba(248,113,113,0.15)',color:'#f87171',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>
              🗑️ Clear All Bets
            </button>
          </div>

          {/* Reset by player */}
          {players.length > 0 && (
            <div style={{marginBottom:'12px'}}>
              <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'6px'}}>Reset bets for one person:</div>
              <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                {players.map((p:any) => (
                  <button key={p} onClick={()=>resetBets(p)}
                    style={{padding:'6px 12px',borderRadius:'8px',border:'1px solid rgba(248,113,113,0.4)',background:'rgba(248,113,113,0.1)',color:'#f87171',cursor:'pointer',fontWeight:600,fontSize:'12px'}}>
                    🗑️ {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reset results */}
          <div>
            <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'6px'}}>Clear all match results (for testing):</div>
            <button onClick={resetResults}
              style={{padding:'8px 16px',borderRadius:'8px',border:'1px solid rgba(232,144,26,0.5)',background:'rgba(232,144,26,0.15)',color:'#e8901a',cursor:'pointer',fontWeight:700,fontSize:'13px'}}>
              🔄 Clear All Results
            </button>
          </div>
        </div>

        {/* BETS OVERVIEW */}
        {allBets.length > 0 && (
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'16px',marginBottom:'24px'}}>
            <div style={{fontSize:'16px',fontWeight:900,color:'#f5c842',marginBottom:'12px',letterSpacing:'1px'}}>📊 CURRENT BETS ({allBets.length} total)</div>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {players.map((p:any) => {
                const count = allBets.filter((b:any)=>b.playerName===p).length;
                return (
                  <div key={p} style={{padding:'8px 12px',borderRadius:'8px',background:'rgba(245,200,66,0.1)',border:'1px solid rgba(245,200,66,0.2)'}}>
                    <span style={{fontWeight:700,color:'#f5c842'}}>{p}</span>
                    <span style={{color:'#a0a09a',fontSize:'12px',marginLeft:'6px'}}>{count} bets</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SET RESULTS */}
        <div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',marginBottom:'12px',letterSpacing:'1px'}}>⚽ SET MATCH RESULTS</div>
        {GROUPS.map(g => (
          <div key={g} style={{marginBottom:'20px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#a0a09a',marginBottom:'8px',letterSpacing:'2px'}}>GROUP {g}</div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              {(data?.matches||[]).filter((m:any)=>m.group===g).map((m: any) => {
                const result = data.results?.[m.id];
                return (
                  <div key={m.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'10px',padding:'12px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:'13px'}}>{m.homeFlag} {m.homeTeam} vs {m.awayFlag} {m.awayTeam}</div>
                      <div style={{fontSize:'11px',color:'#a0a09a'}}>{m.date} · {m.time} SGT</div>
                    </div>
                    {result ? (
                      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'12px',padding:'4px 10px',borderRadius:'20px',background:'rgba(74,222,128,0.2)',color:'#4ade80',fontWeight:700}}>
                          ✓ {result==='home'?m.homeTeam:result==='away'?m.awayTeam:'Draw'}
                        </span>
                        <button onClick={()=>setResult(m.id,'none','Clear result')}
                          style={{padding:'4px 8px',borderRadius:'6px',border:'1px solid rgba(248,113,113,0.4)',background:'transparent',color:'#f87171',cursor:'pointer',fontSize:'11px'}}>
                          ✕ Clear
                        </button>
                      </div>
                    ) : (
                      <div style={{display:'flex',gap:'6px'}}>
                        {[['home',m.homeTeam,'#4ade80'],['draw','Draw','#f5c842'],['away',m.awayTeam,'#f87171']].map(([sel,label,color]) => (
                          <button key={sel} onClick={()=>setResult(m.id,String(sel),m.homeTeam+' vs '+m.awayTeam)}
                            disabled={saving===m.id}
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
      </div>
    </div>
  );
}
