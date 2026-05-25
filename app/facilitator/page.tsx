'use client';
import { useState, useEffect } from 'react';
import { GROUPS } from '@/lib/data';

const BET_TYPES = [
  {v:'1x2',l:'1X2 (Win/Draw/Win)'},
  {v:'htft',l:'Half Time / Full Time'},
  {v:'correct_score',l:'Correct Score'},
  {v:'total_goals',l:'Total Goals (0-1, 2-3, 4+)'},
  {v:'handicap',l:'Asian Handicap'},
  {v:'ou_over',l:'Over/Under Goals'},
  {v:'btts_yes',l:'Both Teams To Score'},
  {v:'winner',l:'Tournament Winner'},
  {v:'scorer',l:'Top Scorer (Golden Boot)'},
];

interface FBet {
  id: string; dbId?: string; playerName: string; matchId: string; matchLabel: string;
  betType: string; selection: string; odds: number; stake: number;
  potentialWin: number; placed: boolean; createdAt: string;
}

export default function FacilitatorPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [fbets, setFbets] = useState<FBet[]>([]);
  const [data, setData] = useState<any>(null);
  const [view, setView] = useState<'add'|'confirm'|'byMatch'|'byPlayer'>('add');
  const [activeGroup, setActiveGroup] = useState('A');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({playerName:'',matchId:'',betType:'1x2',selection:'',odds:'',stake:''});
  const [dbBets, setDbBets] = useState<any[]>([]);

  useEffect(() => {
    if (authed) {
      fetch('/api/matches').then(r=>r.json()).then(setData);
      fetch('/api/bets').then(r=>r.json()).then(setDbBets);
      const s = localStorage.getItem('fbets');
      if (s) setFbets(JSON.parse(s));
    }
  }, [authed]);

  function save(updated: FBet[]) { localStorage.setItem('fbets', JSON.stringify(updated)); setFbets(updated); }

  function addBet() {
    if (!form.playerName || !form.selection || !form.odds || !form.stake) { setMsg('❌ Fill all fields'); return; }
    const match = data?.matches?.find((m:any) => m.id === form.matchId);
    const odds = parseFloat(form.odds), stake = parseFloat(form.stake);
    const bet: FBet = {
      id: `f${Date.now()}`,
      playerName: form.playerName.trim(),
      matchId: form.matchId,
      matchLabel: match ? `${match.homeTeam} vs ${match.awayTeam} (${match.date})` : (form.betType==='winner'?'Tournament Winner':form.betType==='scorer'?'Top Scorer':'—'),
      betType: form.betType, selection: form.selection, odds, stake,
      potentialWin: Math.round(odds * stake * 100) / 100,
      placed: false, createdAt: new Date().toISOString(),
    };
    save([...fbets, bet]);
    setForm(f => ({...f, selection:'', odds:'', stake:''}));
    setMsg(`✅ ${bet.playerName} — ${bet.selection} @ ${bet.odds}`);
    setTimeout(()=>setMsg(''), 3000);
  }

  async function toggle(id: string) {
    const bet = fbets.find(b=>b.id===id);
    if (!bet) return;
    const newPlaced = !bet.placed;
    save(fbets.map(b => b.id===id ? {...b, placed:newPlaced} : b));
    // Sync to database so players see confirmation status
    if (newPlaced && bet.dbId) {
      await fetch('/api/bets', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ action: 'confirm', betIds: [bet.dbId] }),
      });
    }
  }
  function del(id: string) { if (confirm('Delete this bet?')) save(fbets.filter(b=>b.id!==id)); }

  function exportCSV() {
    const rows = [
      ['Player','Match','Bet Type','Selection','Odds','Stake SGD','Potential Win','Placed'],
      ...fbets.map(b=>[b.playerName,b.matchLabel,b.betType,b.selection,b.odds,'$'+b.stake,'$'+b.potentialWin.toFixed(2),b.placed?'Yes':'No'])
    ];
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='wc2026_bets.csv'; a.click();
  }

  const groupMatches = (g: string) => (data?.matches||[]).filter((m:any)=>m.group===g);
  const selectedMatch = data?.matches?.find((m:any)=>m.id===form.matchId);
  const unplaced = fbets.filter(b=>!b.placed);
  const placed = fbets.filter(b=>b.placed);

  // Group bets by matchLabel
  const matchGroups: Record<string, FBet[]> = {};
  fbets.forEach(b => {
    if (!matchGroups[b.matchLabel]) matchGroups[b.matchLabel] = [];
    matchGroups[b.matchLabel].push(b);
  });

  // Group bets by player
  const playerGroups: Record<string, FBet[]> = {};
  fbets.forEach(b => {
    if (!playerGroups[b.playerName]) playerGroups[b.playerName] = [];
    playerGroups[b.playerName].push(b);
  });

  const totalStaked = placed.reduce((s,b)=>s+b.stake,0);
  const totalPotential = placed.reduce((s,b)=>s+b.potentialWin,0);

  if (!authed) return (
    <div style={{minHeight:'100vh',background:'#071f10',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',fontFamily:'system-ui,sans-serif'}}>
      <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.3)',borderRadius:'16px',padding:'40px 24px',maxWidth:'360px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px',marginBottom:'4px'}}>FACILITATOR</div>
        <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'20px'}}>Record & track bets for SGPools</div>
        <input type="password" placeholder="Admin key..." value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&key)setAuthed(true);}}
          style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',fontSize:'16px',textAlign:'center',background:'#f0ede4',color:'#071f10',marginBottom:'12px',outline:'none',fontFamily:'inherit'}} autoFocus />
        <button onClick={()=>{if(key)setAuthed(true);}} style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:900,fontSize:'16px',background:'#f5c842',color:'#071f10',letterSpacing:'1px'}}>ENTER</button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#071f10',color:'#f0ede4',paddingBottom:'40px',fontFamily:'system-ui,sans-serif'}}>
      {/* Header */}
      <div style={{position:'sticky',top:0,zIndex:40,background:'rgba(7,31,16,0.97)',borderBottom:'1px solid rgba(245,200,66,0.2)',backdropFilter:'blur(12px)',padding:'12px 16px'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <div>
              <div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>📋 FACILITATOR</div>
              <div style={{fontSize:'11px',color:'#a0a09a'}}>Track → Place on SGPools</div>
            </div>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={exportCSV} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'11px'}}>📥 CSV</button>
              <a href="/" style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',color:'#a0a09a',textDecoration:'none',fontSize:'11px'}}>← App</a>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'6px',marginBottom:'10px'}}>
            {[
              {l:'To Place',v:unplaced.length,c:'#e8901a'},
              {l:'Placed',v:placed.length,c:'#4ade80'},
              {l:'Staked',v:'$'+totalStaked.toFixed(0),c:'#4ade80'},
              {l:'Potential',v:'$'+totalPotential.toFixed(0),c:'#f5c842'},
            ].map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'7px',textAlign:'center'}}>
                <div style={{fontWeight:900,fontSize:'15px',color:s.c}}>{s.v}</div>
                <div style={{fontSize:'10px',color:'#a0a09a'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{display:'flex',gap:'4px'}}>
            {[{id:'add',l:'➕ Add Bet'},{id:'confirm',l:'✓ Confirm'},{id:'byMatch',l:'🗓 By Match'},{id:'byPlayer',l:'👥 By Player'}].map(t=>(
              <button key={t.id} onClick={()=>setView(t.id as any)}
                style={{padding:'6px 12px',borderRadius:'20px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,background:view===t.id?'#f5c842':'transparent',color:view===t.id?'#071f10':'#a0a09a'}}>
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'16px'}}>
        {msg && <div style={{padding:'10px',borderRadius:'10px',marginBottom:'12px',fontWeight:600,fontSize:'13px',background:msg.startsWith('✅')?'rgba(74,222,128,0.15)':'rgba(248,113,113,0.15)',color:msg.startsWith('✅')?'#4ade80':'#f87171'}}>{msg}</div>}

        {/* ADD BET */}
        {view === 'add' && (
          <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
            <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>RECORD A BET</div>

            <Field label="FAMILY MEMBER">
              <input value={form.playerName} onChange={e=>setForm(f=>({...f,playerName:e.target.value}))} placeholder="e.g. Dad, Mum, John..."
                style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} />
            </Field>

            <Field label="SGPOOLS BET TYPE">
              <select value={form.betType} onChange={e=>setForm(f=>({...f,betType:e.target.value,matchId:''}))}
                style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'14px',fontFamily:'inherit'}}>
                {BET_TYPES.map(bt=><option key={bt.v} value={bt.v}>{bt.l}</option>)}
              </select>
            </Field>

            {!['winner','scorer'].includes(form.betType) && (
              <Field label="MATCH">
                <div style={{display:'flex',gap:'4px',overflowX:'auto',marginBottom:'8px',paddingBottom:'2px',scrollbarWidth:'none'}}>
                  {GROUPS.map(g=>(
                    <button key={g} onClick={()=>setActiveGroup(g)}
                      style={{padding:'5px 11px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,flexShrink:0,fontSize:'12px',background:activeGroup===g?'#f5c842':'rgba(255,255,255,0.08)',color:activeGroup===g?'#071f10':'#a0a09a'}}>
                      {g}
                    </button>
                  ))}
                </div>
                <select value={form.matchId} onChange={e=>setForm(f=>({...f,matchId:e.target.value}))}
                  style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontSize:'14px',fontFamily:'inherit'}}>
                  <option value="">Select match...</option>
                  {groupMatches(activeGroup).map((m:any)=>(
                    <option key={m.id} value={m.id}>{m.homeFlag} {m.homeTeam} vs {m.awayFlag} {m.awayTeam} · {m.date}</option>
                  ))}
                </select>

                {selectedMatch && (
                  <div style={{marginTop:'8px',background:'rgba(255,255,255,0.05)',borderRadius:'10px',padding:'10px'}}>
                    <div style={{fontSize:'11px',color:'#4ade80',fontWeight:700}}>✓ {selectedMatch.homeTeam} vs {selectedMatch.awayTeam} · {selectedMatch.date} · {selectedMatch.time} SGT</div>
                    <div style={{fontSize:'11px',color:'#a0a09a',marginTop:'2px'}}>{selectedMatch.venue}</div>
                  </div>
                )}
              </Field>
            )}

            <Field label="SELECTION / PICK">
              <input value={form.selection} onChange={e=>setForm(f=>({...f,selection:e.target.value}))}
                placeholder={
                  form.betType==='1x2'?'e.g. Brazil Win / Draw / Morocco Win':
                  form.betType==='htft'?'e.g. Draw / Brazil (HT result / FT result)':
                  form.betType==='correct_score'?'e.g. 2-1 or 0-0':
                  form.betType==='total_goals'?'e.g. 2-3 Goals':
                  form.betType==='handicap'?'e.g. Brazil -1':
                  form.betType==='ou_over'?'e.g. Over 2.5 / Under 1.5':
                  form.betType==='btts_yes'?'Yes or No':
                  form.betType==='winner'?'e.g. Brazil':'e.g. Mbappe'
                }
                style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} />
            </Field>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Field label="ODDS (from SGPools)">
                <input type="number" step="0.01" value={form.odds} onChange={e=>setForm(f=>({...f,odds:e.target.value}))} placeholder="e.g. 1.85"
                  style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} />
              </Field>
              <Field label="STAKE (SGD $)">
                <input type="number" step="1" value={form.stake} onChange={e=>setForm(f=>({...f,stake:e.target.value}))} placeholder="e.g. 10"
                  style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:600,fontSize:'15px',outline:'none',fontFamily:'inherit'}} />
              </Field>
            </div>

            {form.odds && form.stake && (
              <div style={{padding:'12px',borderRadius:'10px',textAlign:'center',border:'1px solid rgba(245,200,66,0.3)',background:'rgba(245,200,66,0.05)'}}>
                <span style={{color:'#a0a09a',fontSize:'13px'}}>Potential payout: </span>
                <span style={{fontWeight:900,fontSize:'22px',color:'#f5c842'}}>${(parseFloat(form.stake)*parseFloat(form.odds)).toFixed(2)}</span>
              </div>
            )}

            <button onClick={addBet} style={{padding:'14px',borderRadius:'12px',border:'none',cursor:'pointer',fontWeight:900,fontSize:'16px',letterSpacing:'1px',background:'#f5c842',color:'#071f10'}}>
              ➕ ADD BET
            </button>
          </div>
        )}

        {/* CONFIRM BETS FROM DB */}
        {view === 'confirm' && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
              <div>
                <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>CONFIRM WITH SGPOOLS</div>
                <div style={{fontSize:'12px',color:'#a0a09a'}}>Mark each bet as placed on SGPools</div>
              </div>
              <button onClick={()=>fetch('/api/bets').then(r=>r.json()).then(setDbBets)}
                style={{padding:'6px 12px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.2)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'12px'}}>
                Refresh
              </button>
            </div>
            {dbBets.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No bets in database yet.</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {/* Group by player */}
                {Array.from(new Set(dbBets.map((b:any)=>b.playerName))).map((player:any) => {
                  const pb = dbBets.filter((b:any)=>b.playerName===player);
                  const confirmed = pb.filter((b:any)=>b.confirmedBySGPools).length;
                  return (
                    <div key={player} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',overflow:'hidden'}}>
                      <div style={{padding:'10px 14px',background:'rgba(245,200,66,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontWeight:900,fontSize:'16px',color:'#f5c842'}}>{player}</div>
                        <div style={{fontSize:'11px',color:'#a0a09a'}}>{confirmed}/{pb.length} confirmed</div>
                      </div>
                      {pb.map((b:any) => (
                        <div key={b.id} style={{padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',background:b.confirmedBySGPools?'rgba(74,222,128,0.04)':'transparent'}}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:600,fontSize:'13px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.selection}</div>
                            <div style={{fontSize:'11px',color:'#a0a09a'}}>
                              {b.betType}
                              {b.stake > 0 && <span style={{color:'#4ade80',marginLeft:'6px'}}>SGD ${b.stake}</span>}
                            </div>
                          </div>
                          <button
                            onClick={async ()=>{
                              await fetch('/api/bets', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'confirm',betIds:[b.id]})});
                              fetch('/api/bets').then(r=>r.json()).then(setDbBets);
                            }}
                            disabled={b.confirmedBySGPools}
                            style={{padding:'5px 10px',borderRadius:'8px',border:'1px solid '+(b.confirmedBySGPools?'rgba(74,222,128,0.4)':'rgba(232,144,26,0.4)'),background:b.confirmedBySGPools?'rgba(74,222,128,0.15)':'transparent',color:b.confirmedBySGPools?'#4ade80':'#e8901a',cursor:b.confirmedBySGPools?'default':'pointer',fontWeight:700,fontSize:'11px',whiteSpace:'nowrap',flexShrink:0}}>
                            {b.confirmedBySGPools ? '✓ Confirmed' : 'Confirm'}
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BY MATCH */}
        {view === 'byMatch' && (
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
              <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>BETS BY MATCH</div>
              {unplaced.length > 0 && <span style={{fontSize:'11px',padding:'4px 8px',borderRadius:'20px',background:'rgba(232,144,26,0.2)',color:'#e8901a',fontWeight:700}}>{unplaced.length} to place</span>}
            </div>

            {fbets.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No bets recorded yet.</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
                {Object.entries(matchGroups).map(([matchLabel, matchBets]) => {
                  const matchStaked = matchBets.reduce((s,b)=>s+b.stake,0);
                  const matchPlaced = matchBets.filter(b=>b.placed).length;
                  return (
                    <div key={matchLabel} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',overflow:'hidden'}}>
                      {/* Match header */}
                      <div style={{padding:'10px 14px',background:'rgba(245,200,66,0.08)',borderBottom:'1px solid rgba(255,255,255,0.08)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div style={{fontWeight:700,fontSize:'13px',color:'#f5c842'}}>{matchLabel}</div>
                        <div style={{display:'flex',gap:'10px',fontSize:'11px',color:'#a0a09a'}}>
                          <span>{matchBets.length} bets</span>
                          <span style={{color:'#4ade80'}}>Total: {'$'+matchStaked.toFixed(0)}</span>
                          <span>{matchPlaced}/{matchBets.length} placed</span>
                        </div>
                      </div>
                      {/* Bets in this match */}
                      <div style={{display:'flex',flexDirection:'column',gap:'1px'}}>
                        {matchBets.map(b => (
                          <div key={b.id} style={{padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px',borderBottom:'1px solid rgba(255,255,255,0.05)',background:b.placed?'rgba(74,222,128,0.04)':'transparent'}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:'flex',gap:'5px',alignItems:'center',marginBottom:'2px',flexWrap:'wrap'}}>
                                <span style={{fontWeight:700,color:'#f5c842',fontSize:'13px'}}>{b.playerName}</span>
                                <span style={{fontSize:'10px',padding:'1px 5px',borderRadius:'6px',background:'rgba(59,130,246,0.2)',color:'#60a5fa'}}>{BET_TYPES.find(x=>x.v===b.betType)?.l||b.betType}</span>
                              </div>
                              <div style={{fontWeight:600,fontSize:'13px'}}>{b.selection}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a'}}>Odds: {b.odds} · Stake: ${b.stake} · Win: ${b.potentialWin.toFixed(2)}</div>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',gap:'4px',alignItems:'flex-end',flexShrink:0}}>
                              <button onClick={()=>del(b.id)} style={{background:'none',border:'none',color:'#a0a09a',cursor:'pointer',fontSize:'13px'}}>✕</button>
                              <button onClick={()=>toggle(b.id)}
                                style={{padding:'4px 8px',borderRadius:'6px',border:(b.placed?'1px solid rgba(74,222,128,0.4)':'1px solid rgba(232,144,26,0.4)'),background:b.placed?'rgba(74,222,128,0.15)':'transparent',color:b.placed?'#4ade80':'#e8901a',cursor:'pointer',fontWeight:700,fontSize:'10px',whiteSpace:'nowrap'}}>
                                {b.placed?'✓ Placed':'Place'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BY PLAYER */}
        {view === 'byPlayer' && (
          <div>
            <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px',marginBottom:'14px'}}>BETS BY PLAYER</div>
            {Object.keys(playerGroups).length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No bets yet.</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {Object.entries(playerGroups).map(([player, pb]) => {
                  const totalS = pb.reduce((s,b)=>s+b.stake,0);
                  const totalP = pb.reduce((s,b)=>s+b.potentialWin,0);
                  const numPlaced = pb.filter(b=>b.placed).length;
                  return (
                    <div key={player} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.15)',borderRadius:'12px',overflow:'hidden'}}>
                      {/* Player header */}
                      <div style={{padding:'12px 14px',background:'rgba(245,200,66,0.08)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <div style={{fontWeight:900,fontSize:'18px',color:'#f5c842'}}>{player}</div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontWeight:900,fontSize:'16px',color:'#4ade80'}}>${totalS.toFixed(2)}</div>
                            <div style={{fontSize:'10px',color:'#a0a09a'}}>total staked</div>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:'12px',marginTop:'6px',fontSize:'11px',color:'#a0a09a'}}>
                          <span>{pb.length} bets</span>
                          <span>{numPlaced}/{pb.length} placed on SGPools</span>
                          <span style={{color:'#f5c842'}}>Max win: ${totalP.toFixed(2)}</span>
                        </div>
                      </div>
                      {/* Bets list */}
                      <div>
                        {pb.map(b => (
                          <div key={b.id} style={{padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'8px',borderBottom:'1px solid rgba(255,255,255,0.05)',background:b.placed?'rgba(74,222,128,0.04)':'transparent'}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:'flex',gap:'5px',marginBottom:'2px',flexWrap:'wrap'}}>
                                <span style={{fontSize:'10px',padding:'1px 5px',borderRadius:'6px',background:'rgba(59,130,246,0.2)',color:'#60a5fa'}}>{BET_TYPES.find(x=>x.v===b.betType)?.l||b.betType}</span>
                                {b.placed && <span style={{fontSize:'10px',padding:'1px 5px',borderRadius:'6px',background:'rgba(74,222,128,0.2)',color:'#4ade80'}}>✓ Placed</span>}
                              </div>
                              <div style={{fontWeight:600,fontSize:'13px'}}>{b.selection}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.matchLabel}</div>
                            </div>
                            <div style={{textAlign:'right',flexShrink:0}}>
                              <div style={{fontWeight:700,fontSize:'12px',color:'#f5c842'}}>${b.stake} @ {b.odds}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a'}}>→ ${b.potentialWin.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Player total row */}
                      <div style={{padding:'10px 14px',background:'rgba(0,0,0,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:'12px',color:'#a0a09a'}}>All bets placed? {numPlaced === pb.length ? '✅ Yes' : '❌ '+(pb.length - numPlaced)+' remaining'}</span>
                        <button onClick={()=>{
                          const allIds = pb.map(b=>b.id);
                          save(fbets.map(b => allIds.includes(b.id) ? {...b, placed:true} : b));
                        }} style={{padding:'5px 10px',borderRadius:'8px',border:'1px solid rgba(74,222,128,0.4)',background:'rgba(74,222,128,0.1)',color:'#4ade80',cursor:'pointer',fontWeight:700,fontSize:'11px'}}>
                          Mark All Placed ✓
                        </button>
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

function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <div>
      <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'5px',letterSpacing:'1px',fontWeight:600}}>{label}</div>
      {children}
    </div>
  );
}
