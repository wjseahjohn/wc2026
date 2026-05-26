import { NextRequest, NextResponse } from 'next/server';
import { getAllBets, addBet, confirmBets } from '@/lib/db';

async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch('https://api.telegram.org/bot'+token+'/sendMessage', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch(e) { console.error('Telegram error:', e); }
}

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

  const playerName = b.playerName.trim().split(' ').map((w:string)=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase()).join(' ');

  const bet = await addBet({
    playerName,
    betType: b.betType,
    targetId: b.targetId,
    selection: b.selection,
    odds: b.odds || 1,
    stake: b.stake || 0,
    potentialWin: 0,
  });

  // Send Telegram notification
  const betTypeLabel: Record<string,string> = {
    '1x2':'1X2','correct_score':'Correct Score','ou_over':'Over 2.5',
    'ou_under':'Under 2.5','btts_yes':'BTTS Yes','btts_no':'BTTS No',
    'htft':'HT/FT','total_goals':'Total Goals','ht_goals':'HT Goals',
  };
  const label = betTypeLabel[b.betType] || b.betType;
  const stakeText = b.stake > 0 ? 'SGD $'+b.stake : 'no stake entered';
  const msg = '⚽ <b>New bet from '+playerName+'!</b>\n\nBet type: '+label+'\nSelection: '+b.selection+'\nStake: '+stakeText+'\n\n<a href="https://2026-wc-bets.vercel.app/facilitator">Confirm on facilitator</a>';

  await sendTelegram(msg);

  return NextResponse.json(bet, { status: 201 });
}
