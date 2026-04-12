// Fetches free stock images and videos from Pexels, Pixabay, and Unsplash in parallel.
// Called when task is visual/video/creative related — assets injected into system prompt
// so Khoa (Video) and Ngọc (Creative) can cite real URLs in their recommendations.
// All three APIs are free tier — graceful empty string on failure.

const TIMEOUT_MS = 5000;

export interface StockAsset {
  type: 'image' | 'video';
  source: 'pexels' | 'pixabay' | 'unsplash';
  thumb: string;   // small thumbnail URL for display
  full: string;    // full-res URL for download
  preview?: string; // video preview URL (video only)
  title: string;
  link: string;    // attribution page URL
}

function abort(ms: number) {
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

// ── Pexels ──────────────────────────────────────────────────────────────────

async function fetchPexelsImages(query: string, apiKey: string): Promise<StockAsset[]> {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=4&orientation=landscape`,
      { headers: { Authorization: apiKey }, signal: abort(TIMEOUT_MS) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.photos ?? []).map((p: {
      src: { medium: string; original: string };
      alt: string;
      url: string;
    }) => ({
      type: 'image', source: 'pexels',
      thumb: p.src.medium, full: p.src.original,
      title: p.alt || query, link: p.url,
    }));
  } catch { return []; }
}

async function fetchPexelsVideos(query: string, apiKey: string): Promise<StockAsset[]> {
  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=3`,
      { headers: { Authorization: apiKey }, signal: abort(TIMEOUT_MS) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.videos ?? []).map((v: {
      image: string;
      video_files: Array<{ quality: string; link: string }>;
      url: string;
      id: number;
    }) => {
      const sd = v.video_files?.find((f: { quality: string }) => f.quality === 'sd') ?? v.video_files?.[0];
      return {
        type: 'video', source: 'pexels',
        thumb: v.image, full: sd?.link ?? '',
        preview: sd?.link, title: `Video #${v.id}`, link: v.url,
      };
    });
  } catch { return []; }
}

// ── Pixabay ──────────────────────────────────────────────────────────────────

async function fetchPixabayImages(query: string, apiKey: string): Promise<StockAsset[]> {
  try {
    const res = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=4&safesearch=true&orientation=horizontal`,
      { signal: abort(TIMEOUT_MS) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.hits ?? []).map((h: {
      webformatURL: string;
      largeImageURL: string;
      tags: string;
      pageURL: string;
    }) => ({
      type: 'image', source: 'pixabay',
      thumb: h.webformatURL, full: h.largeImageURL,
      title: h.tags || query, link: h.pageURL,
    }));
  } catch { return []; }
}

async function fetchPixabayVideos(query: string, apiKey: string): Promise<StockAsset[]> {
  try {
    const res = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=3`,
      { signal: abort(TIMEOUT_MS) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.hits ?? []).map((h: {
      picture_id: string;
      videos: { medium?: { url: string }; small?: { url: string } };
      tags: string;
      pageURL: string;
    }) => {
      const url = h.videos?.medium?.url ?? h.videos?.small?.url ?? '';
      return {
        type: 'video', source: 'pixabay',
        thumb: `https://i.vimeocdn.com/video/${h.picture_id}_295x166.jpg`,
        full: url, preview: url,
        title: h.tags || query, link: h.pageURL,
      };
    });
  } catch { return []; }
}

// ── Unsplash ─────────────────────────────────────────────────────────────────

async function fetchUnsplashImages(query: string, apiKey: string): Promise<StockAsset[]> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=4&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${apiKey}` }, signal: abort(TIMEOUT_MS) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).map((p: {
      urls: { small: string; full: string };
      alt_description: string;
      description: string;
      links: { html: string };
    }) => ({
      type: 'image', source: 'unsplash',
      thumb: p.urls.small, full: p.urls.full,
      title: p.alt_description || p.description || query,
      link: p.links.html,
    }));
  } catch { return []; }
}

// ── Main export ───────────────────────────────────────────────────────────────

export interface StockMediaResult {
  images: StockAsset[];
  videos: StockAsset[];
}

export async function fetchStockMedia(
  query: string,
  needsVideo: boolean,
  keys: { pexels: string; pixabay: string; unsplash: string },
): Promise<StockMediaResult> {
  const fetches: Promise<StockAsset[]>[] = [
    keys.pexels   ? fetchPexelsImages(query, keys.pexels)     : Promise.resolve([]),
    keys.pixabay  ? fetchPixabayImages(query, keys.pixabay)   : Promise.resolve([]),
    keys.unsplash ? fetchUnsplashImages(query, keys.unsplash) : Promise.resolve([]),
  ];

  if (needsVideo) {
    fetches.push(
      keys.pexels  ? fetchPexelsVideos(query, keys.pexels)   : Promise.resolve([]),
      keys.pixabay ? fetchPixabayVideos(query, keys.pixabay) : Promise.resolve([]),
    );
  }

  const results = await Promise.all(fetches);
  const all = results.flat();

  return {
    images: all.filter(a => a.type === 'image').slice(0, 6),
    videos: all.filter(a => a.type === 'video').slice(0, 4),
  };
}

// Format assets as context block for system prompt injection
export function formatStockMediaAsContext(media: StockMediaResult, query: string): string {
  if (!media.images.length && !media.videos.length) return '';

  const lines: string[] = [`📸 STOCK ASSETS — "${query}" (miễn phí, sẵn sàng dùng):`];

  if (media.images.length) {
    lines.push('\nHình ảnh:');
    media.images.forEach((a, i) => {
      lines.push(`${i + 1}. [${a.source.toUpperCase()}] ${a.title.slice(0, 60)}`);
      lines.push(`   Thumb: ${a.thumb}`);
      lines.push(`   Full: ${a.full}`);
      lines.push(`   Link: ${a.link}`);
    });
  }

  if (media.videos.length) {
    lines.push('\nVideo clip:');
    media.videos.forEach((a, i) => {
      lines.push(`${i + 1}. [${a.source.toUpperCase()}] ${a.title.slice(0, 60)}`);
      lines.push(`   Thumb: ${a.thumb}`);
      lines.push(`   Download: ${a.full}`);
      lines.push(`   Link: ${a.link}`);
    });
  }

  lines.push('\nKhoa và Ngọc: khi đề xuất asset, cite URL Thumb và Full đúng như trên để frontend render được.');
  return lines.join('\n');
}
