const fs = require('fs');

const text = `Chào mừng bạn đến với thế giới của Cà Phê Nhân Tâm - nơi mỗi hạt cà phê đều mang trong mình một câu chuyện về bản sắc và khát vọng.
Bạn đang tìm kiếm sự khác biệt cho quán cà phê của mình? Bạn muốn chinh phục những thực khách khó tính nhất bằng hương vị đậm đà, quyến rũ?
Hãy nhìn lớp crema dày mịn này. Đó chính là minh chứng cho sự tinh túy trong từng giọt Sài Gòn Bold.
Hậu vị ngọt thanh, hương thơm nồng nàn, không bao giờ vỡ phom đá. Nhân Tâm cam kết đồng hành cùng các startup cà phê Việt.
Chúng tôi mang đến sản phẩm hạt rang mộc nguyên chất, quy trình chế biến khép kín, đảm bảo chất lượng vàng.
Đặc biệt, chương trình ưu đãi vàng: Mua một ký, tính giá xưởng. Cơ hội bứt phá doanh thu cho quán của bạn ngay hôm nay.
Cà Phê Nhân Tâm - Đậm đà bản sắc, trọn vẹn niềm tin.`;

const totalDuration = 45.79; // Giây
const sentences = text.split('\n').filter(s => s.trim().length > 0);

let assContent = `[Script Info]
Title: Nhan Tam Karaoke TVC Fixed
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

// Thuật toán phân bổ thời gian (Dynamic Time Allocation)
// Tổng số ký tự
const totalChars = text.replace(/\s/g, '').length;
const timePerChar = totalDuration / totalChars;

let currentTime = 0;

sentences.forEach((s, idx) => {
    const words = s.split(/\s+/).filter(w => w.length > 0);
    const sentenceCharCount = s.replace(/\s/g, '').length;
    let sentenceDuration = sentenceCharCount * timePerChar;
    
    // Thêm một chút thời gian đệm cuối câu
    if (idx < sentences.length - 1) sentenceDuration -= 0.5; 

    const lines = [];
    const wordsPerLine = 6;
    for (let i = 0; i < words.length; i += wordsPerLine) {
        lines.push(words.slice(i, i + wordsPerLine));
    }

    const lineDuration = sentenceDuration / lines.length;

    lines.forEach(lineWords => {
        const start = currentTime;
        const end = currentTime + lineDuration;
        let kText = '';
        
        const wordDur = Math.floor((lineDuration / lineWords.length) * 100);
        lineWords.forEach(w => {
            kText += `{\\k${wordDur}}${w} `;
        });

        assContent += `Dialogue: 0,${formatTime(start)},${formatTime(end)},Default,,0,0,0,,${kText.trim()}\n`;
        currentTime = end;
    });
    
    currentTime += 0.5; // Nghỉ giữa các câu
});

fs.writeFileSync('assets/videos/karaoke-fixed.ass', assContent);
console.log('[+] Đã tạo tệp Karaoke ASS FIX 100%: assets/videos/karaoke-fixed.ass');
