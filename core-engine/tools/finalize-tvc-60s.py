import subprocess
import os

def finalize_video(video_list, audio_path, output_path):
    print("Finalizing Video: Montage + Audio...")
    
    # Building complex filter for concatenating and scaling 
    # to 1080x1920 (TikTok Vertical)
    filter_complex = ""
    for i in range(len(video_list)):
        filter_complex += f"[{i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[v{i}];"
    
    for i in range(len(video_list)):
        filter_complex += f"[v{i}]"
    
    filter_complex += f"concat=n={len(video_list)}:v=1:a=0[v]"
    
    cmd = ['ffmpeg', '-y']
    for v in video_list:
        cmd.extend(['-i', v])
    
    cmd.extend([
        '-i', audio_path,
        '-filter_complex', filter_complex,
        '-map', '[v]',
        '-map', f'{len(video_list)}:a',
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '18',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest', # Match audio length
        output_path
    ])
    
    print("Running FFmpeg FINAL assembly (this might take a few minutes)...")
    subprocess.run(cmd, check=True)
    print(f"SUCCESS: Final TVC saved to {output_path}")

if __name__ == "__main__":
    base_dir = 'brands/nhan-tam/assets/videos'
    videos = [
        f'{base_dir}/canh-1.mp4.mp4',
        f'{base_dir}/canh-2.mp4.mp4',
        f'{base_dir}/canh-3.mp4.mp4',
        f'{base_dir}/canh-4.mp4.mp4',
        f'{base_dir}/canh-5.mp4.mp4',
        f'{base_dir}/canh-6.mp4.mp4',
        f'{base_dir}/canh-7.mp4.mp4',
        f'{base_dir}/3zzKEqLbPrOGtXl0Oa4S0_dfa30ec164e6432c8e82b9dfeba63532.mp4',
        f'{base_dir}/n6i5u_diEVdLRloyKZNRy_a1a543b9a0974a25b41fc85b91609851.mp4'
    ]
    audio = 'brands/nhan-tam/assets/audio/final-tvc-audio-60s-PREMIUM.mp3'
    output = 'brands/nhan-tam/assets/videos/TVC-60s-Elite-Final-PREMIUM.mp4'
    
    finalize_video(videos, audio, output)
