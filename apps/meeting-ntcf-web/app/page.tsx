'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Message { role: 'user' | 'assistant'; content: string; }

interface PersonaTurn {
  key: string;
  type: 'persona' | 'divider' | 'text';
  name?: string;
  role?: string;
  color?: string;
  content: string;
}

const PERSONA_COLORS: Record<string, string> = {
  'THƯƠNG':   '#C65C33', 'MINH CHÂU': '#3E6145', 'HÀ LINH':  '#7B4F9E',
  'TUẤN ANH': '#1A6B8A', 'PHÚC':      '#2E7D32', 'NGỌC':     '#C2185B',
  'KHOA':     '#455A64', 'MAI':        '#F57C00', 'ĐỨC':      '#1565C0',
  'THANH':    '#6A1550', 'LIÊN':       '#558B2F', 'BẢO':      '#4E342E',
  'HÙNG':     '#37474F', 'KHẢI':       '#B71C1C', 'TÚ':       '#00695C',
  'HƯƠNG':    '#6A1B9A',
};

const SUGGESTIONS = [
  'Lên kế hoạch content Facebook tháng 5',
  'Phân tích đối thủ và đề xuất angle mới',
  'Tạo chiến dịch lead gen cho startup F&B',
];

const MODEL_LABELS: Record<string, string> = {
  'claude-sonnet-4-6': 'Claude', 'gpt-4o-mini': 'GPT-4o',
  'gemini-2.0-flash':  'Gemini', 'tavily-search': '🌐 Web',
  'gsc': 'GSC',  'ga4': 'GA4',
  'memory': '🧠', 'stock-media': '📷', 'brand-docs': '📚',
};

// Derive 2-char initials from Vietnamese name
function initials(name: string): string {
  const w = name.trim().split(/\s+/);
  return w.length >= 2
    ? (w[0][0] + w[w.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

// Parse raw stream text → array of PersonaTurn
function parseToTurns(text: string): PersonaTurn[] {
  const turns: PersonaTurn[] = [];
  const lines = text.split('\n');
  let cur: PersonaTurn | null = null;

  const flush = () => { if (cur) { turns.push(cur); cur = null; } };

  lines.forEach((line, i) => {
    // Section divider (box-drawing chars)
    if (/^[━╔╚║╗╝═─]/.test(line)) {
      flush();
      turns.push({ key: `div-${i}`, type: 'divider', content: line });
      return;
    }
    // Persona message: [NAME — Role]: content
    const m = line.match(/^\[([^—\]]+)—([^\]]+)\]:(.*)/);
    if (m) {
      flush();
      const name    = m[1].trim().toUpperCase();
      const role    = m[2].trim();
      const content = m[3].trim();
      const color   = Object.entries(PERSONA_COLORS).find(([k]) => name.includes(k))?.[1] ?? '#C65C33';
      cur = { key: `${name}-${i}`, type: 'persona', name, role, color, content };
      return;
    }
    if (!line.trim()) { flush(); return; }
    if (cur?.type === 'persona') {
      cur.content += (cur.content ? '\n' : '') + line;
    } else {
      flush();
      cur = { key: `txt-${i}`, type: 'text', content: line };
    }
  });

  flush();
  return turns;
}

// Parse [ASSET:...] tags from message content
interface AssetTag { thumb: string; full: string; source: string; title: string; }
function parseAssetTags(text: string): Array<{ type: 'text' | 'asset'; value: string; asset?: AssetTag }> {
  const segments: Array<{ type: 'text' | 'asset'; value: string; asset?: AssetTag }> = [];
  const re = /\[ASSET:\s*thumb=(\S+)\s+full=(\S+)\s+source=(\S+)\s+title=([^\]]+)\]/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'text', value: text.slice(last, m.index) });
    segments.push({ type: 'asset', value: m[0], asset: { thumb: m[1], full: m[2], source: m[3], title: m[4].trim() } });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: 'text', value: text.slice(last) });
  return segments;
}

function AssetCard({ asset }: { asset: AssetTag }) {
  return (
    <a href={asset.full} target="_blank" rel="noopener noreferrer"
       className="inline-flex flex-col gap-1 rounded-xl overflow-hidden shadow-sm my-1 max-w-[180px] align-top"
       style={{ border: '1px solid var(--border)', textDecoration: 'none' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset.thumb} alt={asset.title} className="w-full h-20 object-cover" loading="lazy" />
      <div className="px-2 pb-1.5">
        <p className="text-[10px] font-medium truncate" style={{ color: 'var(--text)' }}>{asset.title}</p>
        <p className="text-[9px] opacity-70" style={{ color: 'var(--text-muted)' }}>{asset.source} · Tải về →</p>
      </div>
    </a>
  );
}

function RichContent({ text, isActive }: { text: string; isActive: boolean }) {
  const segments = parseAssetTags(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'asset' && seg.asset ? (
          <AssetCard key={i} asset={seg.asset} />
        ) : (
          <span key={i}>
            {seg.value.split('\n').map((ln, j) => (
              <span key={j}>{j > 0 && <br />}{ln}</span>
            ))}
          </span>
        )
      )}
      {isActive && <span className="typing-cursor" />}
    </>
  );
}

function TypingDots({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-[5px] h-5 px-1">
      {[0, 0.2, 0.4].map((d, i) => (
        <span key={i} className="streaming-dot rounded-full inline-block w-2 h-2"
              style={{ background: color, animationDelay: `${d}s` }} />
      ))}
    </span>
  );
}

// Section divider between meeting blocks
function MeetingDivider({ content }: { content: string }) {
  const isRule = /^[━═─\s]+$/.test(content.trim());
  return (
    <div className="flex items-center gap-3 py-2 px-1">
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      {!isRule && (
        <span className="text-[10px] font-semibold tracking-widest px-2 py-0.5 rounded-full"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-header)', border: '1px solid var(--border)' }}>
          {content.replace(/^[━╔╚║╗╝═─\s]+|[━╔╚║╗╝═─\s]+$/g, '').trim() || '· · ·'}
        </span>
      )}
      {isRule && (
        <span className="text-xs opacity-30" style={{ color: 'var(--text-muted)' }}>· · ·</span>
      )}
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  );
}

// Single persona chat bubble
function PersonaBubble({ turn, isActive, isFirst }: { turn: PersonaTurn; isActive: boolean; isFirst: boolean }) {
  if (turn.type === 'divider') return <MeetingDivider content={turn.content} />;

  if (turn.type === 'text') {
    return (
      <p className="text-xs text-center leading-relaxed px-4 py-1" style={{ color: 'var(--text-muted)' }}>
        {turn.content}{isActive && <span className="typing-cursor" />}
      </p>
    );
  }

  const { name, role, color, content } = turn;
  const isEmpty = !content.trim();

  return (
    <div className={`flex gap-3 items-end ${isFirst ? 'mt-1' : 'mt-2'} turn-appear`}>
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
                      text-[11px] font-bold shadow select-none self-end mb-0.5"
           style={{ background: color + '18', color, border: `1.5px solid ${color}55` }}>
        {initials(name!)}
      </div>

      <div className="flex-1 min-w-0" style={{ maxWidth: 'calc(100% - 52px)' }}>
        {/* Name + role */}
        <div className="flex items-baseline gap-1.5 mb-1.5 ml-0.5">
          <span className="text-[12px] font-bold leading-none" style={{ color }}>{name}</span>
          <span className="text-[10px] leading-none opacity-60" style={{ color: 'var(--text-muted)' }}>{role}</span>
        </div>

        {/* Bubble */}
        <div className="inline-block rounded-2xl rounded-bl-[6px] px-4 py-2.5 text-sm leading-relaxed shadow-sm"
             style={{
               background: 'var(--bg-card)',
               border: `1.5px solid ${color}22`,
               color: 'var(--text)',
               boxShadow: `0 1px 4px ${color}10`,
               maxWidth: '100%',
             }}>
          {isEmpty && isActive
            ? <TypingDots color={color!} />
            : <RichContent text={content} isActive={isActive} />
          }
        </div>
      </div>
    </div>
  );
}

// Full meeting thread (one assistant message)
function MeetingThread({ content, isStreaming, isLast }: {
  content: string; isStreaming: boolean; isLast: boolean;
}) {
  const turns = parseToTurns(content);
  return (
    <div className="space-y-0.5">
      {turns.map((turn, i) => (
        <PersonaBubble
          key={turn.key}
          turn={turn}
          isFirst={i === 0}
          isActive={isLast && isStreaming && i === turns.length - 1}
        />
      ))}
    </div>
  );
}

// Detect approval keywords that trigger execution
function detectApproval(text: string): string | null {
  const m = text.match(/duyệt\s+([AB])/i);
  return m ? m[1].toUpperCase() : null;
}

// ── Sync button icon states ───────────────────────────────────────────────
function SyncIcon({ state }: { state: 'idle' | 'syncing' | 'ok' | 'error' }) {
  if (state === 'syncing')
    return <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />;
  if (state === 'ok')
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  if (state === 'error')
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function MeetingPage() {
  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState('');
  const [isStreaming, setIsStreaming]    = useState(false);
  const [isExecuting, setIsExecuting]   = useState(false);
  const [activeModels, setActiveModels] = useState<string[]>([]);
  const [syncState, setSyncState]       = useState<'idle' | 'syncing' | 'ok' | 'error'>('idle');

  const sessionIdRef     = useRef<string>(Date.now().toString(36));
  // Tracks the ID of the last saved session so runExecution can look up assignments from KV.
  // sessionIdRef resets after each save; lastSavedSessionIdRef keeps the saved ID.
  const lastSavedSessionIdRef = useRef<string>('');
  const lastTaskRef    = useRef<string>('');
  const lastMeetingRef = useRef<string>('');
  const bottomRef      = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  // ── Typewriter engine (recursive setTimeout) ──────────────────────────
  // Speed tiers: CHAR_MS normal · NL_MS at newlines · TURN_MS before new speaker
  const CHAR_MS = 15;
  const NL_MS   = 80;
  const TURN_MS = 750;

  const rawTextRef          = useRef('');
  const typePosRef          = useRef(0);
  const streamDoneRef       = useRef(false);
  const typeTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTypewriterDoneRef = useRef<(() => void) | null>(null);

  function stopTypewriter() {
    if (typeTimerRef.current) { clearTimeout(typeTimerRef.current); typeTimerRef.current = null; }
  }

  function scheduleTypewriterTick() {
    const raw    = rawTextRef.current;
    const pos    = typePosRef.current;
    const target = raw.length;

    if (pos >= target) {
      if (streamDoneRef.current) {
        stopTypewriter();
        setIsStreaming(false);
        onTypewriterDoneRef.current?.();
        onTypewriterDoneRef.current = null;
      } else {
        typeTimerRef.current = setTimeout(scheduleTypewriterTick, 30);
      }
      return;
    }

    const ch     = raw[pos];
    const newPos = pos + 1;
    typePosRef.current = newPos;
    setMessages(prev => [
      ...prev.slice(0, -1),
      { role: 'assistant', content: raw.slice(0, newPos) },
    ]);

    let delay = CHAR_MS + Math.random() * 8;
    if (ch === '\n') {
      const ahead         = raw.slice(newPos);
      const skippedBlanks = ahead.match(/^[\n ]*/)?.[0].length ?? 0;
      const nextChar      = ahead[skippedBlanks];
      delay = nextChar === '[' ? TURN_MS : NL_MS;
    }

    typeTimerRef.current = setTimeout(scheduleTypewriterTick, delay);
  }

  function startTypewriter() {
    stopTypewriter();
    rawTextRef.current    = '';
    typePosRef.current    = 0;
    streamDoneRef.current = false;
    typeTimerRef.current  = setTimeout(scheduleTypewriterTick, 80);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  // Sync brand docs → Redis
  async function syncBrandDocs() {
    if (syncState === 'syncing') return;
    setSyncState('syncing');
    try {
      const res  = await fetch('/api/meeting/sync-brand', { method: 'POST' });
      const data = await res.json();
      setSyncState(res.ok ? 'ok' : 'error');
      if (res.ok) {
        setActiveModels(prev => prev.includes('brand-docs') ? prev : [...prev, 'brand-docs']);
        setTimeout(() => setSyncState('idle'), 3000);
      } else {
        console.error('Sync error:', data.error);
        setTimeout(() => setSyncState('idle'), 4000);
      }
    } catch {
      setSyncState('error');
      setTimeout(() => setSyncState('idle'), 4000);
    }
  }

  async function saveSessionAsync(task: string, meetingText: string) {
    try {
      await fetch('/api/meeting/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current, task, meetingText }),
      });
    } catch { /* non-critical */ }
  }

  async function runExecution(approvedPlan: string) {
    if (isExecuting) return;
    setIsExecuting(true);
    const msg = `[THƯƠNG — PA]: ⚙️ Đã duyệt **Phương án ${approvedPlan}**. Team đang triển khai...`;
    setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    try {
      const res = await fetch('/api/meeting/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: lastSavedSessionIdRef.current || sessionIdRef.current,
          task: lastTaskRef.current,
          sessionContext: lastMeetingRef.current.slice(0, 3000),
          assignments: [],
        }),
      });
      if (!res.ok || !res.body) return;
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const evt = JSON.parse(line);
            if (evt.type === 'result' && evt.output)
              setMessages(prev => [...prev, { role: 'assistant', content: `[${evt.persona} — Output]:\n${evt.output}` }]);
            if (evt.type === 'done') {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: '[THƯƠNG — PA]: ✅ Team đã hoàn thành. Kết quả được lưu vào bộ nhớ cho phiên họp sau.',
              }]);
              sessionIdRef.current = Date.now().toString(36);
            }
          } catch { /* skip */ }
        }
      }
    } catch { /* non-critical */ } finally {
      setIsExecuting(false);
    }
  }

  async function sendMessage() {
    const task = input.trim();
    if (!task || isStreaming || isExecuting) return;
    setInput('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.blur(); }

    const approval = detectApproval(task);
    // Filter out empty/whitespace assistant messages before building history.
    // These accumulate when a previous stream fails mid-flight and would cause
    // Anthropic to return 400 ("message content must be non-empty").
    const cleanHistory = messages.filter(m => m.content.trim().length > 0);
    const history: Message[] = [...cleanHistory, { role: 'user', content: task }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setIsStreaming(true);
    startTypewriter();

    try {
      const res = await fetch('/api/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());

      const modelsHeader = res.headers.get('X-Active-Models');
      if (modelsHeader) setActiveModels(modelsHeader.split(',').filter(Boolean));

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        rawTextRef.current = text;
      }

      streamDoneRef.current = true;
      onTypewriterDoneRef.current = () => {
        const fullText = rawTextRef.current;
        if (!approval) {
          lastTaskRef.current         = task;
          lastMeetingRef.current      = fullText;
          // Snapshot current sessionId before resetting — execute will need it
          lastSavedSessionIdRef.current = sessionIdRef.current;
          saveSessionAsync(task, fullText);
          sessionIdRef.current        = Date.now().toString(36);
        }
        if (approval) runExecution(approval);
      };
    } catch (err: unknown) {
      stopTypewriter();
      setIsStreaming(false);
      const detail = (err instanceof Error ? err.message : String(err)).toLowerCase();
      const isBilling = /credit|billing|quota|overload|insufficient/i.test(detail);
      const errMsg = isBilling
        ? '[THƯƠNG — PA]: ❌ API hết credits. Sếp Nhân vui lòng nạp thêm tiền vào tài khoản Anthropic rồi thử lại.'
        : '[THƯƠNG — PA]: ❌ Có lỗi kết nối. Vui lòng thử lại.';
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: errMsg },
      ]);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const syncColors = {
    ok:    { bg: '#3E614520', border: '#3E6145', color: '#3E6145' },
    error: { bg: '#B71C1C20', border: '#B71C1C', color: '#B71C1C' },
    idle:  { bg: 'var(--bg-input)', border: 'var(--border)', color: 'var(--text-muted)' },
    syncing: { bg: 'var(--bg-input)', border: 'var(--border)', color: 'var(--text-muted)' },
  }[syncState];

  return (
    /* Full-screen flex column — accounts for iOS safe areas */
    <div className="flex flex-col w-full max-w-2xl mx-auto"
         style={{ height: '100dvh', background: 'var(--bg)' }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 border-b px-4 pt-3 pb-2"
              style={{ background: 'var(--bg-header)', borderColor: 'var(--border)',
                       paddingTop: 'max(12px, env(safe-area-inset-top))' }}>

        {/* Row 1: logo + title + sync + status */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 shadow">
            <Image src="/cpnt-logo.png" alt="Cà Phê Nhân Tâm" width={36} height={36}
                   className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight" style={{ color: 'var(--text)' }}>
              Phòng Chiến Lược Nhân Tâm
            </p>
            <p className="text-[11px] leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Thương & Team · Giải pháp Vận hành
            </p>
          </div>

          {/* Sync brand docs button — 44px tap target */}
          <button
            onClick={syncBrandDocs}
            disabled={syncState === 'syncing'}
            title="Cập nhật tài liệu thương hiệu"
            className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                       transition-all active:scale-95 disabled:opacity-50"
            style={{ background: syncColors.bg, border: `1.5px solid ${syncColors.border}`, color: syncColors.color }}>
            <SyncIcon state={syncState} />
          </button>

          {/* Streaming status indicator */}
          {(isStreaming || isExecuting) && (
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-medium"
                 style={{ background: '#C65C3318', color: '#C65C33' }}>
              {[0, 0.15, 0.3].map((d, i) => (
                <span key={i} className="streaming-dot w-1.5 h-1.5 rounded-full"
                      style={{ background: '#C65C33', animationDelay: `${d}s` }} />
              ))}
              <span className="ml-1 hidden xs:inline">
                {isExecuting ? 'Đang triển khai' : 'Đang họp'}
              </span>
            </div>
          )}
        </div>

        {/* Row 2: active model badges (always visible, wraps on small screens) */}
        {activeModels.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-2">
            {activeModels.map(m => (
              <span key={m} className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border)',
                             color: 'var(--text-muted)' }}>
                {MODEL_LABELS[m] ?? m}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ── Messages ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-4"
            style={{ overscrollBehavior: 'contain' }}>

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-5 pb-6 text-center px-4">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
              <Image src="/cpnt-logo.png" alt="Cà Phê Nhân Tâm" width={96} height={96}
                     className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-xl" style={{ color: 'var(--text)' }}>Chào Sếp Nhân!</p>
              <p className="text-sm mt-1.5 leading-relaxed max-w-[260px] mx-auto"
                 style={{ color: 'var(--text-muted)' }}>
                Thương đang trực phí. Sếp muốn tối ưu chỉ số kinh doanh nào hôm nay?
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full max-w-sm">
              {[
                'Phân tích định mức và biên lợi nhuận',
                'Kế hoạch tối ưu vận hành Kiosk',
                'Chiến lược Direct Sales chuẩn bị Launch',
              ].map(s => (
                <button key={s}
                  onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  className="text-left text-sm rounded-2xl px-4 py-3.5 transition-all
                             active:scale-[0.98] hover:shadow-sm"
                  style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                           color: 'var(--text)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>→ </span>{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.role === 'user' ? (
              /* User bubble — right aligned */
              <div className="flex gap-2.5 justify-end items-end msg-appear">
                <div className="max-w-[78%]">
                  <div className="text-[11px] text-right mb-1 font-semibold" style={{ color: '#C65C33' }}>
                    Sếp Nhân
                  </div>
                  <div className="rounded-2xl rounded-br-[6px] px-4 py-2.5 text-sm leading-relaxed shadow-sm"
                       style={{ background: '#C65C33', color: '#FDF8ED' }}>
                    {msg.content}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center
                                text-[11px] font-bold shadow-sm self-end"
                     style={{ background: 'var(--bg-header)', border: '1.5px solid #C65C3360',
                              color: '#C65C33' }}>
                  SN
                </div>
              </div>
            ) : (
              /* Meeting thread — left aligned group chat */
              <MeetingThread
                content={msg.content}
                isStreaming={isStreaming}
                isLast={idx === messages.length - 1}
              />
            )}
          </div>
        ))}

        <div ref={bottomRef} className="h-1" />
      </main>

      {/* ── Input footer ──────────────────────────────────────────────── */}
      <footer className="flex-shrink-0 border-t px-3 pt-3"
              style={{
                background: 'var(--bg-header)',
                borderColor: 'var(--border)',
                paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
              }}>
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            onChange={e => { setInput(e.target.value); autoResize(e.target); }}
            onKeyDown={onKeyDown}
            disabled={isStreaming || isExecuting}
            placeholder="Nhập task cho Thương... (Enter để gửi)"
            className="flex-1 rounded-2xl px-4 py-3 focus:outline-none resize-none
                       disabled:opacity-50 transition-all text-[16px] sm:text-sm"
            style={{
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border)',
              color: 'var(--text)',
              maxHeight: 120,
              overflowY: 'auto',
              lineHeight: '1.5',
            }}
          />
          {/* Send button — 48px tap target */}
          <button
            onClick={sendMessage}
            disabled={isStreaming || isExecuting || !input.trim()}
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                       transition-all active:scale-95 disabled:opacity-40 hover:opacity-85 shadow"
            style={{ background: '#C65C33', color: '#FDF8ED' }}>
            {isStreaming
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
            }
          </button>
        </div>

        <p className="text-center text-[11px] mt-2 pb-0.5" style={{ color: 'var(--text-muted)', opacity: 0.45 }}>
          Shift+Enter để xuống dòng
        </p>
      </footer>
    </div>
  );
}
