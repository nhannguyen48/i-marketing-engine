// Semantic search over past meeting sessions using OpenAI text-embedding-3-small.
// Computes cosine similarity between the current task and stored session summaries.
// Falls back to keyword matching when OpenAI key is absent.

import { getAllSessions, type MeetingSession } from './meeting-session-kv-memory-store';

const EMBED_MODEL = 'text-embedding-3-small';
const TOP_K       = 3;   // max sessions to inject into prompt
const MIN_SCORE   = 0.30; // cosine similarity threshold

async function embed(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  if (!res.ok) throw new Error('embed failed');
  const data = await res.json();
  return data.data[0].embedding as number[];
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] ** 2; nb += b[i] ** 2; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

// Lightweight keyword fallback: score by shared word overlap
function keywordScore(task: string, session: MeetingSession): number {
  const taskWords  = new Set(task.toLowerCase().split(/\s+/));
  const haystack   = (session.task + ' ' + session.topic + ' ' + session.summary).toLowerCase().split(/\s+/);
  const matches    = haystack.filter(w => taskWords.has(w)).length;
  return matches / (taskWords.size + 1);
}

export async function findRelatedSessions(task: string): Promise<MeetingSession[]> {
  const sessions = await getAllSessions();
  if (!sessions.length) return [];

  const apiKey = process.env.OPENAI_API_KEY ?? '';

  try {
    if (apiKey) {
      const [taskVec, ...sessionVecs] = await Promise.all([
        embed(task, apiKey),
        ...sessions.map(s => embed(s.task + ' ' + s.summary, apiKey)),
      ]);

      return sessions
        .map((s, i) => ({ s, score: cosine(taskVec, sessionVecs[i]) }))
        .filter(x => x.score >= MIN_SCORE)
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_K)
        .map(x => x.s);
    }
  } catch {
    // fall through to keyword fallback
  }

  // Keyword fallback
  return sessions
    .map(s => ({ s, score: keywordScore(task, s) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_K)
    .map(x => x.s);
}

// Format past sessions as context block for system prompt injection
export function formatSessionsAsContext(sessions: MeetingSession[]): string {
  if (!sessions.length) return '';

  const blocks = sessions.map(s => {
    const date = new Date(s.timestamp).toLocaleDateString('vi-VN');
    const decisions = s.decisions.map(d => `  • ${d.plan}: ${d.description}`).join('\n');
    const done = s.assignments
      .filter(a => a.status === 'done' && a.output)
      .map(a => `  • ${a.persona}: ${a.output?.slice(0, 120)}...`)
      .join('\n');
    const pending = s.assignments
      .filter(a => a.status === 'pending')
      .map(a => `  • ${a.persona} → ${a.task} [chưa xong]`)
      .join('\n');

    return [
      `📅 Phiên ${date} — "${s.task}"`,
      decisions ? `Quyết định:\n${decisions}` : '',
      done      ? `Đã thực hiện:\n${done}`     : '',
      pending   ? `Chưa xong:\n${pending}`     : '',
      s.summary ? `Tóm tắt: ${s.summary.slice(0, 200)}` : '',
    ].filter(Boolean).join('\n');
  });

  return blocks.join('\n\n─────\n\n');
}
