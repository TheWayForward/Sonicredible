module.exports = {
    host: "127.0.0.1",
    port: parseInt(process.env.PORT,10) || 3000,
    mail_account: "951947409@qq.com",
    protocol: "http://",
    password: "",
    aes_key: "TrWyFowrd",
    database: "sonicredible",
    user: "root",
    secret: "",

    captcha_age: 1000 * 60 * 5,

    mailer_host: "smtp.qq.com",
    mailer_service: "qq",
    mailer_secure: true,
    mailer_auth: {
        user: "951947409@qq.com",
        pass: "kfrlvkjzokmbbcii"
    },

    batch: 8,
};