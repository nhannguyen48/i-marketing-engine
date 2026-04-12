// Fetches CPNT brand knowledge from Upstash Redis.
// Knowledge is synced by running: npm run sync:brand
// Key: meeting:brand:knowledge — no TTL, persists until next sync.
//
// Token-saving: only inject sections relevant to the current task.
// Full blob can be ~17K tokens; smart selection keeps it under ~3K.

import { Redis } from '@upstash/redis';

const REDIS_KEY = 'meeting:brand:knowledge';

// Map task keywords → section header keywords to include
const SECTION_RULES: Array<{ match: RegExp; headers: string[] }> = [
  { match: /giá|price|pricing|sỉ|wholesale|tiered|tier/i,         headers: ['CHIẾN LƯỢC GIÁ', 'BẢNG GIÁ SỈ'] },
  { match: /marketing|chiến lược|campaign|kênh|channel/i,         headers: ['CHIẾN LƯỢC MARKETING'] },
  { match: /content|nội dung|brand|tone|voice|creative|copy/i,    headers: ['BRAND GUIDELINES'] },
  { match: /design|visual|logo|màu|color|typo|banner|hình/i,      headers: ['DESIGN GUIDELINES'] },
  { match: /sản phẩm|product|robusta|arabica|culi|blend|hạt/i,    headers: ['PRODUCT PLAYBOOK'] },
  { match: /bán|sales|objection|phản đối|chốt|khách hàng/i,       headers: ['XỬ LÝ PHẢN ĐỐI'] },
  { match: /giới thiệu|referral|affiliate|recommend/i,            headers: ['CHƯƠNG TRÌNH GIỚI THIỆU'] },
  { match: /ngân sách|budget|chi phí|cost|vận hành|operation/i,   headers: ['NGÂN SÁCH VẬN HÀNH'] },
  { match: /dòng tiền|cash flow|tài chính|finance/i,              headers: ['KỊCH BẢN DÒNG TIỀN'] },
  { match: /video|script|kịch bản|quay|clip/i,                    headers: ['SCRIPT VIDEO'] },
];

// Max chars to keep after filtering (≈ 3,000 tokens ≈ 12,000 chars)
const MAX_CHARS = 12000;

function filterRelevantSections(knowledge: string, task: string): string {
  // Split into sections by '---' divider
  const sections = knowledge.split(/\n---\n/);
  if (sections.length <= 1) return knowledge.slice(0, MAX_CHARS);

  // Header block (title + date) is always kept
  const header = sections[0] ?? '';

  // Determine which section headers to include based on task
  const wantedHeaders: string[] = [];
  for (const rule of SECTION_RULES) {
    if (rule.match.test(task)) {
      rule.headers.forEach(h => { if (!wantedHeaders.includes(h)) wantedHeaders.push(h); });
    }
  }

  // If no specific match, include brand-guidelines + product as baseline
  if (wantedHeaders.length === 0) {
    wantedHeaders.push('BRAND GUIDELINES', 'PRODUCT PLAYBOOK');
  }

  const relevant = sections.slice(1).filter(sec =>
    wantedHeaders.some(h => sec.includes(h)),
  );

  const result = [header].concat(relevant).join('\n---\n');
  return result.slice(0, MAX_CHARS);
}

export async function fetchBrandKnowledge(task = ''): Promise<string> {
  const url   = process.env.UPSTASH_REDIS_REST_URL?.trim()   ?? '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? '';
  if (!url || !token) return '';

  try {
    const redis     = new Redis({ url, token });
    const knowledge = await redis.get<string>(REDIS_KEY);
    if (!knowledge) return '';
    return filterRelevantSections(knowledge, task);
  } catch {
    return '';
  }
}

export async function saveBrandKnowledge(content: string): Promise<void> {
  const url   = process.env.UPSTASH_REDIS_REST_URL?.trim()   ?? '';
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ?? '';
  if (!url || !token) throw new Error('Missing UPSTASH_REDIS_REST_URL / TOKEN');

  const redis = new Redis({ url, token });
  await redis.set(REDIS_KEY, content);  // no TTL — persists until next sync
}
