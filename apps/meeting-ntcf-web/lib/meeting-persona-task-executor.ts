// Executes persona assignments after Sếp Nhân approves a plan.
// Each persona generates real output (draft content, analysis, plan...) via Claude.
// Option B action registry is pre-wired here — extend by adding handlers to ACTION_REGISTRY.

import Anthropic from '@anthropic-ai/sdk';
import type { MeetingAssignment } from './meeting-session-kv-memory-store';

// Option B: action registry — extend when integrating real channels
// Key: action name. Value: async function that takes output text and executes side-effect.
type ActionHandler = (output: string, meta?: Record<string, string>) => Promise<void>;
const ACTION_REGISTRY: Record<string, ActionHandler> = {
  // 'post_facebook': async (output) => { /* Facebook Graph API */ },
  // 'send_zalo':     async (output) => { /* Zalo OA API */ },
  // 'create_file':   async (output, meta) => { /* write to storage */ },
};

// Persona-specific system prompts for task execution
const PERSONA_EXECUTION_PROMPTS: Record<string, string> = {
  'MINH CHÂU': `Bạn là Minh Châu — Trưởng phòng Nội dung Cà Phê Nhân Tâm.
Viết content thực tế, đúng brand voice CPNT (chân thành, am hiểu, thực dụng). Không sáo rỗng.`,

  'HÀ LINH': `Bạn là Hà Linh — Social & Zalo OA Lead Cà Phê Nhân Tâm.
Tạo post ngắn, hook mạnh, phù hợp từng platform. Zalo: thực dụng, CTA rõ. Facebook: engaging.`,

  'TUẤN ANH': `Bạn là Tuấn Anh — Performance Marketing Manager Cà Phê Nhân Tâm.
Lập ad brief: target audience, budget allocation, creative direction, KPI cụ thể.`,

  'PHÚC': `Bạn là Phúc — SEO Lead Cà Phê Nhân Tâm.
Tạo keyword plan, content outline, hoặc technical SEO checklist. Thực tế, có search volume estimate.`,

  'NGỌC': `Bạn là Ngọc — Creative Director Cà Phê Nhân Tâm.
Mô tả visual concept chi tiết: layout, màu sắc (#2B1408, #FDF8ED, #C65C33, #3E6145), typography, mood.`,

  'KHOA': `Bạn là Khoa — Video Production Lead Cà Phê Nhân Tâm.
Viết video brief: hook 3s, script outline, shooting plan, caption, format (Reels/TikTok/YouTube).`,

  'MAI': `Bạn là Mai — Data & Insights Manager Cà Phê Nhân Tâm.
Tạo dashboard framework, tracking plan, hoặc báo cáo phân tích với metrics cụ thể.`,

  'ĐỨC': `Bạn là Đức — Campaign & Strategy Manager Cà Phê Nhân Tâm.
Viết campaign brief: objective, timeline, OKR, channel mix, budget breakdown.`,

  'THANH': `Bạn là Thanh — Growth Lead Cà Phê Nhân Tâm.
Thiết kế funnel, pricing tier, referral mechanism, hoặc CRO checklist cụ thể.`,

  'LIÊN': `Bạn là Liên — CRM & Customer Success Lead Cà Phê Nhân Tâm.
Viết Zalo OA sequence, onboarding flow, hoặc re-engagement message — warm nhưng thực dụng.`,

  'BẢO': `Bạn là Bảo — Research & Competitive Intelligence Cà Phê Nhân Tâm.
Viết competitive analysis, persona research, hoặc risk assessment với data cụ thể.`,

  'HÙNG': `Bạn là Hùng — Technical & Strategy Advisor Cà Phê Nhân Tâm.
Breakdown vấn đề thành các bước giải quyết, xác định bottleneck, đề xuất prioritization.`,

  'KHẢI': `Bạn là Khải — Giám đốc Kinh doanh Cà Phê Nhân Tâm.
Viết business case, revenue projection, hoặc go-to-market plan với con số cụ thể.`,
};

const DEFAULT_EXECUTION_PROMPT = `Bạn là thành viên team Cà Phê Nhân Tâm. Thực hiện task được giao một cách chuyên nghiệp, thực tế.`;

export interface ExecutionResult {
  persona: string;
  task: string;
  output: string;
  action?: string; // Option B: triggered action name if any
}

export async function executePersonaTask(
  assignment: MeetingAssignment,
  sessionContext: string,
  apiKey: string,
): Promise<ExecutionResult> {
  const client = new Anthropic({ apiKey });
  const personaKey = assignment.persona.toUpperCase().split(' — ')[0].trim();
  const systemPrompt = PERSONA_EXECUTION_PROMPTS[personaKey] ?? DEFAULT_EXECUTION_PROMPT;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `Context cuộc họp:\n${sessionContext}\n\nTask của bạn: ${assignment.task}\n\nThực hiện ngay. Output tiếng Việt.`,
    }],
  });

  const output = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '';

  // Option B: check if any action should be triggered based on task keywords
  let triggeredAction: string | undefined;
  for (const [actionName, handler] of Object.entries(ACTION_REGISTRY)) {
    if (assignment.task.toLowerCase().includes(actionName.replace('_', ' '))) {
      await handler(output).catch(() => {}); // never block on action failure
      triggeredAction = actionName;
      break;
    }
  }

  return { persona: assignment.persona, task: assignment.task, output, action: triggeredAction };
}

// Execute all pending assignments in parallel (capped at 4 concurrent)
export async function executeAllAssignments(
  assignments: MeetingAssignment[],
  sessionContext: string,
  apiKey: string,
): Promise<ExecutionResult[]> {
  const pending = assignments.filter(a => a.status === 'pending');
  const results: ExecutionResult[] = [];

  // Process in batches of 4 to avoid rate limits
  for (let i = 0; i < pending.length; i += 4) {
    const batch = pending.slice(i, i + 4);
    const batchResults = await Promise.all(
      batch.map(a => executePersonaTask(a, sessionContext, apiKey).catch(() => ({
        persona: a.persona, task: a.task, output: '', action: undefined,
      })))
    );
    results.push(...batchResults);
  }

  return results;
}
