// POST /api/meeting/execute
// Triggered when Sếp Nhân approves a plan ("Duyệt A/B").
// Executes all pending persona assignments and streams progress back as JSON lines.
// Body: { sessionId, task, approvedPlan, assignments, sessionContext }

import { executePersonaTask } from '@/lib/meeting-persona-task-executor';
import { updateAssignmentOutput, getSession } from '@/lib/meeting-session-kv-memory-store';
import type { MeetingAssignment } from '@/lib/meeting-session-kv-memory-store';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY ?? '';
  if (!apiKey) return new Response('missing key', { status: 500 });

  const { sessionId, task, assignments, sessionContext } = await req.json() as {
    sessionId: string;
    task: string;
    assignments: MeetingAssignment[];
    sessionContext: string;
  };

  // If assignments not passed (or empty), load from KV using sessionId.
  // The frontend saves sessions then resets sessionId — execute must use the saved ID.
  let pending: MeetingAssignment[] = (assignments ?? []).filter(
    (a: MeetingAssignment) => a.status === 'pending',
  );

  if (!pending.length && sessionId) {
    const saved = await getSession(sessionId);
    pending = (saved?.assignments ?? []).filter(a => a.status === 'pending');
  }

  if (!pending.length) return new Response('no pending assignments', { status: 400 });

  const encoder = new TextEncoder();

  // Stream JSON lines: one line per persona result as they complete
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: object) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));

      send({ type: 'start', total: pending.length });

      // Execute sequentially to avoid hammering Claude rate limits
      for (const assignment of pending) {
        send({ type: 'progress', persona: assignment.persona, status: 'working' });
        try {
          const result = await executePersonaTask(assignment, sessionContext, apiKey);

          // Persist output to KV
          if (sessionId) {
            await updateAssignmentOutput(sessionId, result.persona, result.output).catch(() => {});
          }

          send({
            type:    'result',
            persona: result.persona,
            task:    result.task,
            output:  result.output,
            action:  result.action,
          });
        } catch {
          send({ type: 'result', persona: assignment.persona, task: assignment.task, output: '', error: true });
        }
      }

      send({ type: 'done' });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
    },
  });
}
