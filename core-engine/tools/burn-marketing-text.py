import subprocess
import os

def burn_text(input_video, ass_file, output_video):
    print(f"Burning Marketing Text from {ass_file} into {input_video}...")
    
    # FFmpeg command to burn subtitles
    # We need to escape the path for the subtitles filter
    abs_ass_path = os.path.abspath(ass_file).replace('\\', '/').replace(':', '\\:')
    
    cmd = [
        'ffmpeg', '-y',
        '-i', input_video,
        '-vf', f"subtitles='{abs_ass_path}'",
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '18',
        '-c:a', 'copy', # keep the mixed audio
        output_video
    ]
    
    subprocess.run(cmd, check=True)
    print(f"SUCCESS: Final TVC with TEXT saved to {output_video}")

if __name__ == "__main__":
    video = 'brands/nhan-tam/assets/videos/TVC-Distribution-Final-PRO.mp4'
    ass = 'brands/nhan-tam/assets/videos/marketing-text-pro-dist.ass'
    output = 'brands/nhan-tam/assets/videos/TVC-Phat-Trien-Phan-Phoi-FINAL.mp4'
    
    burn_text(video, ass, output)
