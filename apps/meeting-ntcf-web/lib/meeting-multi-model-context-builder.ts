// Orchestrates parallel fetches from Tavily, OpenAI, Gemini, GSC, GA4, KV memory, and stock media.
// Returns combined MeetingContext for injection into the system prompt.
// Each source is optional — missing env var → empty string, never blocks the meeting.

import { fetchTavilySearch } from './tavily-web-search-api-fetcher';
import { fetchBaoOpenAIInsight, fetchHungGeminiInsight } from './openai-gemini-cross-model-persona-insight-fetcher';
import { fetchGscSeoData } from './google-search-console-seo-data-fetcher';
import { fetchGa4TrafficData } from './google-analytics-ga4-traffic-fetcher';
import { findRelatedSessions, formatSessionsAsContext } from './meeting-semantic-session-retriever';
import { fetchStockMedia, formatStockMediaAsContext } from './stock-media-pexels-pixabay-unsplash-fetcher';
import { fetchBrandKnowledge } from './brand-knowledge-redis-fetcher';

export interface MeetingContext {
  searchResults:  string;
  baoInsight:     string;
  hungInsight:    string;
  gscData:        string;
  ga4Data:        string;
  pastSessions:   string;
  stockMedia:     string;
  brandKnowledge: string;
  activeModels:   string[];
}

function isSeoTask(task: string): boolean {
  return /seo|content|từ khóa|keyword|rank|tìm kiếm|google|website|organic|bài viết|traffic|lưu lượng/i.test(task);
}

function isAnalyticsTask(task: string): boolean {
  return /analytic|dữ liệu|data|traffic|lưu lượng|conversion|chuyển đổi|hiệu quả|báo cáo|số liệu|kết quả|campaign|chiến dịch/i.test(task);
}

// Triggers stock media fetch for Khoa/Ngọc when task is visual/creative/video
function isVisualTask(task: string): boolean {
  return /video|hình ảnh|ảnh|visual|creative|banner|thumbnail|content|quay|clip|thiết kế|design|post|facebook|tiktok|reels/i.test(task);
}

// Extract a concise search query from the task for stock media APIs
function extractSearchQuery(task: string): string {
  // Strip common Vietnamese filler words, keep meaningful keywords
  return task
    .replace(/lên kế hoạch|tạo|thiết kế|viết|làm|cho|của|và|với|về|cần|muốn/gi, '')
    .replace(/cà phê nhân tâm|cpnt/gi, 'coffee cafe vietnam')
    .trim()
    .slice(0, 80);
}

export async function buildMeetingContext(task: string): Promise<MeetingContext> {
  const tavilyKey   = process.env.TAVILY_API_KEY                     ?? '';
  const openaiKey   = process.env.OPENAI_API_KEY                     ?? '';
  const geminiKey   = process.env.GOOGLE_AI_API_KEY                  ?? '';
  const gcpEmail    = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL       ?? '';
  const gcpKey      = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ?? '';
  const pexelsKey   = process.env.PEXELS_API_KEY                     ?? '';
  const pixabayKey  = process.env.PIXABAY_API_KEY                    ?? '';
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY                ?? '';

  const hasGcpCreds  = !!(gcpEmail && gcpKey);
  const hasStockKeys = !!(pexelsKey || pixabayKey || unsplashKey);
  const needsVideo   = /video|clip|reels|tiktok|quay/i.test(task);

  const [searchResults, baoInsight, hungInsight, gscData, ga4Data, relatedSessions, stockMediaRaw, brandKnowledge] = await Promise.all([
    tavilyKey              ? fetchTavilySearch(task, tavilyKey)              : Promise.resolve(''),
    openaiKey              ? fetchBaoOpenAIInsight(task, openaiKey)          : Promise.resolve(''),
    geminiKey              ? fetchHungGeminiInsight(task, geminiKey)         : Promise.resolve(''),
    hasGcpCreds && isSeoTask(task)       ? fetchGscSeoData(gcpEmail, gcpKey)       : Promise.resolve(''),
    hasGcpCreds && isAnalyticsTask(task) ? fetchGa4TrafficData(gcpEmail, gcpKey)   : Promise.resolve(''),
    findRelatedSessions(task).catch(() => []),
    hasStockKeys && isVisualTask(task)
      ? fetchStockMedia(extractSearchQuery(task), needsVideo, { pexels: pexelsKey, pixabay: pixabayKey, unsplash: unsplashKey })
      : Promise.resolve({ images: [], videos: [] }),
    fetchBrandKnowledge().catch(() => ''),
  ]);

  const pastSessions = formatSessionsAsContext(relatedSessions);
  const stockMedia   = formatStockMediaAsContext(stockMediaRaw, extractSearchQuery(task));

  const activeModels: string[] = ['claude-sonnet-4-6'];
  if (searchResults)                                activeModels.push('tavily-search');
  if (baoInsight)                                   activeModels.push('gpt-4o-mini');
  if (hungInsight)                                  activeModels.push('gemini-2.0-flash');
  if (gscData)                                      activeModels.push('gsc');
  if (ga4Data)                                      activeModels.push('ga4');
  if (pastSessions)                                 activeModels.push('memory');
  if (stockMediaRaw.images.length || stockMediaRaw.videos.length) activeModels.push('stock-media');
  if (brandKnowledge)                               activeModels.push('brand-docs');

  return { searchResults, baoInsight, hungInsight, gscData, ga4Data, pastSessions, stockMedia, brandKnowledge, activeModels };
}
