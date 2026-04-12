// Streaming API endpoint for the NTCF virtual meeting room.
// Accepts conversation messages, calls Claude API with Thương system prompt,
// and streams the response back as plain text chunks.

import Anthropic from '@anthropic-ai/sdk';
import { buildEnrichedSystemPrompt } from '@/lib/meeting-system-prompt';
import { buildMeetingContext } from '@/lib/meeting-multi-model-context-builder';

// nodejs runtime required — google-auth-library uses Node.js crypto for JWT signing
export const runtime = 'nodejs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response('ANTHROPIC_API_KEY chưa được cấu hình.', { status: 500 });
  }

  const { messages }: { messages: Message[] } = await req.json();
  if (!messages?.length) {
    return new Response('Thiếu messages.', { status: 400 });
  }

  // Extract task from last user message for context enrichment
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
  const ctx = await buildMeetingContext(lastUserMsg);
  const systemPrompt = buildEnrichedSystemPrompt(ctx);

  const client = new Anthropic({ apiKey });

  const stream = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    system: systemPrompt,
    messages,
    stream: true,
  });

  // Stream plain text chunks to frontend
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Active-Models': ctx.activeModels.join(','),
    },
  });
}
