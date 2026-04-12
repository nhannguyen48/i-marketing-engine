import os
text = "Cà phê Nhân Tâm. Khởi nghiệp không khó, đã có Sài Gòn Bôn. Lớp bọt bờ rê ma dày kẹo, hậu vị đậm đà không lo vỡ phom đá. Hãy để chúng tôi chắp cánh cho quán của bạn. Nhân Tâm, mua 1 ký tính giá xưởng."
os.system(f'python -m edge_tts --voice vi-VN-HoaiMyNeural --text "{text}" --write-media assets/audio/premium-voice.mp3')
