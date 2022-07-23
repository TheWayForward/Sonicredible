const express = require('express');
const Multiparty = require("multiparty");
const router = express.Router();

const CommandDao = require("../dao/command_dao");
const AudioDao = require("../dao/audio_dao");

const MessageHelper = require("../utils/message_helper");
const CryptoHelper = require("../utils/crypto_helper");
const ResponseHelper = require("../utils/response_helper");
const EnumHelper = require("../utils/enum_helper");
const JWTHelper = require("../utils/jwt_helper");
const PermissionHelper = require("../utils/permission_helper");
const StringHelper = require("../utils/string_helper");
const FileHelper = require("../utils/file_helper");
const SerialHelper = require("../utils/serial_helper");
const TencentCloudHelper = require("../utils/tencent_cloud_helper");

router.post("/register", PermissionHelper.tokenVerification, PermissionHelper.managerVerification, async (req, res) => {
    try {
        let data = req.body;
        let keyword = data.keyword;
        let description = data.description;
        let content = data.content;
        let result = await CommandDao.register({keyword: keyword, content: content, description: description});
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({}));
    } catch (err) {
        console.log(err);
        if (err.code === EnumHelper.databaseException.ER_DUP_ENTRY) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.command_keyword_duplicate}));
            return;
        }
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/get_commands", PermissionHelper.tokenVerification, PermissionHelper.managerVerification, async (req, res) => {
    try {
        let data = req.body;
        let page_index = data.page_index;
        let result = await CommandDao.selectCommands(page_index);
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: result}));
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/enable", PermissionHelper.tokenVerification, PermissionHelper.managerVerification, async (req, res) => {
    try {
        let data = req.body;
        let command_id = data.command_id;
        let enable = data.enable;
        if (enable) {
            // enable
        } else {
            // disable
        }
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

module.exports = router;