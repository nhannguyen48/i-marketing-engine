// Fetches real-time web search results via Tavily API for tool-augmented personas
// (Bảo competitive research, Phúc SEO data, Hà Linh trend spotting).
// Returns empty string gracefully when API key is absent or request fails.

const TIMEOUT_MS = 4000;

interface TavilyResult { title: string; content: string; }

export async function fetchTavilySearch(query: string, apiKey: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        max_results: 4,
        include_answer: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return '';
    const data = await res.json();

    const summary = data.answer ? `Tổng hợp: ${data.answer}\n\n` : '';
    const items = (data.results as TavilyResult[] || [])
      .slice(0, 3)
      .map(r => `• ${r.title}: ${r.content?.slice(0, 160)}`)
      .join('\n');

    return (summary + items).trim();
  } catch {
    return '';
  }
}
