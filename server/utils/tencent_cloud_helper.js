const TencentCloud = require("tencentcloud-sdk-nodejs");
const AsrClient = TencentCloud.asr.v20190614.Client;

const EnumHelper = require("../utils/enum_helper");

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

    static async sentenceRecognition(params) {
        const client = new AsrClient(this.#clientConfig);
        return await client.SentenceRecognition(params);
    }

}

module.exports = TencentCloudHelper;