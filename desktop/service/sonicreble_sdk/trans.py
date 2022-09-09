from pydub import AudioSegment


def mp32wav(filepath):
    sourcefile = AudioSegment.from_mp3(filepath)
    filename = 'audio/' + filepath.split('/')[-1].split('.mp3')[0].replace(' ', '_') + '.wav'
    # print(filename)
    sourcefile.export(filename, format="wav")
    return filename


def wav2mp3(filepath):
    sourcefile = AudioSegment.from_wav(filepath)
    filename = 'audio/' + filepath.split('/')[-1].split('.wav')[0].replace(' ', '_') + '.mp3'
    # print(filename)
    sourcefile.export(filename, format="mp3")
    return filename
