const express = require('express');
const Multiparty = require("multiparty");
const router = express.Router();

const UserDao = require("../dao/user_dao");
const AudioDao = require("../dao/audio_dao");
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


router.post("/avatar", PermissionHelper.tokenVerification, (req, res) => {
    try {
        let form = new Multiparty.Form();
        form.uploadDir = EnumHelper.directory.images.avatar;
        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
            }
            let path = StringHelper.directoryRevision("" + files[EnumHelper.formField.avatar][0]["path"]);
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: {path: path}}));
        });
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/voiceprint", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let tokenData = JWTHelper.parseToken(req);
        let user_id = tokenData.user_id;
        let form = new Multiparty.Form();
        form.uploadDir = EnumHelper.directory.audios.voiceprint;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
            }
            let path = StringHelper.directoryRevision("" + files[EnumHelper.formField.audio][0]["path"]);
            let result = await VoiceprintDao.insertVoiceprint({user_id: user_id, url: path});
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: {path: path}}));
        });
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/audio_recognition", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let tokenData = JWTHelper.parseToken(req);
        let user_id = tokenData.user_id;
        let form = new Multiparty.Form();
        form.uploadDir = EnumHelper.directory.audios.recognition;
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err);
                res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
            }
            let path = StringHelper.directoryRevision("" + files[EnumHelper.formField.audio][0]["path"]);
            let base64 = FileHelper.fileToBase64(path);
            let serial = SerialHelper.generateAudioFileSerial();
            let result = await AudioDao.insertAudio({serial: serial, user_id: user_id, url: path, base64: base64});
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({
                info: {
                    serial: serial,
                    path: path,
                    base64: base64
                }
            }));
        });
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});


module.exports = router;