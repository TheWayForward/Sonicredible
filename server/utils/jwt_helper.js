const fs = require('fs');
const path = require('path');
const jwt_helper = require('jsonwebtoken');
const secret = "TrWyFowrd";
const expire_time = 60 * 60 * 24 * 10;

class Jwt {
    constructor(data) {
        this.data = data;
    }

    generateToken() {
        let token = jwt_helper.sign(this.data, secret);
        return token;
    }

    static verifyToken(req) {
        let token = req.headers["token"];
        if (token) {
            return jwt_helper.verify(token, secret, (err, decode) => {
                if (err) {
                    return false;
                }
                else return true;
            })
        }
        return false;
    }

    static parseToken(req) {
        let token = req.headers["token"];
        return jwt_helper.decode(token);
    }
}

module.exports = Jwt;