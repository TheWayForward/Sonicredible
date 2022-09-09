const Config = require("../config");

class MessageHelper {
    // server
    static internal_error = "操作失敗，內部錯誤！";
    static timeout = "請求超時，請刷新重試！";
    static success = "操作成功！";
    static do_not_exist = "访问的内容不存在！"
    static duplication = "提交失败，该内容条目已存在！";
    static type_undefined = "未指定內容類型！";
    static token_expired = "令牌已过期！";

    // client
    static  param_error = "参数错误！";

    // login
    static login_success_username = "登录成功！（类型：用户名）";
    static login_success_tel = "登录成功！（类型：手机号码）";
    static login_success_email = "登录成功！（类型：email）";
    static login_succeed = "登录成功";
    static login_failed = "用户名或密码错误，登录失败！";
    static login_need = "请先登录！";
    static login_unauthorized = "校验失败！";
    static log_out_success = "登出成功！";
    static log_out_unauthorized = "非法登出操作！";

    // user register
    static user_register_success = "注册成功！";
    static user_unregistered = "此用户尚未注册！";
    static user_register_duplication = "该用户已被注册！请重试！";

    // captcha
    static captcha_sent = "验证码发送成功！";
    static captcha_send_exception = "验证码发送失败！";
    static captcha_illegal = "验证码错误或验证码失效！";
    static captcha_verified = "验证码校验成功！";
    static captcha_unknown = "未知来源的验证码！";

    // update
    static update_success = "修改成功！";

    // upload
    static image_url_upload_success = "图片链接上传成功！";
    static image_upload_success = "图片上传成功！";

    // audio
    static audio_empty = "未找到对应音频！";
    static audio_instruction_unabled = "音频尚未进行语义识别，不能转换为指令！";
    static audio_instruction_failed = "无对应关键词或指令被禁用，转换失败！";

    // voiceprint
    static voiceprint_unregistered = "该用户尚未注册声纹！";
    static voiceprint_contrast_failed = "声纹识别失败！";
    static voiceprint_service_disconnected = "声纹识别服务未开启！";

    // command
    static command_keyword_duplicate = "指令关键词已被注册！";

    // device
    static device_unauthorized = "非法获取设备信息！";
    static device_empty = "尚无设备！";
    static device_disconnected = "硬件网关未连接！";

    // verification
    static ultra_vires = "越权访问！";
    static image_url_duplication = "图片链接已存在！"
}

module.exports = MessageHelper;