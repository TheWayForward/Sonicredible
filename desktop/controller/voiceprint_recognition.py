# -*- coding: utf-8 -*-
"""
Created on Mon Jul 25 21:35:47 2022

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
    
    #下载声纹信息
    respone_code,respone,audio_path2=get_voiceprint()
    
    
    #声纹认证
    record_audio = RecordAudio()
    print('请说出“芝麻开门”')
    audio_path3 = record_audio.record()
    contrast(audio_path2,audio_path3)