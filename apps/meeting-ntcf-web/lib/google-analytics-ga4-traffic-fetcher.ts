// Fetches Google Analytics 4 traffic data for Mai (Data & Insights Manager).
// Returns sessions, traffic sources, and conversion trends for last 7 days vs prior 7 days.
// Inject into meeting when task is analytics/campaign/data/conversion related.
// Requires GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY env vars.

import { GoogleAuth } from 'google-auth-library';

const PROPERTY_ID = '517501761';
const TIMEOUT_MS  = 6000;

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  // Normalize: Vercel may store \n as literal escape sequences instead of real newlines
  const normalizedKey = privateKey.replace(/\\n/g, '\n');
  const auth = new GoogleAuth({
    credentials: { client_email: email, private_key: normalizedKey },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const client = await auth.getClient();
  const tokenResponse = await (client as { getAccessToken: () => Promise<{ token: string }> }).getAccessToken();
  return tokenResponse.token;
}

export async function fetchGa4TrafficData(email: string, privateKey: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const token = await getAccessToken(email, privateKey);

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [
            { startDate: '7daysAgo', endDate: 'today', name: 'week_current' },
            { startDate: '14daysAgo', endDate: '8daysAgo', name: 'week_prior' },
          ],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'conversions' },
          ],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 6,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timer);

    if (!res.ok) return '';
    const data = await res.json();
    if (!data.rows?.length) return '';

    // Aggregate totals across channels for current vs prior week
    let totalSessions = 0, totalUsers = 0, totalConversions = 0;
    let priorSessions = 0;

    const channelLines: string[] = [];
    for (const row of data.rows as Array<{ dimensionValues: Array<{ value: string }>; metricValues: Array<{ value: string }> }>) {
      const channel   = row.dimensionValues[0].value;
      const sessions  = parseInt(row.metricValues[0].value);
      const users     = parseInt(row.metricValues[1].value);
      const convs     = parseInt(row.metricValues[2].value);
      const priorSess = parseInt(row.metricValues[3]?.value ?? '0');

      totalSessions     += sessions;
      totalUsers        += users;
      totalConversions  += convs;
      priorSessions     += priorSess;

      channelLines.push(`• ${channel}: ${sessions} sessions, ${users} users${convs > 0 ? `, ${convs} conversions` : ''}`);
    }

    const delta = priorSessions > 0
      ? ` (${totalSessions >= priorSessions ? '+' : ''}${(((totalSessions - priorSessions) / priorSessions) * 100).toFixed(1)}% so với tuần trước)`
      : '';

    return [
      `GA4 — 7 ngày gần nhất: ${totalSessions} sessions${delta}, ${totalUsers} users, ${totalConversions} conversions`,
      'Theo kênh:',
      ...channelLines,
    ].join('\n');
  } catch {
    return '';
  }
}
