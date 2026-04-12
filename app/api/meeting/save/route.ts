// POST /api/meeting/save
// Called by frontend after streaming ends to extract and persist session to KV memory.
// Body: { sessionId, task, meetingText }

import { extractSessionFromMeetingText } from '@/lib/meeting-session-summary-extractor';
import { saveSession, generateSessionId } from '@/lib/meeting-session-kv-memory-store';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { sessionId, task, meetingText } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY ?? '';
    if (!apiKey || !meetingText) return new Response('ok', { status: 200 });

    const extracted = await extractSessionFromMeetingText(meetingText, apiKey);
    if (!extracted) return new Response('ok', { status: 200 });

    await saveSession({
      id:          sessionId ?? generateSessionId(),
      timestamp:   Date.now(),
      task:        task ?? '',
      topic:       extracted.topic,
      summary:     extracted.summary,
      decisions:   extracted.decisions,
      assignments: extracted.assignments,
    });

    return new Response('ok', { status: 200 });
  } catch {
    return new Response('ok', { status: 200 }); // never fail the client
  }
}
