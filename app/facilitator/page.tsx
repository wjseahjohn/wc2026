'use client';
import { useState, useEffect } from 'react';

const BET_LABELS: Record<string,string> = {
  '1x2':'1X2','ou':'O/U','btts':'BTTS','htft':'HT/FT',
  'score':'Score','goals':'Goals','ou_over':'O/U','ou_under':'O/U',
  'btts_yes':'BTTS','btts_no':'BTTS','total_goals':'Goals',
  'correct_score':'Score','winner':'Winner','scorer':'Scorer',
};

export default function FacilitatorPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [bets, setBets] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [odds, setOdds] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState<string>('');
  const [msg, setMsg] = useState('');
  const [filter, setFilter] = useState<'all'|'unconfirmed'|'confirmed'>('unconfirmed');
  const [playerFilter, setPlayerFilter] = useState('');

  useEffect(() => {
    if (authed) {
      loadAll();
      // Load saved odds from localStorage
      const savedOdds = localStorage.getItem('facilitator_odds');
      if (savedOdds) setOdds(JSON.parse(savedOdds));
    }
  }, [authed]);

  async function loadAll() {
    const [b, m] = await Promise.all([
      fetch('/api/bets').then(r=>r.json()),
      fetch('/api/matches').then(r=>r.json()),
    ]);
    setBets(b);
    setMatches(m.matches || []);
  }

  function updateOdds(betId: string, val: string) {
    const updated = {...odds, [betId]: val};
    setOdds(updated);
    localStorage.setItem('facilitator_odds', JSON.stringify(updated));
  }

  async function confirmBet(betId: string) {
    setSaving(betId);
    const oddsVal = parseFloat(odds[betId] || '0');

    // Update odds + confirm in one step
    await fetch('/api/bets', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'confirm', betIds: [betId], oddsMap: {[betId]: oddsVal} }),
    });

    setSaving('');
    setMsg('Bet confirmed on SGPools!');
    setTimeout(()=>setMsg(''), 2000);
    loadAll();
  }

  async function confirmAll(betIds: string[]) {
    setSaving('all');
    const oddsMap: Record<string,number> = {};
    betIds.forEach(id => { oddsMap[id] = parseFloat(odds[id] || '0'); });
    await fetch('/api/bets', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'confirm', betIds, oddsMap }),
    });
    setSaving('');
    setMsg('All bets confirmed!');
    setTimeout(()=>setMsg(''), 2000);
    loadAll();
  }

  function getMatchLabel(targetId: string) {
    const matchId = targetId.split('_')[0];
    const m = matches.find(x => x.id === matchId);
    if (!m) return targetId;
    return m.homeTeam + ' vs ' + m.awayTeam;
  }

  function getMatchTime(targetId: string) {
    const matchId = targetId.split('_')[0];
    const m = matches.find(x => x.id === matchId);
    if (!m) return '';
    return m.date + ' · ' + m.time + ' SGT';
  }

  function exportCSV() {
    const rows = [
      ['Player','Match','Bet Type','Selection','Stake SGD','Odds','Potential Win','Confirmed'],
      ...filtered.map(b => {
        const o = parseFloat(odds[b.id] || String(b.odds || 0));
        const pot = b.stake > 0 && o > 0 ? (b.stake * o).toFixed(2) : '-';
        return [b.playerName, getMatchLabel(b.targetId), BET_LABELS[b.betType]||b.betType, b.selection, b.stake||0, o||'-', pot, b.confirmedBySGPools?'Yes':'No'];
      })
    ];
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], {type:'text/csv'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='wc2026_bets.csv'; a.click();
  }

  // Filtering
  const players: string[] = [];
  bets.forEach(b => { if (b.playerName && !players.includes(b.playerName)) players.push(b.playerName); });

  const filtered = bets.filter(b => {
    const statusOk = filter === 'all' || (filter === 'unconfirmed' && !b.confirmedBySGPools) || (filter === 'confirmed' && b.confirmedBySGPools);
    const playerOk = playerFilter === '' || b.playerName === playerFilter;
    return statusOk && playerOk;
  });

  const unconfirmedCount = bets.filter(b => !b.confirmedBySGPools).length;
  const confirmedCount = bets.filter(b => b.confirmedBySGPools).length;
  const totalStaked = bets.filter(b=>b.confirmedBySGPools).reduce((s,b)=>s+(b.stake||0),0);

  // Group filtered bets by player
  const byPlayer: Record<string, any[]> = {};
  filtered.forEach(b => {
    if (!byPlayer[b.playerName]) byPlayer[b.playerName] = [];
    byPlayer[b.playerName].push(b);
  });

  if (!authed) return (
    <div style={{minHeight:'100vh',background:'#071f10',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',fontFamily:'system-ui,sans-serif'}}>
      <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.3)',borderRadius:'16px',padding:'40px 24px',maxWidth:'360px',width:'100%',textAlign:'center'}}>
        <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
        <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px',marginBottom:'4px'}}>FACILITATOR</div>
        <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'20px'}}>View bets · Enter odds · Confirm with SGPools</div>
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
    <div style={{minHeight:'100vh',background:'#071f10',color:'#f0ede4',paddingBottom:'40px',fontFamily:'system-ui,sans-serif'}}>

      {/* Header */}
      <div style={{position:'sticky',top:0,zIndex:40,background:'rgba(7,31,16,0.97)',borderBottom:'1px solid rgba(245,200,66,0.2)',backdropFilter:'blur(12px)',padding:'12px 16px'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>

          {/* Title row */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <div>
              <div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>FACILITATOR PANEL</div>
              <div style={{fontSize:'11px',color:'#a0a09a'}}>Enter odds · Confirm on SGPools</div>
            </div>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={exportCSV} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'11px'}}>
                CSV
              </button>
              <button onClick={loadAll} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'11px'}}>
                Refresh
              </button>
              <a href="/" style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',color:'#a0a09a',textDecoration:'none',fontSize:'11px'}}>
                App
              </a>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px',marginBottom:'10px'}}>
            {[
              {l:'To Confirm',v:unconfirmedCount,c:'#e8901a'},
              {l:'Confirmed',v:confirmedCount,c:'#4ade80'},
              {l:'Total Staked',v:'$'+totalStaked.toFixed(0),c:'#f5c842'},
            ].map(s=>(
              <div key={s.l} style={{background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'8px',textAlign:'center'}}>
                <div style={{fontWeight:900,fontSize:'16px',color:s.c}}>{s.v}</div>
                <div style={{fontSize:'10px',color:'#a0a09a'}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Status filter */}
          <div style={{display:'flex',gap:'4px',marginBottom:'6px',overflowX:'auto',scrollbarWidth:'none'}}>
            {[['unconfirmed','To Confirm'],['all','All Bets'],['confirmed','Confirmed']].map(([v,l]) => (
              <button key={v} onClick={()=>setFilter(v as any)}
                style={{padding:'5px 12px',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:600,flexShrink:0,fontSize:'11px',background:filter===v?'#f5c842':'rgba(255,255,255,0.06)',color:filter===v?'#071f10':'#a0a09a'}}>
                {l}
              </button>
            ))}
            <div style={{width:'1px',background:'rgba(255,255,255,0.1)',margin:'0 4px'}}></div>
            {/* Player filter */}
            <button onClick={()=>setPlayerFilter('')}
              style={{padding:'5px 12px',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:600,flexShrink:0,fontSize:'11px',background:playerFilter===''?'rgba(59,130,246,0.3)':'rgba(255,255,255,0.06)',color:playerFilter===''?'#60a5fa':'#a0a09a'}}>
              All Players
            </button>
            {players.map(p => (
              <button key={p} onClick={()=>setPlayerFilter(p===playerFilter?'':p)}
                style={{padding:'5px 12px',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:600,flexShrink:0,fontSize:'11px',background:playerFilter===p?'rgba(59,130,246,0.3)':'rgba(255,255,255,0.06)',color:playerFilter===p?'#60a5fa':'#a0a09a'}}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'16px'}}>

        {msg && (
          <div style={{padding:'10px',borderRadius:'10px',marginBottom:'12px',fontWeight:600,fontSize:'13px',textAlign:'center',background:'rgba(74,222,128,0.15)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.3)'}}>
            {msg}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{padding:'60px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.03)',borderRadius:'12px'}}>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
            <div style={{fontWeight:600}}>No bets here yet</div>
            <div style={{fontSize:'12px',marginTop:'4px'}}>
              {filter === 'unconfirmed' ? 'All bets have been confirmed!' : 'Players have not placed any bets yet.'}
            </div>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {Object.entries(byPlayer).map(([player, playerBets]) => {
              const unconfirmed = playerBets.filter(b=>!b.confirmedBySGPools);
              const totalPlayerStake = playerBets.reduce((s,b)=>s+(b.stake||0),0);
              const totalPotential = playerBets.reduce((s,b)=>{
                const o = parseFloat(odds[b.id] || String(b.odds || 0));
                return s + (b.stake > 0 && o > 0 ? b.stake * o : 0);
              },0);

              return (
                <div key={player} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',overflow:'hidden'}}>

                  {/* Player header */}
                  <div style={{padding:'12px 16px',background:'rgba(245,200,66,0.08)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
                      <div style={{fontWeight:900,fontSize:'18px',color:'#f5c842'}}>{player}</div>
                      <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                        {unconfirmed.length > 0 && (
                          <button
                            onClick={()=>confirmAll(unconfirmed.map(b=>b.id))}
                            disabled={saving==='all'}
                            style={{padding:'6px 12px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'12px',background:'#f5c842',color:'#071f10',opacity:saving==='all'?0.5:1}}>
                            Confirm All ({unconfirmed.length})
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'16px',fontSize:'11px',color:'#a0a09a'}}>
                      <span>{playerBets.length} bets</span>
                      <span style={{color:'#4ade80'}}>Staked: ${totalPlayerStake.toFixed(2)}</span>
                      {totalPotential > 0 && <span style={{color:'#f5c842'}}>Potential: ${totalPotential.toFixed(2)}</span>}
                      <span style={{color:unconfirmed.length===0?'#4ade80':'#e8901a'}}>{unconfirmed.length === 0 ? 'All confirmed' : unconfirmed.length+' to confirm'}</span>
                    </div>
                  </div>

                  {/* Bet rows */}
                  <div>
                    {playerBets.map(b => {
                      const oddsVal = parseFloat(odds[b.id] || '');
                      const hasOdds = !isNaN(oddsVal) && oddsVal > 0;
                      const potential = hasOdds && b.stake > 0 ? b.stake * oddsVal : null;
                      const isConfirmed = b.confirmedBySGPools;

                      return (
                        <div key={b.id} style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)',background:isConfirmed?'rgba(74,222,128,0.03)':'transparent'}}>

                          {/* Bet info */}
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px',gap:'8px'}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:'flex',gap:'5px',alignItems:'center',marginBottom:'3px',flexWrap:'wrap'}}>
                                <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'6px',background:'rgba(59,130,246,0.2)',color:'#60a5fa',fontWeight:600,flexShrink:0}}>
                                  {BET_LABELS[b.betType]||b.betType}
                                </span>
                                {isConfirmed && (
                                  <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'6px',background:'rgba(74,222,128,0.2)',color:'#4ade80',fontWeight:700}}>
                                    Placed on SGPools
                                  </span>
                                )}
                              </div>
                              <div style={{fontWeight:700,fontSize:'14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.selection}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a',marginTop:'2px'}}>{getMatchLabel(b.targetId)} · {getMatchTime(b.targetId)}</div>
                            </div>
                            <div style={{textAlign:'right',flexShrink:0}}>
                              {b.stake > 0 && <div style={{fontSize:'13px',fontWeight:700,color:'#f0ede4'}}>SGD ${b.stake}</div>}
                            </div>
                          </div>

                          {/* Odds input + potential win + confirm button */}
                          <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>

                            {/* Odds input */}
                            <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'6px 10px',flex:1,minWidth:'160px'}}>
                              <span style={{fontSize:'11px',color:'#a0a09a',flexShrink:0}}>SGPools Odds:</span>
                              <input
                                type="number" step="0.01" min="1"
                                value={odds[b.id] || ''}
                                onChange={e=>updateOdds(b.id, e.target.value)}
                                placeholder="e.g. 1.85"
                                disabled={isConfirmed}
                                style={{flex:1,minWidth:'70px',padding:'4px 8px',borderRadius:'6px',border:'1px solid rgba(245,200,66,0.3)',background:isConfirmed?'rgba(255,255,255,0.03)':'rgba(7,31,16,0.8)',color:isConfirmed?'#a0a09a':'#f5c842',fontWeight:700,fontSize:'14px',outline:'none',fontFamily:'inherit'}}
                              />
                            </div>

                            {/* Potential win */}
                            {potential !== null ? (
                              <div style={{textAlign:'center',padding:'6px 12px',borderRadius:'8px',background:'rgba(245,200,66,0.1)',border:'1px solid rgba(245,200,66,0.2)',flexShrink:0}}>
                                <div style={{fontSize:'10px',color:'#a0a09a'}}>Potential Win</div>
                                <div style={{fontWeight:900,fontSize:'16px',color:'#f5c842'}}>SGD ${potential.toFixed(2)}</div>
                              </div>
                            ) : b.stake > 0 ? (
                              <div style={{textAlign:'center',padding:'6px 12px',borderRadius:'8px',background:'rgba(255,255,255,0.04)',flexShrink:0}}>
                                <div style={{fontSize:'10px',color:'#a0a09a'}}>Potential Win</div>
                                <div style={{fontWeight:700,fontSize:'13px',color:'#a0a09a'}}>Enter odds</div>
                              </div>
                            ) : null}

                            {/* Confirm button */}
                            {!isConfirmed ? (
                              <button
                                onClick={()=>confirmBet(b.id)}
                                disabled={saving===b.id}
                                style={{padding:'8px 14px',borderRadius:'8px',border:'none',cursor:saving===b.id?'not-allowed':'pointer',fontWeight:700,fontSize:'12px',background:'#f5c842',color:'#071f10',opacity:saving===b.id?0.5:1,flexShrink:0,whiteSpace:'nowrap'}}>
                                {saving===b.id ? 'Saving...' : 'Placed on SGPools'}
                              </button>
                            ) : (
                              <div style={{padding:'8px 14px',borderRadius:'8px',background:'rgba(74,222,128,0.15)',border:'1px solid rgba(74,222,128,0.3)',fontSize:'12px',fontWeight:700,color:'#4ade80',flexShrink:0,whiteSpace:'nowrap'}}>
                                Done
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
