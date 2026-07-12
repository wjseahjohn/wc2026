import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export interface Bet {
  id: string;
  playerName: string;
  betType: string;
  targetId: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  actualWin: number;
  settled: boolean;
  confirmedBySGPools: boolean;
  createdAt: string;
  handicapLine?: string;
}

export interface MatchResult {
  matchId: string;
  homeScore: number;
  awayScore: number;
  htHomeScore: number;
  htAwayScore: number;
}

const BETS_KEY = 'wc2026:bets';
const RESULTS_KEY = 'wc2026:results';
const MATCH_RESULTS_KEY = 'wc2026:matchresults';

export async function getAllBets(): Promise<Bet[]> {
  try {
    const data = await redis.get<Bet[]>(BETS_KEY);
    return data || [];
  } catch { return []; }
}

export async function addBet(b: Omit<Bet,'id'|'createdAt'|'settled'|'actualWin'|'confirmedBySGPools'>): Promise<Bet> {
  const bet: Bet = { ...b, id: 'b_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), createdAt: new Date().toISOString(), settled: false, actualWin: 0, confirmedBySGPools: false };
  const all = await getAllBets();
  await redis.set(BETS_KEY, [...all, bet]);
  return bet;
}

export async function confirmBets(betIds: string[], oddsMap: Record<string,number> = {}, handicapLineMap: Record<string,string> = {}): Promise<void> {
  const all = await getAllBets();
  await redis.set(BETS_KEY, all.map(b => {
    if (!betIds.includes(b.id)) return b;
    const newOdds = oddsMap[b.id] || b.odds;
    const newPotential = b.stake > 0 && newOdds > 0 ? Math.round(b.stake * newOdds * 100) / 100 : b.potentialWin;
    // If bet already won, recalculate actualWin with new odds
    const newActualWin = b.settled && b.actualWin > 0 ? newPotential : b.actualWin;
    const newHandicapLine = handicapLineMap[b.id] !== undefined ? handicapLineMap[b.id] : b.handicapLine;
    return { ...b, confirmedBySGPools: true, odds: newOdds, potentialWin: newPotential, actualWin: newActualWin, handicapLine: newHandicapLine };
  }));
}

export async function getResults(): Promise<Record<string, string>> {
  try { return await redis.get<Record<string,string>>(RESULTS_KEY) || {}; }
  catch { return {}; }
}

export async function getMatchResults(): Promise<Record<string, MatchResult>> {
  try { return await redis.get<Record<string,MatchResult>>(MATCH_RESULTS_KEY) || {}; }
  catch { return {}; }
}

// Determine if a bet won based on match result
function didBetWin(bet: Bet, result: MatchResult): boolean {
  const { homeScore, awayScore, htHomeScore, htAwayScore } = result;
  const sel = bet.selection;
  const bt = bet.betType;
  const matchId = (bet.targetId.startsWith('R32')||bet.targetId.startsWith('R16')||bet.targetId.startsWith('QF')||bet.targetId.startsWith('SF')) ? bet.targetId.split('_').slice(0,2).join('_') : bet.targetId.split('_')[0];

  // Only settle bets for this match
  if (!bet.targetId.startsWith(matchId)) return false;

  // 1X2
  if (bt === '1x2') {
    if (sel === 'home') return homeScore > awayScore;
    if (sel === 'away') return awayScore > homeScore;
    if (sel === 'draw') return homeScore === awayScore;
  }

  // Correct Score
  if (bt === 'correct_score') {
    const parts = sel.split('-');
    return parseInt(parts[0]) === homeScore && parseInt(parts[1]) === awayScore;
  }

  // Half Time Correct Score
  if (bt === 'ht_correct_score') {
    const parts = sel.split('-');
    return parseInt(parts[0]) === htHomeScore && parseInt(parts[1]) === htAwayScore;
  }

  // Over/Under 2.5
  if (bt === 'ou_over' || sel === 'ou-over') return (homeScore + awayScore) > 2.5;
  if (bt === 'ou_under' || sel === 'ou-under') return (homeScore + awayScore) < 2.5;

  // BTTS
  if (bt === 'btts_yes' || sel === 'btts-yes') return homeScore > 0 && awayScore > 0;
  if (bt === 'btts_no' || sel === 'btts-no') return homeScore === 0 || awayScore === 0;

  // Full Time Total Goals (exact)
  if (bt === 'total_goals') {
    const total = homeScore + awayScore;
    if (sel === '8+') return total >= 8;
    return total === parseInt(sel);
  }

  // Half Time Total Goals (exact)
  if (bt === 'ht_goals') {
    const htTotal = htHomeScore + htAwayScore;
    if (sel === 'ht5+') return htTotal >= 5;
    const num = parseInt(sel.replace('ht',''));
    return htTotal === num;
  }

  // HT 1X2
  if (bt === 'htx2_home') return htHomeScore > htAwayScore;
  if (bt === 'htx2_draw') return htHomeScore === htAwayScore;
  if (bt === 'htx2_away') return htAwayScore > htHomeScore;

  // Goal Handicap
  // Line is from the perspective of the team that was bet on.
  // e.g. handicap_home with line "-1.5" means home needs to win by 2+
  // handicap_home with line "+1.5" means home can lose by 1 and still win the bet
  if (bt === 'handicap_home' || bt === 'handicap_away') {
    const line = parseFloat(bet.handicapLine || '0');
    if (isNaN(line)) return false;
    const diff = bt === 'handicap_home' ? (homeScore - awayScore) : (awayScore - homeScore);
    return (diff + line) > 0;
  }

  // HT/FT
  if (bt === 'htft') {
    const htResult = htHomeScore > htAwayScore ? '1' : htHomeScore < htAwayScore ? '2' : 'X';
    const ftResult = homeScore > awayScore ? '1' : homeScore < awayScore ? '2' : 'X';
    return sel === htResult+'/'+ftResult;
  }

  return false;
}

export async function setMatchResult(matchId: string, result: MatchResult): Promise<void> {
  // Save full result
  const allResults = await getMatchResults();
  allResults[matchId] = result;
  await redis.set(MATCH_RESULTS_KEY, allResults);

  // Save simple 1X2 result for display
  const simpleResults = await getResults();
  const { homeScore, awayScore } = result;
  simpleResults[matchId] = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw';
  await redis.set(RESULTS_KEY, simpleResults);

  // Settle all bets for this match (re-settle if updating)
  const all = await getAllBets();
  const updated = all.map(bet => {
    const betMatchId = (bet.targetId.startsWith('R32')||bet.targetId.startsWith('R16')||bet.targetId.startsWith('QF')||bet.targetId.startsWith('SF')) ? bet.targetId.split('_').slice(0,2).join('_') : bet.targetId.split('_')[0];
    if (betMatchId !== matchId) return bet;
    const won = didBetWin(bet, result);
    return { ...bet, settled: true, actualWin: won ? Math.round(bet.stake * bet.odds * 100) / 100 : 0 };
  });
  await redis.set(BETS_KEY, updated);
}

// Keep old setResult for compatibility
export async function setResult(targetId: string, result: string): Promise<void> {
  const results = await getResults();
  results[targetId] = result;
  await redis.set(RESULTS_KEY, results);
}

export interface PlayerStats {
  name: string; bets: number; won: number; lost: number; pending: number;
  staked: number; winnings: number; net: number; paid: number; balance: number;
}

export async function getLeaderboard(): Promise<PlayerStats[]> {
  const all = await getAllBets();
  const payments = await redis.get<any[]>('wc2026:payments') || [];
  const map: Record<string, PlayerStats> = {};
  for (const b of all) {
    if (!map[b.playerName]) map[b.playerName] = { name: b.playerName, bets: 0, won: 0, lost: 0, pending: 0, staked: 0, winnings: 0, net: 0, paid: 0, balance: 0 };
    map[b.playerName].bets++;
    if (b.stake > 0) map[b.playerName].staked += b.stake; // ALL bets for balance tracking
    if (b.settled) {
      if (b.actualWin > 0) { map[b.playerName].won++; map[b.playerName].winnings += b.actualWin; }
      else map[b.playerName].lost++;
    } else {
      map[b.playerName].pending++;
    }
  }
  // Add payments per player
  for (const p of payments) {
    if (map[p.playerName]) map[p.playerName].paid += p.amount;
  }
  return Object.values(map).map(p => ({
    ...p,
    net: Math.round((p.winnings - p.staked) * 100) / 100,
    // balance: positive = player owes you, negative = you owe player
    // staked (all) - winnings (settled) - paid = net cash position
    balance: Math.round((p.staked - p.winnings - p.paid) * 100) / 100,
  })).sort((a, b) => b.net - a.net);
}
