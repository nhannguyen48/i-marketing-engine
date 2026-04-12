import os
import json
from google.cloud import texttospeech

# Đường dẫn key GCP
KEY_PATH = 'gcp-key.json'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = KEY_PATH

def generate_gcp_voice(text, voice_name, speaking_rate=1.0, pitch=0.0, filename="output"):
    print(f"Generating voice with {voice_name}...")
    client = texttospeech.TextToSpeechClient()

    input_text = texttospeech.SynthesisInput(text=text)

    # Note: Neural2 voices are premium
    # Lấy giới tính từ tên giọng đọc (D là Nam, A là Nữ)
    ssml_gender = texttospeech.SsmlVoiceGender.MALE if "-D" in voice_name or "-B" in voice_name else texttospeech.SsmlVoiceGender.FEMALE
    
    voice = texttospeech.VoiceSelectionParams(
        language_code="vi-VN",
        name=voice_name,
        ssml_gender=ssml_gender
    )

    print(f"Requesting: {voice_name} ({ssml_gender.name}) | Rate: {speaking_rate} | Pitch: {pitch}")

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=speaking_rate,
        pitch=pitch,
        volume_gain_db=0.0
    )

    response = client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    output_dir = 'brands/nhan-tam/assets/audio/gcp-samples'
    os.makedirs(output_dir, exist_ok=True)
    
    path = os.path.join(output_dir, f"{filename}.mp3")
    with open(path, "wb") as out:
        out.write(response.audio_content)
    
    print(f"SUCCESS: Saved to {path}")
    return path

if __name__ == "__main__":
    # Load script từ tệp kịch bản 30s
    script_path = 'brands/nhan-tam/content/video/tvc/script-specials-30s.txt'
    with open(script_path, 'r', encoding='utf-8') as f:
        tvc_text = f.read().strip()
    
    with open('brands/nhan-tam/brand-identity.json', 'r', encoding='utf-8') as f:
        brand = json.load(f)
    
    voice_id = 'vi-VN-Wavenet-D'

    print(f"--- PRODUCING 30S SPECIALS TVC VOICEOVER ({voice_id}) ---")
    generate_gcp_voice(tvc_text, voice_id, speaking_rate=0.92, pitch=0.0, filename="nhan-tam-specials-30s-vo-v3")
