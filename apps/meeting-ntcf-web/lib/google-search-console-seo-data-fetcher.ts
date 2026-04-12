// Fetches Google Search Console data for Phúc (SEO Lead).
// Returns top queries, pages, CTR and avg position for caphenhantam.com.
// Inject into meeting when task is SEO/content/keyword related.
// Requires GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY env vars.

import { GoogleAuth } from 'google-auth-library';

const SITE_URL   = 'https://caphenhantam.com/';
const TIMEOUT_MS = 6000;

async function getAccessToken(email: string, privateKey: string, scope: string): Promise<string> {
  // Normalize: Vercel may store \n as literal escape sequences instead of real newlines
  const normalizedKey = privateKey.replace(/\\n/g, '\n');
  const auth = new GoogleAuth({
    credentials: { client_email: email, private_key: normalizedKey },
    scopes: [scope],
  });
  const client = await auth.getClient();
  const tokenResponse = await (client as { getAccessToken: () => Promise<{ token: string }> }).getAccessToken();
  return tokenResponse.token;
}

export async function fetchGscSeoData(email: string, privateKey: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const token = await getAccessToken(email, privateKey, 'https://www.googleapis.com/auth/webmasters.readonly');

    const encodedSite = encodeURIComponent(SITE_URL);
    const endDate   = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 28);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    const res = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['query'],
          rowLimit: 8,
          orderBy: [{ fieldName: 'clicks', sortOrder: 'DESCENDING' }],
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) return '';
    const data = await res.json();

    if (!data.rows?.length) return '';

    const rows = (data.rows as Array<{
      keys: string[];
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>).map(r =>
      `• "${r.keys[0]}" — ${r.clicks} clicks, ${r.impressions} impressions, CTR ${(r.ctr * 100).toFixed(1)}%, vị trí TB ${r.position.toFixed(1)}`
    ).join('\n');

    return `GSC — 28 ngày gần nhất (${fmt(startDate)} → ${fmt(endDate)}):\n${rows}`;
  } catch {
    return '';
  }
}
