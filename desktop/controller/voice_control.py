# -*- coding: utf-8 -*-
"""
Created on Mon Jul 25 21:50:10 2022

@author: Lenovo
"""

from post import *
from utils.record import RecordAudio
from infer_contrast import*

if __name__ == '__main__':
    print('欢迎使用声不凡语声控制系统')
    username = str(input("用户名："))
    password = str(input("密码："))
    #登陆
    respone_code,respone=login(username=username,password=password)
    
    #录音
    record_audio = RecordAudio()
    print('请说出指令')
    audio_path1 = record_audio.record()
    
    #上传音频
    respone_code,respone=audio_recognition(audio_path1)
    print(respone['info']['serial'])
    
    #语义识别转指令
    respone_code,respone=command(respone['info']['serial'])
    
    print(respone)
    