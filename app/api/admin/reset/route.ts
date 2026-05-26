import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { adminKey, playerName, resetResults, deleteBetId, resetMatchId } = body;

  const isAdmin = adminKey === process.env.ADMIN_KEY;
  const isPlayerDelete = adminKey === '__player__' && deleteBetId && playerName;

  if (!isAdmin && !isPlayerDelete) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Delete single bet by ID
  if (deleteBetId) {
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    // Players can only delete their own unconfirmed bets
    const filtered = bets.filter((b:any) => {
      if (b.id !== deleteBetId) return true;
      if (isPlayerDelete) return b.playerName !== playerName || b.confirmedBySGPools;
      return false; // admin can delete any
    });
    await redis.set('wc2026:bets', filtered);
    return NextResponse.json({ ok: true, deleted: bets.length - filtered.length });
  }

  // Reset ONE match result only
  if (resetMatchId) {
    // Remove match result records
    const matchResults = await redis.get<Record<string,any>>('wc2026:matchresults') || {};
    delete matchResults[resetMatchId];
    await redis.set('wc2026:matchresults', matchResults);

    const results = await redis.get<Record<string,any>>('wc2026:results') || {};
    delete results[resetMatchId];
    await redis.set('wc2026:results', results);

    // Only unsettle bets where the match ID exactly matches
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    let count = 0;
    const updated = bets.map((b:any) => {
      // Get the match ID from targetId - it's always the part before the first underscore
      // For 1X2 bets: targetId = "A1" (no underscore)
      // For other bets: targetId = "A1_score_4-0" or "A1_btts-yes" etc.
      const betMatchId = b.targetId.includes('_') ? b.targetId.split('_')[0] : b.targetId;
      if (betMatchId !== resetMatchId) return b; // not this match, leave alone
      count++;
      return { ...b, settled: false, actualWin: 0 };
    });
    await redis.set('wc2026:bets', updated);
    return NextResponse.json({ ok: true, unsettled: count });
  }

  // Clear ALL results and unsettle all bets
  if (resetResults) {
    await redis.del('wc2026:results');
    await redis.del('wc2026:matchresults');
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    await redis.set('wc2026:bets', bets.map((b:any) => ({ ...b, settled: false, actualWin: 0 })));
    return NextResponse.json({ ok: true });
  }

  // Clear bets for one player
  if (playerName) {
    const bets = await redis.get<any[]>('wc2026:bets') || [];
    await redis.set('wc2026:bets', bets.filter((b:any) => b.playerName !== playerName));
    return NextResponse.json({ ok: true });
  }

  // Clear ALL bets
  await redis.del('wc2026:bets');
  return NextResponse.json({ ok: true });
}
