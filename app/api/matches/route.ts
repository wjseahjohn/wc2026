import { NextRequest, NextResponse } from 'next/server';
import { getResults, setResult } from '@/lib/db';
import { MATCHES } from '@/lib/data';

export async function GET() {
  const results = await getResults();
  return NextResponse.json({ matches: MATCHES, results });
}

export async function POST(req: NextRequest) {
  const { targetId, result, adminKey } = await req.json();
  if (adminKey !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await setResult(targetId, result);
  return NextResponse.json({ ok: true });
}
