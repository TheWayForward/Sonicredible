const NodeMailer = require("nodemailer");
const Config = require("../config");

class EmailHelper {

    static emailClient = NodeMailer.createTransport({
        host: Config.mailer_host,
        service: Config.mailer_service,
        secure: Config.mailer_secure,
        auth: Config.mailer_auth
    });

    static mailOptions = (email_to, subject, html) => {
        return {
            from: Config.mail_account,
            to: email_to,
            subject: subject,
            html: html
        }
    }

    static emailTemplate = {
        captchaEmail: (captcha) => {
            return {
                subject: `Sonicredible: 邮箱验证码`,
                content: '<html><head><meta http-equiv="Content-Type"content="text/html; charset=UTF-8"></head><body><div style="width:700px;margin:0 auto;border-bottom:1px solid #ccc;margin-bottom:30px;"><table border="0"cellpadding="0"cellspacing="0"width="700"height="39"style="font:12px Tahoma, Arial, 宋体;"><tbody><tr><td width="210"></td></tr></tbody></table></div><div style="width:680px;padding:0 10px;margin:0 auto;"><div style="line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d;"><strong style="display:block;margin-bottom:15px;">用户您好！</strong><strong style="display:block;margin-bottom:15px;">您正在修改邮箱，请在验证码输入框中输入：<span style="color:#6667AB;font-size: 24px">' + captcha + '</span>，以完成操作。</strong></div><div style="margin-bottom:30px;"><small style="display:block;margin-bottom:20px;font-size:12px;"><p style="color:#747474;">注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全。<br></p></small></div></div><div style="width:700px;margin:0 auto;"><div style="padding:10px 10px 0;border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;font-size:12px;"><p>此为系统邮件，请勿回复<br>请保管好您的邮箱，避免账号被他人盗用</p><p>© Sonicredible</p></div></div></body></html>'
            };
        }
    }

}

module.exports = EmailHelper;