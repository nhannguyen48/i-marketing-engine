import os
import torch
import torchaudio
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write

def generate_music(prompt, duration=60, output_path='brands/nhan-tam/assets/audio/tvc-music-60s'):
    print(f"Loading MusicGen model...")
    model = MusicGen.get_pretrained('facebook/musicgen-small')
    model.set_generation_params(duration=duration)
    
    print(f"Generating music for: {prompt}...")
    wav = model.generate([prompt])
    
    # Save the music
    audio_write(output_path, wav[0].cpu(), model.sample_rate, strategy="loudness", loudness_compressor=True)
    print(f"SUCCESS: Saved music to {output_path}.wav")

if __name__ == "__main__":
    prompt = "Cinematic Intense Powerful Industrial Coffee Roastery, rhythmic percussion, deep bass, premium atmosphere"
    generate_music(prompt)
