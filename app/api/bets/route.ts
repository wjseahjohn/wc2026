import { NextRequest, NextResponse } from 'next/server';
import { getAllBets, addBet } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await getAllBets());
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.playerName || !b.selection || !b.odds || !b.stake) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  const bet = await addBet({ playerName: b.playerName.trim(), betType: b.betType, targetId: b.targetId, selection: b.selection, odds: b.odds, stake: b.stake, potentialWin: Math.round(b.stake * b.odds) });
  return NextResponse.json(bet, { status: 201 });
}
