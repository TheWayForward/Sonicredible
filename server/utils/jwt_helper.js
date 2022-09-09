const JWT = require('jsonwebtoken');
const Config = require("../config");
const expire_time = 1000 * 60 * 60 * 24 * 30;

class JWTHelpler {

    #data;

    constructor(user_id) {
        this.#data = {
            user_id: user_id,
            timestamp: Date.now()
        };
    }

    generateToken() {
        return JWT.sign(this.#data, Config.aes_key);
    }

    static verifyToken(req) {
        let token = req.headers["token"];
        if (token) {
            return JWT.verify(token, Config.aes_key, (err, decode) => {
                if (err) {
                    return false;
                } else {
                    let tokenData = JWT.decode(token);
                    if (Date.now() - tokenData.timestamp >= expire_time) {
                        return false;
                    } else {
                        return true;
                    }
                }
            })
        } else {
            return false;
        }
    }

    static parseToken(req) {
        let token = req.headers["token"];
        return JWT.decode(token);
    }

}

module.exports = JWTHelpler;