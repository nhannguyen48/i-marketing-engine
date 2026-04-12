"""
generate-voice-edge-tts-brand-awareness.py
Generate giong nam tieng Viet mien phi bang Microsoft Edge TTS.
Voice: vi-VN-NamMinhNeural
Output: brands/nhan-tam/assets/audio/voice-brand-awareness-edge.mp3
"""

import asyncio
import sys
import os
import edge_tts

# Fix asyncio tren Windows (SelectorEventLoop thay vi ProactorEventLoop)
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

VOICE = "vi-VN-NamMinhNeural"

VOICEOVER_TEXT = (
    "Sai Gon khong ngu. Sai Gon chay bang ca phe. "
    "Moi buoi sang, hang ngan ly ca phe duoc pha ra, "
    "tu nhung xe day goc pho, nhung kiosk nho, nhung quan coc via he. "
    "Dang sau moi ly ca phe do, la mot nguoi khoi nghiep voi giac mo rieng cua ho. "
    "Ho khong can loi hua hen. Ho can mot doi tac thuc su. "
    "Ca Phe Nhan Tam. Robusta dam da. Arabica thanh thom. Culi manh me. "
    "Rang theo tung lo, chuan theo tung quan. "
    "Gia thang tu xuong. Giao noi do 24 gio. Mix va Match theo cong thuc rieng cua quan ban. "
    "Vi khi quan ban lon, chung toi cung lon theo. "
    "Ca Phe Nhan Tam. Cung gia xuong, cung lon."
)

OUTPUT_PATH = os.path.abspath(os.path.join(
    os.path.dirname(__file__),
    "../../brands/nhan-tam/assets/audio/voice-brand-awareness-edge.mp3"
))

async def generate():
    communicate = edge_tts.Communicate(VOICEOVER_TEXT, VOICE)
    await communicate.save(OUTPUT_PATH)

if __name__ == "__main__":
    print("[+] Generating voice: " + VOICE)
    print("[+] Output: " + OUTPUT_PATH)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(generate())
    loop.close()
    print("[OK] Saved: " + OUTPUT_PATH)
