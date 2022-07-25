# -*- coding: utf-8 -*-
"""
Created on Mon Jul 25 21:29:22 2022

@author: Lenovo
"""

from post import *
if __name__ == '__main__':
    print('欢迎使用声不凡语声控制系统')
    username = str(input("用户名："))
    password = str(input("密码："))
    #登陆
    respone_code,respone=login(username=username,password=password)
    
    print(respone_code)
    print(respone)