import torchaudio
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import os

def generate_bgm(prompt, duration=45, filename="high-impact-bgm"):
    print(f"Generating High-Impact BGM: {prompt}...")
    model = MusicGen.get_pretrained('facebook/musicgen-small')
    model.set_generation_params(duration=duration)
    
    wav = model.generate([prompt])
    
    output_dir = 'brands/nhan-tam/assets/audio/musicgen'
    os.makedirs(output_dir, exist_ok=True)
    
    path = os.path.join(output_dir, filename)
    audio_write(path, wav[0].cpu(), model.sample_rate, strategy="loudness", loudness_compressor=True)
    
    full_path = path + ".wav"
    print(f"SUCCESS: BGM saved to {full_path}")
    return full_path

if __name__ == "__main__":
    # Prompt cho mô hình Phân phối: Chuyên nghiệp, Tin cậy, Hiện đại, Công ty
    prompt = "Professional Corporate, Clean Minimalist, Reliable Distribution Theme, Modern Piano & Muted Electric Guitar, Success vibe, 90BPM, high quality, advertising background"
    generate_bgm(prompt, duration=60, filename="tvc-music-corporate-dist")
