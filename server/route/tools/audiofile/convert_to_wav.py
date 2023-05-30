import subprocess


def convert_to_wav(source: str, dest: str) -> bool:
    try:
        command = ['ffmpeg', '-y',
                   '-i', source,
                   '-acodec', 'pcm_s16le',
                   '-ac', '1',
                   '-ar', '44100',
                   dest,
                   '-hide_banner', '-loglevel', 'error'
                   ]
        subprocess.check_call(command)
        return True
    except:
        return False
