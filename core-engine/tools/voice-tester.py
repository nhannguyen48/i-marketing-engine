import asyncio
import edge_tts
import os

TEST_TEXT = "Cà phê Nhân Tâm - Đâm đà bản sắc, trọn vẹn niềm tin. Mua một ký, tính giá xưởng ngay hôm nay!"
VOICE = "vi-VN-NamMinhNeural"

async def main():
    os.makedirs("brands/nhan-tam/assets/audio", exist_ok=True)
    
    # Test 1: Original
    print("Generating original...")
    await edge_tts.Communicate(TEST_TEXT, VOICE).save("brands/nhan-tam/assets/audio/test-original.mp3")
    
    # Test 2: Faster (TVC style)
    print("Generating faster...")
    await edge_tts.Communicate(TEST_TEXT, VOICE, rate="+15%").save("brands/nhan-tam/assets/audio/test-tvc-fast.mp3")
    
    # Test 3: Standard TVC (Optimized)
    print("Generating optimized...")
    await edge_tts.Communicate(TEST_TEXT, VOICE, rate="+5%", pitch="-5Hz").save("brands/nhan-tam/assets/audio/test-tvc-optimized.mp3")

    print("\n--- VOICE LAB RESULTS ---")
    print("1. original.mp3")
    print("2. tvc-fast.mp3")
    print("3. tvc-optimized.mp3")

if __name__ == "__main__":
    asyncio.run(main())
