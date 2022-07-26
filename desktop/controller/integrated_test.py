from post import *
from utils.record import RecordAudio
from infer_contrast import *

if __name__ == '__main__':
    print('欢迎使用声不凡语声控制系统')
    username = str(input("用户名："))
    password = str(input("密码："))
    # 登陆
    respone_code, respone = login(username=username, password=password)

    # 下载声纹信息
    respone_code, respone, audio_path2 = get_voiceprint()

    # 声纹认证
    record_audio = RecordAudio()
    print('请说出“芝麻开门”')
    audio_path3 = record_audio.record()
    result = contrast(audio_path2, audio_path3)

    if result:
        # 声纹认证通过
        # 录音
        record_audio = RecordAudio()
        print('请说出指令')
        audio_path1 = record_audio.record()

        # 上传音频
        respone_code, respone = audio_recognition(audio_path1)
        print(respone['info']['serial'])

        # 语义识别转指令
        respone_code, respone = command(respone['info']['serial'])
        print(respone)
    else:
        # 声纹认证不通过
        print('声纹认证不通过，不能控制硬件')
