import os
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

# Load API Key từ .env
load_dotenv()
api_key = os.getenv("ELEVENLABS_API_KEY")

if not api_key:
    print("ERROR: ELEVENLABS_API_KEY not found in .env")
    exit(1)

client = ElevenLabs(api_key=api_key)

def generate_voice_11labs(text, voice_id="pNInz6obpgDQGcFmaJgB", stability=0.65, similarity_boost=0.8, filename="elevenlabs-output"):
    print(f"Generating ElevenLabs Voice (Voice ID: {voice_id}) | Stability: {stability}...")
    
    # Cấu hình Voice Settings để ép AI đọc đúng giọng Việt hơn
    voice_settings = {
        "stability": stability,
        "similarity_boost": similarity_boost,
        "style": 0.0,
        "use_speaker_boost": True
    }
    
    # Sử dụng API mới của SDK ElevenLabs v1.0+
    audio_generator = client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id="eleven_multilingual_v2",
        output_format="mp3_44100_128",
        voice_settings=voice_settings
    )
    
    output_dir = 'brands/nhan-tam/assets/audio/elevenlabs'
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, f"{filename}.mp3")
    
    # audio_generator là một iterator trả về các chunk bytes
    with open(output_path, "wb") as f:
        for chunk in audio_generator:
            f.write(chunk)
                
    print(f"SUCCESS: Saved ElevenLabs voice to {output_path}")
    return output_path

if __name__ == "__main__":
    tvc_script = """
    Bạn có đang phí phạm lợi nhuận vào những mẻ cà phê kém chất lượng? 
    Sài Gòn không thiếu cà phê, nhưng tìm được nguồn hạt rang mộc chuẩn để giữ chân khách... lại là bài toán khó.
    Nhìn lớp crema này đi. Đây là Sài Gòn Bold – Tinh túy từ xưởng rang Nhân Tâm. 
    Đậm đà. Nguyên chất. Và đặc biệt: Không bao giờ vỡ phom đá.
    """
    
    # 1. Adam - Tuned (Sửa dấu bằng kỹ thuật - Stability cao)
    generate_voice_11labs(tvc_script, voice_id="pNInz6obpgDQGcFmaJgB", stability=0.75, similarity_boost=0.85, filename="adam-tuned-v2")
    
    # 2. Adam - Phonetic Phrases (Phiên âm để AI đọc đúng dấu hơn)
    # Gợi ý: Dùng dấu gạch nối hoặc viết lái đi một chút
    script_phonetic = """
    Bạn có đang phí phạm lợi nhuận vào những mẻ cà phê kém chất lượng? 
    Sài Gòn không thiếu cà phê, nhưng tìm được nguồn hạt rang mộc chuẩn để giữ chân khách... lại là bài toán khó.
    Nhìn lớp Crê-ma này đi. Đây là Sài Gòn Bôn – Tinh túy từ xưởng rang Nhân Tâm. 
    Đậm đà. Nguyên chất. Và đặc biệt: Không bao giờ vỡ phom đá.
    """
    generate_voice_11labs(script_phonetic, voice_id="pNInz6obpgDQGcFmaJgB", stability=0.8, similarity_boost=0.9, filename="adam-phonetic-v2")
