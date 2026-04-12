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

  // Sanitise: Anthropic returns 400 if any message has empty/whitespace-only content.
  // This can happen when a previous stream failed mid-flight and left an empty assistant turn.
  const cleanMessages = messages
    .filter(m => m.content.trim().length > 0)
    .map(m => ({ role: m.role, content: m.content.trim() }));

  // Ensure the last message is from the user (Anthropic requires this)
  if (!cleanMessages.length || cleanMessages[cleanMessages.length - 1].role !== 'user') {
    return new Response('Tin nhắn cuối phải là của user.', { status: 400 });
  }

  // Keep only last 8 messages to cap history tokens.
  // Early turns are less relevant; the system prompt + brand docs carry the context.
  const trimmedMessages = cleanMessages.slice(-8);

  // Extract task from last user message for context enrichment
  const lastUserMsg = trimmedMessages.filter(m => m.role === 'user').at(-1)?.content ?? '';
  const ctx = await buildMeetingContext(lastUserMsg);
  const { staticPrompt, dynamicContext } = buildEnrichedSystemPrompt(ctx);

  const client = new Anthropic({ apiKey });

  // Prompt caching strategy:
  //   staticPrompt   → cache_control: ephemeral → cached for 5 min, 10% cost on hits
  //   dynamicContext → no cache → changes every request (search results, brand docs, etc.)
  // Switching to claude-haiku-4-5 saves ~12× vs Sonnet at equivalent quality for roleplay.
  const systemBlocks: Anthropic.TextBlockParam[] = [
    { type: 'text', text: staticPrompt, cache_control: { type: 'ephemeral' } } as Anthropic.TextBlockParam,
  ];
  if (dynamicContext) {
    systemBlocks.push({ type: 'text', text: dynamicContext });
  }

  let stream;
  try {
    stream = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 4000,
      system:     systemBlocks,
      messages:   trimmedMessages,
      stream:     true,
    });
  } catch (err: unknown) {
    // Surface the actual Anthropic error so it's visible in Vercel logs and to the frontend
    const errMsg = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('[/api/meeting] Anthropic error:', errMsg);
    return new Response(
      JSON.stringify({ error: errMsg }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

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
      } catch (err) {
        console.error('[/api/meeting] Stream error:', err);
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
