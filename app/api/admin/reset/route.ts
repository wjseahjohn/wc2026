import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { adminKey, playerName, resetResults, deleteBetId, resetMatchId } = await req.json();
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (deleteBetId) {
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    await redis.set('wc2026:bets', bets.filter((b:any) => b.id !== deleteBetId));
    return NextResponse.json({ ok: true });
  }

  if (resetMatchId) {
    const matchResults = await redis.get<any>('wc2026:matchresults') || {};
    delete matchResults[resetMatchId];
    await redis.set('wc2026:matchresults', matchResults);
    const results = await redis.get<any>('wc2026:results') || {};
    delete results[resetMatchId];
    await redis.set('wc2026:results', results);
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    await redis.set('wc2026:bets', bets.map((b:any) => {
      if (b.targetId?.split('_')[0] !== resetMatchId) return b;
      return { ...b, settled: false, actualWin: 0 };
    }));
    return NextResponse.json({ ok: true });
  }

  if (resetResults) {
    await redis.del('wc2026:results');
    await redis.del('wc2026:matchresults');
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    await redis.set('wc2026:bets', bets.map((b:any) => ({ ...b, settled: false, actualWin: 0 })));
    return NextResponse.json({ ok: true });
  }

  if (playerName) {
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    await redis.set('wc2026:bets', bets.filter((b:any) => b.playerName !== playerName));
    return NextResponse.json({ ok: true });
  }

  await redis.del('wc2026:bets');
  return NextResponse.json({ ok: true });
}
