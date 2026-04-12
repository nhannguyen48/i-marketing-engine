// Extracts structured session data (summary, decisions, assignments) from raw meeting text.
// Called after streaming ends to auto-save the session to KV memory.
// Uses Claude to parse — gracefully skips if extraction fails.

import Anthropic from '@anthropic-ai/sdk';
import type { MeetingDecision, MeetingAssignment } from './meeting-session-kv-memory-store';

export interface ExtractedSession {
  topic: string;
  summary: string;
  decisions: MeetingDecision[];
  assignments: MeetingAssignment[];
}

const EXTRACT_SYSTEM = `Bạn là parser JSON. Đọc nội dung cuộc họp và trích xuất:
- topic: 3-5 từ mô tả chủ đề (tiếng Việt, kebab-style vd: "content-facebook-thang-5")
- summary: tóm tắt 1-2 câu kết quả họp
- decisions: mảng { plan, description } — các phương án đã được thảo luận
- assignments: mảng { persona, task, status: "pending" } — phân công cụ thể sau khi duyệt

Trả về JSON thuần túy, không markdown, không giải thích.`;

export async function extractSessionFromMeetingText(
  meetingText: string,
  apiKey: string,
): Promise<ExtractedSession | null> {
  try {
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', // cheap + fast for parsing
      max_tokens: 1024,
      system: EXTRACT_SYSTEM,
      messages: [{
        role: 'user',
        content: `Nội dung cuộc họp:\n\n${meetingText.slice(0, 6000)}`,
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '';
    // Strip markdown code fences if present
    const json = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(json);

    return {
      topic:       parsed.topic       ?? 'general',
      summary:     parsed.summary     ?? '',
      decisions:   parsed.decisions   ?? [],
      assignments: (parsed.assignments ?? []).map((a: MeetingAssignment) => ({
        ...a,
        status: 'pending' as const,
      })),
    };
  } catch {
    return null;
  }
}
