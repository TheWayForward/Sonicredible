class VerificationHelper {

    // user
    static usernameVerification(username) {
        if (username.length < 4) {
            if (!username) {
                return {
                    has_error: true,
                    detail: "用户名不能为空！"
                }
            }
            return {
                has_error: true,
                detail: "用户名过短！"
            }
        } else if (username.length > 20) {
            return {
                has_error: true,
                detail: "用户名过长！"
            }
        } else {
            if (/^[0-9a-zA-Z_]{1,}$/.test(username)) {
                return {
                    has_error: false,
                }
            } else {
                return {
                    has_error: true,
                    detail: "用户名包含非法字符！"
                }
            }
        }
    }

    static nicknameVerification(nickname) {
        if (nickname.length < 6) {
            if (!nickname) {
                return {
                    has_error: true,
                    detail: "昵称不能为空！"
                }
            }
            return {
                has_error: true,
                detail: "昵称过短！"
            }
        } else if (nickname.length > 20) {
            return {
                has_error: true,
                detail: "昵称过长！"
            }
        } else {
            // has proper length
            if (/^[0-9a-zA-Z_\u4E00-\u9FA5\\s]{1,}$/.test(nickname)) {
                return {
                    has_error: false,
                    detail: "昵称可用！"
                }
            } else {
                return {
                    has_error: true,
                    detail: "昵称包含非法字符！"
                }
            }
        }
    }

    static realnameVerification(realname) {
        if (realname === "") {
            return {
                has_error: true,
                detail: "真实姓名不能为空！"
            }
        }
        if (/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/.test(realname)) {
            return {
                has_error: false,
                detail: "真实姓名可用！"
            }
        } else {
            return {
                has_error: true,
                detail: "真实姓名包含非法字符！"
            }
        }
    }

    static passwordVerification(password) {
        if (!password) {
            return {
                has_error: true,
                detail: "密码不能为空！"
            }
        }
        if (password.length < 4) {
            return {
                has_error: true,
                detail: "密码过短！"
            }
        } else if (password.length > 20) {
            return {
                has_error: true,
                detail: "密码过长！"
            }
        } else {
            if (/^[0-9a-zA-Z_]{1,}$/.test(password)) {
                return {
                    has_error: false,
                }
            } else {
                return {
                    has_error: true,
                    detail: "密码包含非法字符！"
                }
            }
        }
    }

    static passwordStrengthVerification(password) {
        let s = Number(/\s+/g.test(password));
        // has number
        let n = Number(/\d+/g.test(password));
        // has letter
        let l = Number(/[a-zA-Z]+/g.test(password));
        // has dash
        let d = Number(/[_]+/g.test(password));
        return s ? 0 : n + l + d;
    }

    static QQVerification(QQ) {
        if (!QQ) {
            return {
                has_error: true,
                detail: "QQ号码不能为空！"
            }
        }
        if (QQ.length < 6 || QQ.length > 11) {
            return {
                has_error: true,
                detail: "QQ号码长度错误！"
            }
        } else {
            if (/[1-9][0-9]{4,14}/.test(QQ)) {
                return {
                    has_error: false
                }
            } else {
                return {
                    has_error: true,
                    detail: "QQ号码格式错误！"
                }
            }
        }
    }

    static telVerification(tel) {
        if (!tel) {
            return {
                has_error: true,
                detail: "手机号不能为空！"
            }
        }
        if (/^[1][3,4,5,7,8][0-9]{9}$/.test(tel)) {
            return {
                has_error: false
            };
        } else {
            return {
                has_error: true,
                detail: "手机号格式错误！"
            };
        }
    }

    static emailVerification(email) {
        if (!email) {
            return {
                has_error: true,
                detail: "email不能为空！"
            }
        }
        if (/[\w]+(\.[\w]+)*@[\w]+(\.[\w])+/.test(email)) {
            return {
                has_error: false
            }
        } else {
            return {
                has_error: true,
                detail: "email格式错误！"
            }
        }
    }

    // url
    static urlVerification(url) {
        if (!url) {
            return {
                has_error: true,
                detail: "url不能为空！"
            }
        } else {
            if (/([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|[wW]{3}.|[wW][aA][pP].|[fF][tT][pP].|[fF][iI][lL][eE].)[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(url)) {
                return {
                    has_error: false
                }
            } else {
                return {
                    has_error: true,
                    detail: "url格式有误！"
                }
            }
        }
    }

    static jsonStringWithParamVerification(str) {
        let replacedStr = str.replaceAll("?", "0");
        try {
            JSON.parse(replacedStr);
            return {
                has_error: false
            }
        } catch (err) {
            return {
                has_error: true,
                detail: "带参数JSON字符串格式错误！"
            }
        }
    }

    static constainsSpace(str) {
        return !/^[^\s]*$/.test(str);
    }

    static priceVerification(price) {
        if (Number(price) === 0) return false;
        return /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(price);
    }

    static quantityVerification(quantity) {
        return /^[1-9]\d*$/.test(quantity);
    }

}

export default VerificationHelper;