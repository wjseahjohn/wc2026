import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  const { adminKey, playerName, resetResults } = await req.json();
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (resetResults) {
    await redis.del('wc2026:results');
    return NextResponse.json({ ok: true });
  }

  if (playerName) {
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    await redis.set('wc2026:bets', bets.filter((b:any) => b.playerName !== playerName));
  } else {
    await redis.del('wc2026:bets');
  }

  return NextResponse.json({ ok: true });
}
