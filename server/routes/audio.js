const express = require('express');
const Multiparty = require("multiparty");
const router = express.Router();

const AudioDao = require("../dao/audio_dao");
const CommandDao = require("../dao/command_dao");

const HardwareRequest = require("../requests/hardware");

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

router.post("/recognition", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let tokenData = JWTHelper.parseToken(req);
        let user_id = tokenData.user_id;
        let data = req.body;
        let audio_id = data.audio_id;
        let result = await AudioDao.selectAudio(audio_id);
        if (!result.length) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({
                message: MessageHelper.audio_empty,
            }));
        } else {
            let audioData = result[0];
            let recognitionResult = await TencentCloudHelper.sentenceRecognition({
                userAudioKey: audioData.serial,
                audioFileDirectory: audioData.url
            });
            result = await AudioDao.updateResult({result: JSON.stringify(recognitionResult), id: audio_id});
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: recognitionResult}));
        }
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/get_audios", PermissionHelper.tokenVerification, PermissionHelper.managerVerification, async (req, res) => {
    try {
        let data = req.body;
        let page_index = data.page_index;
        let result = await AudioDao.selectAudios(page_index);
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({info: result}));
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.ERROR).send(ResponseHelper.error({}));
    }
});

router.post("/instruction", PermissionHelper.tokenVerification, async (req, res) => {
    try {
        let tokenData = JWTHelper.parseToken(req);
        let user_id = tokenData.user_id;
        let data = req.body;
        let audio_id = req.body.audio_id;
        let result = await AudioDao.selectAudio(audio_id);
        if (!result.length) {
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({
                message: MessageHelper.audio_empty,
            }));
        } else {
            let audioData = result[0];
            audioData.result = JSON.parse(audioData.result);
            if (!audioData.result.hasOwnProperty("RequestId")) {
                res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.audio_instruction_unabled}));
                return;
            }
            let wordList = audioData.result.WordList;
            result = await CommandDao.matchCommandsByKeyword(wordList);
            let count = [];
            result.forEach((sub) => {
                sub.forEach((item) => {
                    count.push(item.id);
                });
            });
            if (!count.length) {
                res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.audio_instruction_failed}));
                return;
            }
            result = await CommandDao.selectCommand(Number(ObjectHelper.findMost(count)));
            let commandData = result[0];
            if (CommandDao.containsParam(commandData.content)) {
                let params = CommandDao.extractParams(wordList);
                commandData = CommandDao.setParams(commandData, params);
            }
            result = await HardwareRequest.excute(JSON.parse(commandData.content));
            console.log(result.message);
            res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.ok({
                info: {
                    id: commandData.id,
                    keyword: commandData.keyword,
                    content: commandData.content
                }
            }));
        }
    } catch (err) {
        console.log(err);
        res.status(EnumHelper.HTTPStatus.OK).send(ResponseHelper.noContent({message: MessageHelper.audio_instruction_failed}));
    }
});

module.exports = router;