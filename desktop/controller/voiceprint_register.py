# -*- coding: utf-8 -*-
"""
Created on Mon Jul 25 21:33:47 2022

@author: Lenovo
"""

from post import *
from utils.record import RecordAudio

if __name__ == '__main__':
    print('欢迎使用声不凡语声控制系统')
    username = str(input("用户名："))
    password = str(input("密码："))
    #登陆
    respone_code,respone=login(username=username,password=password)
    
    #录音
    record_audio = RecordAudio()
    print('请说出“芝麻开门”')
    audio_path1 = record_audio.record()
    
    #上传声纹信息
    respone_code,respone=voiceprint(file=audio_path1)
    
    print(respone_code)
    print(respone)