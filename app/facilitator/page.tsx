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
  const [matchResults, setMatchResults] = useState<Record<string,any>>({});
  const [odds, setOdds] = useState<Record<string,string>>({});
  const [handicapLines, setHandicapLines] = useState<Record<string,string>>({});
  const [scoreInput, setScoreInput] = useState<Record<string,any>>({});
  const [payments, setPayments] = useState<any[]>([]);
  const [payInput, setPayInput] = useState<Record<string,string>>({});
  const [payNote, setPayNote] = useState<Record<string,string>>({});
  const [saving, setSaving] = useState('');
  const [savingResult, setSavingResult] = useState('');
  const [msg, setMsg] = useState('');
  const [view, setView] = useState<'bets'|'results'|'payments'>('bets');
  const [resultsFilter, setResultsFilter] = useState<'upcoming'|'completed'>('upcoming');
  const [filter, setFilter] = useState<'all'|'unconfirmed'|'confirmed'>('unconfirmed');
  const [playerFilter, setPlayerFilter] = useState('');

  useEffect(() => {
    if (authed) {
      loadAll();
      const savedOdds = localStorage.getItem('facilitator_odds');
      if (savedOdds) setOdds(JSON.parse(savedOdds));
      const savedLines = localStorage.getItem('facilitator_handicap_lines');
      if (savedLines) setHandicapLines(JSON.parse(savedLines));
    }
  }, [authed]);

  async function loadAll() {
    const [b, m, mr, p] = await Promise.all([
      fetch('/api/bets').then(r=>r.json()),
      fetch('/api/matches').then(r=>r.json()),
      fetch('/api/results').then(r=>r.json()).catch(()=>({})),
      fetch('/api/payments').then(r=>r.json()).catch(()=>[]),
    ]);
    setBets(b);
    setMatches(m.matches || []);
    setMatchResults(mr);
    setPayments(p);
  }

  async function recordPayment(playerName: string) {
    const amount = parseFloat(payInput[playerName] || '0');
    if (!amount || amount <= 0) { setMsg('Enter a valid amount'); return; }
    setSaving('pay_'+playerName);
    await fetch('/api/payments', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ adminKey: key, playerName, amount, note: payNote[playerName] || '' }),
    });
    setSaving('');
    setPayInput(p => ({...p, [playerName]: ''}));
    setPayNote(p => ({...p, [playerName]: ''}));
    setMsg('Payment recorded for '+playerName+'!');
    setTimeout(()=>setMsg(''), 3000);
    loadAll();
  }

  async function deletePayment(id: string) {
    await fetch('/api/payments', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ adminKey: key, deleteId: id }),
    });
    loadAll();
  }


  function updateOdds(betId: string, val: string) {
    const updated = {...odds, [betId]: val};
    setOdds(updated);
    localStorage.setItem('facilitator_odds', JSON.stringify(updated));
  }

  function updateHandicapLine(betId: string, val: string) {
    const updated = {...handicapLines, [betId]: val};
    setHandicapLines(updated);
    localStorage.setItem('facilitator_handicap_lines', JSON.stringify(updated));
  }

  async function resetResult(matchId: string, matchLabel: string) {
    if (!confirm('Reset result for ' + matchLabel + '?\nThis will un-settle all bets for this match.')) return;
    setSavingResult(matchId+'_reset');
    await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ adminKey: key, resetMatchId: matchId }),
    });
    setSavingResult('');
    setMsg('Result reset! Bets unsettled.');
    setScoreInput((p:any) => { const n = {...p}; delete n[matchId]; return n; });
    loadAll();
    setTimeout(()=>setMsg(''), 3000);
  }

  function updateScore(matchId: string, field: string, val: string) {
    setScoreInput((p:any) => ({...p, [matchId]: {...(p[matchId]||{}), [field]: val === '' ? undefined : parseInt(val)}}));
  }

  async function confirmBet(betId: string) {
    setSaving(betId);
    const oddsVal = parseFloat(odds[betId] || '0');
    const hcapLine = handicapLines[betId] || '';
    await fetch('/api/bets', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ action: 'confirm', betIds: [betId], oddsMap: {[betId]: oddsVal}, handicapLineMap: hcapLine ? {[betId]: hcapLine} : {} }),
    });
    setSaving('');
    setMsg('Bet confirmed!');
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

  async function deleteBet(betId: string, label: string) {
    if (!confirm('Delete this bet?\n' + label)) return;
    setSaving(betId);
    await fetch('/api/admin/reset', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ adminKey: key, deleteBetId: betId }),
    });
    setSaving('');
    setMsg('Bet deleted');
    setTimeout(()=>setMsg(''), 2000);
    loadAll();
  }

  async function saveResult(matchId: string) {
    const si = scoreInput[matchId] || {};
    if (si.homeScore === undefined || si.awayScore === undefined) {
      setMsg('Please enter both full time scores'); return;
    }
    setSavingResult(matchId);
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        adminKey: key, matchId,
        homeScore: si.homeScore, awayScore: si.awayScore,
        htHomeScore: si.htHomeScore || 0, htAwayScore: si.htAwayScore || 0,
      }),
    });
    setSavingResult('');
    if (res.ok) {
      setMsg('Result saved! All bets settled automatically.');
      loadAll();
      setTimeout(()=>setMsg(''), 4000);
    } else { setMsg('Failed — check admin key'); }
  }

  function getMatchLabel(targetId: string) {
    const mid = (targetId?.startsWith('R32')||targetId?.startsWith('R16')||targetId?.startsWith('QF')||targetId?.startsWith('SF')) ? targetId?.split('_').slice(0,2).join('_') : targetId?.split('_')[0];
    const m = matches.find(x => x.id === mid);
    return m ? m.homeTeam + ' vs ' + m.awayTeam : targetId;
  }

  function getMatchTime(targetId: string) {
    const mid = (targetId?.startsWith('R32')||targetId?.startsWith('R16')||targetId?.startsWith('QF')||targetId?.startsWith('SF')) ? targetId?.split('_').slice(0,2).join('_') : targetId?.split('_')[0];
    const m = matches.find(x => x.id === mid);
    return m ? m.date + ' · ' + m.time + ' SGT' : '';
  }

  function exportCSV() {
    const rows = [
      ['Player','Match','Bet Type','Selection','Stake SGD','Odds','Potential Win','Confirmed'],
      ...bets.map(b => {
        const o = parseFloat(odds[b.id] || String(b.odds || 0));
        const pot = b.stake > 0 && o > 0 ? (b.stake * o).toFixed(2) : '-';
        return [b.playerName, getMatchLabel(b.targetId), BET_LABELS[b.betType]||b.betType, b.selection, b.stake||0, o||'-', pot, b.confirmedBySGPools?'Yes':'No'];
      })
    ];
    const blob = new Blob([rows.map(r=>r.join(',')).join('\n')], {type:'text/csv'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='wc2026_bets.csv'; a.click();
  }

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
        <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'20px'}}>Enter odds · Confirm · Set Results</div>
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

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <div>
              <div style={{fontSize:'18px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>FACILITATOR PANEL</div>
              <div style={{fontSize:'11px',color:'#a0a09a'}}>Confirm bets · Set results · Settle bets</div>
            </div>
            <div style={{display:'flex',gap:'6px'}}>
              <button onClick={exportCSV} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'11px'}}>CSV</button>
              <button onClick={loadAll} style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'11px'}}>Refresh</button>
              <a href="/" style={{padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',color:'#a0a09a',textDecoration:'none',fontSize:'11px'}}>App</a>
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

          {/* View tabs */}
          <div style={{display:'flex',gap:'6px',marginBottom:'8px'}}>
            {[['bets','Bets'],['results','Set Results'],['payments','Payments']].map(([v,l]) => (
              <button key={v} onClick={()=>setView(v as 'bets'|'results'|'payments')}
                style={{padding:'6px 14px',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'12px',background:view===v?'#f5c842':'rgba(255,255,255,0.08)',color:view===v?'#071f10':'#a0a09a'}}>
                {l}
              </button>
            ))}
          </div>

          {/* Bet filters - only show on bets view */}
          {view === 'bets' && (
            <div style={{display:'flex',gap:'4px',overflowX:'auto',scrollbarWidth:'none'}}>
              {[['unconfirmed','To Confirm'],['all','All'],['confirmed','Confirmed']].map(([v,l]) => (
                <button key={v} onClick={()=>setFilter(v as 'all'|'unconfirmed'|'confirmed')}
                  style={{padding:'5px 12px',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:600,flexShrink:0,fontSize:'11px',background:filter===v?'#f5c842':'rgba(255,255,255,0.06)',color:filter===v?'#071f10':'#a0a09a'}}>
                  {l}
                </button>
              ))}
              <div style={{width:'1px',background:'rgba(255,255,255,0.1)',margin:'0 4px',flexShrink:0}}></div>
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
          )}
        </div>
      </div>

      <div style={{maxWidth:'700px',margin:'0 auto',padding:'16px'}}>

        {msg && (
          <div style={{padding:'10px',borderRadius:'10px',marginBottom:'12px',fontWeight:600,fontSize:'13px',textAlign:'center',background:'rgba(74,222,128,0.15)',color:'#4ade80',border:'1px solid rgba(74,222,128,0.3)'}}>
            {msg}
          </div>
        )}

        {/* SET RESULTS VIEW */}
        {view === 'results' && (
          <div>
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>SET MATCH RESULTS</div>
              <div style={{fontSize:'12px',color:'#a0a09a',marginTop:'2px'}}>Enter the final score to automatically settle ALL bet types for that match</div>
            </div>

            {/* Upcoming / Completed toggle */}
            <div style={{display:'flex',gap:'6px',marginBottom:'14px'}}>
              {(()=>{
                const upcomingCount = matches.filter((m:any)=>!matchResults[m.id]).length;
                const completedCount = matches.filter((m:any)=>matchResults[m.id]).length;
                return [['upcoming','Upcoming ('+upcomingCount+')'],['completed','Completed ('+completedCount+')']].map(([v,l]) => (
                  <button key={v} onClick={()=>setResultsFilter(v as 'upcoming'|'completed')}
                    style={{padding:'7px 16px',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'13px',background:resultsFilter===v?'#f5c842':'rgba(255,255,255,0.06)',color:resultsFilter===v?'#071f10':'#a0a09a'}}>
                    {l}
                  </button>
                ));
              })()}
            </div>

            {(()=>{
              const filteredMatches = matches.filter((m:any) => resultsFilter==='upcoming' ? !matchResults[m.id] : !!matchResults[m.id]);
              const byDate: Record<string, any[]> = {};
              const sorted = [...filteredMatches].sort((a:any,b:any) => {
                const cmp = (a.date+a.time) < (b.date+b.time) ? -1 : 1;
                return resultsFilter==='completed' ? -cmp : cmp;
              });
              sorted.forEach((m:any) => {
                if (!byDate[m.date]) byDate[m.date] = [];
                byDate[m.date].push(m);
              });
              if (sorted.length === 0) {
                return (
                  <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>
                    {resultsFilter==='upcoming' ? 'All matches completed!' : 'No matches completed yet.'}
                  </div>
                );
              }
              return Object.entries(byDate).map(([date, dayMatches]) => (
                <div key={date} style={{marginBottom:'20px'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:resultsFilter==='upcoming'?'#f5c842':'#a0a09a',marginBottom:'8px',padding:'6px 10px',background:resultsFilter==='upcoming'?'rgba(245,200,66,0.08)':'rgba(255,255,255,0.04)',borderRadius:'8px',letterSpacing:'1px'}}>
                    {new Date(date+'T12:00:00').toLocaleDateString('en-SG',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    {(dayMatches as any[]).map((m:any) => {
                      const settled = matchResults[m.id];
                      const si = scoreInput[m.id] || {};
                      return (
                        <div key={m.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid '+(settled?'rgba(74,222,128,0.3)':'rgba(255,255,255,0.1)'),borderRadius:'12px',padding:'14px'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px',flexWrap:'wrap',gap:'6px'}}>
                            <div>
                              <div style={{fontWeight:700,fontSize:'14px'}}>{m.homeTeam} vs {m.awayTeam}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a'}}>{m.date} · {m.time} SGT</div>
                            </div>
                            {settled && (
                              <div style={{padding:'4px 10px',borderRadius:'20px',background:'rgba(74,222,128,0.15)',color:'#4ade80',fontWeight:700,fontSize:'12px'}}>
                                FT: {settled.homeScore}-{settled.awayScore}
                                {settled.htHomeScore !== undefined ? ' (HT: '+settled.htHomeScore+'-'+settled.htAwayScore+')' : ''}
                              </div>
                            )}
                          </div>

                          <div style={{display:'flex',gap:'12px',alignItems:'flex-end',flexWrap:'wrap'}}>
                            {/* Full time score */}
                            <div>
                              <div style={{fontSize:'11px',color:'#f5c842',fontWeight:600,marginBottom:'4px'}}>Full Time Score *</div>
                              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                <div style={{textAlign:'center'}}>
                                  <div style={{fontSize:'10px',color:'#a0a09a',marginBottom:'3px'}}>{m.homeTeam}</div>
                                  <input type="number" min="0" max="20"
                                    value={si.homeScore !== undefined ? si.homeScore : (settled?.homeScore !== undefined ? settled.homeScore : '')}
                                    onChange={e=>updateScore(m.id,'homeScore',e.target.value)}
                                    style={{width:'52px',padding:'8px 4px',borderRadius:'8px',border:'1px solid rgba(245,200,66,0.5)',background:'rgba(7,31,16,0.9)',color:'#f5c842',fontWeight:900,fontSize:'20px',textAlign:'center',outline:'none',fontFamily:'inherit'}} />
                                </div>
                                <div style={{fontWeight:900,color:'#a0a09a',fontSize:'18px',paddingBottom:'4px'}}>-</div>
                                <div style={{textAlign:'center'}}>
                                  <div style={{fontSize:'10px',color:'#a0a09a',marginBottom:'3px'}}>{m.awayTeam}</div>
                                  <input type="number" min="0" max="20"
                                    value={si.awayScore !== undefined ? si.awayScore : (settled?.awayScore !== undefined ? settled.awayScore : '')}
                                    onChange={e=>updateScore(m.id,'awayScore',e.target.value)}
                                    style={{width:'52px',padding:'8px 4px',borderRadius:'8px',border:'1px solid rgba(245,200,66,0.5)',background:'rgba(7,31,16,0.9)',color:'#f5c842',fontWeight:900,fontSize:'20px',textAlign:'center',outline:'none',fontFamily:'inherit'}} />
                                </div>
                              </div>
                            </div>

                            {/* Half time score */}
                            <div>
                              <div style={{fontSize:'11px',color:'#a0a09a',fontWeight:600,marginBottom:'4px'}}>Half Time (for HT/FT bets)</div>
                              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                                <input type="number" min="0" max="20"
                                  value={si.htHomeScore !== undefined ? si.htHomeScore : (settled?.htHomeScore !== undefined ? settled.htHomeScore : '')}
                                  onChange={e=>updateScore(m.id,'htHomeScore',e.target.value)}
                                  placeholder="0"
                                  style={{width:'44px',padding:'6px 4px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.2)',background:'rgba(7,31,16,0.9)',color:'#f0ede4',fontWeight:700,fontSize:'16px',textAlign:'center',outline:'none',fontFamily:'inherit'}} />
                                <div style={{fontWeight:700,color:'#a0a09a',fontSize:'16px'}}>-</div>
                                <input type="number" min="0" max="20"
                                  value={si.htAwayScore !== undefined ? si.htAwayScore : (settled?.htAwayScore !== undefined ? settled.htAwayScore : '')}
                                  onChange={e=>updateScore(m.id,'htAwayScore',e.target.value)}
                                  placeholder="0"
                                  style={{width:'44px',padding:'6px 4px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.2)',background:'rgba(7,31,16,0.9)',color:'#f0ede4',fontWeight:700,fontSize:'16px',textAlign:'center',outline:'none',fontFamily:'inherit'}} />
                              </div>
                            </div>

                            {/* Save button */}
                            <button onClick={()=>saveResult(m.id)} disabled={savingResult===m.id}
                              style={{padding:'10px 18px',borderRadius:'8px',border:'none',cursor:savingResult===m.id?'not-allowed':'pointer',fontWeight:700,fontSize:'13px',background:'#f5c842',color:'#071f10',opacity:savingResult===m.id?0.5:1,alignSelf:'flex-end',whiteSpace:'nowrap'}}>
                              {savingResult===m.id ? 'Saving...' : settled ? 'Update Result' : 'Save & Settle Bets'}
                            </button>
                            {settled && (
                              <button onClick={()=>resetResult(m.id, m.homeTeam+' vs '+m.awayTeam)} disabled={savingResult===m.id+'_reset'}
                                style={{padding:'10px 14px',borderRadius:'8px',border:'1px solid rgba(248,113,113,0.4)',cursor:'pointer',fontWeight:700,fontSize:'13px',background:'rgba(248,113,113,0.1)',color:'#f87171',alignSelf:'flex-end',whiteSpace:'nowrap',opacity:savingResult===m.id+'_reset'?0.5:1}}>
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* BETS VIEW */}
        {view === 'bets' && (
          filtered.length === 0 ? (
            <div style={{padding:'60px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.03)',borderRadius:'12px'}}>
              <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
              <div style={{fontWeight:600}}>{filter==='unconfirmed'?'All bets confirmed!':'No bets yet.'}</div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {Object.entries(byPlayer).map(([player, playerBets]) => {
                const unconfirmed = playerBets.filter(b=>!b.confirmedBySGPools);
                const totalPlayerStake = playerBets.reduce((s,b)=>s+(b.stake||0),0);
                const totalPotential = playerBets.reduce((s,b)=>{
                  const o = parseFloat(odds[b.id] || String(b.odds||0));
                  return s + (b.stake>0&&o>0 ? b.stake*o : 0);
                },0);

                return (
                  <div key={player} style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',overflow:'hidden'}}>
                    <div style={{padding:'12px 16px',background:'rgba(245,200,66,0.08)',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px'}}>
                        <div style={{fontWeight:900,fontSize:'18px',color:'#f5c842'}}>{player}</div>
                        {unconfirmed.length > 0 && (
                          <button onClick={()=>confirmAll(unconfirmed.map(b=>b.id))} disabled={saving==='all'}
                            style={{padding:'6px 12px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'12px',background:'#f5c842',color:'#071f10',opacity:saving==='all'?0.5:1}}>
                            Confirm All ({unconfirmed.length})
                          </button>
                        )}
                      </div>
                      <div style={{display:'flex',gap:'16px',fontSize:'11px',color:'#a0a09a',flexWrap:'wrap'}}>
                        <span>{playerBets.length} bets</span>
                        <span style={{color:'#4ade80'}}>Staked: ${totalPlayerStake.toFixed(2)}</span>
                        {totalPotential > 0 && <span style={{color:'#f5c842'}}>Potential: ${totalPotential.toFixed(2)}</span>}
                        <span style={{color:unconfirmed.length===0?'#4ade80':'#e8901a'}}>{unconfirmed.length===0?'All confirmed':unconfirmed.length+' to confirm'}</span>
                      </div>
                    </div>

                    {playerBets.map(b => {
                      const oddsVal = parseFloat(odds[b.id] || '');
                      const currentOdds = !isNaN(oddsVal) && oddsVal > 0 ? oddsVal : (b.odds > 1 ? b.odds : null);
                      const potential = currentOdds && b.stake > 0 ? b.stake * currentOdds : null;
                      const isConfirmed = b.confirmedBySGPools;

                      return (
                        <div key={b.id} style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.05)',background:isConfirmed?'rgba(74,222,128,0.03)':b.settled?'rgba(59,130,246,0.03)':'transparent'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px',gap:'8px'}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:'flex',gap:'5px',alignItems:'center',marginBottom:'3px',flexWrap:'wrap'}}>
                                <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'6px',background:'rgba(59,130,246,0.2)',color:'#60a5fa',fontWeight:600}}>{BET_LABELS[b.betType]||b.betType}</span>
                                {b.settled ? (
                                  <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'6px',background:b.actualWin>0?'rgba(74,222,128,0.2)':'rgba(248,113,113,0.2)',color:b.actualWin>0?'#4ade80':'#f87171',fontWeight:700}}>
                                    {b.actualWin>0?'WON +$'+b.actualWin.toFixed(2):'LOST'}
                                  </span>
                                ) : isConfirmed ? (
                                  <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'6px',background:'rgba(74,222,128,0.2)',color:'#4ade80',fontWeight:600}}>Placed on SGPools</span>
                                ) : (
                                  <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'6px',background:'rgba(232,144,26,0.2)',color:'#e8901a',fontWeight:600}}>Pending</span>
                                )}
                              </div>
                              <div style={{fontWeight:700,fontSize:'14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{b.selection}</div>
                              <div style={{fontSize:'11px',color:'#a0a09a'}}>{getMatchLabel(b.targetId)} · {getMatchTime(b.targetId)}</div>
                            </div>
                            <div style={{textAlign:'right',flexShrink:0}}>
                              {b.stake > 0 && <div style={{fontSize:'13px',fontWeight:700}}>SGD ${b.stake}</div>}
                            </div>
                          </div>

                          <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                            {(b.betType==='handicap_home'||b.betType==='handicap_away') && (
                              <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'6px 10px',flexShrink:0}}>
                                <span style={{fontSize:'11px',color:'#a0a09a'}}>Line:</span>
                                <input type="text"
                                  value={handicapLines[b.id] || b.handicapLine || ''}
                                  onChange={e=>updateHandicapLine(b.id, e.target.value)}
                                  placeholder="e.g. -1.5"
                                  style={{width:'60px',padding:'4px 8px',borderRadius:'6px',border:'1px solid rgba(245,200,66,0.3)',background:'rgba(7,31,16,0.8)',color:'#f5c842',fontWeight:700,fontSize:'14px',outline:'none',fontFamily:'inherit',textAlign:'center'}} />
                              </div>
                            )}
                            <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'6px 10px',flex:1,minWidth:'160px'}}>
                              <span style={{fontSize:'11px',color:'#a0a09a',flexShrink:0}}>SGPools Odds:</span>
                              <input type="number" step="0.01" min="1"
                                value={odds[b.id] || (b.odds > 1 ? String(b.odds) : '')}
                                onChange={e=>updateOdds(b.id, e.target.value)}
                                placeholder="e.g. 1.85"
                                style={{flex:1,minWidth:'70px',padding:'4px 8px',borderRadius:'6px',border:'1px solid rgba(245,200,66,0.3)',background:'rgba(7,31,16,0.8)',color:'#f5c842',fontWeight:700,fontSize:'14px',outline:'none',fontFamily:'inherit'}} />
                            </div>

                            {potential !== null ? (
                              <div style={{textAlign:'center',padding:'6px 10px',borderRadius:'8px',background:'rgba(245,200,66,0.1)',border:'1px solid rgba(245,200,66,0.2)',flexShrink:0}}>
                                <div style={{fontSize:'10px',color:'#a0a09a'}}>Potential Win</div>
                                <div style={{fontWeight:900,fontSize:'15px',color:'#f5c842'}}>SGD ${potential.toFixed(2)}</div>
                              </div>
                            ) : b.stake > 0 ? (
                              <div style={{textAlign:'center',padding:'6px 10px',borderRadius:'8px',background:'rgba(255,255,255,0.04)',flexShrink:0}}>
                                <div style={{fontSize:'10px',color:'#a0a09a'}}>Potential Win</div>
                                <div style={{fontSize:'12px',color:'#a0a09a'}}>Enter odds</div>
                              </div>
                            ) : null}

                            <button onClick={()=>confirmBet(b.id)} disabled={saving===b.id}
                              style={{padding:'8px 12px',borderRadius:'8px',border:isConfirmed?'1px solid rgba(74,222,128,0.4)':'1px solid transparent',cursor:saving===b.id?'not-allowed':'pointer',fontWeight:700,fontSize:'12px',background:isConfirmed?'rgba(74,222,128,0.15)':'#f5c842',color:isConfirmed?'#4ade80':'#071f10',opacity:saving===b.id?0.5:1,flexShrink:0,whiteSpace:'nowrap'}}>
                              {saving===b.id?'Saving...':isConfirmed?'Update Odds':'Place on SGPools'}
                            </button>

                            <button onClick={()=>deleteBet(b.id, player+' — '+b.selection)} disabled={saving===b.id}
                              style={{padding:'8px 10px',borderRadius:'8px',border:'1px solid rgba(248,113,113,0.3)',cursor:'pointer',fontWeight:700,fontSize:'12px',background:'rgba(248,113,113,0.1)',color:'#f87171',flexShrink:0}}>
                              Del
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* PAYMENTS VIEW */}
        {view === 'payments' && (
          <div>
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'1px'}}>PAYMENTS</div>
              <div style={{fontSize:'12px',color:'#a0a09a',marginTop:'2px'}}>Track cash collected from each player · Balance updates in their My Bets tab</div>
            </div>

            {(()=>{
              const playerNames: string[] = [];
              bets.forEach((b:any) => { if (b.playerName && !playerNames.includes(b.playerName)) playerNames.push(b.playerName); });

              return playerNames.map(player => {
                const playerBets = bets.filter((b:any) => b.playerName === player);
                const staked = playerBets.reduce((s:number,b:any)=>s+(b.stake||0),0);
                const winnings = playerBets.filter((b:any)=>b.settled&&b.actualWin>0).reduce((s:number,b:any)=>s+(b.actualWin||0),0);
                const playerPayments = payments.filter((p:any) => p.playerName === player);
                const totalPaid = playerPayments.reduce((s:number,p:any)=>s+p.amount,0);
                const balance = Math.round((staked - winnings - totalPaid) * 100) / 100;

                return (
                  <div key={player} style={{background:'rgba(255,255,255,0.04)',border:'1px solid '+(balance>0?'rgba(248,113,113,0.25)':balance<0?'rgba(74,222,128,0.25)':'rgba(255,255,255,0.1)'),borderRadius:'14px',marginBottom:'12px',overflow:'hidden'}}>
                    {/* Player header */}
                    <div style={{padding:'12px 16px',background:'rgba(245,200,66,0.06)',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                        <div style={{fontWeight:900,fontSize:'18px',color:'#f5c842'}}>{player}</div>
                        <div style={{display:'flex',gap:'12px',fontSize:'12px',flexWrap:'wrap'}}>
                          <span style={{color:'#a0a09a'}}>Staked: <span style={{color:'#f0ede4',fontWeight:700}}>${staked.toFixed(2)}</span></span>
                          <span style={{color:'#a0a09a'}}>Won: <span style={{color:'#4ade80',fontWeight:700}}>${winnings.toFixed(2)}</span></span>
                          <span style={{color:'#a0a09a'}}>Paid: <span style={{color:'#60a5fa',fontWeight:700}}>${totalPaid.toFixed(2)}</span></span>
                        </div>
                      </div>
                      {/* Balance pill */}
                      <div style={{marginTop:'8px',padding:'8px 12px',borderRadius:'8px',background:balance>0?'rgba(248,113,113,0.1)':balance<0?'rgba(74,222,128,0.1)':'rgba(255,255,255,0.05)',display:'inline-flex',alignItems:'center',gap:'8px'}}>
                        <span style={{fontSize:'11px',color:'#a0a09a'}}>{balance>0?'Owes you:':balance<0?'You owe:':'Settled'}</span>
                        <span style={{fontWeight:900,fontSize:'16px',color:balance>0?'#f87171':balance<0?'#4ade80':'#a0a09a'}}>{balance===0?'All good!':'$'+Math.abs(balance).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Record payment */}
                    <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <div style={{fontSize:'11px',color:'#f5c842',fontWeight:700,marginBottom:'6px'}}>Record Payment Received</div>
                      <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.05)',borderRadius:'8px',padding:'6px 10px'}}>
                          <span style={{fontSize:'11px',color:'#a0a09a'}}>SGD $</span>
                          <input type="number" min="0" step="1"
                            value={payInput[player] || ''}
                            onChange={e=>setPayInput(p=>({...p,[player]:e.target.value}))}
                            placeholder="Amount"
                            style={{width:'70px',padding:'4px 6px',borderRadius:'6px',border:'1px solid rgba(245,200,66,0.3)',background:'rgba(7,31,16,0.8)',color:'#f5c842',fontWeight:700,fontSize:'14px',outline:'none',fontFamily:'inherit',textAlign:'center'}} />
                        </div>
                        <input type="text"
                          value={payNote[player] || ''}
                          onChange={e=>setPayNote(p=>({...p,[player]:e.target.value}))}
                          placeholder="Note (optional, e.g. PayNow)"
                          style={{flex:1,minWidth:'120px',padding:'8px 10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.15)',background:'rgba(255,255,255,0.05)',color:'#f0ede4',fontSize:'12px',outline:'none',fontFamily:'inherit'}} />
                        <button onClick={()=>recordPayment(player)} disabled={saving==='pay_'+player}
                          style={{padding:'8px 14px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,fontSize:'12px',background:'#f5c842',color:'#071f10',opacity:saving==='pay_'+player?0.5:1,whiteSpace:'nowrap'}}>
                          {saving==='pay_'+player?'Saving...':'Record Payment'}
                        </button>
                      </div>
                    </div>

                    {/* Payment history */}
                    {playerPayments.length > 0 && (
                      <div style={{padding:'12px 16px'}}>
                        <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'6px',fontWeight:600}}>Payment History</div>
                        <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                          {playerPayments.map((p:any) => (
                            <div key={p.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',borderRadius:'8px',background:'rgba(96,165,250,0.08)',border:'1px solid rgba(96,165,250,0.15)'}}>
                              <div>
                                <span style={{fontWeight:700,color:'#60a5fa',fontSize:'13px'}}>+${p.amount.toFixed(2)}</span>
                                {p.note && <span style={{fontSize:'11px',color:'#a0a09a',marginLeft:'8px'}}>{p.note}</span>}
                                <div style={{fontSize:'10px',color:'#a0a09a'}}>{new Date(p.createdAt).toLocaleDateString('en-SG',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
                              </div>
                              <button onClick={()=>deletePayment(p.id)}
                                style={{padding:'4px 8px',borderRadius:'6px',border:'1px solid rgba(248,113,113,0.3)',background:'rgba(248,113,113,0.1)',color:'#f87171',cursor:'pointer',fontSize:'11px',fontWeight:600}}>
                                Del
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
