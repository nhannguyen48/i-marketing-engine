// Fetches pre-meeting insights from OpenAI (for Bảo) and Gemini (for Hùng)
// to provide independent cross-model perspectives in the CPNT meeting room.
// Both functions return empty string gracefully when API key is absent or times out.

const TIMEOUT_MS = 6000;

async function callWithTimeout(fn: () => Promise<string>): Promise<string> {
  return Promise.race([
    fn(),
    new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
    ),
  ]).catch(() => '');
}

// Bảo's devil's advocate perspective — powered by GPT-4o-mini
export async function fetchBaoOpenAIInsight(task: string, apiKey: string): Promise<string> {
  return callWithTimeout(async () => {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 280,
        messages: [
          {
            role: 'system',
            content: `Bạn là Bảo — chuyên gia competitive intelligence cho Cà Phê Nhân Tâm, thương hiệu cà phê rang mộc B2B tại TP.HCM (khách: F&B startup, xe đẩy, kiosk).
Phân tích task theo góc độ rủi ro và cạnh tranh: đối thủ đã làm gì, điều gì có thể fail, điểm mù team hay bỏ qua.
Trả lời tiếng Việt. Tối đa 4 điểm ngắn, bullet list. Thẳng thắn, devil's advocate.`,
          },
          { role: 'user', content: task },
        ],
      }),
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  });
}

// Hùng's systematic breakdown — powered by Gemini 2.0 Flash
export async function fetchHungGeminiInsight(task: string, apiKey: string): Promise<string> {
  return callWithTimeout(async () => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: `Bạn là Hùng — systematic thinker, technical advisor cho Cà Phê Nhân Tâm (cà phê rang mộc B2B TP.HCM).
Breakdown task thành các components cần giải quyết, xác định bottleneck và dependencies theo thứ tự ưu tiên.
Trả lời tiếng Việt. Đánh số 1-4. Logic, structured, thực tế. Tối đa 280 tokens.`,
            }],
          },
          contents: [{ parts: [{ text: task }] }],
          generationConfig: { maxOutputTokens: 280 },
        }),
      }
    );
    if (!res.ok) return '';
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
  });
}
