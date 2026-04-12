// Persistent session memory for the NTCF meeting room.
// Stores session summaries, decisions, assignments, and outputs in Upstash Redis.
// Designed to be portable: swap UPSTASH_REDIS_* env vars when migrating to VPS.

import { Redis } from '@upstash/redis';

export interface MeetingDecision {
  plan: string;          // e.g. "Phương án A"
  description: string;
}

export interface MeetingAssignment {
  persona: string;
  task: string;
  status: 'pending' | 'done';
  output?: string;       // generated content after execution
}

export interface MeetingSession {
  id: string;
  timestamp: number;
  task: string;           // original task from Sếp Nhân
  topic: string;          // short topic slug for grouping
  summary: string;        // Thương's synthesis
  decisions: MeetingDecision[];
  assignments: MeetingAssignment[];
}

function getRedis(): Redis | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const SESSION_INDEX_KEY = 'ntcf:sessions:index';
const SESSION_PREFIX    = 'ntcf:session:';
const MAX_SESSIONS      = 50; // trim old sessions beyond this

export async function saveSession(session: MeetingSession): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const key = SESSION_PREFIX + session.id;
  await redis.set(key, JSON.stringify(session), { ex: 60 * 60 * 24 * 180 }); // 180 days TTL

  // Maintain sorted index by timestamp for fast retrieval
  await redis.zadd(SESSION_INDEX_KEY, { score: session.timestamp, member: session.id });

  // Trim oldest sessions beyond limit
  const total = await redis.zcard(SESSION_INDEX_KEY);
  if (total > MAX_SESSIONS) {
    const toRemove = await redis.zrange(SESSION_INDEX_KEY, 0, total - MAX_SESSIONS - 1);
    if (toRemove.length) {
      await redis.zrem(SESSION_INDEX_KEY, ...toRemove);
      for (const id of toRemove) await redis.del(SESSION_PREFIX + id);
    }
  }
}

export async function getSession(id: string): Promise<MeetingSession | null> {
  const redis = getRedis();
  if (!redis) return null;
  const raw = await redis.get<string>(SESSION_PREFIX + id);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw as MeetingSession;
}

// Returns all sessions sorted newest-first
export async function getAllSessions(): Promise<MeetingSession[]> {
  const redis = getRedis();
  if (!redis) return [];

  const ids = await redis.zrange(SESSION_INDEX_KEY, 0, -1, { rev: true });
  if (!ids.length) return [];

  const sessions: MeetingSession[] = [];
  for (const id of ids) {
    const s = await getSession(id as string);
    if (s) sessions.push(s);
  }
  return sessions;
}

// Update assignment output after execution
export async function updateAssignmentOutput(
  sessionId: string,
  personaName: string,
  output: string,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  const session = await getSession(sessionId);
  if (!session) return;

  for (const a of session.assignments) {
    if (a.persona.toUpperCase() === personaName.toUpperCase()) {
      a.output  = output;
      a.status  = 'done';
    }
  }
  await redis.set(SESSION_PREFIX + sessionId, JSON.stringify(session), { ex: 60 * 60 * 24 * 180 });
}

export function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
