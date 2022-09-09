const express = require('express');
const Multiparty = require("multiparty");
const router = express.Router();

const VoiceprintDao = require("../dao/voiceprint_dao");

const MessageHelper = require("../utils/message_helper");
const CryptoHelper = require("../utils/crypto_helper");
const ResponseHelper = require("../utils/response_helper");
const EnumHelper = require("../utils/enum_helper");
const JWTHelper = require("../utils/jwt_helper");
const PermissionHelper = require("../utils/permission_helper");
const StringHelper = require("../utils/string_helper");
const FileHelper = require("../utils/file_helper");
const SerialHelper = require("../utils/serial_helper");
const ObjectHelper = require("../utils/object_helper");
const TencentCloudHelper = require("../utils/tencent_cloud_helper");
const Request = require("../requests/index");

router.post("/get_voiceprint", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let tokenData = JWTHelper.parseToken(req);
        let user_id = tokenData.user_id;
        let result = await VoiceprintDao.selectVoiceprintByUserId(user_id);
        if (!result.length) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({info: MessageHelper.voiceprint_unregistered}));
        } else {
            let data = result[0];
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: data}));
        }
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/get_voiceprints", PermissionHelper.tokenVerification, PermissionHelper.managerVerification, async (req, res) => {
    try {
        let data = req.body;
        let page_index = data.page_index;
        let result = await VoiceprintDao.selectVoiceprints(page_index);
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: result}));
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/contrast", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let data = req.body;
        let user_voiceprint_url = data.user_voiceprint_url;
        let target_voice_url = data.target_voice_url;
        let result = await Request.VoiceprintContrastRequest.execute({
            user_voiceprint_url: user_voiceprint_url,
            target_voice_url: target_voice_url
        });
        if (result.code === EnumHelper.HTTPStatus.OK) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({
                info: {
                    is_same: result.info.is_same.toLowerCase() === "true",
                    similarity: Number(result.info.similarity)
                }
            }));
        }
    } catch (err) {
        console.log(err.code);
        if (err.code === EnumHelper.networkException.ECONNREFUSED) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.voiceprint_service_disconnected}));
            return;
        }
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.voiceprint_contrast_failed}));
    }
});

module.exports = router;