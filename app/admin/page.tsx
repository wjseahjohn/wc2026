'use client';
import { useState, useEffect } from 'react';
import { GROUPS } from '@/lib/data';

const BET_LABELS: Record<string,string> = {
  '1x2':'1X2','ou':'O/U','btts':'BTTS','htft':'HT/FT',
  'score':'Score','goals':'Goals','ou_over':'O/U','ou_under':'O/U',
  'btts_yes':'BTTS','btts_no':'BTTS','total_goals':'Goals',
  'correct_score':'Score','winner':'Winner','scorer':'Scorer',
};

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<any>(null);
  const [allBets, setAllBets] = useState<any[]>([]);
  const [saving, setSaving] = useState('');
  const [msg, setMsg] = useState('');
  const [view, setView] = useState<'results'|'bets'>('bets');

  useEffect(() => {
    if (authed) {
      fetch('/api/matches').then(r=>r.json()).then(setData);
      fetch('/api/bets').then(r=>r.json()).then(setAllBets);
    }
  }, [authed]);

  function reload() {
    fetch('/api/matches').then(r=>r.json()).then(setData);
    fetch('/api/bets').then(r=>r.json()).then(setAllBets);
  }

  async function setResult(targetId: string, result: string, label: string) {
    setSaving(targetId);
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ targetId, result, adminKey: key }),
    });
    setSaving('');
    if (res.ok) {
      setMsg('Result set: ' + label + ' = ' + result);
      reload();
      setTimeout(()=>setMsg(''), 3000);
    } else { setMsg('Wrong admin key'); }
  }

  async function adminAction(body: object) {
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ...body, adminKey: key }),
    });
    if (res.ok) {
      reload();
      return true;
    }
    setMsg('Failed');
    return false;
  }

  async function deleteBet(id: string, label: string) {
    if (!confirm('Delete this bet?\n' + label)) return;
    setSaving(id);
    const ok = await adminAction({ deleteBetId: id });
    setSaving('');
    if (ok) setMsg('Bet deleted');
    setTimeout(()=>setMsg(''), 2000);
  }

  async function resetPlayer(playerName: string) {
    if (!confirm('Delete ALL bets for ' + playerName + '?')) return;
    const ok = await adminAction({ playerName });
    if (ok) setMsg('All bets cleared for ' + playerName);
    setTimeout(()=>setMsg(''), 2000);
  }

  async function resetAllBets() {
    if (!confirm('Delete ALL bets from everyone? Cannot be undone.')) return;
    const ok = await adminAction({});
    if (ok) setMsg('All bets cleared');
    setTimeout(()=>setMsg(''), 2000);
  }

  async function resetResults() {
    if (!confirm('Clear all match results?')) return;
    const ok = await adminAction({ resetResults: true });
    if (ok) setMsg('Results cleared');
    setTimeout(()=>setMsg(''), 2000);
  }

  const players: string[] = [];
  allBets.forEach((b:any) => { if (b.playerName && !players.includes(b.playerName)) players.push(b.playerName); });

  function getMatchLabel(targetId: string) {
    const mid = targetId?.split('_')[0];
    const m = (data?.matches||[]).find((x:any) => x.id === mid);
    return m ? m.homeFlag+' '+m.homeTeam+' vs '+m.awayFlag+' '+m.awayTeam : targetId;
  }

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
            <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>ADMIN PANEL</div>
            <div style={{fontSize:'12px',color:'#a0a09a'}}>Manage bets and results</div>
          </div>
          <a href="/" style={{color:'#a0a09a',textDecoration:'none',fontSize:'13px'}}>App</a>
        </div>

        {msg && (
          <div style={{padding:'10px',borderRadius:'10px',marginBottom:'16px',fontWeight:600,fontSize:'13px',background:'rgba(74,222,128,0.15)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.3)'}}>
            {msg}
          </div>
        )}

        {/* Tabs */}
        <div style={{display:'flex',gap:'6px',marginBottom:'20px'}}>
          {[['bets','Manage Bets'],['results','Set Results']].map(([v,l]) => (
            <button key={v} onClick={()=>setView(v as any)}
              style={{padding:'8px 16px',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'13px',background:view===v?'#f5c842':'rgba(255,255,255,0.08)',color:view===v?'#071f10':'#a0a09a'}}>
              {l}
            </button>
          ))}
        </div>

        {/* MANAGE BETS */}
        {view === 'bets' && (
          <div>
            {/* Danger zone */}
            <div style={{background:'rgba(248,113,113,0.08)',border:'1px solid rgba(248,113,113,0.2)',borderRadius:'12px',padding:'14px',marginBottom:'20px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#f87171',marginBottom:'10px'}}>BULK RESET</div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                <button onClick={resetAllBets}
                  style={{padding:'7px 14px',borderRadius:'8px',border:'1px solid rgba(248,113,113,0.4)',background:'rgba(248,113,113,0.1)',color:'#f87171',cursor:'pointer',fontWeight:600,fontSize:'12px'}}>
                  Delete All Bets
                </button>
                <button onClick={resetResults}
                  style={{padding:'7px 14px',borderRadius:'8px',border:'1px solid rgba(232,144,26,0.4)',background:'rgba(232,144,26,0.1)',color:'#e8901a',cursor:'pointer',fontWeight:600,fontSize:'12px'}}>
                  Clear All Results
                </button>
                {players.map(p => (
                  <button key={p} onClick={()=>resetPlayer(p)}
                    style={{padding:'7px 14px',borderRadius:'8px',border:'1px solid rgba(248,113,113,0.3)',background:'rgba(248,113,113,0.08)',color:'#f87171',cursor:'pointer',fontWeight:600,fontSize:'12px'}}>
                    Delete {p} bets
                  </button>
                ))}
              </div>
            </div>

            {/* All bets with delete buttons */}
            <div style={{fontSize:'14px',fontWeight:700,color:'#f5c842',marginBottom:'10px',letterSpacing:'1px'}}>
              ALL BETS ({allBets.length})
            </div>
            {allBets.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No bets yet.</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                {allBets.map((b:any) => (
                  <div key={b.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'12px',display:'flex',alignItems:'center',gap:'10px'}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',gap:'5px',alignItems:'center',marginBottom:'3px',flexWrap:'wrap'}}>
                        <span style={{fontWeight:700,color:'#f5c842',fontSize:'13px'}}>{b.playerName}</span>
                        <span style={{fontSize:'10px',padding:'1px 5px',borderRadius:'5px',background:'rgba(59,130,246,0.2)',color:'#60a5fa'}}>{BET_LABELS[b.betType]||b.betType}</span>
                        {b.confirmedBySGPools && <span style={{fontSize:'10px',padding:'1px 5px',borderRadius:'5px',background:'rgba(74,222,128,0.2)',color:'#4ade80'}}>Confirmed</span>}
                        {b.settled && <span style={{fontSize:'10px',padding:'1px 5px',borderRadius:'5px',background:b.actualWin>0?'rgba(74,222,128,0.2)':'rgba(248,113,113,0.2)',color:b.actualWin>0?'#4ade80':'#f87171'}}>{b.actualWin>0?'WON':'LOST'}</span>}
                      </div>
                      <div style={{fontWeight:600,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.selection}</div>
                      <div style={{fontSize:'11px',color:'#a0a09a'}}>{getMatchLabel(b.targetId)}</div>
                      {b.stake > 0 && <div style={{fontSize:'11px',color:'#a0a09a'}}>SGD ${b.stake} {b.odds > 1 ? '@ '+b.odds.toFixed(2) : ''}</div>}
                    </div>
                    <button
                      onClick={()=>deleteBet(b.id, b.playerName+' — '+b.selection)}
                      disabled={saving===b.id}
                      style={{padding:'6px 12px',borderRadius:'8px',border:'1px solid rgba(248,113,113,0.4)',background:'rgba(248,113,113,0.1)',color:'#f87171',cursor:'pointer',fontWeight:700,fontSize:'12px',flexShrink:0,opacity:saving===b.id?0.5:1}}>
                      {saving===b.id ? '...' : 'Delete'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SET RESULTS */}
        {view === 'results' && (
          <div>
            {GROUPS.map(g => (
              <div key={g} style={{marginBottom:'20px'}}>
                <div style={{fontSize:'12px',fontWeight:700,color:'#a0a09a',marginBottom:'8px',letterSpacing:'2px'}}>GROUP {g}</div>
                <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                  {(data?.matches||[]).filter((m:any)=>m.group===g).map((m:any) => {
                    const result = data.results?.[m.id];
                    return (
                      <div key={m.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'10px',padding:'12px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
                        <div>
                          <div style={{fontWeight:600,fontSize:'13px'}}>{m.homeFlag} {m.homeTeam} vs {m.awayFlag} {m.awayTeam}</div>
                          <div style={{fontSize:'11px',color:'#a0a09a'}}>{m.date} · {m.time} SGT</div>
                        </div>
                        {result ? (
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <span style={{fontSize:'12px',padding:'4px 10px',borderRadius:'20px',background:'rgba(74,222,128,0.2)',color:'#4ade80',fontWeight:700}}>
                              {result==='home'?m.homeTeam:result==='away'?m.awayTeam:'Draw'}
                            </span>
                            <button onClick={()=>setResult(m.id,'none','clear')}
                              style={{padding:'4px 8px',borderRadius:'6px',border:'1px solid rgba(248,113,113,0.4)',background:'transparent',color:'#f87171',cursor:'pointer',fontSize:'11px'}}>
                              Clear
                            </button>
                          </div>
                        ) : (
                          <div style={{display:'flex',gap:'6px'}}>
                            {[['home',m.homeTeam,'#4ade80'],['draw','Draw','#f5c842'],['away',m.awayTeam,'#f87171']].map(([sel,label,color]) => (
                              <button key={sel}
                                onClick={()=>setResult(m.id,String(sel),m.homeTeam+' vs '+m.awayTeam)}
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
        )}
      </div>
    </div>
  );
}
