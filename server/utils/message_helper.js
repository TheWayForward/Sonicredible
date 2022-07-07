const Config = require("../config");

module.exports = {
    // server
    internal_error: "操作失敗，內部錯誤！",
    timeout: "請求超時，請刷新重試！",
    success: "操作成功！",
    duplication: "提交失败，该内容条目已存在！",
    type_undefined: "未指定內容類型！",
    token_expired: "令牌已过期！",

    // client
    param_error: "参数错误！",

    // login
    login_success_username: "登录成功！（类型：用户名）",
    login_success_tel: "登录成功！（类型：手机号码）",
    login_success_email: "登录成功！（类型：email）",
    login_succeed: "登录成功",
    login_failed: "用户名或密码错误，登录失败！",
    login_need: "请先登录！",
    login_unauthorized: "校验失败！",
    log_out_success: "登出成功！",
    log_out_unauthorized: "非法登出操作！",

    // user register
    user_register_duplication: "手机、email不可重复注册，请重试！",
    user_register_success: "注册成功！",
    user_unregistered: "此用户尚未注册！",
    tel_duplication: "手机号码已被注册！",
    email_duplication: "email已被注册！",

    // product
    product_unavailable: "商品已下架！",

    // order
    order_quantity_exceed: "购买数量超出库存，下单失败！",
    order_user_unpaid_exceed: `您已有${Config.max_user_unpaid_order}笔未支付的订单，请支付或取消订单后再下单！`,
    order_pay_success: "订单支付成功！",
    order_pay_fail: "订单支付失败！",
    order_closed: "该订单已关闭！请刷新页面！",
    order_serial_invalid: "订单号无效！",
    order_status_illegal: "订单状态非法！",
    order_empty: "暂无相关订单！",

    // shipping
    shipping_serial_duplication: "此单号已被使用！",

    // captcha
    captcha_sent: "验证码发送成功！",
    captcha_send_exception: "验证码发送失败！",
    captcha_illegal: "验证码错误或验证码失效！",
    captcha_verified: "验证码校验成功！",
    captcha_unknown: "未知来源的验证码！",

    // event
    event_empty: "暂无活动！",

    // swiper
    swiper_low: "至少保留2张轮播图！",

    // update
    update_success: "修改成功！",

    // upload
    image_url_upload_success: "图片链接上传成功！",
    image_upload_success: "图片上传成功！",

    // delete
    product_type_delete_failed_has_product: (count) => `该类别条目下仍有${count}种商品，删除失败！`,
    product_type_delete_failed_has_child: (count) => `该类别条目含有${count}个子类，删除失败！`,

    // device
    device_unauthorized: "非法获取设备信息！",
    device_empty: "尚无设备！",

    // verification
    ultra_vires: "越权访问！",
    image_url_duplication: "图片链接已存在！"
}