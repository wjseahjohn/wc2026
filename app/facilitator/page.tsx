'use client';
import { useState, useEffect } from 'react';
import { GROUPS } from '@/lib/data';

const BET_TYPES = [
  {v:'1x2',l:'1X2 (Win/Draw/Win)'},
  {v:'handicap',l:'Asian Handicap'},
  {v:'over_under',l:'Over/Under Goals'},
  {v:'btts',l:'Both Teams To Score'},
  {v:'correct_score',l:'Correct Score'},
  {v:'first_goal',l:'First Goal Scorer'},
  {v:'winner',l:'Tournament Winner'},
  {v:'scorer',l:'Top Scorer (Golden Boot)'},
];

interface FBet {
  id: string; playerName: string; matchLabel: string; betType: string;
  selection: string; odds: number; stake: number; potentialWin: number;
  placed: boolean; createdAt: string;
}

export default function FacilitatorPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [fbets, setFbets] = useState<FBet[]>([]);
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<'add'|'list'|'players'>('list');
  const [activeGroup, setActiveGroup] = useState('A');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ playerName:'', matchId:'', betType:'1x2', selection:'', odds:'', stake:'' });

  useEffect(() => {
    if (authed) {
      fetch('/api/matches').then(r=>r.json()).then(setData);
      const s = localStorage.getItem('fbets');
      if (s) setFbets(JSON.parse(s));
    }
  }, [authed]);

  function save(updated: FBet[]) { localStorage.setItem('fbets', JSON.stringify(updated)); setFbets(updated); }

  function addBet() {
    if (!form.playerName || !form.selection || !form.odds || !form.stake) { setMsg('❌ Fill all fields'); return; }
    const match = data?.matches?.find((m: any) => m.id === form.matchId);
    const odds = parseFloat(form.odds), stake = parseFloat(form.stake);
    const bet: FBet = {
      id: `f${Date.now()}`, playerName: form.playerName.trim(),
      matchLabel: match ? `${match.homeTeam} vs ${match.awayTeam}` : (form.betType==='winner'?'Tournament Winner':form.betType==='scorer'?'Top Scorer':'—'),
      betType: form.betType, selection: form.selection, odds, stake,
      potentialWin: Math.round(odds * stake * 100) / 100,
      placed: false, createdAt: new Date().toISOString(),
    };
    save([...fbets, bet]);
    setForm(f => ({...f, selection:'', odds:'', stake:''}));
    setMsg(`✅ Added: ${bet.playerName} — ${bet.selection}`);
    setTimeout(()=>setMsg(''), 3000);
  }

  function toggle(id: string) { save(fbets.map(b => b.id===id ? {...b, placed:!b.placed} : b)); }
  function del(id: string) { if (confirm('Delete?')) save(fbets.filter(b=>b.id!==id)); }

  function exportCSV() {
    const rows = [['Player','Match','Type','Selection','Odds','Stake $','Potential Win','Placed'],...fbets.map(b=>[b.playerName,b.matchLabel,b.betType,b.selection,b.odds,b.stake,b.potentialWin.toFixed(2),b.placed?'Yes':'No'])];
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='wc2026_bets.csv'; a.click();
  }

  const unplaced = fbets.filter(b=>!b.placed);
  const placed = fbets.filter(b=>b.placed);
  const groupMatches = (g: string) => (data?.matches||[]).filter((m: any)=>m.group===g);
  const selectedMatch = data?.matches?.find((m: any)=>m.id===form.matchId);

  // unique player names - avoid Set spread for TS compat
  const playerSet: Record<string, boolean> = {};
  fbets.forEach(b => { playerSet[b.playerName] = true; });
  const players = Object.keys(playerSet);

  if (!authed) return (
    <div style={{minHeight:'100vh',background:'#071f10',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.3)',borderRadius:'16px',padding:'40px 24px',maxWidth:'360px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px',marginBottom:'6px'}}>FACILITATOR</div>
        <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'20px'}}>Record bets to place on SGPools</div>
        <input type="password" placeholder="Admin key..." value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&key)setAuthed(true);}}
          style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',fontSize:'16px',textAlign:'center',background:'#f0ede4',color:'#071f10',marginBottom:'12px',outline:'none',fontFamily:'inherit'}} autoFocus />
        <button onClick={()=>{if(key)setAuthed(true);}} style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:900,fontSize:'16px',background:'#f5c842',color:'#071f10',letterSpacing:'1px'}}>ENTER</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#071f10',color:'#f0ede4',paddingBottom:'40px',fontFamily:'inherit'}}>
      {/* Header */}
      <div style={{position:'sticky',top:0,zIndex:40,background:'rgba(7,31,16,0.97)',borderBottom:'1px solid rgba(245,200,66,0.2)',backdropFilter:'blur(12px)',padding:'12px 16px'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <div><div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>📋 FACILITATOR</div><div style={{fontSize:'11px',color:'#a0a09a'}}>Track → Place on SGPools</div></div>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <button onClick={exportCSV} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'11px'}}>📥 CSV</button>
              <a href="/" style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',color:'#a0a09a',textDecoration:'none',fontSize:'11px'}}>← App</a>
            </div>
          </div>
          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'6px',marginBottom:'10px'}}>
            {[
              {l:'To Place',v:unplaced.length,c:'#e8901a'},
              {l:'Placed',v:placed.length,c:'#4ade80'},
              {l:'Staked $',v:`$${placed.reduce((s,b)=>s+b.stake,0).toFixed(0)}`,c:'#4ade80'},
              {l:'Potential',v:`$${placed.reduce((s,b)=>s+b.potentialWin,0).toFixed(0)}`,c:'#f5c842'},
            ].map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'8px',textAlign:'center'}}>
                <div style={{fontWeight:900,fontSize:'16px',color:s.c}}>{s.v}</div>
                <div style={{fontSize:'10px',color:'#a0a09a'}}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:'6px'}}>
            {[{id:'add',l:'➕ Add'},{id:'list',l:`📋 Bets (${fbets.length})`},{id:'players',l:'👥 Players'}].map(t=>(
              <button key={t.id} onClick={()=>setView(t.id as any)}
                style={{padding:'6px 12px',borderRadius:'20px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,background:view===t.id?'#f5c842':'transparent',color:view===t.id?'#071f10':'#a0a09a'}}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'16px'}}>
        {msg && <div style={{padding:'10px',borderRadius:'10px',marginBottom:'12px',background:msg.startsWith('✅')?'rgba(74,222,128,0.15)':'rgba(248,113,113,0.15)',color:msg.startsWith('✅')?'#4ade80':'#f87171',fontWeight:600,fontSize:'13px'}}>{msg}</div>}

        {/* ADD */}
        {view === 'add' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>RECORD A BET</div>

            <div><div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px',letterSpacing:'1px'}}>FAMILY MEMBER</div>
              <input value={form.playerName} onChange={e=>setForm(f=>({...f,playerName:e.target.value}))} placeholder="e.g. Dad, Mum, John..." style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} /></div>

            <div><div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px',letterSpacing:'1px'}}>SGPOOLS BET TYPE</div>
              <select value={form.betType} onChange={e=>setForm(f=>({...f,betType:e.target.value,matchId:''}))} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'14px',fontFamily:'inherit'}}>
                {BET_TYPES.map(bt=><option key={bt.v} value={bt.v}>{bt.l}</option>)}
              </select></div>

            {!['winner','scorer'].includes(form.betType) && (
              <div>
                <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px',letterSpacing:'1px'}}>MATCH</div>
                <div style={{display:'flex',gap:'4px',overflowX:'auto',marginBottom:'8px',paddingBottom:'2px',scrollbarWidth:'none'}}>
                  {GROUPS.map(g=><button key={g} onClick={()=>setActiveGroup(g)} style={{padding:'6px 12px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,flexShrink:0,fontSize:'12px',background:activeGroup===g?'#f5c842':'rgba(255,255,255,0.08)',color:activeGroup===g?'#071f10':'#a0a09a'}}>{g}</button>)}
                </div>
                <select value={form.matchId} onChange={e=>setForm(f=>({...f,matchId:e.target.value}))} style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontSize:'14px',fontFamily:'inherit'}}>
                  <option value="">Select match...</option>
                  {groupMatches(activeGroup).map((m:any)=><option key={m.id} value={m.id}>{m.homeFlag} {m.homeTeam} vs {m.awayFlag} {m.awayTeam} · {m.date}</option>)}
                </select>
                {selectedMatch && (
                  <div style={{marginTop:'8px',background:'rgba(255,255,255,0.05)',borderRadius:'10px',padding:'12px'}}>
                    <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'8px',fontWeight:700}}>SGPOOLS ODDS REFERENCE</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px',marginBottom:'6px',textAlign:'center'}}>
                      {[['1X2',selectedMatch.homeTeam,selectedMatch.odds1x2.home],['1X2','Draw',selectedMatch.odds1x2.draw],['1X2',selectedMatch.awayTeam,selectedMatch.odds1x2.away]].map(([type,label,odd]:any,i)=>(
                        <div key={i} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'8px'}}>
                          <div style={{fontSize:'10px',color:'#a0a09a'}}>{label}</div>
                          <div style={{fontWeight:900,fontSize:'18px',color:'#f5c842'}}>{Number(odd).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'6px',textAlign:'center'}}>
                      {[['O2.5',selectedMatch.oddsOU.over],['U2.5',selectedMatch.oddsOU.under],['BTTS Y',selectedMatch.oddsBTTS.yes],['BTTS N',selectedMatch.oddsBTTS.no]].map(([label,odd]:any,i)=>(
                        <div key={i} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'6px'}}>
                          <div style={{fontSize:'10px',color:'#a0a09a'}}>{label}</div>
                          <div style={{fontWeight:700,fontSize:'14px',color:'#f0ede4'}}>{Number(odd).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    {selectedMatch.handicapLine && <div style={{marginTop:'6px',fontSize:'11px',color:'#a0a09a',textAlign:'center'}}>Handicap {selectedMatch.handicapLine}: {selectedMatch.homeTeam} {selectedMatch.handicapOdds.home} / {selectedMatch.awayTeam} {selectedMatch.handicapOdds.away}</div>}
                  </div>
                )}
              </div>
            )}

            <div><div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px',letterSpacing:'1px'}}>SELECTION / PICK</div>
              <input value={form.selection} onChange={e=>setForm(f=>({...f,selection:e.target.value}))}
                placeholder={form.betType==='1x2'?'e.g. Brazil Win / Draw / Morocco Win':form.betType==='handicap'?'e.g. Brazil -1':form.betType==='over_under'?'e.g. Over 2.5':form.betType==='btts'?'Yes or No':form.betType==='correct_score'?'e.g. 2-1':form.betType==='first_goal'?'e.g. Mbappe (France)':form.betType==='winner'?'e.g. Brazil':'e.g. Mbappe'}
                style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} /></div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <div><div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px',letterSpacing:'1px'}}>ODDS (from SGPools)</div>
                <input type="number" step="0.01" value={form.odds} onChange={e=>setForm(f=>({...f,odds:e.target.value}))} placeholder="e.g. 1.85" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} /></div>
              <div><div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px',letterSpacing:'1px'}}>STAKE (SGD $)</div>
                <input type="number" step="1" value={form.stake} onChange={e=>setForm(f=>({...f,stake:e.target.value}))} placeholder="e.g. 10" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} /></div>
            </div>

            {form.odds && form.stake && (
              <div style={{padding:'12px',borderRadius:'10px',textAlign:'center',border:'1px solid rgba(245,200,66,0.3)',background:'rgba(245,200,66,0.05)'}}>
                <span style={{color:'#a0a09a'}}>Potential payout: </span>
                <span style={{fontWeight:900,fontSize:'22px',color:'#f5c842'}}>${(parseFloat(form.stake)*parseFloat(form.odds)).toFixed(2)}</span>
              </div>
            )}

            <button onClick={addBet} style={{padding:'14px',borderRadius:'12px',border:'none',cursor:'pointer',fontWeight:900,fontSize:'16px',letterSpacing:'1px',background:'#f5c842',color:'#071f10'}}>➕ ADD BET</button>
          </div>
        )}

        {/* LIST */}
        {view === 'list' && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
              <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>ALL BETS</div>
              {unplaced.length>0 && <span style={{fontSize:'11px',padding:'4px 8px',borderRadius:'20px',background:'rgba(232,144,26,0.2)',color:'#e8901a',fontWeight:700}}>{unplaced.length} to place on SGPools</span>}
            </div>
            {fbets.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No bets yet. Go to Add!</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {unplaced.length>0 && <div style={{fontSize:'11px',color:'#e8901a',fontWeight:700,letterSpacing:'2px',marginBottom:'4px'}}>⚠ NOT YET PLACED ON SGPOOLS</div>}
                {unplaced.map(b=><BCard key={b.id} b={b} onToggle={toggle} onDel={del}/>)}
                {placed.length>0 && <div style={{fontSize:'11px',color:'#4ade80',fontWeight:700,letterSpacing:'2px',margin:'8px 0 4px'}}>✓ PLACED ON SGPOOLS</div>}
                {placed.map(b=><BCard key={b.id} b={b} onToggle={toggle} onDel={del}/>)}
              </div>
            )}
          </div>
        )}

        {/* PLAYERS */}
        {view === 'players' && (
          <div>
            <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px',marginBottom:'12px'}}>BY PLAYER</div>
            {players.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No bets yet.</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {players.map(player => {
                  const pb = fbets.filter(b=>b.playerName===player);
                  const total = pb.reduce((s,b)=>s+b.stake,0);
                  const potential = pb.reduce((s,b)=>s+b.potentialWin,0);
                  return (
                    <div key={player} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.15)',borderRadius:'12px',padding:'16px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
                        <div style={{fontWeight:900,fontSize:'18px',color:'#f5c842'}}>{player}</div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontWeight:900,fontSize:'16px',color:'#4ade80'}}>${total.toFixed(2)}</div>
                          <div style={{fontSize:'11px',color:'#a0a09a'}}>total staked</div>
                        </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                        {pb.map(b=>(
                          <div key={b.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 10px',borderRadius:'8px',background:'rgba(255,255,255,0.04)'}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontWeight:700,fontSize:'13px'}}>{b.selection}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a'}}>{b.matchLabel}</div>
                            </div>
                            <div style={{textAlign:'right',flexShrink:0,marginLeft:'8px'}}>
                              <div style={{fontWeight:700,fontSize:'12px',color:'#f5c842'}}>${b.stake} @ {b.odds}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a'}}>→ ${b.potentialWin.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{marginTop:'8px',padding:'8px',borderRadius:'8px',background:'rgba(245,200,66,0.08)',display:'flex',justifyContent:'space-between'}}>
                        <span style={{fontSize:'12px',color:'#a0a09a'}}>{pb.length} bets · {pb.filter(b=>b.placed).length} placed</span>
                        <span style={{fontSize:'12px',color:'#f5c842',fontWeight:700}}>Max win: ${potential.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BCard({b, onToggle, onDel}: {b: FBet; onToggle:(id:string)=>void; onDel:(id:string)=>void}) {
  return (
    <div style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${b.placed?'rgba(74,222,128,0.2)':'rgba(232,144,26,0.3)'}`,borderRadius:'10px',padding:'12px',display:'flex',alignItems:'flex-start',gap:'10px'}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px',flexWrap:'wrap'}}>
          <span style={{fontWeight:900,color:'#f5c842',fontSize:'14px'}}>{b.playerName}</span>
          <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'8px',background:'rgba(59,130,246,0.2)',color:'#60a5fa',fontWeight:600}}>{BET_TYPES.find(x=>x.v===b.betType)?.l||b.betType}</span>
        </div>
        <div style={{fontWeight:700,fontSize:'13px',marginBottom:'2px'}}>{b.selection}</div>
        <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px'}}>{b.matchLabel}</div>
        <div style={{display:'flex',gap:'10px',fontSize:'11px'}}>
          <span style={{color:'#a0a09a'}}>Odds: <span style={{color:'#f5c842',fontWeight:700}}>{b.odds}</span></span>
          <span style={{color:'#a0a09a'}}>Stake: <span style={{color:'#4ade80',fontWeight:700}}>${b.stake}</span></span>
          <span style={{color:'#a0a09a'}}>Win: <span style={{color:'#f5c842',fontWeight:700}}>${b.potentialWin.toFixed(2)}</span></span>
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'6px',alignItems:'flex-end',flexShrink:0}}>
        <button onClick={()=>onDel(b.id)} style={{background:'none',border:'none',color:'#a0a09a',cursor:'pointer',fontSize:'14px'}}>✕</button>
        <button onClick={()=>onToggle(b.id)}
          style={{padding:'6px 10px',borderRadius:'8px',border:`1px solid ${b.placed?'rgba(74,222,128,0.4)':'rgba(232,144,26,0.4)'}`,background:b.placed?'rgba(74,222,128,0.15)':'transparent',color:b.placed?'#4ade80':'#e8901a',cursor:'pointer',fontWeight:700,fontSize:'11px',whiteSpace:'nowrap'}}>
          {b.placed?'✓ Placed':'Mark Placed'}
        </button>
      </div>
    </div>
  );
}
