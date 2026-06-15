import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const PAYMENTS_KEY = 'wc2026:payments';

export interface Payment {
  id: string;
  playerName: string;
  amount: number;
  note: string;
  createdAt: string;
}

export async function GET() {
  const payments = await redis.get<Payment[]>(PAYMENTS_KEY) || [];
  return NextResponse.json(payments);
}

export async function POST(req: NextRequest) {
  const { adminKey, playerName, amount, note, deleteId } = await req.json();

  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payments = await redis.get<Payment[]>(PAYMENTS_KEY) || [];

  if (deleteId) {
    await redis.set(PAYMENTS_KEY, payments.filter((p:Payment) => p.id !== deleteId));
    return NextResponse.json({ ok: true });
  }

  if (!playerName || !amount || amount <= 0) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const newPayment: Payment = {
    id: Date.now().toString(),
    playerName: playerName.trim(),
    amount: parseFloat(amount),
    note: note || '',
    createdAt: new Date().toISOString(),
  };

  await redis.set(PAYMENTS_KEY, [...payments, newPayment]);
  return NextResponse.json(newPayment, { status: 201 });
}
