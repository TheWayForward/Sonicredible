const TencentCloud = require("tencentcloud-sdk-nodejs");
const AsrClient = TencentCloud.asr.v20190614.Client;
const ClientConfig = {
    credential: {
        secretId: "SecretId",
        secretKey: "SecretKey",
    },
    region: "",
    profile: {
        httpProfile: {
            endpoint: "asr.tencentcloudapi.com",
        },
    }
};