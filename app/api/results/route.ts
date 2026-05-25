import { NextRequest, NextResponse } from 'next/server';
import { setMatchResult, getMatchResults } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await getMatchResults());
}

export async function POST(req: NextRequest) {
  const { adminKey, matchId, homeScore, awayScore, htHomeScore, htAwayScore } = await req.json();
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await setMatchResult(matchId, {
    matchId,
    homeScore: parseInt(homeScore),
    awayScore: parseInt(awayScore),
    htHomeScore: parseInt(htHomeScore || '0'),
    htAwayScore: parseInt(htAwayScore || '0'),
  });
  return NextResponse.json({ ok: true });
}
