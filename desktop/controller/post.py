# -*- coding: utf-8 -*-
"""

此文件提供了语声控制器前端与服务器的请求接口。
具体接口函数如下：



"""

import requests
import json
import shelve
from contextlib import closing
from trans import *


Server='http://127.0.0.1:3000'


with closing(shelve.open('storage/storage', 'r')) as shelf:
    token = shelf['token']

def register(nickname,username,password,tel):
    url='/api/v1/user/register'
    param_dict={
    "nickname": nickname, 
     
    "username": username, 
     
    "password": password, 
     
    "tel": tel
     
    }
    respone_code = None
    respone = None
    try:
        params = param_dict
        
        ret = requests.post(Server+url, data=params)
        
        respone_code = ret.status_code
        
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def login (username,password):
    global token 
    url='/api/v1/user/login'
    param_dict={
    "username": username, 
     
    "password": password 
     
    }
    respone_code = None
    respone = None
    try:
        
        ret = requests.post(Server+url, data=param_dict)
        
        respone_code = ret.status_code
        respone = ret.text
        try:
            with closing(shelve.open('storage/storage', 'c')) as shelf:
                shelf['token'] = eval(respone)['info']['token']
        except:
            print('请求失败')
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,eval(respone)
    
def full_register(nickname,username,password,tel,realname,email):
    url='/api/v1/user/full_register'
    param_dict={
    "nickname": nickname, 
     
    "username": username, 
     
    "password": password, 
     
    "tel": tel,
    
    "realname": realname, 
 
    "email": email
     
    }
    respone_code = None
    respone = None
    try:
        params = param_dict
        
        ret = requests.post(Server+url, data=params)
        
        respone_code = ret.status_code
        
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def get_users(page_index):
    param_header={'token':token}
    url='/api/v1/user/get_users'
    param_dict={
        "page_index": page_index
    }
    respone_code = None
    respone = None
    try:
        params = param_dict
        ret = requests.post(Server+url, data=params, headers=param_header)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def update(id,nickname,avatar,password,realname,email,tel):
    param_header={'token':token}
    url='/api/v1/user/update'
    param_dict={
    "id": id, 
     
    "nickname":nickname, 
     
    "avatar": avatar, 
     
    "password": password, 
     
    "tel": tel, 
     
    "realname": realname, 
     
    "email": email
     
    }
    respone_code = None
    respone = None
    try:
        params = param_dict
        ret = requests.post(Server+url, data=params, headers=param_header)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def audio_recognition (file):
    param_header={'token':token}
    url='/api/v1/upload/audio_recognition'
    file = wav2mp3(file)
    files = {'audio':open(file,'rb')}
    respone_code = None
    respone = None
    try:
        ret = requests.post(Server+url,files = files, headers=param_header)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def avatar  (file):
    param_header={'token':token}
    url='/api/v1/upload/avatar'
    files = {'avatar':open(file,'rb')}
    respone_code = None
    respone = None
    try:
        ret = requests.post(Server+url,headers=param_header,files = files)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone
    
def get_audios(page_index):
    param_header={'token':token}
    url='/api/v1/audio/get_audios'
    param_dict={
        "page_index": page_index
    }
    respone_code = None
    respone = None
    try:
        params = param_dict
        ret = requests.post(Server+url, data=params, headers=param_header)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def recognition(audio_id):
    param_header={'token':token}
    url='/api/v1/audio/recognition'
    param_dict={
        "audio_id": audio_id
    }
    respone_code = None
    respone = None
    try:
        params = param_dict
        ret = requests.post(Server+url, data=params, headers=param_header)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def voiceprint (file):
    param_header={'token':token}
    url='/api/v1/upload/voiceprint'
    file = wav2mp3(file)
    files = {'audio':open(file,'rb')}
    respone_code = None
    respone = None
    try:
        ret = requests.post(Server+url,files = files, headers=param_header)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

def get_voiceprint ():
    param_header={'token':token}
    url='/api/v1/voiceprint/get_voiceprint'
    respone_code = None
    respone = None
    try:
        ret = requests.post(Server+url, headers=param_header)
        respone_code = ret.status_code
        respone = ret.text
        url=Server+str('/')+eval(respone)['info']['url']
        # print(url)
        r = requests.get(url)
        with open("audio/Server_voice.mp3", "wb") as code:
            code.write(r.content)
        filename=mp32wav('audio/Server_voice.mp3')
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,eval(respone),filename

def command (serial):
    param_header={'token':token}
    url='/api/v1/audio/command'
    param_dict={
        "serial": serial
    }
    respone_code = None
    respone = None
    try:
        params = param_dict
        ret = requests.post(Server+url, data=params, headers=param_header)
        respone_code = ret.status_code
        respone = eval(ret.text)
    except requests.HTTPError as e:
        respone_code = e.getcode()
        respone = e.read().decode("utf-8")

    return respone_code,respone

#示例代码如下

file='D:\\test.wav'
img='D:\\illust_89937713_20210526_005318.jpg'

# respone_code,respone=login(username='username_2',
#                             password='Sam_2019')

# respone_code,respone=register(nickname='阿龙',
#                             password='Sam_2019',
#                             username='username_5',
#                             tel='12345678888')

# respone_code,respone=full_register(nickname='god',
#                                     realname='阿龙',
#                                     password='Sam_2019',
#                                     username='username_5',
#                                     tel='12345678888',
#                                     email='951947407@qq.com')

# respone_code,respone=get_users(page_index=0)

# respone_code,respone=audio_recognition(file=file)

# respone_code,respone=avatar(file=img)

# respone_code,respone=get_audios(page_index=0)

# respone_code,respone=recognition(audio_id=1)

# respone_code,respone=voiceprint(file=file)

# respone_code,respone=get_voiceprint()


# print(respone_code)
# print(respone)


