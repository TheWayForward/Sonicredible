const TencentCloud = require("tencentcloud-sdk-nodejs");
const AsrClient = TencentCloud.asr.v20190614.Client;
const EnumHelper = require("../utils/enum_helper");
const FileHelper = require("../utils/file_helper");

class TencentCloudHelper {

    static #clientConfig = {
        credential: {
            secretId: "AKIDqW0HQ0lcfZL0iXhfy8BPRK9qLeyIffHn",
            secretKey: "Pq6A6D9tQp2GMJrDNLBsPl4DB1fCXfbc",
        },
        region: "",
        profile: {
            httpProfile: {
                endpoint: "asr.tencentcloudapi.com",
            },
        }
    };

    static async sentenceRecognition({userAudioKey, audioFileDirectory}) {
        const client = new AsrClient(this.#clientConfig);
        let convertedFileDirectory = await FileHelper.wavToMp3(audioFileDirectory);
        return await client.SentenceRecognition({
            "UsrAudioKey": userAudioKey,
            "SubServiceType": 2,
            "ProjectId": 0,
            "EngSerViceType": "16k_zh",
            "VoiceFormat": "mp3",
            "Data": FileHelper.fileToBase64(convertedFileDirectory),
            "SourceType": 1,
            "WordInfo": 1
        });
    }

}

module.exports = TencentCloudHelper;