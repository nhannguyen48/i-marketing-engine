const fs = require('fs');

const syncData = JSON.parse(fs.readFileSync('assets/audio/whisper-sync.json', 'utf8'));

// Cấu hình ASS
let assContent = `[Script Info]
Title: Nhan Tam Karaoke TVC
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,65,&H00FFFFFF,&H0000FFFF,&H00000000,&H4B000000,-1,0,0,0,100,100,0,0,1,3,2,2,60,60,180,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

const chunks = syncData.chunks || [];
let currentLine = [];
let lineStart = 0;
let maxWordsPerLine = 6;

for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    if (currentLine.length === 0) lineStart = chunk.timestamp[0];
    
    currentLine.push(chunk);
    
    // Gộp thành dòng mới nếu hết câu hoặc quá dài
    const endsWithPause = i < chunks.length - 1 && (chunks[i+1].timestamp[0] - chunk.timestamp[1] > 0.5);
    const isFullLine = currentLine.length >= maxWordsPerLine;
    const isEnd = i === chunks.length - 1;

    if (isFullLine || endsWithPause || isEnd) {
        const lineEnd = chunk.timestamp[1];
        let karaokeText = '';
        let lastTimestamp = lineStart;

        currentLine.forEach(c => {
            const start = c.timestamp[0];
            const end = c.timestamp[1];
            
            // Tính khoảng lặng (silence) trước từ
            const silenceDur = Math.floor((start - lastTimestamp) * 100);
            if (silenceDur > 0) karaokeText += `{\\k${silenceDur}}`;
            
            // Tính độ dài từ (duration)
            const wordDur = Math.max(1, Math.floor((end - start) * 100));
            karaokeText += `{\\k${wordDur}}${c.text.trim()} `;
            
            lastTimestamp = end;
        });

        assContent += `Dialogue: 0,${formatTime(lineStart)},${formatTime(lineEnd)},Default,,0,0,0,,${karaokeText.trim()}\n`;
        currentLine = [];
    }
}

fs.writeFileSync('assets/videos/karaoke.ass', assContent);
console.log('[+] Đã tạo tệp Karaoke ASS chuyên nghiệp: assets/videos/karaoke.ass');
