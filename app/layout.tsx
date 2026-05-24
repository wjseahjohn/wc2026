import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: '⚽ WC2026 Family Bets', description: 'World Cup 2026 family betting app' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
