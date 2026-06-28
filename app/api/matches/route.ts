import { NextRequest, NextResponse } from 'next/server';
import { getResults, setResult } from '@/lib/db';
import { MATCHES } from '@/lib/data';

// Convert 2-letter country code to flag emoji
function toFlag(code: string): string {
  const flags: Record<string,string> = {
    MX:'🇲🇽',ZA:'🇿🇦',KR:'🇰🇷',CZ:'🇨🇿',CA:'🇨🇦',BA:'🇧🇦',QA:'🇶🇦',CH:'🇨🇭',
    BR:'🇧🇷',MA:'🇲🇦',HT:'🇭🇹',SCO:'🏴󠁧󠁢󠁳󠁣󠁴󠁿',US:'🇺🇸',PY:'🇵🇾',AU:'🇦🇺',TR:'🇹🇷',
    DE:'🇩🇪',CW:'🇨🇼',CI:'🇨🇮',EC:'🇪🇨',NL:'🇳🇱',JP:'🇯🇵',SE:'🇸🇪',TN:'🇹🇳',
    BE:'🇧🇪',EG:'🇪🇬',IR:'🇮🇷',NZ:'🇳🇿',ES:'🇪🇸',CV:'🇨🇻',SA:'🇸🇦',UY:'🇺🇾',
    FR:'🇫🇷',SN:'🇸🇳',IQ:'🇮🇶',NO:'🇳🇴',AR:'🇦🇷',DZ:'🇩🇿',AT:'🇦🇹',JO:'🇯🇴',
    PT:'🇵🇹',CD:'🇨🇩',UZ:'🇺🇿',CO:'🇨🇴',ENG:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',GH:'🇬🇭',PA:'🇵🇦',HR:'🇭🇷',
  };
  return flags[code] || code;
}

export async function GET() {
  const results = await getResults();
  const matches = MATCHES.map(m => ({
    ...m,
    homeFlag: toFlag(m.homeFlag),
    awayFlag: toFlag(m.awayFlag),
  }));
  return NextResponse.json({ matches, results });
}

export async function POST(req: NextRequest) {
  const { targetId, result, adminKey } = await req.json();
  if (adminKey !== process.env.ADMIN_KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await setResult(targetId, result);
  return NextResponse.json({ ok: true });
}
