import { NextRequest, NextResponse } from 'next/server';
import { getAllBets, addBet, confirmBets } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await getAllBets());
}

export async function POST(req: NextRequest) {
  const b = await req.json();

  if (b.action === 'confirm' && b.betIds) {
    await confirmBets(b.betIds, b.oddsMap || {});
    return NextResponse.json({ ok: true });
  }

  if (!b.playerName || !b.selection) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  const bet = await addBet({
    playerName: b.playerName.trim(),
    betType: b.betType,
    targetId: b.targetId,
    selection: b.selection,
    odds: b.odds || 1,
    stake: b.stake || 0,
    potentialWin: 0,
  });
  return NextResponse.json(bet, { status: 201 });
}
