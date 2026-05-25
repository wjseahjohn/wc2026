'use client';
import { useState, useEffect, useCallback } from 'react';
import { GROUPS } from '@/lib/data';

type Tab = 'matches' | 'winner' | 'scorer' | 'mybets' | 'board';
type BetCategory = '1x2' | 'ou' | 'btts' | 'htft' | 'score' | 'goals';

interface SlipItem {
  targetId: string; label: string; selection: string;
  selectionLabel: string; odds: number; betType: string;
}

const HTFT_OPTIONS = [
  {v:'1/1',l:'Home / Home'},{v:'1/X',l:'Home / Draw'},{v:'1/2',l:'Home / Away'},
  {v:'X/1',l:'Draw / Home'},{v:'X/X',l:'Draw / Draw'},{v:'X/2',l:'Draw / Away'},
  {v:'2/1',l:'Away / Home'},{v:'2/X',l:'Away / Draw'},{v:'2/2',l:'Away / Away'},
];

const CORRECT_SCORES = [
  '1-0','2-0','2-1','3-0','3-1','3-2',
  '0-0','1-1','2-2','3-3',
  '0-1','0-2','1-2','0-3','1-3','2-3',
];

const TOTAL_GOALS = [
  {v:'0-1',l:'0 - 1 Goals'},{v:'2-3',l:'2 - 3 Goals'},
  {v:'4-5',l:'4 - 5 Goals'},{v:'6+',l:'6+ Goals'},
];

const DEFAULT_HTFT_ODDS: Record<string,number> = {
  '1/1':2.50,'1/X':9.00,'1/2':17.00,
  'X/1':5.50,'X/X':5.00,'X/2':7.00,
  '2/1':19.00,'2/X':11.00,'2/2':3.20,
};
const DEFAULT_SCORE_ODDS: Record<string,number> = {
  '1-0':7.50,'2-0':9.00,'2-1':7.00,'3-0':14.00,'3-1':12.00,'3-2':18.00,
  '0-0':8.00,'1-1':5.50,'2-2':12.00,'3-3':34.00,
  '0-1':9.00,'0-2':11.00,'1-2':8.50,'0-3':17.00,'1-3':14.00,'2-3':20.00,
};
const DEFAULT_GOALS_ODDS: Record<string,number> = {
  '0-1':4.00,'2-3':2.10,'4-5':4.50,'6+':15.00,
};

export default function Home() {
  const [tab, setTab] = useState<Tab>('matches');
  const [name, setName] = useState('');
  const [namedIn, setNamedIn] = useState(false);
  const [data, setData] = useState<any>(null);
  const [bets, setBets] = useState<any[]>([]);
  const [board, setBoard] = useState<any[]>([]);
  const [slip, setSlip] = useState<SlipItem[]>([]);
  const [stakes, setStakes] = useState<Record<string, number>>({});
  const [slipOpen, setSlipOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [group, setGroup] = useState('A');
  const [betCat, setBetCat] = useState<BetCategory>('1x2');

  const load = useCallback(async () => {
    const [d, b, lb] = await Promise.all([
      fetch('/api/matches').then(r=>r.json()),
      fetch('/api/bets').then(r=>r.json()),
      fetch('/api/leaderboard').then(r=>r.json()),
    ]);
    setData(d); setBets(b); setBoard(lb);
  }, []);

  useEffect(() => { load(); }, [load]);

  const myBets = bets.filter((b:any) => b.playerName?.toLowerCase() === name.toLowerCase());
  const groupMatches = (g: string) => (data?.matches||[]).filter((m:any) => m.group === g);

  function addSlip(item: SlipItem) {
    setSlip(prev => {
      const i = prev.findIndex(x => x.targetId === item.targetId);
      if (i >= 0) { const n = [...prev]; n[i] = item; return n; }
      return [...prev, item];
    });
    setSlipOpen(true);
  }

  function removeSlip(id: string) {
    setSlip(p => p.filter(x => x.targetId !== id));
    setStakes(p => { const n = {...p}; delete n[id]; return n; });
  }

  async function placeBets() {
    if (!namedIn || slip.length === 0) return;
    setSubmitting(true);
    for (const item of slip) {
      await fetch('/api/bets', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ playerName: name, betType: item.betType, targetId: item.targetId, selection: item.selection, odds: item.odds, stake: stakes[item.targetId] || 50 }),
      });
    }
    setSubmitting(false);
    setToast(`🎉 ${slip.length} bet${slip.length>1?'s':''} placed! Good luck ${name}!`);
    setSlip([]); setStakes({}); setSlipOpen(false);
    load(); setTimeout(() => setToast(''), 4000);
  }

  const slipTotal = slip.reduce((s,i) => s + Math.round((stakes[i.targetId]||50) * i.odds), 0);
  const s = (id: string) => slip.find(x => x.targetId === id);

  const BET_CATS: {id: BetCategory; label: string}[] = [
    {id:'1x2',label:'1X2'},{id:'ou',label:'O/U'},{id:'btts',label:'BTTS'},
    {id:'htft',label:'HT/FT'},{id:'score',label:'Score'},{id:'goals',label:'Goals'},
  ];

  if (!data) return (
    <div style={{minHeight:'100vh',background:'#071f10',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px'}}>
      <div style={{fontSize:'64px'}}>⚽</div>
      <div style={{fontSize:'24px',color:'#f5c842',letterSpacing:'4px',fontWeight:900}}>LOADING...</div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#071f10',color:'#f0ede4',fontFamily:'system-ui,sans-serif',paddingBottom:'140px'}}>
      <div style={{position:'sticky',top:0,zIndex:40,background:'rgba(7,31,16,0.97)',borderBottom:'1px solid rgba(245,200,66,0.2)',backdropFilter:'blur(12px)',padding:'12px 16px'}}>
        <div style={{maxWidth:'600px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <div>
              <div style={{fontSize:'20px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>⚽ WC2026 BETS</div>
              <div style={{fontSize:'11px',color:'#a0a09a'}}>Family Edition · SGPools Style</div>
            </div>
            {namedIn && (
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'11px',color:'#a0a09a'}}>Playing as</div>
                <div style={{fontWeight:700,color:'#f5c842',fontSize:'14px'}}>{name}</div>
                <button onClick={()=>{setNamedIn(false);setName('');}} style={{fontSize:'10px',color:'#a0a09a',background:'none',border:'none',cursor:'pointer'}}>change</button>
              </div>
            )}
          </div>
          <div style={{display:'flex',gap:'4px',overflowX:'auto',paddingBottom:'2px',scrollbarWidth:'none'}}>
            {([['matches','🗓 Matches'],['winner','🏆 Winner'],['scorer','👟 Scorer'],['mybets','📋 My Bets'],['board','🥇 Board']] as [Tab,string][]).map(([id,label]) => (
              <button key={id} onClick={()=>setTab(id)} style={{padding:'6px 10px',borderRadius:'20px',border:'none',cursor:'pointer',whiteSpace:'nowrap',fontSize:'12px',fontWeight:600,background:tab===id?'#f5c842':'transparent',color:tab===id?'#071f10':'#a0a09a',transition:'all 0.2s',flexShrink:0}}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'600px',margin:'0 auto',padding:'16px'}}>
        {!namedIn && (
          <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.3)',borderRadius:'16px',padding:'40px 24px',textAlign:'center',marginBottom:'20px'}}>
            <div style={{fontSize:'48px',marginBottom:'12px'}}>⚽</div>
            <div style={{fontSize:'28px',fontWeight:900,color:'#f5c842',letterSpacing:'2px',marginBottom:'4px'}}>WELCOME</div>
            <div style={{color:'#a0a09a',marginBottom:'20px',fontSize:'14px'}}>Who is placing bets today?</div>
            <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&name.trim())setNamedIn(true);}} placeholder="Your name..." autoFocus
              style={{width:'100%',padding:'12px',borderRadius:'10px',border:'none',fontSize:'16px',fontWeight:600,textAlign:'center',background:'#f0ede4',color:'#071f10',marginBottom:'12px',outline:'none'}} />
            <button onClick={()=>{if(name.trim())setNamedIn(true);}} disabled={!name.trim()}
              style={{width:'100%',padding:'14px',borderRadius:'10px',border:'none',cursor:name.trim()?'pointer':'not-allowed',fontSize:'18px',fontWeight:900,letterSpacing:'2px',background:name.trim()?'#f5c842':'rgba(255,255,255,0.1)',color:name.trim()?'#071f10':'#a0a09a'}}>
              LET'S GO
            </button>
          </div>
        )}

        {toast && <div style={{padding:'12px',borderRadius:'12px',marginBottom:'12px',textAlign:'center',fontWeight:600,background:'rgba(74,222,128,0.15)',border:'1px solid rgba(74,222,128,0.4)',color:'#4ade80',fontSize:'14px'}}>{toast}</div>}

        {tab === 'matches' && (
          <div>
            <div style={{marginBottom:'14px'}}>
              <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>GROUP STAGE</div>
              <div style={{fontSize:'12px',color:'#a0a09a'}}>Select a group and bet type</div>
            </div>
            <div style={{display:'flex',gap:'4px',overflowX:'auto',marginBottom:'10px',paddingBottom:'4px',scrollbarWidth:'none'}}>
              {GROUPS.map(g => (
                <button key={g} onClick={()=>setGroup(g)} style={{padding:'7px 13px',borderRadius:'8px',border:'none',cursor:'pointer',fontWeight:700,flexShrink:0,fontSize:'13px',background:group===g?'#f5c842':'rgba(255,255,255,0.06)',color:group===g?'#071f10':'#a0a09a'}}>
                  {g}
                </button>
              ))}
            </div>
            <div style={{display:'flex',gap:'4px',marginBottom:'14px',overflowX:'auto',paddingBottom:'2px',scrollbarWidth:'none'}}>
              {BET_CATS.map(c => (
                <button key={c.id} onClick={()=>setBetCat(c.id)} style={{padding:'5px 12px',borderRadius:'20px',border:`1px solid ${betCat===c.id?'#f5c842':'rgba(255,255,255,0.15)'}`,cursor:'pointer',fontWeight:700,flexShrink:0,fontSize:'12px',background:betCat===c.id?'rgba(245,200,66,0.15)':'transparent',color:betCat===c.id?'#f5c842':'#a0a09a'}}>
                  {c.label}
                </button>
              ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {groupMatches(group).map((m: any) => {
                const result = data.results?.[m.id];
                return (
                  <div key={m.id} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'16px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                      <span style={{fontSize:'11px',color:'#a0a09a'}}>{m.date} · {m.venue.split(',')[0]}</span>
                      {result && <span style={{fontSize:'11px',padding:'2px 8px',borderRadius:'20px',background:'rgba(74,222,128,0.15)',color:'#4ade80',fontWeight:600}}>SETTLED</span>}
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',alignItems:'center',gap:'8px',marginBottom:'14px',textAlign:'center'}}>
                      <div><div style={{fontSize:'26px'}}>{m.homeFlag}</div><div style={{fontWeight:700,fontSize:'13px'}}>{m.homeTeam}</div></div>
                      <div style={{fontWeight:900,color:'#a0a09a',fontSize:'13px'}}>VS</div>
                      <div><div style={{fontSize:'26px'}}>{m.awayFlag}</div><div style={{fontWeight:700,fontSize:'13px'}}>{m.awayTeam}</div></div>
                    </div>

                    {betCat === '1x2' && (
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px'}}>
                        {[['home',m.homeTeam,m.odds1x2.home],['draw','Draw',m.odds1x2.draw],['away',m.awayTeam,m.odds1x2.away]].map(([sel,label,odd]:any) => {
                          const active = s(m.id)?.selection === sel;
                          const won = result === sel;
                          return (
                            <button key={sel} disabled={!!result||!namedIn} onClick={()=>addSlip({targetId:m.id,label:`${m.homeTeam} vs ${m.awayTeam}`,selection:sel,selectionLabel:String(label),odds:odd,betType:'1x2'})}
                              style={{padding:'8px 4px',borderRadius:'8px',border:`1px solid ${won?'#4ade80':active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:won?'rgba(74,222,128,0.15)':active?'rgba(245,200,66,0.15)':'rgba(255,255,255,0.04)',cursor:result||!namedIn?'not-allowed':'pointer',opacity:result&&!won?0.5:1}}>
                              <div style={{fontSize:'10px',color:'#a0a09a',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{label}</div>
                              <div style={{fontWeight:900,fontSize:'17px',color:active||won?'#f5c842':'#f0ede4'}}>{Number(odd).toFixed(2)}</div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {betCat === 'ou' && (
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                        {[['ou-over','Over 2.5',m.oddsOU.over,'ou_over'],['ou-under','Under 2.5',m.oddsOU.under,'ou_under']].map(([sel,label,odd,bt]:any) => {
                          const tid = `${m.id}_${sel}`; const active = !!s(tid);
                          return (
                            <button key={sel} disabled={!!result||!namedIn} onClick={()=>addSlip({targetId:tid,label:`${m.homeTeam} vs ${m.awayTeam}`,selection:sel,selectionLabel:String(label),odds:odd,betType:bt})}
                              style={{padding:'10px',borderRadius:'8px',border:`1px solid ${active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:active?'rgba(245,200,66,0.15)':'rgba(255,255,255,0.04)',cursor:result||!namedIn?'not-allowed':'pointer',opacity:result?0.5:1}}>
                              <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'4px'}}>{label}</div>
                              <div style={{fontWeight:900,fontSize:'20px',color:active?'#f5c842':'#f0ede4'}}>{Number(odd).toFixed(2)}</div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {betCat === 'btts' && (
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                        {[['btts-yes','Both Teams Score - Yes',m.oddsBTTS.yes,'btts_yes'],['btts-no','Both Teams Score - No',m.oddsBTTS.no,'btts_no']].map(([sel,label,odd,bt]:any) => {
                          const tid = `${m.id}_${sel}`; const active = !!s(tid);
                          return (
                            <button key={sel} disabled={!!result||!namedIn} onClick={()=>addSlip({targetId:tid,label:`${m.homeTeam} vs ${m.awayTeam}`,selection:sel,selectionLabel:String(label),odds:odd,betType:bt})}
                              style={{padding:'10px',borderRadius:'8px',border:`1px solid ${active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:active?'rgba(245,200,66,0.15)':'rgba(255,255,255,0.04)',cursor:result||!namedIn?'not-allowed':'pointer',opacity:result?0.5:1}}>
                              <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'4px'}}>{label}</div>
                              <div style={{fontWeight:900,fontSize:'20px',color:active?'#f5c842':'#f0ede4'}}>{Number(odd).toFixed(2)}</div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {betCat === 'htft' && (
                      <div>
                        <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'6px'}}>Halftime / Full Time Result</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'5px'}}>
                          {HTFT_OPTIONS.map(opt => {
                            const tid = `${m.id}_htft_${opt.v}`; const active = !!s(tid);
                            const odd = DEFAULT_HTFT_ODDS[opt.v] || 10.00;
                            const parts = opt.v.split('/');
                            const htLabel = parts[0]==='1'?m.homeTeam:parts[0]==='2'?m.awayTeam:'Draw';
                            const ftLabel = parts[1]==='1'?m.homeTeam:parts[1]==='2'?m.awayTeam:'Draw';
                            return (
                              <button key={opt.v} disabled={!!result||!namedIn} onClick={()=>addSlip({targetId:tid,label:`${m.homeTeam} vs ${m.awayTeam}`,selection:opt.v,selectionLabel:`${htLabel} / ${ftLabel}`,odds:odd,betType:'htft'})}
                                style={{padding:'7px 4px',borderRadius:'8px',border:`1px solid ${active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:active?'rgba(245,200,66,0.15)':'rgba(255,255,255,0.04)',cursor:result||!namedIn?'not-allowed':'pointer',opacity:result?0.5:1,textAlign:'center'}}>
                                <div style={{fontSize:'9px',color:'#a0a09a',lineHeight:'1.3',marginBottom:'2px'}}>{htLabel}<br/>/ {ftLabel}</div>
                                <div style={{fontWeight:900,fontSize:'14px',color:active?'#f5c842':'#f0ede4'}}>{odd.toFixed(2)}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {betCat === 'score' && (
                      <div>
                        <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'6px'}}>Correct Score</div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'5px'}}>
                          {CORRECT_SCORES.map(score => {
                            const tid = `${m.id}_score_${score}`; const active = !!s(tid);
                            const odd = DEFAULT_SCORE_ODDS[score] || 20.00;
                            return (
                              <button key={score} disabled={!!result||!namedIn} onClick={()=>addSlip({targetId:tid,label:`${m.homeTeam} vs ${m.awayTeam}`,selection:score,selectionLabel:`Score ${score}`,odds:odd,betType:'correct_score'})}
                                style={{padding:'7px 4px',borderRadius:'8px',border:`1px solid ${active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:active?'rgba(245,200,66,0.15)':'rgba(255,255,255,0.04)',cursor:result||!namedIn?'not-allowed':'pointer',opacity:result?0.5:1,textAlign:'center'}}>
                                <div style={{fontWeight:700,fontSize:'13px',color:active?'#f5c842':'#f0ede4',marginBottom:'1px'}}>{score}</div>
                                <div style={{fontSize:'11px',color:'#a0a09a'}}>{odd.toFixed(2)}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {betCat === 'goals' && (
                      <div>
                        <div style={{fontSize:'11px',color:'#a0a09a',marginBottom:'6px'}}>Total Goals in Match</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px'}}>
                          {TOTAL_GOALS.map(opt => {
                            const tid = `${m.id}_goals_${opt.v}`; const active = !!s(tid);
                            const odd = DEFAULT_GOALS_ODDS[opt.v] || 5.00;
                            return (
                              <button key={opt.v} disabled={!!result||!namedIn} onClick={()=>addSlip({targetId:tid,label:`${m.homeTeam} vs ${m.awayTeam}`,selection:opt.v,selectionLabel:opt.l,odds:odd,betType:'total_goals'})}
                                style={{padding:'10px',borderRadius:'8px',border:`1px solid ${active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:active?'rgba(245,200,66,0.15)':'rgba(255,255,255,0.04)',cursor:result||!namedIn?'not-allowed':'pointer',opacity:result?0.5:1}}>
                                <div style={{fontSize:'12px',color:'#a0a09a',marginBottom:'4px'}}>{opt.l}</div>
                                <div style={{fontWeight:900,fontSize:'20px',color:active?'#f5c842':'#f0ede4'}}>{odd.toFixed(2)}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'winner' && (
          <div>
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>🏆 TOURNAMENT WINNER</div>
              <div style={{fontSize:'12px',color:'#a0a09a'}}>Who lifts the trophy on July 19?</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              {(data?.winners||[]).map((w: any) => {
                const active = !!s(w.id);
                return (
                  <button key={w.id} disabled={!namedIn} onClick={()=>addSlip({targetId:w.id,label:'Tournament Winner',selection:w.team,selectionLabel:w.team,odds:w.odds,betType:'winner'})}
                    style={{padding:'16px',borderRadius:'12px',border:`1px solid ${active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:active?'rgba(245,200,66,0.12)':'rgba(255,255,255,0.04)',cursor:!namedIn?'not-allowed':'pointer',textAlign:'left'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                      <span style={{fontSize:'26px'}}>{w.flag}</span>
                      <span style={{fontWeight:900,fontSize:'20px',color:active?'#f5c842':'#f0ede4'}}>{w.odds.toFixed(2)}</span>
                    </div>
                    <div style={{fontWeight:700,fontSize:'14px'}}>{w.team}</div>
                    <div style={{fontSize:'11px',color:'#a0a09a'}}>Win ${w.odds.toFixed(0)} per $1</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'scorer' && (
          <div>
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>👟 TOP SCORER</div>
              <div style={{fontSize:'12px',color:'#a0a09a'}}>Who wins the Golden Boot?</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {(data?.scorers||[]).map((sc: any) => {
                const active = !!s(sc.id);
                return (
                  <button key={sc.id} disabled={!namedIn} onClick={()=>addSlip({targetId:sc.id,label:'Top Scorer',selection:sc.player,selectionLabel:sc.player,odds:sc.odds,betType:'scorer'})}
                    style={{padding:'14px',borderRadius:'12px',border:`1px solid ${active?'#f5c842':'rgba(255,255,255,0.1)'}`,background:active?'rgba(245,200,66,0.12)':'rgba(255,255,255,0.04)',cursor:!namedIn?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                      <span style={{fontSize:'22px'}}>{sc.flag}</span>
                      <div style={{textAlign:'left'}}><div style={{fontWeight:700}}>{sc.player}</div><div style={{fontSize:'12px',color:'#a0a09a'}}>{sc.team}</div></div>
                    </div>
                    <div style={{textAlign:'right'}}><div style={{fontWeight:900,fontSize:'20px',color:active?'#f5c842':'#f0ede4'}}>{sc.odds.toFixed(2)}</div><div style={{fontSize:'11px',color:'#a0a09a'}}>odds</div></div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'mybets' && (
          <div>
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>📋 MY BETS</div>
              {namedIn && <div style={{fontSize:'12px',color:'#a0a09a'}}>All bets for <span style={{color:'#f5c842'}}>{name}</span></div>}
            </div>
            {!namedIn ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>Enter your name to view your bets</div>
            ) : myBets.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No bets yet! Go to Matches to get started.</div>
            ) : (
              <>
                <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'16px'}}>
                  {myBets.map((b: any) => {
                    const won = b.settled && b.actualWin > 0;
                    const lost = b.settled && b.actualWin === 0;
                    return (
                      <div key={b.id} style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${won?'rgba(74,222,128,0.3)':lost?'rgba(248,113,113,0.2)':'rgba(255,255,255,0.1)'}`,borderRadius:'10px',padding:'14px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:'8px'}}>
                          <div style={{flex:1}}>
                            <div style={{display:'flex',gap:'5px',marginBottom:'4px',flexWrap:'wrap'}}>
                              <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'8px',background:'rgba(59,130,246,0.2)',color:'#60a5fa',fontWeight:600}}>{b.betType}</span>
                              {b.settled
                                ? <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'8px',background:won?'rgba(74,222,128,0.2)':'rgba(248,113,113,0.2)',color:won?'#4ade80':'#f87171',fontWeight:600}}>{won?'✓ WON':'✗ LOST'}</span>
                                : <span style={{fontSize:'10px',padding:'2px 6px',borderRadius:'8px',background:'rgba(232,144,26,0.2)',color:'#e8901a',fontWeight:600}}>⏳ PENDING</span>}
                            </div>
                            <div style={{fontWeight:700,marginBottom:'2px'}}>{b.selection}</div>
                            <div style={{fontSize:'12px',color:'#a0a09a'}}>Odds: {b.odds}</div>
                          </div>
                          <div style={{textAlign:'right',flexShrink:0}}>
                            <div style={{fontSize:'11px',color:'#a0a09a'}}>Stake / Win</div>
                            <div style={{fontWeight:900,fontSize:'16px'}}>
                              <span style={{color:'#a0a09a'}}>{b.stake}</span>
                              <span style={{color:'#a0a09a',margin:'0 3px'}}>/</span>
                              <span style={{color:won?'#4ade80':'#f5c842'}}>{b.settled ? b.actualWin : b.potentialWin}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(245,200,66,0.2)',borderRadius:'12px',padding:'16px'}}>
                  <div style={{fontWeight:900,color:'#f5c842',marginBottom:'12px',letterSpacing:'1px'}}>SUMMARY</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'8px',textAlign:'center'}}>
                    {[
                      ['Bets',myBets.length,'#f0ede4'],
                      ['Won',myBets.filter((b:any)=>b.settled&&b.actualWin>0).length,'#4ade80'],
                      ['Net',`${myBets.reduce((s:number,b:any)=>s+(b.actualWin||0)-b.stake,0)>=0?'+':''}${myBets.reduce((s:number,b:any)=>s+(b.actualWin||0)-b.stake,0)}`,myBets.reduce((s:number,b:any)=>s+(b.actualWin||0)-b.stake,0)>=0?'#4ade80':'#f87171'],
                    ].map(([l,v,c])=>(
                      <div key={String(l)}><div style={{fontWeight:900,fontSize:'22px',color:String(c)}}>{v}</div><div style={{fontSize:'11px',color:'#a0a09a'}}>{l}</div></div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'board' && (
          <div>
            <div style={{marginBottom:'16px'}}>
              <div style={{fontSize:'22px',fontWeight:900,color:'#f5c842',letterSpacing:'2px'}}>🥇 LEADERBOARD</div>
              <div style={{fontSize:'12px',color:'#a0a09a'}}>Family rankings by net points</div>
            </div>
            {board.length === 0 ? (
              <div style={{padding:'40px',textAlign:'center',color:'#a0a09a',background:'rgba(255,255,255,0.04)',borderRadius:'12px'}}>No settled bets yet!</div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                {board.map((p:any,i:number) => (
                  <div key={p.name} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'16px',display:'flex',alignItems:'center',gap:'16px'}}>
                    <div style={{fontSize:'28px',minWidth:'36px',textAlign:'center'}}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:'16px'}}>{p.name}</div><div style={{fontSize:'12px',color:'#a0a09a'}}>{p.won}/{p.bets} won</div></div>
                    <div style={{textAlign:'right'}}><div style={{fontWeight:900,fontSize:'20px',color:p.net>=0?'#4ade80':'#f87171'}}>{p.net>=0?'+':''}{p.net}</div><div style={{fontSize:'11px',color:'#a0a09a'}}>net pts</div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {slip.length > 0 && (
        <div style={{position:'fixed',bottom:'16px',left:0,right:0,zIndex:50,maxWidth:'600px',margin:'0 auto',padding:'0 16px'}}>
          <div style={{background:'linear-gradient(135deg,#1a2f1e,#0d1f10)',border:'1px solid rgba(245,200,66,0.35)',borderRadius:'16px',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.6)'}}>
            <button onClick={()=>setSlipOpen(!slipOpen)} style={{width:'100%',padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(245,200,66,0.08)',border:'none',cursor:'pointer',color:'#f0ede4'}}>
              <span style={{fontWeight:900,color:'#f5c842',letterSpacing:'1px',fontSize:'14px'}}>⚡ BET SLIP ({slip.length})</span>
              <span style={{color:'#f5c842',fontWeight:700,fontSize:'13px'}}>Potential: {slipTotal} pts {slipOpen?'▼':'▲'}</span>
            </button>
            {slipOpen && (
              <div style={{padding:'12px 16px'}}>
                <div style={{display:'flex',flexDirection:'column',gap:'10px',maxHeight:'220px',overflowY:'auto',marginBottom:'12px'}}>
                  {slip.map(item => (
                    <div key={item.targetId} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:'10px',color:'#a0a09a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.label}</div>
                        <div style={{fontWeight:700,color:'#f5c842',fontSize:'12px'}}>{item.selectionLabel} @ {item.odds.toFixed(2)}</div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:'6px',flexShrink:0}}>
                        <div>
                          <input type="number" min={10} max={500} step={10} value={stakes[item.targetId]||50} onChange={e=>setStakes(p=>({...p,[item.targetId]:Math.max(10,Math.min(500,Number(e.target.value)))}))}
                            style={{width:'58px',padding:'4px 6px',borderRadius:'6px',border:'none',background:'#f0ede4',color:'#071f10',fontWeight:700,fontSize:'12px',textAlign:'center'}} />
                          <div style={{fontSize:'10px',color:'#f5c842',textAlign:'center'}}>→{Math.round((stakes[item.targetId]||50)*item.odds)}</div>
                        </div>
                        <button onClick={()=>removeSlip(item.targetId)} style={{background:'none',border:'none',color:'#a0a09a',cursor:'pointer',fontSize:'16px'}}>×</button>
                      </div>
                    </div>
                  ))}
                </div>
                {!namedIn ? (
                  <div style={{textAlign:'center',color:'#e8901a',fontSize:'13px'}}>Enter your name first</div>
                ) : (
                  <div style={{display:'flex',gap:'8px'}}>
                    <button onClick={()=>{setSlip([]);setStakes({});}} style={{padding:'10px 14px',borderRadius:'10px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'#a0a09a',cursor:'pointer',fontSize:'13px'}}>Clear</button>
                    <button onClick={placeBets} disabled={submitting}
                      style={{flex:1,padding:'10px',borderRadius:'10px',border:'none',cursor:'pointer',fontWeight:900,fontSize:'14px',letterSpacing:'1px',background:submitting?'rgba(245,200,66,0.5)':'#f5c842',color:'#071f10'}}>
                      {submitting?'PLACING...`':`PLACE ${slip.length} BET${slip.length>1?'S':''}`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
