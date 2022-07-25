from tkinter import *
from tkinter import messagebox
from PIL import Image,ImageTk
import tkinter
import time
import tkinter
import tkinter.ttk


x=0
root = Tk()
# 禁止最大化按钮（只显示最小化按钮和关闭按钮）
root.resizable(False,False)
root.minsize(600,600) # 最小尺寸
root.maxsize(600,600) # 最大尺寸
root.title("基于声纹识别的语声控制器")
root.config(width=600)
root.config(height=600)

# 添加窗口背景图片
canvas = tkinter.Canvas(root,
                        width = 600,  # 指定Canvas组件的宽度
                        height = 600,  # 指定Canvas组件的高度
                        bg = 'white'  # 指定Canvas组件的背景色
                        )
#记得在运行时修改文件所在位置
image = Image.open('bg.png')

im = ImageTk.PhotoImage(image) #用photoImage打开图片
canvas.create_image(300, 300, image=im)  # 使用creat_image将图片添加到Canvas
canvas.pack()


#用户注册
def insert_stu():  #录入信息
    root1=Tk()
    root1.title("用户注册")
    root1.config(width=600)
    root1.config(height=600)

    

    #创建关联字符变量
    varName=StringVar(root1,value='')
    varId=StringVar(root1,value='')
    varClass=StringVar(root1,value='')
    varAge=StringVar(root1,value='')

    #创建标签组件
    label=Label(root1,text="昵称：",font=("微软雅黑 -20"))
    label.place(x=30,y=60,height=40,width=80)

    label=Label(root1,text="用户名：",font=("微软雅黑 -20"))
    label.place(x=30,y=110,height=40,width=80)


    label=Label(root1,text="密码：",font=("微软雅黑 -20"))
    label.place(x=30,y=160,height=40,width=80)


    label=Label(root1,text="电话：",font=("微软雅黑 -20"))
    label.place(x=30,y=210,height=40,width=80)

    entryName=Entry((root1),textvariable=varName)
    entryName.place(x=120,y=60,height=40,width=200)

    entryId=Entry((root1),textvariable=varId)
    entryId.place(x=120,y=110,height=40,width=200)

    entryClass=Entry((root1),textvariable=varClass)
    entryClass.place(x=120,y=160,height=40,width=200)

    entryAge=Entry((root1),textvariable=varAge)
    entryAge.place(x=120,y=210,height=40,width=200)


    def buttonOK():
        lb2 = tkinter.Label(root1,text='注册成功，请点击录入按钮',\
                        bg='#d3fbfb',\
                        fg='red',\
                        font=('微软雅黑',15),\
                        width=180,\
                        height=2,\
                        )
        lb2.place(x=120,y=260,height=40,width=300)

        def sendin():#声纹录入
            root7=Tk()
            root7.title("请念芝麻开门")
            root7.geometry('600x600')

            #配置进度条
            progressbarOne = tkinter.ttk.Progressbar(root7)
            progressbarOne.pack(pady=20)
            # 进度值最大值
            progressbarOne['maximum'] = 100
            # 进度值初始值
            progressbarOne['value'] = 0
            def show():
                global x
                def up():
                    root8=Tk()
                    root8.title("确定")
                    root8.geometry('300x200')
                    label=Label(root8,text="您确认上传此段音频吗？",font=("微软雅黑 -20"))
                    label.place(x=10,y=10,height=40,width=300)

                    def no():
                        root8.destroy()
                    def go():
                        label=Label(root8,text="注册成功",font=("微软雅黑 -20"))
                        label.place(x=10,y=110,height=40,width=200)
                        buttonback=Button(root8,text="关闭页面",font=("微软雅黑 -20"),command=back)
                        buttonback.place(x=30,y=50,height=40,width=100)
                    
                    buttongo=Button(root8,text="确认",font=("微软雅黑 -20"),command=go)
                    buttongo.place(x=30,y=50,height=40,width=100)
                    buttonno=Button(root8,text="返回",font=("微软雅黑 -20"),command=no)
                    buttonno.place(x=150,y=50,height=40,width=100)
                    
                    def back():
                        root7.destroy()
                        root8.destroy()
                        root1.destroy()
                    

                def reset():
                    progressbarOne['value']
                
                
                for i in range(100):
                    # 每次更新加1
                    progressbarOne['value'] = i + 1
                    # 更新画面
                    root.update()
                    time.sleep(0.01)
                        
                    
                    if progressbarOne['value'] == 100:
                        buttonup=Button(root7,text="上传此次录音",font=("微软雅黑 -20"),command=up)
                        buttonreset=Button(root7,text="重新录音",font=("微软雅黑 -20"),command=show)
                        buttonup.place(x=225,y=150,height=40,width=150)
                        buttonreset.place(x=250,y=200,height=40,width=100)

            button = tkinter.Button(root7, text='开始录音', command=show)
            button.pack(pady=5)

            root7.mainloop()
            
            



        
        buttonCancel=Button(root1,text="录入",font=("微软雅黑 -20"),command=sendin)
        buttonCancel.place(x=150,y=360,height=40,width=200)
        
        

    buttonbuttonOK=Button(root1,text="用户注册",font=("微软雅黑 -20"),command=buttonOK)
    buttonbuttonOK.place(x=150,y=310,height=40,width=200)
    def cancel():
        varName.set('')
        varId.set('')
        varClass.set('')
        varAge.set('')


    #取消键
    buttonCancel=Button(root1,text="取消",font=("微软雅黑 -20"),command=cancel)
    buttonCancel.place(x=150,y=360,height=40,width=200)

    #退出键
    buttondel=Button(root1,text="退出",font=("微软雅黑 -20"),command=root1.destroy)
    buttondel.place(x=150,y=410,height=40,width=200)
    root1.mainloop()



# 用户登录
def sel_stu():
    root3=Tk()
    root3.title("用户登录")
    root3.config(width=600)
    root3.config(height=600)


    #创建关联变量
    sId=StringVar(root3,value='')

    #创建文本组件框\标签组件
    label=Label(root3,text="密码",font=("微软雅黑 -20"))
    label.place(x=30,y=60,height=40,width=80)

    selId=Entry((root3),textvariable=sId)
    selId.place(x=120,y=10,height=40,width=200)
    
    label=Label(root3,text="用户名",font=("微软雅黑 -20"))
    label.place(x=30,y=10,height=40,width=80)

    selId=Entry((root3),textvariable=sId)
    selId.place(x=120,y=60,height=40,width=200)


    def select():
        #设置进度条
        def gogogo():
            root4=Tk()
            root4.title("请说出口令")
            root4.geometry('600x600')

            #配置进度条
            progressbarOne = tkinter.ttk.Progressbar(root4)
            progressbarOne.pack(pady=20)
            # 进度值最大值
            progressbarOne['maximum'] = 100
            # 进度值初始值
            progressbarOne['value'] = 0
            def show():
                global x
                def up():
                    root5=Tk()
                    root5.title("确定")
                    root5.geometry('300x200')
                    label=Label(root5,text="您确认上传此段音频吗？",font=("微软雅黑 -20"))
                    label.place(x=10,y=10,height=40,width=300)

                    def no():
                        root5.destroy()
                    def go():
                        label=Label(root5,text="上传成功",font=("微软雅黑 -20"))
                        label.place(x=10,y=110,height=40,width=200)
                        buttonback=Button(root5,text="关闭页面",font=("微软雅黑 -20"),command=back)
                        buttonback.place(x=30,y=50,height=40,width=100)
                    
                    buttongo=Button(root5,text="确认",font=("微软雅黑 -20"),command=go)
                    buttongo.place(x=30,y=50,height=40,width=100)
                    buttonno=Button(root5,text="返回",font=("微软雅黑 -20"),command=no)
                    buttonno.place(x=150,y=50,height=40,width=100)
                    
                    def back():
                        root4.destroy()
                        root5.destroy()
                    

                def reset():
                    progressbarOne['value']
                
                
                for i in range(100):
                    # 每次更新加1
                    progressbarOne['value'] = i + 1
                    # 更新画面
                    root.update()
                    time.sleep(0.01)
                        
                    
                    if progressbarOne['value'] == 100:
                        buttonup=Button(root4,text="上传此次录音",font=("微软雅黑 -20"),command=up)
                        buttonreset=Button(root4,text="重新录音",font=("微软雅黑 -20"),command=show)
                        buttonup.place(x=225,y=150,height=40,width=150)
                        buttonreset.place(x=250,y=200,height=40,width=100)
                                                   
                                                             
            button = tkinter.Button(root4, text='开始录音', command=show)
            button.pack(pady=5)

            root4.mainloop()

            

        #创建标签组件
        label=Label(root3,text="用户川下阿龙，您好",font=("微软雅黑 -20"))
        label.place(x=70,y=250,height=40,width=400)

        label=Label(root3,text="请说出口令，做好准备后点击下方按钮",font=("微软雅黑 -20"))
        label.place(x=70,y=300,height=40,width=400)

        label=Label(root3,text="口令内容：芝麻开门",font=("微软雅黑 -20"))
        label.place(x=70,y=350,height=40,width=400)

        buttonselect=Button(root3,text="我准备好了",font=("微软雅黑 -20"),command=gogogo)
        buttonselect.place(x=220,y=500,height=40,width=120)


    #查询键
    buttonselect=Button(root3,text="查询",font=("微软雅黑 -20"),command=select)
    buttonselect.place(x=200,y=150,height=40,width=100)

    #取消键
    def cancel():
        sId.set('')

    buttoncancel=Button(root3,text="取消",font="微软雅黑 -20",command=cancel)
    buttoncancel.place(x=50,y=150,height=40,width=100)

    #退出键
    buttondel=Button(root3,text="退出",font="微软雅黑 -20",command=root3.destroy)
    buttondel.place(x=350,y=150,height=40,width=100)
    root3.mainloop()



#创建顶级菜单及其下拉菜单
menubar=Menu(root)
filemenu=Menu(menubar,tearoff=False)
filemenu.add_command(label="关于")
filemenu.add_command(label="联系方式")

filemenu.add_separator()
filemenu.add_command(label="退出",command=root.destroy)
menubar.add_cascade(label="菜单",menu=filemenu)

#显示菜单
root.config(menu=menubar)

buttoninsert_stu=Button(root,text="用户注册",font=("微软雅黑 -20"),command=insert_stu)
buttoninsert_stu.place(x=200,y=150,height=40,width=200)

buttonsel_stu=Button(root,text="用户登录",font=("微软雅黑 -20"),command=sel_stu)
buttonsel_stu.place(x=200,y=250,height=40,width=200)

root.mainloop()
