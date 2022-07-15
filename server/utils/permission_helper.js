const JWTHelper = require("../utils/jwt_helper");
const EnumHelper = require("../utils/enum_helper");
const ResponseHelper = require("../utils/response_helper");
const UserDao = require("../dao/user_dao");

class PermissionHelper {

    static tokenVerification(req, res, next) {
        if (JWTHelper.verifyToken(req)) {
            next();
        } else {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.unauthorized({}));
        }
    }

    static async rootVerification(req, res, next) {
        try {
            let tokenData = JWTHelper.parseToken(req);
            let result = await UserDao.selectUser(tokenData.user_id);
            if (!result.length) {
                res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({}));
            } else {
                let authority = result[0].authority;
                if (authority === EnumHelper.authorityType.root) {
                    next();
                } else {
                    res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.authorityUltraVires({}));
                }
            }
        } catch (err) {
            console.log(err);
            res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
        }
    }

    static async managerVerification(req, res, next) {
        try {
            let tokenData = JWTHelper.parseToken(req);
            let result = await UserDao.selectUser(tokenData.user_id);
            if (!result.length) {
                res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({}));
            } else {
                let authority = result[0].authority;
                if (authority === EnumHelper.authorityType.root || authority === EnumHelper.authorityType.manager) {
                    next();
                } else {
                    res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.authorityUltraVires({}));
                }
            }
        } catch (err) {
            console.log(err);
            res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
        }
    }

}

module.exports = PermissionHelper;