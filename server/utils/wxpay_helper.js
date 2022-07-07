const path = require("path");
const xmlreader = require("xmlreader");
const {KJUR, KEYUTIL, hextob64} = require("jsrsasign");
const fs = require("fs");
const JsonToXml = require("jstoxml");
const md5 = require("md5");
const Config = require("../config");

let wxpay = {

    get_money(money) {
        return parseFloat(money) * 100;
    },

    generate_random_string() {
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = chars.length;
        let s = '';
        for (i = 0; i < 32; i++) {
            s += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return s;
    },

    generate_timestamp() {
        return parseInt(new Date().getTime() / 1000) + '';
    },

    generate_sign_string(timestamp, random_string, params) {
        return `POST\n/v3/pay/transactions/jsapi\n${timestamp}\n${random_string}\n${JSON.stringify(params)}\n`;
    },

    generate_confirm_sign_string(timestamp, nonce_str, prepay_id) {
        return `${Config.wx_appid}\n${timestamp}\n${nonce_str}\nprepay_id=${prepay_id}\n`;
    },

    sign_rsa(s) {
        let src = s;
        let private_key = KEYUTIL.getKey(Config.wx_apiclient_key);
        let signature = new KJUR.crypto.Signature({alg: "SHA256withRSA", prvkeypem: private_key});
        signature.updateString(src);
        let sign = hextob64(signature.sign());
        return sign;
    },

    generate_sign_header(nonce_str, signature, timestamp, serial_no) {
        return {
            "Authorization": `WECHATPAY2-SHA256-RSA2048 mchid="${Config.wx_mchid}",nonce_str="${nonce_str}",timestamp="${timestamp}",serial_no="${serial_no}",signature="${signature}"`,
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36 Edg/99.0.1150.36"
        };
    },

    paysign_jsapi(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey = "") {
        let params = {
            "appid": appid,
            "mchid": mch_id,
            "description": body,
            "out_trade_no": out_trade_no,
            "notify_url": notify_url,
            "amount": {
                "total": total_fee,
                "currency": "CNY"
            },
            "payer": {
                "openid": openid
            }
        };
        return JSON.stringify(params);
    }
};

function raw(args) {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function (key) {
        if (key !== "") newArgs[key] = args[key];
    });
    let string = '';
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substring(1);
    return string;
}

module.exports = wxpay;