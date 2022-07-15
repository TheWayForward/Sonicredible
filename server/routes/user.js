const express = require('express');
const router = express.Router();
const UserDao = require("../dao/user_dao");
const MessageHelper = require("../utils/message_helper");
const CryptoHelper = require("../utils/crypto_helper");
const ResponseHelper = require("../utils/response_helper");
const EnumHelper = require("../utils/enum_helper");
const JWTHelper = require("../utils/jwt_helper");
const PermissionHelper = require("../utils/permission_helper");

router.post("/test", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let result = await UserDao.selectUser(1);
        res.status(200).send({
            code: 200,
            message: MessageHelper.success,
            info: result
        });
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/register", async (req, res) => {
    try {
        let data = req.body;
        let nickname = data.nickname;
        let username = data.username;
        let password = CryptoHelper.aesEncrypt(data.password);
        let tel = data.tel;
        let result = await UserDao.register({nickname: nickname, username: username, password: password, tel: tel});
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({}));
    } catch (err) {
        console.log(err);
        if (err.code === EnumHelper.databaseException.ER_DUP_ENTRY) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.user_register_duplication}));
            return;
        }
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/full_register", PermissionHelper.tokenVerification, PermissionHelper.managerVerification, async (req, res) => {
    try {
        let data = req.body;
        let username = data.username;
        let password = CryptoHelper.aesEncrypt(data.password);
        let realname = data.realname;
        let nickname = data.nickname;
        let tel = data.tel;
        let email = data.email;
        let result = await UserDao.fullRegister({
            username: username,
            password: password,
            realname: realname,
            nickname: nickname,
            tel: tel,
            email: email
        });
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({}));
    } catch (err) {
        console.log(err);
        if (err.code === EnumHelper.databaseException.ER_DUP_ENTRY) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.user_register_duplication}));
            return;
        }
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/login", async (req, res) => {
    try {
        let data = req.body;
        let username = data.username;
        let password = CryptoHelper.aesEncrypt(data.password);
        let result = await UserDao.login({username: username, password: password});
        if (!result.length) {
            // user DNE
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({
                message: MessageHelper.login_failed,
            }));
        } else {
            // generate token
            let userinfo = result[0];
            let user_id = userinfo.id;
            let token = new JWTHelper(user_id);
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({
                info: {
                    userinfo: userinfo,
                    token: token.generateToken()
                }
            }));
        }
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/get_users", PermissionHelper.tokenVerification, PermissionHelper.managerVerification, async (req, res) => {
    try {
        let data = req.body;
        let page_index = data.page_index;
        let result = await UserDao.selectUsers(page_index);
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: result}));
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/update", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let data = req.body;
        let id = data.id;
        let realname = data.realname;
        let nickname = data.nickname;
        let avatar = data.avatar;
        let tel = data.tel;
        let email = data.email;
        let result = await UserDao.update({
            realname: realname,
            nickname: nickname,
            avatar: avatar,
            tel: tel,
            email: email,
            id: id
        });
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({}));
    } catch (err) {
        console.log(err);
        if (err.code === EnumHelper.databaseException.ER_DUP_ENTRY) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.user_register_duplication}));
            return;
        }
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

module.exports = router;