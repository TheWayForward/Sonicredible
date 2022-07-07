const wx_appid = "wxf47298c3ec2cb529";
const wx_appsecret = "f79baa6ad4026770e24dc9fc85198466";
const wx_mchid = "1616719037";

module.exports = {
    host: "127.0.0.1",
    port: parseInt(process.env.PORT,10) || 3000,
    mail_account: "951947409@qq.com",
    protocol: "http://",
    password: "",
    database: "sonicredible",
    user: "root",
    secret: "",
    // 1 minute
    max_age: 1000,

    batch: 8,
    miniprogram_batch: 4,
    max_stock: 10000,

    wx_appid: "wxf47298c3ec2cb529",
    wx_appsecret: "f79baa6ad4026770e24dc9fc85198466",
    wx_mchid: "1616719037",

    wx_code_to_session_url: (code) => `https://api.weixin.qq.com/sns/jscode2session?appid=${wx_appid}&secret=${wx_appsecret}&js_code=${code}&grant_type=authorization_code`,
    wx_get_access_token_url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wx_appid}&secret=${wx_appsecret}`,
    wx_get_phone_number_url: (access_token) => `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${access_token}`,

    wxpay_cert_url: "https://api.mch.weixin.qq.com/v3/certificates",
    wxpay_unifiedorder_url: "https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi",
    wxpay_notify_url: "http://127.0.0.1:3000/api/v1/wxpay_notify",

    wxpay_cert_serial: "5D5F55C54197EC786AEB5C9F2233B28EFDCAF762",

    wx_apiclient_cert: "-----BEGIN CERTIFICATE-----\n" +
        "MIID+TCCAuGgAwIBAgIUXV9VxUGX7Hhq61yfIjOyjv3K92IwDQYJKoZIhvcNAQEL\n" +
        "BQAwXjELMAkGA1UEBhMCQ04xEzARBgNVBAoTClRlbnBheS5jb20xHTAbBgNVBAsT\n" +
        "FFRlbnBheS5jb20gQ0EgQ2VudGVyMRswGQYDVQQDExJUZW5wYXkuY29tIFJvb3Qg\n" +
        "Q0EwHhcNMjIwMzExMDkzMzM0WhcNMjcwMzEwMDkzMzM0WjCBijETMBEGA1UEAwwK\n" +
        "MTYxNjcxOTAzNzEbMBkGA1UECgwS5b6u5L+h5ZWG5oi357O757ufMTYwNAYDVQQL\n" +
        "DC3otaTls7DluILlkqnlkqnnlJ/mgIHlhbvmrpbmnInpmZDotKPku7vlhazlj7gx\n" +
        "CzAJBgNVBAYMAkNOMREwDwYDVQQHDAhTaGVuWmhlbjCCASIwDQYJKoZIhvcNAQEB\n" +
        "BQADggEPADCCAQoCggEBAMFyWPh6cQ6KdxACJhDGjCnGeWeiWxkmYLohxXexBjNS\n" +
        "9NZ4XqeRGa+mYwbUmPzFp+4weqJEAf7WhFXd+dBdHNw0bYEGrEaInSB62BibJe8V\n" +
        "O3t+gYirUfFrRBXlrDUJSzbXeIGEw3lT/H8lhNgNE1EUHY/tRMjzU6yBJ21AMTV4\n" +
        "SkGMIqJP7YN1UeOLszAANI04FoVcKxJdZRCpHvWiE/syg0AHl5Rc6nP1w86oyQU+\n" +
        "d+MY4JF3hfa2aD/OhzNDCNq93QZij7Y0wgxfy/GCM+heEjJS8Ym4Ds9JnJxrfy39\n" +
        "DpX/DxUr1c/C7SBZfdiwUCfQpj/eWOTr3FeiTSj3990CAwEAAaOBgTB/MAkGA1Ud\n" +
        "EwQCMAAwCwYDVR0PBAQDAgTwMGUGA1UdHwReMFwwWqBYoFaGVGh0dHA6Ly9ldmNh\n" +
        "Lml0cnVzLmNvbS5jbi9wdWJsaWMvaXRydXNjcmw/Q0E9MUJENDIyMEU1MERCQzA0\n" +
        "QjA2QUQzOTc1NDk4NDZDMDFDM0U4RUJEMjANBgkqhkiG9w0BAQsFAAOCAQEAK3pe\n" +
        "9lWks8Pc0mgxtt0da6F80ZM2qToe1pY7kCL+zbbrshTet6eheVVVIczsnANe7Y+w\n" +
        "QK1zy4lFVnbaCa14E7H1I2VQ1ZyuMPpeI9UGFRG3mkH70MY1kfNebi7vBPTpUuOl\n" +
        "cbi3YHqrQlvvP/fJtH1ETNkHsHQlgzXRWuoMsx7Q0PdGpJYC7L/RKtFBmJFpIW65\n" +
        "q3oRVv/yluIwkFqtAGxFftXVJpkprIFmQEO4sD3rdjIIQuhARDJYe1U6vQk56pbW\n" +
        "BiKIW3SInbRNAKdqEWm7JZmIZfLI6lKYBckaNl0zuQdrhMvrxEJezcbAr4Honuj/\n" +
        "KWeGeA+WjJNgQVJgtw==\n" +
        "-----END CERTIFICATE-----\n",
    wx_apiclient_key: "-----BEGIN PRIVATE KEY-----\n" +
        "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBclj4enEOincQ\n" +
        "AiYQxowpxnlnolsZJmC6IcV3sQYzUvTWeF6nkRmvpmMG1Jj8xafuMHqiRAH+1oRV\n" +
        "3fnQXRzcNG2BBqxGiJ0getgYmyXvFTt7foGIq1Hxa0QV5aw1CUs213iBhMN5U/x/\n" +
        "JYTYDRNRFB2P7UTI81OsgSdtQDE1eEpBjCKiT+2DdVHji7MwADSNOBaFXCsSXWUQ\n" +
        "qR71ohP7MoNAB5eUXOpz9cPOqMkFPnfjGOCRd4X2tmg/zoczQwjavd0GYo+2NMIM\n" +
        "X8vxgjPoXhIyUvGJuA7PSZyca38t/Q6V/w8VK9XPwu0gWX3YsFAn0KY/3ljk69xX\n" +
        "ok0o9/fdAgMBAAECggEAM5QLiOUMs/XTXR9Viu+Fe7YBtNIjPAdxju9mOU2n+5NI\n" +
        "2M5rXn5fvOe+S5nv2KXS6r1eVVmQtqP30PVIoHfTNBt+fwKKeJwAWSKn75eee6rL\n" +
        "m1fVrd0QEjCpjLUaP2Hk/hBhfxcpD3aHQld8niaOWfXlE/UNfA705m/hVU3iUQD0\n" +
        "HukJbmEXBRPU3ALNEQSk98kvczcByb6ciwpNYcc0YfNlrkLXfhFnM+Kuve1N8vCK\n" +
        "tdHiKfzpCchq9FNRY5aGZsMktV+nBUbs5xFuH7b2/5rPeehELZPFZxWs689STLfj\n" +
        "QS45/KbAtomgZQfrstYOqPBRBZP/fzut15O5SXI9+QKBgQD8Y7MKCgam5Jk6LwBI\n" +
        "yGshPwrtLZFOffE0V8/kyY6Rfi87NF/l0KS0tM1I9VCAf7UgtasUZ98oSmU/GMIF\n" +
        "7EpYLERMmEzqX1zDO7hEm4pdOWHhvRMbpv+SZysZ5/4555tghZwIjcQ3yHItn0gu\n" +
        "NnQ2Lio5AZlRcd/jwTg1lw5EzwKBgQDENsm1Ta3YNpDv8lC9aoRBzJtI3VaU9Tnn\n" +
        "+T0x6IAQ/Wle0TFLQeeKjaREGz3MG316mL+icLEypkoAJmZ2VbYAgcxJqUvCKFCn\n" +
        "JcSbVNa36NPTkHk0eHKl6cnF3pZCuaXN7XBPl4nhDLOnSsxTm4dLXI4MlPSVPyNW\n" +
        "VNEKv5l7kwKBgQCqOuiobci8ylTbHJZ5gMxZGTdab7ChG2sT3eJ3ssa5NT3QFexU\n" +
        "ilx9EbGgcu2ALiLR1BZ25fRrLXqKiz1aV1xxijHq45KFRhrAB8iqZap2ZFyzsB5y\n" +
        "OToJ2hIFICelkKSI/rUWQ+BDq6vvP46ktM+/N3X9CyoI9+CFsm4iHyddmwKBgHbn\n" +
        "iLbRGw+SiaSO4HTY7sr9FgFC+GwOa4fzFy1+atVg7BDkjo2/o3PoP+px47Ij2peH\n" +
        "p2HmDsvVz7RlkOQXLtMB1W2yJVHEopOYJJvI/tG2S1/DBmBQuZFnqrm5GK/Y1uyC\n" +
        "/fONrqVt0BUKE+Z6srNtpDtlrQ4gk+aGQaPU1kr3AoGBAMGSoYG6ddOaBrB22rRB\n" +
        "mEGRN2BaqG8ffyI3/xTQXgHQefE39ZAgo+qIPQuc54xFUkMvjdHbkgszEsFsti9b\n" +
        "zwOjwQ9EvOJ6M79G35wPRKtV7NvBH/B0iTNpGImOcEIQfaz07watqSkb8x+aLP+T\n" +
        "5r2Ud5koOJfTbG0o6TJepV6J\n" +
        "-----END PRIVATE KEY-----\n",

    ssl_cert: "-----BEGIN CERTIFICATE-----\n" +
        "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\n" +
        "dUv4BBJiMg==\n" +
        "-----END CERTIFICATE-----\n" +
        "-----BEGIN CERTIFICATE-----\n" +
        "MIIEqjCCA5KgAwIBAgIQAnmsRYvBskWr+YBTzSybsTANBgkqhkiG9w0BAQsFADBh\n" +
        "MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n" +
        "d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\n" +
        "QTAeFw0xNzExMjcxMjQ2MTBaFw0yNzExMjcxMjQ2MTBaMG4xCzAJBgNVBAYTAlVT\n" +
        "MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n" +
        "b20xLTArBgNVBAMTJEVuY3J5cHRpb24gRXZlcnl3aGVyZSBEViBUTFMgQ0EgLSBH\n" +
        "MTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALPeP6wkab41dyQh6mKc\n" +
        "oHqt3jRIxW5MDvf9QyiOR7VfFwK656es0UFiIb74N9pRntzF1UgYzDGu3ppZVMdo\n" +
        "lbxhm6dWS9OK/lFehKNT0OYI9aqk6F+U7cA6jxSC+iDBPXwdF4rs3KRyp3aQn6pj\n" +
        "pp1yr7IB6Y4zv72Ee/PlZ/6rK6InC6WpK0nPVOYR7n9iDuPe1E4IxUMBH/T33+3h\n" +
        "yuH3dvfgiWUOUkjdpMbyxX+XNle5uEIiyBsi4IvbcTCh8ruifCIi5mDXkZrnMT8n\n" +
        "wfYCV6v6kDdXkbgGRLKsR4pucbJtbKqIkUGxuZI2t7pfewKRc5nWecvDBZf3+p1M\n" +
        "pA8CAwEAAaOCAU8wggFLMB0GA1UdDgQWBBRVdE+yck/1YLpQ0dfmUVyaAYca1zAf\n" +
        "BgNVHSMEGDAWgBQD3lA1VtFMu2bwo+IbG8OXsj3RVTAOBgNVHQ8BAf8EBAMCAYYw\n" +
        "HQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMBIGA1UdEwEB/wQIMAYBAf8C\n" +
        "AQAwNAYIKwYBBQUHAQEEKDAmMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdp\n" +
        "Y2VydC5jb20wQgYDVR0fBDswOTA3oDWgM4YxaHR0cDovL2NybDMuZGlnaWNlcnQu\n" +
        "Y29tL0RpZ2lDZXJ0R2xvYmFsUm9vdENBLmNybDBMBgNVHSAERTBDMDcGCWCGSAGG\n" +
        "/WwBAjAqMCgGCCsGAQUFBwIBFhxodHRwczovL3d3dy5kaWdpY2VydC5jb20vQ1BT\n" +
        "MAgGBmeBDAECATANBgkqhkiG9w0BAQsFAAOCAQEAK3Gp6/aGq7aBZsxf/oQ+TD/B\n" +
        "SwW3AU4ETK+GQf2kFzYZkby5SFrHdPomunx2HBzViUchGoofGgg7gHW0W3MlQAXW\n" +
        "M0r5LUvStcr82QDWYNPaUy4taCQmyaJ+VB+6wxHstSigOlSNF2a6vg4rgexixeiV\n" +
        "4YSB03Yqp2t3TeZHM9ESfkus74nQyW7pRGezj+TC44xCagCQQOzzNmzEAP2SnCrJ\n" +
        "sNE2DpRVMnL8J6xBRdjmOsC3N6cQuKuRXbzByVBjCqAA8t1L0I+9wXJerLPyErjy\n" +
        "rMKWaBFLmfK/AHNF4ZihwPGOc7w6UHczBZXH5RFzJNnww+WnKuTPI0HfnVH8lg==\n" +
        "-----END CERTIFICATE-----",
    ssl_key: "-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIIEpAIBAAKCAQEA5RViL761LZ5MGiNVvoMPJS0wH2LM/O7c+PuSQaFg54oNu1aH\n" +
        "LhEMfYZ2x/8Ado77fXooAE5bqlHWGGi+tFuavQzfxh67eVggaJvs3C7HeG1xo7Xk\n" +
        "IWIpbRaF59mG86sBKQS0WgXxIi10NOh1I0nJOk0zR3ET45t3DIrEX1tfY59jv4wI\n" +
        "cTPgaMjIPa/fAmT2Y53SFPIfNGri7X71EABJv93z69fiHowLg27lgzUAznYLiEf/\n" +
        "8OrPbVEUv13IWdAoYT6gI2+hV+XWs+DR18eHbYPQC2db4M6NU45r8Qts1ctJmnlF\n" +
        "BFW0ioKOQ2G+AM4P4n2GUne454xlop1PgNKrRwIDAQABAoIBAAoFXkcDZc6J4v9Z\n" +
        "C1pVm6x/JmCWbwF40Mltdno7fSSJGU0CyHq0kTd5JyoG1suDjq8a+wlPDtsg+vy/\n" +
        "XD7sgOot2CjFAGNwU56ahN55h2KWZbGzy7fFdlVzdkZsRrx9qa5/KlqDxwa9Npz3\n" +
        "4Y6PyZHXfbDthTa1fsbZgnnqDSlWOD4VQPPoD9tpvVLJC5T2RHhLQYjZxLo7VNoP\n" +
        "1l5o11YI7VkO6bfHyluw3KWAm/W2T7QLURNszYEBJMM+TiCH6tpm5z9q26YtgtVn\n" +
        "yJzb9A4+3L60JasW9Mqb77iJ+8sfRGOH9SVv23INTXT2EEdAUWOlUO8WA4Rj+s+v\n" +
        "J4vrDQECgYEA9hR/md3sbLfoNbNYfoMVjgrU5+M2nfE2NbnOWa0on3jG2n5FSXSm\n" +
        "+aSObY/Jwr3SrsN2qxTJrSl/ZAXiaJOY7Nxrpo3ijdOIMlWTqzDEWYJQ3ggKViYN\n" +
        "8MH8Sgrc8kS23Bckk5knrdLeqKvEcj40Dt5Jw1LaT9YLqGP8iANfvQECgYEA7lF7\n" +
        "3x6661nwFsmH4Ix65sGdR1n2qEU9TRkTyuKQMMzN12yB7sIyoHrUWoKCdovnS5eO\n" +
        "oXSKa+hZzMnvsfjX355TSBPWabrxGbKHIgp0KajMjVrAEHf6Dh52G7mW0pMRlY0Q\n" +
        "JEOiv4LQTnaK+8gGdSpbvq0jhoez6xG28vEFQEcCgYEApqd7Q1lopLhoKvYrGILu\n" +
        "NiRfzCu08YJKlFghx9ndiSLiiVa61eSKsMchLlIS8jBcXr9Bvtt1OjDAdZ0GmIxd\n" +
        "JQyiW0n8BNEdi/ko6Oc+EuCOo9AOMAnVpxe5JOv2dpzSuntx6gPvO2l0IgcyI6y8\n" +
        "1NT2X7Hc5/SuMHyGqhae4AECgYEAv8xEbSVGOfOADlbTTBzDLMPV2H7GzFYtJ8du\n" +
        "7nG4qg2p/B4P1B/mrtEr5kvyw4WE+IlY+QfZ/05YN0Ct8AXddtLtI60TerRBJfVQ\n" +
        "XE0dgAmh1oGa4aYtUP+i/l02zPIfzMRioUztxkN5cixlXo105QbaH3MojDTaz+zJ\n" +
        "2GuxVjECgYA44XY0raZ7c3iWt8L9ZotqUt1fAwIT77JrDUiAg6ZJzi7Eb5spG+qx\n" +
        "IJtvX9327Vl7hhE0/xg+Jbp4Vhqyq/5uHiIRBtN2SW7Wge7zg/zEsKErKjtrHHSH\n" +
        "1oxcZE71G2et0GhQ0761epqj5prWj3kOj+0TDmzMcSyfrl7P3FjRqQ==\n" +
        "-----END RSA PRIVATE KEY-----"
};