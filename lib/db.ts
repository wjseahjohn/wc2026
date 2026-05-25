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
}

const BETS_KEY = 'wc2026:bets';
const RESULTS_KEY = 'wc2026:results';

export async function getAllBets(): Promise<Bet[]> {
  try {
    const data = await redis.get<Bet[]>(BETS_KEY);
    return data || [];
  } catch { return []; }
}

export async function addBet(b: Omit<Bet, 'id'|'createdAt'|'settled'|'actualWin'|'confirmedBySGPools'>): Promise<Bet> {
  const bet: Bet = { ...b, id: 'b_'+Date.now(), createdAt: new Date().toISOString(), settled: false, actualWin: 0, confirmedBySGPools: false };
  const all = await getAllBets();
  await redis.set(BETS_KEY, [...all, bet]);
  return bet;
}

export async function confirmBets(betIds: string[], oddsMap: Record<string,number> = {}): Promise<void> {
  const all = await getAllBets();
  await redis.set(BETS_KEY, all.map(b => {
    if (!betIds.includes(b.id)) return b;
    const newOdds = oddsMap[b.id] || b.odds;
    return {
      ...b,
      confirmedBySGPools: true,
      odds: newOdds,
      potentialWin: b.stake > 0 && newOdds > 0 ? b.stake * newOdds : b.potentialWin,
    };
  }));
}

export async function getResults(): Promise<Record<string, string>> {
  try {
    const data = await redis.get<Record<string, string>>(RESULTS_KEY);
    return data || {};
  } catch { return {}; }
}

export async function setResult(targetId: string, result: string): Promise<void> {
  const results = await getResults();
  results[targetId] = result;
  await redis.set(RESULTS_KEY, results);
  const all = await getAllBets();
  const updated = all.map(bet => {
    if (bet.targetId === targetId && !bet.settled) {
      const won = bet.selection === result;
      return { ...bet, settled: true, actualWin: won ? bet.stake * bet.odds : 0 };
    }
    return bet;
  });
  await redis.set(BETS_KEY, updated);
}

export interface PlayerStats {
  name: string; bets: number; won: number; lost: number; pending: number;
  staked: number; winnings: number; net: number;
}

export async function getLeaderboard(): Promise<PlayerStats[]> {
  const all = await getAllBets();
  const map: Record<string, PlayerStats> = {};
  for (const b of all) {
    if (!map[b.playerName]) map[b.playerName] = { name: b.playerName, bets: 0, won: 0, lost: 0, pending: 0, staked: 0, winnings: 0, net: 0 };
    map[b.playerName].bets++;
    if (b.stake > 0) map[b.playerName].staked += b.stake;
    if (b.settled) {
      if (b.actualWin > 0) { map[b.playerName].won++; map[b.playerName].winnings += b.actualWin; }
      else map[b.playerName].lost++;
    } else {
      map[b.playerName].pending++;
    }
  }
  return Object.values(map).map(p => ({ ...p, net: p.winnings - p.staked })).sort((a, b) => b.net - a.net);
}
